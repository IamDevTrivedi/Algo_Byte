const express=require('express');
const userMiddleware=require('../middleware/userMiddle')
const battleRoomRouter=express.Router();
const {createBattleRoom, joinBattleRoom, getAllBattles, getBattle, battleSubmitCode, getLeaderBoard}=require('../controllers/battleRoomControl');


battleRoomRouter.post("/createBattleRoom",userMiddleware,createBattleRoom)
battleRoomRouter.post("/joinBattleRoom",userMiddleware,joinBattleRoom)
battleRoomRouter.get("/getAllBattles",userMiddleware,getAllBattles)
battleRoomRouter.get("/:roomId",userMiddleware,getBattle)
battleRoomRouter.post("/submit",userMiddleware,battleSubmitCode)
battleRoomRouter.get("/leaderBoard/:roomId",userMiddleware,getLeaderBoard)



module.exports=battleRoomRouter