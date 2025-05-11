import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const FileManagement = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [fileToUpdate, setFileToUpdate] = useState(null);
  const [showVersions, setShowVersions] = useState(null);
  const [versions, setVersions] = useState([]);
  const [restoringVersion, setRestoringVersion] = useState(null);

  const fileInputRef = useRef();

  const fetchFiles = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/files');
      setFiles(response.data);
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const resetForm = (e) => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setSelectedFile(null);
    if (e) e.target.reset?.();
  };
  // Function to handle file preview
const handlePreviewFile = (file) => {
  // Construct the file URL
  const fileUrl = `http://localhost:5000/api/files/download/${file._id}`;

  // Check file extension
  const fileExtension = file.filename.split('.').pop().toLowerCase();

  if (fileExtension === 'jpg' || fileExtension === 'jpeg' || fileExtension === 'png' || fileExtension === 'gif') {
    // For images, open in a new window
    const imageWindow = window.open('', '_blank');
    imageWindow.document.write(`<img src="${fileUrl}" style="width: 100%; height: auto;" />`);
  } else if (fileExtension === 'pdf') {
    // For PDFs, open in a new window
    window.open(fileUrl, '_blank');
  } else {
    // For other file types, show an alert or handle accordingly
    alert('Preview not available for this file type.');
  }
};


  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      await axios.post('http://localhost:5000/api/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      resetForm(e);
      fetchFiles();
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      setIsDeleting(true);
      try {
        await axios.delete(`http://localhost:5000/api/files/${id}`);
        fetchFiles();
      } catch (error) {
        console.error('Delete error:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleFileUpdate = async (e) => {
    e.preventDefault();
    if (!fileToUpdate || !selectedFile) return;

    setIsUpdating(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      await axios.put(`http://localhost:5000/api/files/${fileToUpdate._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setFileToUpdate(null);
      resetForm(e);
      fetchFiles();
    } catch (error) {
      console.error('Update error:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const fetchVersions = async (fileId) => {
    if (showVersions === fileId) {
      setShowVersions(null);
      return;
    }

    try {
      const res = await axios.get(`http://localhost:5000/api/files/${fileId}/versions`);
      setVersions(res.data);
      setShowVersions(fileId);
    } catch (err) {
      console.error('Error fetching versions:', err);
    }
  };

  const handleRestoreVersion = async (fileId, versionNumber) => {
    setRestoringVersion(versionNumber);
    try {
      await axios.post(`http://localhost:5000/api/files/${fileId}/restore/${versionNumber}`);
      fetchFiles();
      setShowVersions(null);
    } catch (err) {
      console.error('Restore error:', err);
    } finally {
      setRestoringVersion(null);
    }
  };

  const filteredFiles = files.filter((file) =>
    file.filename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full h-full max-w-full mx-auto p-8 bg-white rounded-lg shadow-lg mt-0 transition-all duration-300 ease-in-out">
  <h1 className="text-3xl font-bold text-gray-800 mb-6">File Management</h1>

  {/* Upload Section */}
  <motion.div
    className="bg-blue-50 p-6 rounded-lg mb-8 shadow-md transition-all duration-300 ease-in-out"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <h2 className="text-xl font-semibold text-gray-700 mb-4">
      {fileToUpdate ? 'Update File' : 'Upload New File'}
    </h2>
    <form onSubmit={fileToUpdate ? handleFileUpdate : handleFileUpload} className="space-y-4">
      <div className="flex items-center space-x-4">
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => setSelectedFile(e.target.files[0])}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-100 file:text-blue-700
            hover:file:bg-blue-200"
        />
        <button
          type="submit"
          disabled={!selectedFile || isUploading || isUpdating}
          className={`px-6 py-2 rounded-md text-white font-medium transition-all duration-200 ease-in-out ${!selectedFile || isUploading || isUpdating
            ? 'bg-blue-300 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {isUploading || isUpdating ? 'Processing...' : fileToUpdate ? 'Update' : 'Upload'}
        </button>

        {fileToUpdate && (
          <button
            type="button"
            onClick={() => {
              setFileToUpdate(null);
              resetForm();
            }}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 text-sm transition-all duration-200 ease-in-out"
          >
            Cancel
          </button>
        )}
      </div>
      {selectedFile && (
        <div className="text-sm text-gray-600">
          Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
        </div>
      )}
    </form>
  </motion.div>

  {/* File List */}
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="transition-all duration-300 ease-in-out"
  >
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-semibold text-gray-700">Your Files</h2>
      <div className="relative">
        <input
          type="text"
          placeholder="Search files..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <svg
          className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>

    {filteredFiles.length === 0 ? (
      <div className="text-center py-12 bg-gray-50 rounded-lg shadow-sm">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No files</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by uploading a new file.</p>
      </div>
    ) : (
      <div className="overflow-x-auto shadow-lg ring-1 ring-black ring-opacity-5 rounded-lg">
       <table className="min-w-full divide-y divide-gray-300">
  <thead className="bg-gray-100">
    <tr>
      <th className="py-4 pl-6 pr-4 text-left text-sm font-semibold text-gray-800">Filename</th>
      <th className="px-4 py-4 text-left text-sm font-semibold text-gray-800">Size</th>
      <th className="px-4 py-4 text-left text-sm font-semibold text-gray-800">Uploaded</th>
      <th className="px-4 py-4 text-sm font-semibold text-gray-800">Actions</th>
    </tr>
  </thead>
  <tbody className="divide-y divide-gray-200 bg-white">
    {filteredFiles.map((file) => (
      <React.Fragment key={file._id}>
        <tr className="hover:bg-gray-50 transition-all duration-300 ease-in-out">
          <td className="whitespace-nowrap py-4 pl-6 pr-4 text-sm font-medium text-gray-900">{file.filename}</td>
          <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-600">{formatFileSize(file.size)}</td>
          <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-600">{new Date(file.uploadDate).toLocaleDateString()}</td>
          <td className="whitespace-nowrap px-4 py-4 text-sm flex gap-4">
            {/* Download Button with Emoji */}
            <a
              href={`http://localhost:5000/api/files/download/${file._id}`}
              className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              ⬇️ Download
            </a>
            
            {/* Delete Button with Emoji */}
            <button
              onClick={() => handleFileDelete(file._id)}
              disabled={isDeleting}
              className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ease-in-out ${isDeleting ? 'bg-red-300 cursor-not-allowed text-white' : 'bg-red-600 hover:bg-red-700 text-white transform hover:scale-105'}`}
            >
              🗑️ {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
            
            {/* Update Button with Emoji */}
            <button
              onClick={() => {
                setFileToUpdate(file);
                resetForm();
              }}
              className="inline-flex items-center px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              ✏️ Update
            </button>
            
            {/* Versions Button with Emoji */}
            <button
              onClick={() => fetchVersions(file._id)}
              className="inline-flex items-center px-4 py-2 rounded-lg bg-yellow-600 text-white text-sm font-semibold hover:bg-yellow-700 transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              📜 Versions
            </button>

            {/* Preview Button with Emoji */}
            <button
              onClick={() => handlePreviewFile(file)} // This triggers the preview function
              className="inline-flex items-center px-4 py-2 rounded-lg bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700 transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              👁️ Preview
            </button>
          </td>
        </tr>
        
        {/* Versions Dropdown */}
        {showVersions === file._id && (
          <tr className="bg-gray-50">
            <td colSpan={4}>
              <div className="p-6">
                <h4 className="font-semibold text-lg text-gray-800 mb-4">Previous Versions</h4>
                {versions.length === 0 ? (
                  <p className="text-sm text-gray-500">No versions available</p>
                ) : (
                  <ul className="space-y-4">
                    {versions.map((v) => (
                      <li key={v.versionNumber} className="flex justify-between items-center text-sm text-gray-700">
                        <span>
                          {v.filename} - v{v.versionNumber} ({formatFileSize(v.size)})
                        </span>
                        <button
                          onClick={() => handleRestoreVersion(file._id, v.versionNumber)}
                          disabled={restoringVersion === v.versionNumber}
                          className={`px-4 py-2 text-sm rounded-lg text-white ${restoringVersion === v.versionNumber ? 'bg-yellow-400 cursor-not-allowed' : 'bg-yellow-600 hover:bg-yellow-700 transform hover:scale-105'}`}
                        >
                          🔄 Restore
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </td>
          </tr>
        )}
      </React.Fragment>
    ))}
  </tbody>
</table>

      </div>
    )}
  </motion.div>
</div>);
};

export default FileManagement;
