const mongoose=require('mongoose');
const { Schema } = mongoose;

const battleRoomSchema = new Schema({
    roomId:{
        type:String,
        required:true,
        unique:true,
    },
    hostId:{
        type:Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    problemId: {
        type: Schema.Types.ObjectId,
        ref: "problem",
        required: true,
    },
    players: [
        {
            userId:{
                type:Schema.Types.ObjectId,
                ref:'user',
                required:true
            },
            userName:{type:String},
        },
    ],
    isActive:{
        type:Boolean,
        default:true
    }
    

},{
    timestamps:true
});



const battleRoom = mongoose.model('battleRoom', battleRoomSchema);
module.exports=battleRoom;