const redisClient = require('../config/redis')
const User=require('../models/userSchema')
const validate=require('../utils/validator')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const Submission=require('../models/submission')
const {oauth2Client}=require('../utils/googleConfig')
const axios =require('axios')
const nodemailer=require('nodemailer')
const crypto=require('crypto')
const userStreak = require("../models/userStreakSchema");
require('dotenv').config();




const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.MY_EMAIL,
      pass: process.env.GOOGLE_APP_PASSWORD,
    },
    // The critical fix
    tls: {
      ciphers:'SSLv3'
    }
  });






  const checkAndResetStreak = async (userId) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    let streak = await userStreak.findOne({ userId });
  
    if (!streak) {
      // Optional: initialize streak for new users
      streak = await userStreak.create({
        userId,
        currentStreak: 0,
        maxStreak: 0,
        lastSolvedDate: null,
        solvedDates: []
      });
      return;
    }
  
    const lastDate = new Date(streak.lastSolvedDate || 0);
    lastDate.setHours(0, 0, 0, 0);
  
    // If it's a new day and they didn't solve today
    const isNewDay = today.getTime() !== lastDate.getTime();
    const missedToday = !streak.solvedDates.some(
      (d) => new Date(d).getTime() === today.getTime()
    );
  
    if (isNewDay && missedToday) {
      // Reset streak
      streak.currentStreak = 0;
      await streak.save();
      
    }
  };



const register=async (req,res)=>{

    try{
        // validating the data
       
        validate(req.body.credentials);
      

        const {firstName,emailId,password}=req.body.credentials;
        console.log(req.body.credentials);
        
        req.body.credentials.password = await bcrypt.hash(password,10);
        req.body.credentials.role='user';
      
        
        console.log(req.body.credentials);
        const user = await User.create(req.body.credentials);
        //If email is already present in database then User.create will throw an Error.... 
       

        
        const token = jwt.sign({_id:user._id,emailId:emailId,role:'user'},process.env.JWT_KEY,{expiresIn: 60*60})

        const reply={
            firstName:user.firstName,
            emailId:user.emailId,
            _id:user._id
        }

        res.cookie('token',token,{
            httpOnly: true,
            secure: true,          
            sameSite: 'None',
            maxAge:60*60*2000});
        res.status(200).json({
            user:reply,
            message:"Registered Successfully"
        })
        
    }
    catch(err){
       
        res.status(400).json({ message: err.message });
    }
}

const login=async (req,res)=>{
    try{
        const {emailId,password}=req.body

        if(!emailId)
            throw new Error("Invalid Credentials e");
        if(!password)
            throw new Error("Invalid Credentials f");
        
        const user = await User.findOne({emailId});
        
        
        const match= await bcrypt.compare(req.body.password,user.password);
        if(!match)
            throw new Error("Invalid Credentials g");

        const token = jwt.sign({_id:user._id,emailId:emailId,role:user.role},process.env.JWT_KEY,{expiresIn: 60*60})

        const reply={
            firstName:user.firstName,
            emailId:user.emailId,
            _id:user._id
        }
        await checkAndResetStreak(user._id);
        res.cookie('token',token,{
            httpOnly: true,
            secure: true,          
            sameSite: 'None',
            maxAge:60*60*2000});
        res.status(200).json({
            user:reply,
            message:"Logged In Successfully"
        })

    }
    catch(err){
        res.status(401).send(err.message);
    }
}

const logout=async (req,res)=>{
    try{
    //validate token. this part is middleware so not done in this function. it is already checked


    //add token to redis database for blacklist
        const {token}=req.cookies;
        const payload=jwt.decode(token);

        await redisClient.set(`token:${token}`,"BLOCKED");
        await redisClient.expireAt(`token:${token}`,payload.exp)

        res.cookie("token",null,{expires:new Date(Date.now())})
        res.send("logged out successfully");

    }
    catch(err){
        res.status(503).send(err.message)
    }
}

const adminRegister=async (req,res)=>{
    try{
        // validating the data
        validate(req.body);

        const {firstName,emailId,password}=req.body;

        req.body.password = await bcrypt.hash(password,10);
        req.body.role='admin';
        

        const user = await User.create(req.body);
        //If email is already present in database then User.create will throw an Error.... 

        const token = jwt.sign({_id:user._id,emailId:emailId,role:'user'},process.env.JWT_KEY,{expiresIn: 60*60})
        res.cookie('token',token,{maxAge:60*60*1000});
        res.status(201).send("Registered successfully")
        
    }
    catch(err){
        res.status(400).send(err.message)
    }
}

const deleteProfile=async (req,res)=>{
    try{

        const userId=req.result._id;

        await User.findByIdAndDelete(userId)

        //await Submission.deleteMany({userId});

        res.status(200).send("deleted successfully")
    }
    catch(err){
        res.send(err.message);
    }
}

