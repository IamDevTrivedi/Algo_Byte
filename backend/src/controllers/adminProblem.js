const {getLanguageById,submitBatch,submitToken}=require('../utils/problemUtility')
const Problem=require('../models/problemSchema')
const User=require('../models/userSchema');
const Submission = require('../models/submission');
const SolutionVideo=require('../models/videoSchema')
const mongoose = require("mongoose");
const POTD = require('../models/POTD');

const statusIdDescription={
    "1": "In Queue",
    "2": "Processing",
    "3": "Accepted",
    "4": "Wrong Answer",
    "5": "Time Limit Exceeded",
    "6": "Compilation Error",
    "7": "Runtime Error (SIGSEGV)",
    "8": "Runtime Error (SIGXFSZ)",
    "9": "Runtime Error (SIGFPE)",
    "10": "Runtime Error (SIGABRT)",
    "11": "Runtime Error (NZEC)",
    "12": "Runtime Error (Other)",
    "13": "Internal Error",
    "14": "Exec Format Error"
  }
  const createProblem = async (req, res) => {
    const {
        title,
        description,
        difficulty,
        tags,
        visibleTestCases,
        hiddenTestCases,
        startCode,
        problemCreator,
        referenceSolution
    } = req.body;

    try {
        for (const { language, completeCode } of referenceSolution) {
            const languageId = getLanguageById(language);

            if (!languageId) {
                return res.status(400).send(`Unsupported language: ${language}`);
            }

            
            const submissions = visibleTestCases.map((testCase) => ({
                source_code: completeCode,
                language_id: languageId,
                stdin: testCase.input,
                expected_output: testCase.output
            }));

            if (!submissions.length) {
                return res.status(400).send("No visible test cases provided.");
            }
            

            const submitResult = await submitBatch(submissions);

            

            if (!submitResult || !submitResult.map) {
                return res.status(422).send("Judge0 API error: invalid submission response.");
            }

            const resultToken = submitResult.map((value) => value.token);
            const testResult = await submitToken(resultToken);


            
            
            for (const test of testResult) {
                if (test.status_id !== 3) {
                    return res.status(400).send(statusIdDescription[test.status_id] || "Unknown error");
                }
            }
        }

        await Problem.create({
            ...req.body,
            problemCreator: req.result._id // Double-check this line
        });

        res.status(201).send("Problem saved successfully");
    } catch (err) {
        console.error("Error in createProblem:", err);
        res.status(400).send(err.message);
    }
};

const updateProblem= async(req,res)=>{
    const {
        title,
        description,
        difficulty,
        tags,
        visibleTestCases,
        hiddenTestCases,
        startCode,
        problemCreator,
        referenceSolution
    } = req.body;
    const {id}=req.params

    try{

        if(!id)
            throw new Error("Invalid id")

        const getProblem=await Problem.findById(id);
        if(!getProblem)
            throw new Error("not exists");

        for (const { language, completeCode } of referenceSolution) {
            const languageId = getLanguageById(language);

            if (!languageId) {
                return res.status(400).send(`Unsupported language: ${language}`);
            }

            //const sanitize = (str) => (str == null ? "" : String(str).trim());

            const submissions = visibleTestCases.map((testCase) => ({
                source_code: completeCode,
                language_id: languageId,
                stdin: testCase.input,
                expected_output: testCase.output
            }));

            if (!submissions.length) {
                return res.status(400).send("No visible test cases provided.");
            }
            

            const submitResult = await submitBatch(submissions);

            

            if (!submitResult || !submitResult.map) {
                return res.status(422).send("Judge0 API error: invalid submission response.");
            }

            const resultToken = submitResult.map((value) => value.token);
            const testResult = await submitToken(resultToken);

            for (const test of testResult) {
                if (test.status_id !== 3) {
                    return res.status(400).send(statusIdDescription[test.status_id] || "Unknown error");
                }
            }
        }

        const newProblem= await Problem.findByIdAndUpdate(id,{...req.body},{runValidators:true , new:true})

        res.send("updated successfully")

    }
    catch(err){
        res.send(err.message)
    }
}

const deleteProblem=async (req,res)=>{
    try{
        const {id}=req.params;
        if(!id)
            throw new Error("Id is missing");

        const problemToDelete=await Problem.findByIdAndDelete(id);

        if(!problemToDelete)
            throw new Error("Problem is not present");

        res.status(201).send("successfully deleted")
        
        
    }
    catch(err){
        res.send(err.message);
    }
}

const getProblemById=async (req,res)=>{
    try{
        const {id}=req.params;
       
        if(!id)
            throw new Error("Id is missing");

       
        const problemNeededByAdmin=await Problem.findById(id)
        
        const problemNeededByUser=await Problem.findById(id).select('title description difficulty tags visibleTestCases startCode ');
        
        const videos = await SolutionVideo.findOne({problemId:id});
      

            
        

        if(req.result.role=='user')
        {
            if(videos){ 
                const responseData={
                    ...problemNeededByUser,
                    secureUrl : videos.secureUrl,
                    cloudinaryPublicId : videos.cloudinaryPublicId,
                    thumbnailUrl : videos.thumbnailUrl,
                    duration : videos.duration,

                }   
                
                return res.status(200).send( responseData);
                }
            if(!problemNeededByUser)
                throw new Error("Problem is not present");
            
            res.status(201).send(problemNeededByUser)
        }
        else
        {
            if(videos){

                const responseData={
                    ...problemNeededByAdmin,
                    secureUrl : videos.secureUrl,
                    cloudinaryPublicId : videos.cloudinaryPublicId,
                    thumbnailUrl : videos.thumbnailUrl,
                    duration : videos.duration,

                }   
                
    
                return res.status(200).send( responseData);
            }
           
            
            if(!problemNeededByAdmin)
                throw new Error("Problem is not present");
            
            const responseData={...problemNeededByAdmin}
            
            res.status(201).send(responseData)
        }
        
        
    }
    catch(err){
        res.send(err.message);
    }
}

const getAllProblem=async (req,res)=>{
    try{

        const problemNeeded=await Problem.find({}).select('title difficulty tags _id description');
      
        if(problemNeeded.length==0)
            throw new Error("Problems are not present");

        res.status(201).json({problemNeeded})
        
        
    }
    catch(err){
        res.send(err.message);
    }
}

const solvedProblemsByUser=async (req,res)=>{
    try{
        

        const userId=req.result._id;

        const user= await User.findById(userId).populate({
            path:"problemSolved",
            select:'_id title difficulty tags'
        }) 

        res.send(user.problemSolved);
    }
    catch(err){
        res.status(500).send("Server Error")
    }
}

const submittedProblem=async(req,res)=>{
    try{
        const userId=req.result._id;
        const problemId=req.params.pid;

        const ans=await Submission.find({userId,problemId});

        if(ans.length==0){
            res.send("None");
        }

        res.send(ans)
    }
    catch(err){
        res.send(err.message);
    }
}

const problemOfTheDay=async (req,res)=>{
    try{
        const potd=await POTD.findOne({flag:true})

        const problem=await Problem.findById(potd.problemId).select('title description difficulty tags visibleTestCases startCode ');

        res.send(problem);
        
    }
    catch(err){
        res.send(err.message);
    }
}
module.exports={createProblem,updateProblem,deleteProblem,getProblemById,getAllProblem,solvedProblemsByUser,submittedProblem,problemOfTheDay}