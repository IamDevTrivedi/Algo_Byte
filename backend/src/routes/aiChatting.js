const express=require('express');
const userMiddleware=require('../middleware/userMiddle')
const aiRouter=express.Router();
const replyByLLM=require('../controllers/replyByLLM')


aiRouter.post('/chat',userMiddleware,replyByLLM);

module.exports=aiRouter