const mongoose=require('mongoose');
const { Schema } = mongoose;

const battleSubmissionSchema = new Schema({
    roomId:{
        type:String,
        required:true,
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    problemId: {
        type: Schema.Types.ObjectId,
        ref: "problem",
        required: true,
    },
    code:{
        type:String,
        required:true
    },
    language:{
        type:String,
        required:true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'wrong', 'error'],
        default: 'pending',
    },
    passedTestCases:{
        type:Number,
        default:0
    },
    timeTaken:{
        type:Number
    },
    totalTestCases:{
        type:Number
    }
},{
    timestamps:true
});



const battleSubmission = mongoose.model('battleSubmission', battleSubmissionSchema);
module.exports=battleSubmission;