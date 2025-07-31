const battleRoom=require('../models/battleRoom')
const {nanoid}=require('nanoid')
const Problem=require('../models/problemSchema')
const battleSubmission = require('../models/battleSubmission');
const {submitBatch,submitToken,getLanguageById}=require('../utils/problemUtility')


const createBattleRoom=async(req,res)=>{
    try{
        const { hostId, problemId, userName } = req.body;
        
        if(!hostId||!problemId||!userName)
            return res.status(404).json({ message: "Fields are missing" });
        
        const roomId = nanoid(8); 
        
        const newRoom = new battleRoom({
            roomId,
            hostId,
            problemId,
            players: [{ userId: hostId, userName }],
        });
        await newRoom.save();

        
        res.status(201).json({ roomId });

    }
    catch(err){
        res.status(404).json({
            message:err.message
        })
    }
}

const joinBattleRoom=async(req,res)=>{
    try{
        const { roomId, userId, userName } = req.body;
        

        if(!roomId||!userId||!userName)
            return res.status(404).json({ message: "Fields are missing" });
       
        const room = await battleRoom.findOne({ roomId });
   
        if (!room) 
            return res.status(404).json({ message: "Room not found" });
      
        
        const alreadyJoined = room.players.find(p => p.userId.toString() === userId);
        if (!alreadyJoined) {
            room.players.push({ userId, userName });
            await room.save();
        }
       
        res.status(200).json({ message: "Joined room successfully" });
    }
    catch(err){
        res.status(401).json({
            message:err.message
        })
    }
}

const getAllBattles=async(req,res)=>{
    try{
        const playerId=req.result._id;

        const battles = await battleRoom.find({
            'players.userId': playerId
        })
        .populate('hostId')
        .populate('problemId')
        .populate('players.userId');

        res.status(200).json({
            battles:battles
        })
        
    }
    catch(err){
        res.status(401).json({
            message:err.message
        })
    }
}


const getBattle=async(req,res)=>{
    try{
        const {roomId}=req.params;

        if(!roomId){
            return res.status(404).json({ message: "Fields are missing" });
        }

        const battle=await battleRoom.findOne({roomId});

        if(!battle){
            return res.status(404).json({ message: "battle not exist" });
        }

        res.json({
            battle
        })
    }
    catch(err){
        res.json({
            message:err.message
        })
    }
}





const battleSubmitCode = async (req, res) => {
  try {
    const userId = req.result._id;
    
    let { code, language,problemId,roomId } = req.body;

    if (!userId || !problemId || !roomId || !code || !language) {
      return res.status(400).json({ error: 'Missing fields' });
    }

   

    const problem = await Problem.findById(problemId);

    if (!problem) return res.status(404).json({ error: 'Problem not found' });
    const totalTestCases=problem.hiddenTestCases.length
    if (language === 'cpp') language = 'c++';

    const languageId = getLanguageById(language);
    if (!languageId) return res.status(400).json({ error: 'Unsupported language' });

    const testCases = problem.hiddenTestCases.map((testCase) => ({
      source_code: code,
      language_id: languageId,
      stdin: testCase.input,
      expected_output: testCase.output.endsWith('\n') ? testCase.output : testCase.output + '\n',
    }));

    const resultTokens = await submitBatch(testCases);
    const tokens = resultTokens.map(r => r.token);
    const results = await submitToken(tokens);

    let passed = 0, totalTime = 0, maxMemory = 0, status = 'accepted', error = null;

    for (const r of results) {
      if (r.status_id === 3) {
        passed++;
        totalTime += parseFloat(r.time);
        maxMemory = Math.max(maxMemory, r.memory);
      } else {
        status = r.status_id === 4 ? 'error' : 'wrong';
        error = r.stderr || r.compile_output || 'Unknown error';
      }
    }

    const newSubmission = await battleSubmission.create({
      userId,
      roomId,
      problemId,
      code,
      language,
      status,
      totalTestCases:problem.hiddenTestCases.length,
      passedTestCases: passed,
      timeTaken: totalTime,
    });

        // Add after saving a new battleSubmission
    const allSubs = await battleSubmission.find({ roomId });

    const userBestMap = new Map();

    for (const sub of allSubs) {
    const key = sub.userId.toString();

    // Only keep best (max test cases passed, min time taken)
    if (!userBestMap.has(key)) {
        userBestMap.set(key, sub);
    } else {
        const prev = userBestMap.get(key);
        if (
        sub.passedTestCases > prev.passedTestCases ||
        (sub.passedTestCases === prev.passedTestCases && sub.timeTaken < prev.timeTaken)
        ) {
        userBestMap.set(key, sub);
        }
    }
    }

    const battle = await battleRoom.findOne({ roomId });
    const leaderboard = battle.players.map((p) => {
    const sub = userBestMap.get(p.userId.toString());
    return {
        userId: p.userId,
        name: p.userName,
        score: sub?.passedTestCases || 0,
        time: sub?.timeTaken || null,
        status: sub ? (sub.passedTestCases === totalTestCases ? 'finished' : 'coding') : 'coding'
    };
    });

    // Emit the updated leaderboard
    req.io.to(roomId).emit("leaderboard-update", leaderboard);
   
    

    return res.status(201).json(newSubmission);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "err.message" });
  }
};

const getLeaderBoard=async(req,res)=>{
    try {
        const { roomId } = req.params;
    
        const battle = await battleRoom.findOne({ roomId }).populate("problemId");
        if (!battle) {
          return res.status(404).json({ error: "Battle room not found" });
        }
    
        const allSubs = await battleSubmission.find({ roomId });
    
        // Map userId -> best submission
        const userBestMap = new Map();
    
        for (const sub of allSubs) {
          const key = sub.userId.toString();
    
          if (!userBestMap.has(key)) {
            userBestMap.set(key, sub);
          } else {
            const prev = userBestMap.get(key);
            if (
              sub.passedTestCases > prev.passedTestCases ||
              (sub.passedTestCases === prev.passedTestCases && sub.timeTaken < prev.timeTaken)
            ) {
              userBestMap.set(key, sub);
            }
          }
        }
    
        // Total test cases can be determined here (placeholder for now)
        const totalTestCases = battle.problemId.hiddenTestCases.length; // ideally fetched from problemId.testCases.length or similar
    
        const leaderboard = battle.players.map((p) => {
          const sub = userBestMap.get(p.userId.toString());
          return {
            userId: p.userId,
            name: p.userName,
            score: sub?.passedTestCases ?? 0,
            time: sub?.timeTaken ?? null,
            status: sub
              ? sub.passedTestCases === totalTestCases
                ? "finished"
                : "coding"
              : "coding",
          };
        });
    
        const isBattleOver = leaderboard.every((p) => p.status === "finished");
    
        return res.status(200).json({
          battle,
          leaderboard,
          isBattleOver,
        });
      } catch (err) {
        console.error("Error getting battle results:", err.message);
        return res.status(500).json({ error: "Internal server error" });
      }
}


module.exports={createBattleRoom,joinBattleRoom,getAllBattles,getBattle,battleSubmitCode,getLeaderBoard}