import { Mail, Lock, Eye, EyeOff, ArrowRight, Code, Github, Chrome } from "lucide-react"
import { useGoogleLogin } from "@react-oauth/google"
import axiosClient from "../utils/axiosClient"
import { useNavigate } from "react-router"
import { useDispatch, useSelector } from "react-redux"
import { setUser,setAuthenticated } from "../authSlice"
import { useState } from "react"

function ErrorPopup({ message, onClose }) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-6 max-w-sm w-full text-center">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">Login Failed</h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm">{message}</p>
          <button
            onClick={onClose}
            className="mt-6 px-5 py-2 bg-black text-white dark:bg-white dark:text-black rounded-lg hover:scale-105 transition-all font-medium"
          >
            Close
          </button>
        </div>
      </div>
    )
  }
  

export function GoogleAuth(){
    const {isAuthenticated}=useSelector((state)=>state.auth)
    const navigate=useNavigate();
    const [errorPopup, setErrorPopup] = useState(false);

    const dispatch=useDispatch();

    const responseGoogleLogin=async (authRes)=>{
        
        try{
            if(authRes['code']){
                const code=authRes['code'];
                const result=await axiosClient.get(`/user/googleLogin?code=${code}`);
                
                const {emailId,firstName,_id}=result.data.user;
                dispatch(setUser({ emailId, firstName, _id }));
                dispatch(setAuthenticated(true));
                
                // navigate('/homepage')

            }
            
        }
        catch(err){
            
                console.error("Google Login Error:", err.message);
                setErrorPopup(true)
              
        }
    }
    const googleLogin=useGoogleLogin({
        onSuccess:responseGoogleLogin,
        onError:responseGoogleLogin,
        flow:'auth-code'
        
    })

    return(
        <div className="flex justify-center ">
                
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 py-3 px-4 border border-black dark:border-white rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-all duration-300 hover:scale-105 group"
                  onClick={()=>googleLogin()}
                >
                  <Chrome size={18} className="text-gray-700 dark:text-gray-300" />
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Google</span>
                </button>
                {errorPopup && (
                <ErrorPopup
                    message="This Google account is not registered with YourCode."
                    onClose={() => setErrorPopup(false)}
                />
                )}
        </div>
    )
}