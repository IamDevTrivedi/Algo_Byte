const UserStreak = require("../models/userStreakSchema");

const userActivity=async (req,res)=>{
        const userId=req.result._id;
        if(!userId)
            throw new Error("user not present");


        const activityDetails=await UserStreak.findOne({userId:userId});

        res.send(activityDetails);


}

module.exports=userActivity