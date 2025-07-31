const Problem=require('../models/problemSchema')
const POTD=require("../models/POTD")

const createPOTD = async(req,res)=>{
    try{
        const {problemId}=req.body;
        const problem=await Problem.findById(problemId);

        
        if(!problem){
            throw new Error("Not present in database");
        }
        
        let potdProblem=await POTD.findOne({flag:true});
        if (!potdProblem) {
            potdProblem = new POTD({ problemId }); // flag is true by default
          } else {
            potdProblem.problemId = problemId;
          }
        potdProblem.problemId=problemId;
        await potdProblem.save();
        
        res.send("Set successfully")
    }
    catch(err){
        res.send(err.message)
    }
}

module.exports={createPOTD}