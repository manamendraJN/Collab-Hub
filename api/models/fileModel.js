import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  fileId: {
    type: String,
    unique: true,  
    default: () => new mongoose.Types.ObjectId().toString(),  
  },
  filename: {
    type: String,
    required: true,
  },
  filepath: {
    type: String,
    required: true,
  },
  mimetype: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
  versions: [
    {
      versionNumber: Number,
      filename: String,
      filepath: String,
      mimetype: String,
      size: Number,
      uploadDate: Date,
    },
  ],
});

// Automatically update the 'updatedAt' field before saving
fileSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const File = mongoose.model('File', fileSchema);

export default File;
