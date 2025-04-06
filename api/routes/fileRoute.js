import express from 'express';
import upload from '../controllers/multerConfig.js';
import { uploadFile, getFiles, updateFile, deleteFile, downloadFile, restoreVersion, getFileVersions } from '../controllers/fileController.js';

const router = express.Router();


router.post('/upload', upload.single('file'), uploadFile);
router.get('/', getFiles);
router.put('/:id', upload.single('file'), updateFile);
router.delete('/:id', deleteFile);
router.get('/download/:id', downloadFile);
router.get('/:id/versions', getFileVersions);
router.post('/:id/restore/:versionNumber', restoreVersion);

export default router;
