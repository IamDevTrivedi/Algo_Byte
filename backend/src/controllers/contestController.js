const Contest=require('../models/contest')
const ContestParticipants=require('../models/contestParticipants')
const ContestSubmission=require('../models/contestSubmission')

const createContest=async(req,res)=>{
    try {
        const { title, description, startTime, endTime, problems } = req.body
    
      
        if (!title || !description || !startTime || !endTime || !problems || problems.length === 0) {
          return res.status(400).json({ success: false, message: "Missing required fields" })
        }
      
        const contest = await Contest.create({
          title,
          description,
          userId: req.result._id,
          problems,
          startTime: new Date(startTime),
          endTime: new Date(endTime)
        })
    
    
        res.status(201).json({
          success: true,
          message: "Contest created successfully",
          contest
        })
      } catch (error) {

        console.error("Create Contest Error:", error)
        res.status(500).json({
          success: false,
          message: "Server error"
        })

      }
}

const getAllContests=async(req,res)=>{
    try{
    const now = new Date();

    const contests = await Contest.find({})
      .populate('userId', 'name') 
      .populate('problems', 'title difficulty')
      .sort({ startTime: 1 }); // Optional: sort by start time

    // Categorize contests
    const upcoming = contests.filter(c => c.startTime > now);
    const ongoing = contests.filter(c => c.startTime <= now && c.endTime >= now);
    const past = contests.filter(c => c.endTime < now);

    res.status(200).json({
      success: true,
      total: contests.length,
      upcoming,
      ongoing,
      past
    });
  } 
  catch (err) {
    console.error('Error fetching contests:', err);
    res.status(500).json({ success: false, message: 'Server error while fetching contests' });
  }
}

const startContest=async(req,res)=>{
    try {
        const userId = req.result._id;
        const contestId = req.params.id;
    
        const contest = await Contest.findById(contestId).populate('problems', 'title difficulty tags');
        if (!contest) {
          return res.status(404).json({ success: false, message: 'Contest not found' });
        }
    
        const now = new Date();
        if (contest.endTime < now) {
          return res.status(400).json({ success: false, message: 'Contest has already ended' });
        }
    
        let participant = await ContestParticipants.findOne({ userId, contestId });
        
        if (participant?.exited) {
            return res.status(403).json({
              success: false,
              message: "You have exited the contest and cannot rejoin.",
            });
          }
        // If first time, create participant
        if (!participant) {
          participant = await ContestParticipants.create({
            userId,
            contestId,
            startedAt: now,
            finished: false,
            totalScore: 0,
            testCasePassedCount: 0,
          });
        }
    
        res.status(200).json({
          success: true,
          message: participant.createdAt ? 'Contest started' : 'Contest already started',
          startedAt: participant.startedAt,
          contest,
          problems: contest.problems.map((p) => ({
            _id: p._id,
            title: p.title,
            difficulty: p.difficulty,
            tags: p.tags,
          })),
        });
    
      } catch (error) {
        console.error('Error starting contest:', error);
        res.status(500).json({ success: false, message: 'Server error while starting contest' });
      }
}
const getSolvedContestProb=async(req,res)=>{
  try{
    const {contestId}=req.body;
    const userId=req.result._id;

    let solved = await ContestSubmission.find({ userId, contestId });

    res.json({
      solved
    })

  }
  catch(err){
    console.error('Error starting contest:', error);
    res.status(500).json({ success: false, message: 'Server error while starting contest' });
  }
}
const contestProblemSubmission=async(req,res)=>{
    try {
        const { contestId, problemId, code, language, status, executionTime, memoryUsed, testCasePassedCount, totalTestCases, score } = req.body;
        const userId = req.result._id;
    
        const contest = await Contest.findById(contestId);
        if (!contest) {
          return res.status(404).json({ success: false, message: 'Contest not found' });
        }
    
        const now = new Date();
        if (now < contest.startTime) {
          return res.status(400).json({ success: false, message: 'Contest has not started yet' });
        }
        if (now > contest.endTime) {
          return res.status(400).json({ success: false, message: 'Contest has ended' });
        }
    
        
        const participant = await ContestParticipants.findOne({ contestId, userId });
        if (!participant) {
          return res.status(403).json({ success: false, message: 'You are not registered for this contest' });
        }
        const alreadyAccepted = await ContestSubmission.findOne({
            userId,
            contestId,
            problemId,
            status: 'accepted',
          });
       
        // Save the submission
        const submission = await ContestSubmission.create({
          contestId,
          userId,
          problemId,
          code,
          language,
          status,
          executionTime,
          memoryUsed,
          testCasePassedCount,
          totalTestCases,
          score,
        });
      
    
        // Update participant score if submission was accepted
        if (status === 'accepted') {
          // Prevent scoring the same problem multiple times
          
    
          if (!alreadyAccepted) {
            participant.totalScore += score || 0;
           
            participant.testCasePassedCount += testCasePassedCount || 0;
            await participant.save();
          }
        }
        
        res.status(201).json({
          success: true,
          message: 'Submission saved successfully',
          submissionId: submission._id,
        });
    
      } catch (error) {
        console.error('Error in contest submission:', error);
        res.status(500).json({ success: false, message: 'Server error during submission' });
      }
}

