const cloudinary = require('cloudinary').v2;
const Problem = require('../models/problemSchema');
const userImage = require('../models/imageSchema');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET /image/create/:problemId
const generateImageUploadSignature = async (req, res) => {
  try {
    
    const userId = req.result._id;

    
    const timestamp = Math.round(new Date().getTime() / 1000);
    const publicId = `leetcode-images/${userId}_${timestamp}`;

    const uploadParams = {
      timestamp,
      public_id: publicId,
    };

    const signature = cloudinary.utils.api_sign_request(uploadParams, process.env.CLOUDINARY_API_SECRET);

    res.json({
      signature,
      timestamp,
      public_id: publicId,
      api_key: process.env.CLOUDINARY_API_KEY,
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      upload_url: `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
    });
  } catch (err) {
    console.error('Image signature error:', err);
    res.status(500).json({ error: 'Failed to generate image signature' });
  }
};

// POST /image/save
const saveImageMetadata = async (req, res) => {
  try {
    const { problemId, cloudinaryPublicId, secureUrl } = req.body;
    const userId = req.result._id;

    const resource = await cloudinary.api.resource(cloudinaryPublicId, { resource_type: 'image' });

    if (!resource) return res.status(400).json({ error: 'Image not found on Cloudinary' });

    const existing = await userImage.findOne({ userId});
    if (existing) return res.status(409).json({ error: 'Image already exists' });

    const imageRecord = await userImage.create({
      userId,
      cloudinaryPublicId,
      secureUrl,
    });

    res.status(201).json({
      message: 'Image uploaded successfully',
      image: {
        id: imageRecord._id,
        secureUrl: imageRecord.secureUrl,
        uploadedAt: imageRecord.uploadedAt,
      }
    });
  } catch (err) {
    console.error('Image metadata save error:', err);
    res.status(500).json({ error: 'Failed to save image metadata' });
  }
};

// DELETE /image/:problemId
const deleteImage = async (req, res) => {
  try {
    const { problemId } = req.params;
    const userId = req.result._id;

    const image = await userImage.findOneAndDelete({ problemId, userId });
    if (!image) return res.status(404).json({ error: 'Image not found' });

    await cloudinary.uploader.destroy(image.cloudinaryPublicId, { resource_type: 'image', invalidate: true });

    res.json({ message: 'Image deleted successfully' });
  } catch (err) {
    console.error('Delete image error:', err);
    res.status(500).json({ error: 'Failed to delete image' });
  }
};

const getImage=async(req,res)=>{
  try{
      const userId=req.result._id;
      if(!userId)
         res.status(404).json({ error: "Image not found" });
      
      const image=await userImage.findOne({userId:userId});
      if(!image)
         res.status(404).json({ error: "Image not found" });

      res.send(image)


  }
  catch(err){
    res.send("Image not receiving");
  }
}

const getAllImage=async(req,res)=>{
  try{
      
      const images=await userImage.find({});
      if(!images)
        res.send(null);

      res.json({images})
  }
  catch(err){
    res.send("Images not receiving");
  }
}



module.exports = {
  generateImageUploadSignature,
  saveImageMetadata,
  deleteImage,
  getImage,
  getAllImage
};
