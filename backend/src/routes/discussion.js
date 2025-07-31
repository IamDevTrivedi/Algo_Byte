const express=require('express');
const userMiddleware = require('../middleware/userMiddle');
const discussionRouter=express.Router();
const {getAllPosts,createPost,postOperation,deletePost,getMyPosts}=require('../controllers/postControl')
const {createComment,deleteComment,commentOperation,getAllComments}=require("../controllers/commentControl")
const {createReply,deleteReply,getAllRepliesByComment}=require('../controllers/replyControl')

//all POST apis
discussionRouter.get("/getAllPosts",userMiddleware,getAllPosts)
discussionRouter.post("/createPost",userMiddleware,createPost)
discussionRouter.post("/postOperation/:id",userMiddleware,postOperation)
discussionRouter.delete("/deletePost/:id",userMiddleware,deletePost)
discussionRouter.get("/getMyPosts",userMiddleware,getMyPosts)


//all comment apis
discussionRouter.get("/getAllComments/:postId",userMiddleware,getAllComments)
discussionRouter.post("/createComment",userMiddleware,createComment)
discussionRouter.post("/commentOperation/:id",userMiddleware,commentOperation)
discussionRouter.delete("/deleteComment/:id",userMiddleware,deleteComment)

//all reply api
discussionRouter.get("/getAllRepliesByComment/:commentId",userMiddleware,getAllRepliesByComment)
discussionRouter.post("/createReply",userMiddleware,createReply)
discussionRouter.delete("/deleteReply/:id",userMiddleware,deleteReply)

module.exports=discussionRouter;