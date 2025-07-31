const express=require('express');
const POTDrouter=express.Router();
const adminMiddleware=require('../middleware/adminMiddle')
const {createPOTD}=require('../controllers/POTDControl')

POTDrouter.post("/create",adminMiddleware,createPOTD)

module.exports=POTDrouter