const contestLeaderboard=async(req,res)=>{
    try {
        const contestId = req.params.id;
    
        const participants = await ContestParticipants.find({ contestId })
          .populate('userId', 'firstName emailId') // show name/email on leaderboard
          .sort([
            ['totalScore', -1],
            ['startedAt', 1]
          ]);
    
        // Assign ranks
        let leaderboard = [];
        let rank = 1;
    
        for (let i = 0; i < participants.length; i++) {
          if (i > 0 &&
              participants[i].totalScore < participants[i - 1].totalScore) {
            rank = i + 1;
          }
    
          leaderboard.push({
            rank,
            name: participants[i].userId.firstName || "Anonymous",
            email: participants[i].userId.emailId,
            totalScore: participants[i].totalScore,
            testCasePassedCount: participants[i].testCasePassedCount,
            startedAt: participants[i].startedAt,
          });
        }
    
        res.status(200).json({
          success: true,
          leaderboard
        });
    
      } catch (error) {
        console.error('Leaderboard error:', error);
        res.status(500).json({ success: false, message: 'Server error while generating leaderboard' });
      }
}

const myContest=async(req,res)=>{
    try {
        const userId = req.result._id;
        
      
        const participations = await ContestParticipants.find({ userId }).populate({
          path: 'contestId',
          populate: {
            path: 'problems',
            select: 'title difficulty'
          }
        });
        
        const contests = participations
  .filter(p => p.contestId) // skip if null
  .map(p => ({
    _id: p.contestId._id,
    title: p.contestId.title,
    description: p.contestId.description,
    startTime: p.contestId.startTime,
    endTime: p.contestId.endTime,
    totalScore: p.totalScore,
    testCasePassedCount: p.testCasePassedCount,
    problems: p.contestId.problems,
    startedAt: p.startedAt,
    finished: p.finished
  }));
        
        res.status(200).json({
          success: true,
          contests
        });
    
      } catch (error) {
        console.error('Error fetching user contests:', error);
        res.status(500).json({ success: false, message: 'Server error while fetching contests' });
      }
}

const getContestByUser=async(req,res)=>{
    try {
        const userId = req.result._id;
        const contestId = req.params.contestId;
    
        // 1. Ensure the user is a participant
        const participant = await ContestParticipants.findOne({ contestId, userId });
        if (!participant) {
          return res.status(403).json({ success: false, message: "You didn't participate in this contest" });
        }
    
        // 2. Get the contest with problems
        const contest = await Contest.findById(contestId).populate('problems', 'title difficulty description');
        if (!contest) {
          return res.status(404).json({ success: false, message: "Contest not found" });
        }
    
        // 3. Get user's submissions sorted by newest first
        const allSubmissions = await ContestSubmission.find({ contestId, userId })
          .sort({ submittedAt: -1 });
    
        // 4. Map: keep only the final (latest) submission per problem
        const finalSubmissionsByProblem = new Map();
    
        for (const sub of allSubmissions) {
          const pid = sub.problemId.toString();
          if (!finalSubmissionsByProblem.has(pid)) {
            finalSubmissionsByProblem.set(pid, {
              _id: sub._id,
              code: sub.code,
              language: sub.language,
              status: sub.status,
              score: sub.score,
              executionTime: sub.executionTime,
              memoryUsed: sub.memoryUsed,
              submittedAt: sub.submittedAt
            });
          }
        }
    
        // 5. Build final response list of problems
        const problemsWithSubmissions = contest.problems.map(p => ({
          _id: p._id,
          title: p.title,
          difficulty: p.difficulty,
          description: p.description,
          submission: finalSubmissionsByProblem.get(p._id.toString()) || null
        }));
    
        // 6. Send response
        res.status(200).json({
          success: true,
          contest: {
            _id: contest._id,
            title: contest.title,
            startTime: contest.startTime,
            endTime: contest.endTime
          },
          problems: problemsWithSubmissions
        });
    
      } catch (error) {
        console.error('Error loading contest details:', error);
        res.status(500).json({ success: false, message: 'Server error while loading contest details' });
      }
}

const exitContest=async(req,res)=>{
    
        try {
          const userId = req.result._id;
          const { contestId } = req.params;
      
          const participant = await ContestParticipants.findOne({ contestId, userId });
          if (!participant) {
            return res.status(404).json({ success: false, message: "User not in contest" });
          }
      
          participant.exited = true;
          await participant.save();
      
          res.status(200).json({ success: true, message: "You have exited the contest" });
        } catch (err) {
          console.error(err);
          res.status(500).json({ success: false, message: "Server error while exiting contest" });
        }
}
module.exports={createContest,getAllContests,startContest,getSolvedContestProb,contestProblemSubmission,contestLeaderboard,myContest,getContestByUser,exitContest}