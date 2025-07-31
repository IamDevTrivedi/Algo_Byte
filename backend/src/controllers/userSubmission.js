const Problem=require('../models/problemSchema');
const Submission=require('../models/submission')
const {getLanguageById,submitBatch,submitToken}=require('../utils/problemUtility')
const userStreak=require('../models/userStreakSchema')
const POTD = require('../models/POTD');

function decodeBase64(str) {
    if (!str) return null;
    return Buffer.from(str, 'base64').toString('utf-8');
  }

const submitCode=async (req,res)=>{
    try{
        const userId=req.result._id;
        const {id:problemId}=req.params;
        
        let {code,language}=req.body;
       
        if(!userId||!problemId||!code||!language)
            throw new Error("Fields are missiong")

        const problem=await Problem.findById(problemId)
      
        if(language=='cpp')
            language='c++';

        const submitedResult=await Submission.create({
            userId,
            problemId,
            code,
            language,
            status:'pending',
            testCasesTotal:problem.hiddenTestCases.length
        })
       
        //now submit user's code to Judge0

        const languageId = getLanguageById(language);

        if (!languageId){
            return res.status(400).send(`Unsupported language: ${language}`);
        }
       
        
        const submissions = problem.hiddenTestCases.map((testCase) => ({
            source_code: code,
            language_id: languageId,
            stdin: testCase.input,
            expected_output: testCase.output.endsWith('\n') 
            ? testCase.output 
            : testCase.output + '\n'
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
            
     
            let testCasesPassed=0;
            let runtime=0;
            let memory=0;
            let status='accepted';
            let errorMessage=null;

            for(const test of testResult){
                if(test.status_id==3){
                    testCasesPassed++;
                    runtime=runtime+parseFloat(test.time)
                    memory=Math.max(memory,test.memory)
                }
                else{
                    if(test.status_id==4){
                        status='error';
                        errorMessage=test.stderr
                    }
                    else{
                        status="wrong";
                        errorMessage=test.stderr
                    }
                }
            }

                if(status=='accepted'){
                    let IsPresent=req.result.problemSolved.includes(problemId);
                    let potd=await POTD.findOne({flag:true})
                    if(IsPresent==0){
                        req.result.problemSolved.push(problemId);
                        await req.result.save();
                    }
                    if(problemId==potd.problemId){
                        const userInStreak=await userStreak.findOne({userId:userId});
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        if(!userInStreak){
                            
                            await userStreak.create({
                                userId,
                                currentStreak:1,
                                maxStreak:1,
                                lastSolvedDate:today,
                                solvedDates: [today]
                            })
                        }
                        else{
                            const last=new Date(userInStreak.lastSolvedDate);
                            last.setHours(0, 0, 0, 0);

                            if (today.getTime() != last.getTime()) {
                                
                                const diffInDays = (today - last) / (1000 * 60 * 60 * 24);

                                if (diffInDays === 1) {
                                userInStreak.currentStreak += 1;
                                } else {
                                userInStreak.currentStreak = 1;
                                }

                            }
                            userInStreak.lastSolvedDate = today;
                            userInStreak.maxStreak = Math.max(userInStreak.maxStreak, userInStreak.currentStreak);
                            const alreadyExists = userInStreak.solvedDates.some(
                                (d) => new Date(d).getTime() === today.getTime()
                              );
                              if (!alreadyExists) {
                                userInStreak.solvedDates.push(today);
                              }
                            await userInStreak.save();
                        }
                }
            }

            if(status!="accepted"){
                const userInStreak=await userStreak.findOne({userId:userId});
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                if(!userInStreak){
                            
                    await userStreak.create({
                        userId,
                        currentStreak:0,
                        maxStreak:0,
                        lastSolvedDate:null,
                        solvedDates:[today]
                    })
                }
                else{
                    const alreadyExists = userInStreak.solvedDates.some(
                        (d) => new Date(d).getTime() === today.getTime()
                    );
                    if (!alreadyExists) {
                        userInStreak.solvedDates.push(today);
                    }
                    await userInStreak.save();
                }
            }
            //now store result in database

            submitedResult.status=status;
            submitedResult.testCasesPassed=testCasesPassed;
            submitedResult.errorMessage=errorMessage;
            submitedResult.runtime=runtime
            submitedResult.memory=memory;

            await submitedResult.save();

            res.status(201).send(submitedResult);
    }
    catch(err){
        res.send(err.message)
    }
}

const runCode=async (req,res)=>{
    try{
       
        const userId=req.result._id;
        const {id:problemId}=req.params;

        let {code,language}=req.body;

        if(!userId||!problemId||!code||!language)
            throw new Error("Fields are missiong")
       

        const problem=await Problem.findById(problemId)
       

        //now submit user's code to Judge0
        
        if(language=='cpp'){
            language='c++';
        }


        const languageId = getLanguageById(language);

        if (!languageId){
            return res.status(400).send(`Unsupported language: ${language}`);
        }
        

        const submissions = problem.visibleTestCases.map((testCase) => ({
            source_code: code,
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
            
                const userInStreak=await userStreak.findOne({userId:userId});
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                if(!userInStreak){
                            
                    await userStreak.create({
                        userId,
                        currentStreak:0,
                        maxStreak:0,
                        lastSolvedDate:null,
                        solvedDates:[today]
                    })
                }
                else{
                    const alreadyExists = userInStreak.solvedDates.some(
                        (d) => new Date(d).getTime() === today.getTime()
                    );
                    if (!alreadyExists) {
                        userInStreak.solvedDates.push(today);
                    }
                    await userInStreak.save();
                
                }
            //now s
            
            res.status(201).send(testResult);
    }
    catch(err){
        res.send("Your error,you debug")
    }
}

const runCustomCode = async (req, res) => {
    try {
        const userId = req.result._id;
        const { id: problemId } = req.params;
        const { code, language, inputs,expectedOutputs } = req.body;

        if (!userId || !problemId || !code || !language|| !expectedOutputs)
            throw new Error("Fields are missing");

        let lang = language;
        if (lang === 'cpp') 
            lang = 'c++';

        const languageId = getLanguageById(lang);

        if (!languageId) {
            return res.status(400).send(`Unsupported language: ${lang}`);
        }
        
        const submissions = inputs.map((testCase) => ({
            source_code: code,
            language_id: languageId,
            stdin: testCase,
            expected_output:expectedOutputs[0]
        }));
        
        const submitResult = await submitBatch(submissions);
        
        if (!submitResult || !submitResult.map) {
            return res.status(422).send("Judge0 submission failed.");
        }

        const resultToken = submitResult.map((value) => value.token);
        const testResult = await submitToken(resultToken);
       

        res.status(200).json(
            testResult
        );
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const userPreviousSubmission = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.result._id;

        if (!id || !userId) throw new Error("Not present in DB");

        const totalSubmission = await Submission.find({ userId, problemId: id });

        res.status(200).json(totalSubmission);
    } catch (err) {
        res.status(400).json({ error: "Invalid data" });
    }
};
const userAllSubmissions=async(req,res)=>{
    try{
        
        const userId=req.result._id

        

        if(!userId)
            throw new Error("userId missing")

        const allSubmissions=await Submission.find({userId:userId});
        

        res.send(
            allSubmissions);


    }
    catch(err){
        res.send(err.message);
    }
}

const userPaginatedSubmission=async(req,res)=>{
    try{
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const userId=req.result._id

        const skip = (page - 1) * limit;

        if(!userId)
            throw new Error("userId missing")

        const allSubmissions=await Submission.find({userId:userId});
        const totalItems=allSubmissions.length;
        const items = await Submission.find({userId:userId}).skip(skip).limit(limit);

        res.json({
            allSubmissions:items,
            totalPages: Math.ceil(totalItems / limit),
            currentPage: page,
        });


    }
    catch(err){
        res.send(err.message);
    }
}
module.exports={runCustomCode,submitCode,runCode,userPreviousSubmission,userAllSubmissions,userPaginatedSubmission};
