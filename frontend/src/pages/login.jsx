



"use client"

import { useForm } from "react-hook-form"
import { z } from "zod"
import logo from "../Images/logo.png"
import { zodResolver } from "@hookform/resolvers/zod"
import { Mail, Lock, Eye, EyeOff, ArrowRight, Code, Github, Chrome } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { loginUser } from "../authSlice"
import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router"
import { GoogleAuth } from "../customCompo/GoogleAuth"
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google"

const loginSchema = z.object({
  emailId: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
})

function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const dispatch = useDispatch()
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth)
  const navigate = useNavigate()


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  })

  useEffect(() => {
    if (isAuthenticated) navigate("/")
  }, [isAuthenticated])

  const onSubmit = (data) => {
    dispatch(loginUser({ ...data, rememberMe }))
  }

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-black dark:via-gray-900 dark:to-black flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-black/5 dark:bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-gray-300/10 dark:bg-gray-300/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-black/3 dark:bg-white/3 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
        <Link to="/"><div className="relative top-1 left-35">
          <img
            src={logo}
            alt="Logo"
            className="h-12 w-auto max-w-[150px] object-contain"
          />
        </div>
        </Link>
          <h1 className="text-3xl md:text-4xl font-black text-black dark:text-white mb-3">Welcome Back</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
            Continue your coding journey where you left off
          </p>
        </div>

    
        <div className="squiggly-border-container">
          <div className="squiggly-border"></div>

          <div className="relative z-10 bg-white dark:bg-black rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
            {/* Error Display */}
            {error&&error!='Request failed with status code 401' && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                <p className="text-red-700 dark:text-red-400 text-sm font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                    <Mail
                      size={18}
                      className="text-gray-500 dark:text-gray-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors duration-200"
                    />
                  </div>
                  <input
                    {...register("emailId")}
                    type="email"
                    placeholder="Enter your email address"
                    className={`w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-900 border rounded-xl text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 focus:border-black dark:focus:border-white font-medium ${
                      errors.emailId
                        ? "border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/10"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                  />
                </div>
                {errors.emailId && (
                  <p className="text-red-600 dark:text-red-400 text-sm font-medium flex items-center gap-2">
                    <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                    {errors.emailId.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Password
                  </label>
                  
                </div>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                    <Lock
                      size={18}
                      className="text-gray-500 dark:text-gray-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors duration-200"
                    />
                  </div>
                  <input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className={`w-full pl-12 pr-12 py-4 bg-white dark:bg-gray-900 border rounded-xl text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 focus:border-black dark:focus:border-white font-medium ${
                      errors.password
                        ? "border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/10"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-all duration-200 hover:scale-110"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-600 dark:text-red-400 text-sm font-medium flex items-center gap-2">
                    <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between">
              <a> 
                <Link
                  to="/resetPassword"
                  className="text-black dark:text-white font-bold hover:underline transition-all duration-200 hover:scale-105 inline-block"
                >
                  <p className=" cursor-pointer hover:underline text-gray-600 dark:text-gray-400 text-sm">
                  Forgot password ?{" "}
                  </p>
                </Link>
               
              
              </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-black dark:bg-white text-white dark:text-black rounded-xl font-bold text-lg hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-lg flex items-center justify-center gap-2 group"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 dark:border-black/30 border-t-white dark:border-t-black rounded-full animate-spin"></div>
                    Signing In...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-200" />
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white dark:bg-black text-gray-500 dark:text-gray-400 font-medium">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Social Login */}
              <GoogleAuth></GoogleAuth>
              
            </form>

            {/* Sign Up Link */}
            <div className="mt-8 text-center">
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-black dark:text-white font-bold hover:underline transition-all duration-200 hover:scale-105 inline-block"
                >
                  Sign Up
                </Link>
              </p>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
