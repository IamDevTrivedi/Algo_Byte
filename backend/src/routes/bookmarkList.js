const express=require('express');
const bookmarkRouter=express.Router();
const userMiddleware=require('../middleware/userMiddle')
const {getUserBookmarks,createBookmarkList,addProblemToList,getBookmarkProblems,deleteList,removeProblemFromList}=require('../controllers/bookmarkController')



bookmarkRouter.get("/getUserBookmarks",userMiddleware,getUserBookmarks)
bookmarkRouter.post("/createBookmarkList",userMiddleware,createBookmarkList)
bookmarkRouter.post("/addProblemToList",userMiddleware,addProblemToList);
bookmarkRouter.post("/getBookmarkProblems",userMiddleware,getBookmarkProblems)
bookmarkRouter.delete("/deleteList/:listId",userMiddleware,deleteList)
bookmarkRouter.post("/removeProblemFromList",userMiddleware,removeProblemFromList)

module.exports=bookmarkRouter;