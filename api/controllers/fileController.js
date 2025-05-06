import File from '../models/fileModel.js';
import fs from 'fs';
import path from 'path';


const BASE_DIR = path.resolve(process.cwd(), 'uploads');
const VERSION_DIR = path.join(BASE_DIR, 'versions');


const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded or invalid file type/size' });
    }

    const { filename, path: filepath, mimetype, size } = req.file;

   
    const newFile = new File({ filename, filepath, mimetype, size });
    await newFile.save();

    res.status(201).json({ message: 'File uploaded successfully', newFile });
  } catch (error) {
    console.error('Error in uploadFile:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getFiles = async (req, res) => {
  try {
    const files = await File.find();
    res.status(200).json(files);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateFile = async (req, res) => {
  try {
    const { id } = req.params;
    const existingFile = await File.findById(id);
    if (!existingFile) {
      return res.status(404).json({ error: 'File not found' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded for update' });
    }

    
    ensureDirectoryExists(BASE_DIR);
    ensureDirectoryExists(VERSION_DIR);

    const versionFilename = `${existingFile.filename}-${Date.now()}${path.extname(existingFile.filename)}`;
    const versionPath = path.join(VERSION_DIR, versionFilename);

    
    if (fs.existsSync(existingFile.filepath)) {
      // fs.renameSync(existingFile.filepath, versionPath);
      fs.copyFileSync(existingFile.filepath, versionPath);
      fs.unlinkSync(existingFile.filepath);

    } else {
      console.warn(`Old file not found at ${existingFile.filepath}, skipping versioning.`);
    }

  
    existingFile.versions.push({
      versionNumber: existingFile.versions.length + 1,
      filename: existingFile.filename,
      filepath: versionPath,
      mimetype: existingFile.mimetype,
      size: existingFile.size,
      uploadDate: existingFile.uploadDate,
    });

    
    const { filename, path: filepath, mimetype, size } = req.file;
    existingFile.filename = filename;
    existingFile.filepath = filepath;
    existingFile.mimetype = mimetype;
    existingFile.size = size;

    await existingFile.save();

    res.status(200).json({ message: 'File updated successfully', existingFile });
  } catch (error) {
    console.error('Error in updateFile:', error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteFile = async (req, res) => {
  try {
    const { id } = req.params;
    const file = await File.findById(id);
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    
    console.log(`Deleting file with ID: ${id}`);
    console.log(`File path: ${file.filepath}`);

    
    if (fs.existsSync(file.filepath)) {
      fs.unlinkSync(file.filepath); 
      console.log(`File ${file.filename} deleted from file system.`);
    } else {
      console.log(`File ${file.filename} not found in file system.`);
    }

 
    await file.deleteOne();
    console.log(`File with ID: ${id} deleted from database.`);

    res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error during file deletion:', error);
    res.status(500).json({ error: error.message });
  }
};

export const downloadFile = async (req, res) => {
  try {
    const { id } = req.params;
    const file = await File.findById(id);

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Construct the absolute file path
    const absolutePath = path.resolve(file.filepath);

    // Check if the file exists at the given location
    if (!fs.existsSync(absolutePath)) {
      return res.status(404).json({ error: 'File not found on server' });
    }

    // Send the file for download
    res.download(absolutePath, file.filename, (err) => {
      if (err) {
        console.error('Error during file download:', err);
        res.status(500).json({ error: 'Error while downloading file' });
      }
    });
  } catch (error) {
    console.error('Error during file download process:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getFileVersions = async (req, res) => {
  try {
    const { id } = req.params;
    const file = await File.findById(id);
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.status(200).json(file.versions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const restoreVersion = async (req, res) => {
  try {
    const { id, versionNumber } = req.params;
    const file = await File.findById(id);
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    const version = file.versions.find((v) => v.versionNumber === parseInt(versionNumber));
    if (!version) {
      return res.status(404).json({ error: 'Version not found' });
    }

    // Ensure destination exists
    ensureDirectoryExists(path.dirname(file.filepath));

    // Restore file by copying (not moving)
    fs.copyFileSync(version.filepath, file.filepath);

    // Optional: Update file metadata
    file.filename = version.filename;
    file.mimetype = version.mimetype;
    file.size = version.size;
    file.uploadDate = new Date();

    await file.save();

    res.status(200).json({ message: 'File restored successfully', file });
  } catch (error) {
    console.error('Error restoring file version:', error.message, error.stack);
    res.status(500).json({ error: 'Failed to restore file version' });
  }
};
