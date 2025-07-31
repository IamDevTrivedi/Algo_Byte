const express=require('express');
const activityRouter=express.Router();
const userMiddleware=require('../middleware/userMiddle')
const userActivity=require('../controllers/userActivity')


activityRouter.get("/useractivity",userMiddleware,userActivity);


module.exports=activityRouter