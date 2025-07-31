const mongoose=require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    firstName:{
        type:String,
        required:true,
        minLength:3,
        maxLength:20
    },
    lastName:{
        type:String,
        minLength:3,
        maxLength:20
    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        immutable:true,
        trim:true
    },
    age:{
        type:Number,
    },
    role:{
        type:String,
        enum:['user','admin'],
        default:'user',
    },
    levelOfUser:{
        type:String,
        enum:['Beginner','Intermediate','Advance'],
        default:'Beginner',
    },
    problemSolved:{
        type:[{
            type:Schema.Types.ObjectId,
            ref:'problem'
        }],
        unique:true
    },
    password:{
        required:true,
        type:String,
    },
    isVerified:{
        require:true,
        type:Boolean,
        default:false
    }

},{
    timestamps:true
});

userSchema.post('findOneAndDelete', async function (userInfo){
    if(userInfo){
        await mongoose.model('submission').deleteMany({userId:userInfo._id})
    }
})
userSchema.post('findOneAndDelete', async function (userInfo){
    if(userInfo){
        await mongoose.model('userStreak').deleteMany({userId:userInfo._id})
    }
})
userSchema.post('findOneAndDelete', async function (userInfo){
    if(userInfo){
        await mongoose.model('reply').deleteMany({userId:userInfo._id})
    }
})
userSchema.post('findOneAndDelete', async function (userInfo){
    if(userInfo){
        await mongoose.model('post').deleteMany({userId:userInfo._id})
    }
})
userSchema.post('findOneAndDelete', async function (userInfo){
    if(userInfo){
        await mongoose.model('userImage').deleteMany({userId:userInfo._id})
    }
})
userSchema.post('findOneAndDelete', async function (userInfo){
    if(userInfo){
        await mongoose.model('contestSubmission').deleteMany({userId:userInfo._id})
    }
})
userSchema.post('findOneAndDelete', async function (userInfo){
    if(userInfo){
        await mongoose.model('contestparticipants').deleteMany({userId:userInfo._id})
    }
})
userSchema.post('findOneAndDelete', async function (userInfo){
    if(userInfo){
        await mongoose.model('comment').deleteMany({userId:userInfo._id})
    }
})
userSchema.post('findOneAndDelete', async function (userInfo){
    if(userInfo){
        await mongoose.model('bookmarkList').deleteMany({userId:userInfo._id})
    }
})

const User = mongoose.model('user', userSchema);
module.exports=User;