const express=require('express');
const authRouter=express.Router();
const {login,register,logout,adminRegister,updateProfile,deleteProfile,getProfile,googleLogin,resetPassword,forgotPassword,updatePassword}=require('../controllers/userAuthenticate')
const userMiddleware=require('../middleware/userMiddle')
const adminMiddleware=require('../middleware/adminMiddle')

//Register
authRouter.post('/register',register)


//Login
authRouter.post('/login',login)

authRouter.get('/googleLogin',googleLogin)

//Logout
authRouter.post('/logout',userMiddleware,logout)

//Register for admin
authRouter.post('/admin/register',adminMiddleware,adminRegister)

//delete a profile
authRouter.post('/deleteProfile',userMiddleware,deleteProfile)

//GetProfile
authRouter.get('/getProfile',userMiddleware,getProfile)

//update profile
authRouter.post('/updateProfile',userMiddleware,updateProfile)

authRouter.get('/check-auth',userMiddleware,(req,res)=>{
    const reply={
        firstName:req.result.firstName,
        emailId:req.result.emailId,
        _id:req.result._id,
        role:req.result.role
    }

    res.status(200).json({
        user:reply,
        message:"Valid user"
    })
})

authRouter.get('/forgotpassword/:id/:token',forgotPassword)

//reset password
authRouter.post("/resetpassword",resetPassword);

authRouter.post("/updatepassword",updatePassword);


module.exports=authRouter