import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
      setSelectedFile(null);
      e.target.reset();
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
      setSelectedFile(null);
      e.target.reset();
      fetchFiles();
    } catch (error) {
      console.error('Update error:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const fetchVersions = async (fileId) => {
    if (showVersions === fileId) {
      setShowVersions(null); // toggle hide
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
    try {
      await axios.post(`http://localhost:5000/api/files/${fileId}/restore/${versionNumber}`);
      fetchFiles();
      setShowVersions(null);
    } catch (err) {
      console.error('Restore error:', err);
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
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">File Management</h1>

      {/* Upload Section */}
      <div className="bg-blue-50 p-6 rounded-lg mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          {fileToUpdate ? 'Update File' : 'Upload New File'}
        </h2>
        <form onSubmit={fileToUpdate ? handleFileUpdate : handleFileUpload} className="space-y-4">
          <div className="flex items-center space-x-4">
            <input
              type="file"
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
              className={`px-6 py-2 rounded-md text-white font-medium transition ${
                !selectedFile || isUploading || isUpdating
                  ? 'bg-blue-300 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isUploading || isUpdating ? 'Processing...' : fileToUpdate ? 'Update' : 'Upload'}
            </button>
          </div>
          {selectedFile && (
            <div className="text-sm text-gray-600">
              Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
            </div>
          )}
        </form>
      </div>

      {/* File List Section */}
      <div>
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
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {filteredFiles.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No files</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by uploading a new file.</p>
          </div>
        ) : (
          <div className="overflow-x-auto shadow ring-1 ring-black ring-opacity-5 rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 pl-4 pr-3 text-left text-sm font-semibold text-gray-700 sm:pl-6">
                    Filename
                  </th>
                  <th className="px-3 py-3 text-left text-sm font-semibold text-gray-700">Size</th>
                  <th className="px-3 py-3 text-left text-sm font-semibold text-gray-700">
                    Uploaded
                  </th>
                  <th className="px-3 py-3 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredFiles.map((file) => (
                  <React.Fragment key={file._id}>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {file.filename}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-600">
                        {formatFileSize(file.size)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-600">
                        {new Date(file.uploadDate).toLocaleDateString()}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm flex flex-wrap gap-2">
                        <a
                          href={`http://localhost:5000/api/files/download/${file._id}`}
                          className="inline-flex items-center px-3 py-1.5 rounded-md bg-blue-500 text-white text-xs font-medium hover:bg-blue-600 transition"
                        >
                          ⬇️ Download
                        </a>
                        <button
                          onClick={() => handleFileDelete(file._id)}
                          disabled={isDeleting}
                          className={`inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium transition ${
                            isDeleting
                              ? 'bg-red-300 cursor-not-allowed text-white'
                              : 'bg-red-500 hover:bg-red-600 text-white'
                          }`}
                        >
                          🗑️ {isDeleting ? 'Deleting...' : 'Delete'}
                        </button>
                        <button
                          onClick={() => setFileToUpdate(file)}
                          className="inline-flex items-center px-3 py-1.5 rounded-md bg-green-500 text-white text-xs font-medium hover:bg-green-600 transition"
                        >
                          ✏️ Update
                        </button>
                        <button
                          onClick={() => fetchVersions(file._id)}
                          className="inline-flex items-center px-3 py-1.5 rounded-md bg-yellow-500 text-white text-xs font-medium hover:bg-yellow-600 transition"
                        >
                          📜 Versions
                        </button>
                      </td>
                    </tr>

                    {showVersions === file._id && (
                      <tr className="bg-gray-50">
                        <td colSpan={4}>
                          <div className="p-4">
                            <h4 className="font-semibold mb-2">Previous Versions</h4>
                            {versions.length === 0 ? (
                              <p className="text-sm text-gray-500">No versions available</p>
                            ) : (
                              <ul className="space-y-2">
                                {versions.map((v) => (
                                  <li
                                    key={v.versionNumber}
                                    className="flex justify-between items-center text-sm"
                                  >
                                    <span>
                                      {v.filename} - v{v.versionNumber} ({formatFileSize(v.size)})
                                    </span>
                                    <button
                                      onClick={() =>
                                        handleRestoreVersion(file._id, v.versionNumber)
                                      }
                                      className="px-2 py-1 text-xs bg-yellow-500 hover:bg-yellow-600 text-white rounded-md"
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
      </div>
    </div>
  );
};

export default FileManagement;
