const mongoose=require('mongoose');
const { Schema } = mongoose;

const commentSchema = new Schema({
    postId: {
        type: Schema.Types.ObjectId,
        ref: "post",
        required: true,
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
    replies: [
        {
          type: Schema.Types.ObjectId,
          ref: "reply",
        },
      ],

},{
    timestamps:true
});



const Comment = mongoose.model('comment', commentSchema);
module.exports=Comment;