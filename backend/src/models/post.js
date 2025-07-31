const mongoose=require('mongoose');
const { Schema } = mongoose;

const postSchema = new Schema({
    title:{
        type:String,
        required:true,
        minLength:3,
    },
    content:{
        type:String,
        required:true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    likes: [
        {
          type: Schema.Types.ObjectId,
          ref: "user",
        },
      ],
    

},{
    timestamps:true
});



const Post = mongoose.model('post', postSchema);
module.exports=Post;