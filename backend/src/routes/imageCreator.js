const express = require('express');
const imageRouter = express.Router();
const userMiddleware = require('../middleware/userMiddle'); // Assuming JWT
const {
  generateImageUploadSignature,
  saveImageMetadata,
  deleteImage,
  getImage,
  getAllImage
} = require('../controllers/imageSection');

imageRouter.get('/createImage', userMiddleware, generateImageUploadSignature);
imageRouter.post('/saveImage', userMiddleware, saveImageMetadata);
imageRouter.delete('/deleteImage', userMiddleware, deleteImage);

imageRouter.get('/getImage', userMiddleware, getImage);
imageRouter.get('/getAllImage', userMiddleware, getAllImage);


module.exports = imageRouter;