const getProfile=async(req,res)=>{
    try{
        const userId=req.result._id;

        if(!userId)
            throw new Error("user not exist");
       
        const userProfile=await User.findById(userId)
       
    
        res.json(userProfile)
    }
    catch(err){
        res.send("Profile is not present")
    }
}



const googleLogin=async(req,res)=>{
    const code = req.query.code;
    try {
        
        const googleRes = await oauth2Client.getToken(code);
        
        oauth2Client.setCredentials(googleRes.tokens);
        

        const userRes = await axios.get(
            `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
        );
        
        const { email, name, picture } = userRes.data;
       
        let user = await User.findOne({ emailId:email });
       
        if (!user) {
            throw new Error("user not registered")
            
        }
       
        
        const token = jwt.sign({_id:user._id,emailId:email,role:user.role},process.env.JWT_KEY,{expiresIn: 60*60})
       

        const reply={
            firstName:user.firstName,
            emailId:user.emailId,
            _id:user._id
        }

        res.cookie('token',token,{
            httpOnly: true,
            secure: true,          
            sameSite: 'None',
            maxAge:60*60*1000});
        res.status(200).json({
            message: 'success',
            user:reply,
        });
    } catch (err) {
        res.status(500).json({
            message: "Internal Server Error"
        })
    }

}

const resetPassword=async(req,res)=>{
    try{
        const {emailId}=req.body;
       
        const user = await User.findOne({emailId:emailId})

        const token = jwt.sign({_id:user._id},process.env.JWT_KEY,{expiresIn: "3600s"})
        

        const result=await redisClient.setEx(`reset:${emailId}`, 3600, token);
       
        if(result){
            const mailOptions={
                from:"heetbhuva1405@gmail.com",
                to:emailId,
                subject:"Sending an email",
                text:`This link will expires in 2 MINUTES https://algo-byte-eight.vercel.app//forgotpassword/${user._id}/${token}`
            }

            transporter.sendMail(mailOptions,(error,info)=>{
                if(error){
                  
                    res.status(401).json({status:401,message:"email not send"})
                }else{
                   
                    res.status(201).json({status:201,message:"Email sent Succsfully"})
                }
            })
        }
    }
    catch(err){
        
         res.status(401).json({status:401,message:"Not regestered user"})
    }
}

const forgotPassword=async(req,res)=>{
    
    const {id,token}=req.params;

    try{
        const decoded = jwt.verify(token, process.env.JWT_KEY);

        if (decoded._id !== id) {
            return res.status(401).json({ message: "Invalid user." });
        }

        const user=await User.findById(id);

        if(!user)
            throw new Error("user not exist");

        const emailId=user.emailId;

        const storedToken = await redisClient.get(`reset:${emailId}`);
        if (!storedToken || storedToken !== token) {
            
            return res.status(401).json({ message: "Invalid or expired token" });
        }

        res.status(201).json({status:201,user})
    }
    catch(err){
        res.status(401).json({status:401,err})
    }
}

const updatePassword=async(req,res)=>{
    try {
        const { password, id, token } = req.body;
      
        if (!password || !id || !token) {
          return res.status(400).json({ message: "Missing required fields" });
        }
        
        // Verify JWT token
        let decoded;
        try {
          decoded = jwt.verify(token, process.env.JWT_KEY);
         
        } catch (err) {
          return res.status(401).json({ message: "Token expired or invalid" });
        }
       
    
        const user1 = await User.findById(id);
        if (!user1) {
        return res.status(404).json({ message: "User not found" });
        }
        const emailId = user1.emailId;
    
        const redisToken = await redisClient.get(`reset:${emailId}`);

        if(!redisToken)
           

        if (!redisToken || redisToken !== token) {
          return res.status(401).json({ message: "Reset token is invalid or expired" });
        }
    
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.findOneAndUpdate(
          { emailId },
          { password: hashedPassword }
        );
    
       
        await redisClient.del(`reset:${emailId}`);
    
        return res.status(200).json({ message: "Password updated successfully" });

      } catch (error) {

        console.error("updatePassword error:", error.message);
        return res.status(500).json({ message: "Server error" });
      }
}

const updateProfile=async(req,res)=>{
    try{
        const {lastName,age,level}=req.body;

        const userId=req.result._id;

        const user=await User.findById(userId);

        if(!user){
            throw new Error("user does not exist")
        }

        user.lastName=lastName;
        user.age=age;
        user.levelOfUser=level;

        await user.save();
        res.send("successfully updated")
        
    }
    catch(err){
        res.send(err.message);
    }
}
module.exports={login,register,logout,adminRegister,deleteProfile,getProfile,googleLogin,resetPassword,forgotPassword,updatePassword,updateProfile}