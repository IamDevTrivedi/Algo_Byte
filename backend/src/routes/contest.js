const express=require('express');
const userMiddleware=require('../middleware/userMiddle')
const contestRouter=express.Router();
const adminMiddleware=require("../middleware/adminMiddle");
const { getAllContests,createContest,startContest, contestProblemSubmission, contestLeaderboard, myContest, getContestByUser,exitContest, getSolvedContestProb } = require('../controllers/contestController');



contestRouter.post("/createContest",adminMiddleware,createContest);
contestRouter.post("/getSolvedContestProb",userMiddleware,getSolvedContestProb);
contestRouter.get("/getAllContests",userMiddleware,getAllContests);
contestRouter.get("/startContest/:id",userMiddleware,startContest);
contestRouter.post("/contestProblemSubmission",userMiddleware,contestProblemSubmission);
contestRouter.get("/contestLeaderboard/:id",userMiddleware,contestLeaderboard);
contestRouter.get("/myContest",userMiddleware,myContest);
contestRouter.get("/myContest/:contestId",userMiddleware,getContestByUser);
contestRouter.post("/exitContest/:contestId",userMiddleware,exitContest);

module.exports=contestRouter