const express=require('express');
const submissionRouter=express.Router();
const userMiddleware=require('../middleware/userMiddle');
const {submitCode,runCode,userPreviousSubmission,userAllSubmissions,runCustomCode, userPaginatedSubmission}=require('../controllers/userSubmission')
const rateLimiter=require('../middleware/submitRateLimiter')


submissionRouter.post("/submit/:id",userMiddleware,rateLimiter,submitCode);
submissionRouter.post("/run/:id",userMiddleware,runCode);
submissionRouter.get("/submit/prevsubmission/:id",userMiddleware,userPreviousSubmission);
submissionRouter.get("/submit/allsubmissions",userMiddleware,userAllSubmissions);
submissionRouter.get("/submit/allPaginatedSubmission",userMiddleware,userPaginatedSubmission);
submissionRouter.post("/customrun/:id",userMiddleware,runCustomCode);

module.exports=submissionRouter