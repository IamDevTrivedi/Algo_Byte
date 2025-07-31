const express = require('express');
const adminMiddleware = require('../middleware/adminMiddle');
const videoRouter =  express.Router();
const {generateUploadSignature,saveVideoMetadata,deleteVideo,getAllVideos} = require("../controllers/videoSection")

videoRouter.get("/create/:problemId",adminMiddleware,generateUploadSignature);
videoRouter.post("/save",adminMiddleware,saveVideoMetadata);
videoRouter.delete("/delete/:problemId",adminMiddleware,deleteVideo);

videoRouter.get("/getAllVideos",adminMiddleware,getAllVideos);


module.exports = videoRouter;