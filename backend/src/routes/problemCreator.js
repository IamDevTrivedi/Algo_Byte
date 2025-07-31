const express=require('express');
const problemRouter=express.Router();
const adminMiddleware=require('../middleware/adminMiddle')
const {createProblem,updateProblem,deleteProblem,getProblemById,getAllProblem,solvedProblemsByUser,submittedProblem,problemOfTheDay}=require('../controllers/adminProblem')
const userMiddleware=require('../middleware/userMiddle')


//Create
//Fetch
//Update
//delete

//only Admins can do(use adminmiddleware to check admin login or not.)
problemRouter.post("/create",adminMiddleware,createProblem);//to create a new problem
problemRouter.put("/update/:id",adminMiddleware,updateProblem);//to update a problem
problemRouter.delete("/delete/:id",adminMiddleware,deleteProblem);//to delete a problem


//specially for user
problemRouter.get("/problemById/:id",userMiddleware,getProblemById);//for fetchin a particaular problem
problemRouter.get("/getAllProblem",userMiddleware,getAllProblem);//to fetch all problems


problemRouter.get("/problemSolvedByUser",userMiddleware,solvedProblemsByUser)
problemRouter.get("/submittedProblem/:pid",userMiddleware,submittedProblem)

//for problem of the day
problemRouter.get("/problemOfTheDay",userMiddleware,problemOfTheDay)


module.exports=problemRouter