const mongoose=require('mongoose');
const { Schema } = mongoose;

const contestSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    problems: [
        {
          type: Schema.Types.ObjectId,
          ref: "problem",
          
        },
        
    ],
    startTime:{
        type:Date,
        required:true
    },
    endTime:{
        type:Date,
        required:true
    }

},{
    timestamps:true
});



const Contest = mongoose.model('contest', contestSchema);
module.exports=Contest;