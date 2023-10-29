const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: 'dbmcdpt3h', 
  api_key: '745184783584474', 
  api_secret: 'QKURScJQZgU3lkkOWrtHQGABaAE' 
});

const storage = new CloudinaryStorage({
  cloudinary,
  allowedFormats: ['jpg', 'png'],
  params: {
    folder: 'DoAn3'
  }
});

const uploadCloud = multer({ storage });

module.exports = uploadCloud;
