const mongoose=require('mongoose');
const { Schema } = mongoose;

const replySchema = new Schema({
    commentId: {
        type: Schema.Types.ObjectId,
        ref: "comment",
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
    }
    

},{
    timestamps:true
});



const Reply = mongoose.model('reply', replySchema);
module.exports=Reply;