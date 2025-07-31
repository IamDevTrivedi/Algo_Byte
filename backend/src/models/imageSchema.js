const mongoose = require('mongoose');
const {Schema} = mongoose;

const imageSchema = new Schema({
    
    userId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
   },
   cloudinaryPublicId: {
    type: String,
    required: true,
    unique: true
  },
  secureUrl: {
    type: String,
    required: true
  },
  
  uploadedAt: { 
    type: Date, 
    default: Date.now 
    },
},{
    timestamps:true
});



const userImage = mongoose.model("userImage",imageSchema);

module.exports = userImage;