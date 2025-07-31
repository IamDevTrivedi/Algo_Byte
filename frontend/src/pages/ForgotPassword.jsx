
"use client"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Lock, ArrowRight, Code, CheckCircle } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"

import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router"

import axiosClient from "../utils/axiosClient"
import { useParams } from "react-router"

const loginSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),

  confirmPassword: z.string(),
})
.refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"], 
})

export function ForgotPassword() {
  const [rememberMe, setRememberMe] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)
  const dispatch = useDispatch()
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth)
  const navigate = useNavigate()

  const { id, token } = useParams()

  const userValid = async () => {
    
    try {
      const res = await axiosClient.get(`/user/forgotpassword/${id}/${token}`)
     
      const data = res.data

      if (data.status == 201) {
       
      } else {
        navigate("*")
      }
    } catch (err) {
      navigate("*")
    }
  }

  useEffect(() => {
    userValid()
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data) => {
    
    setIsUpdating(true)
    try {
     
      const password=data.password
      const response = await axiosClient.post("/user/updatepassword", {
        password,
        id,
        token,
      })

   
      setSuccessMessage("Password updated successfully! Redirecting to login...")

   
      setTimeout(() => {
        navigate("/login")
      }, 2000)
    } catch (err) {
      
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-black dark:via-gray-900 dark:to-black flex items-center justify-center px-4 py-8 relative overflow-hidden">
      
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-black/5 dark:bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-gray-300/10 dark:bg-gray-300/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-black/3 dark:bg-white/3 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-2xl font-bold text-black dark:text-white hover:scale-105 transition-all duration-300 mb-6"
          >
            <div className="p-2 rounded-xl bg-gray-100 dark:bg-white shadow-lg">
              <Code className="w-6 h-6 text-black dark:text-black" />
            </div>
            YourCode
          </Link>
          <h1 className="text-3xl md:text-4xl font-black text-black dark:text-white mb-3">Enter New Password</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">Enter your new password</p>
        </div>

       
        <div className="squiggly-border-container">
          <div className="squiggly-border"></div>

          <div className="relative z-10 bg-white dark:bg-black rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
            {/* Success Message */}
            {successMessage && (
              <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <p className="text-green-700 dark:text-green-400 text-sm font-medium">{successMessage}</p>
                </div>
              </div>
            )}

            {/* Error Display */}
            {error && error != "Request failed with status code 401" && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                <p className="text-red-700 dark:text-red-400 text-sm font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  New Password
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                    <Lock
                      size={18}
                      className="text-gray-500 dark:text-gray-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors duration-200"
                    />
                  </div>
                  <input
                    {...register("password")}
                    type="password"
                    placeholder="Enter your new password"
                    disabled={successMessage}
                    className={`w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-900 border rounded-xl text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 focus:border-black dark:focus:border-white font-medium disabled:opacity-50 disabled:cursor-not-allowed ${
                      errors.password
                        ? "border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/10"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                  />
                </div>
                {errors.password && (
                  <div className="space-y-1">
                    <p className="text-red-600 dark:text-red-400 text-sm font-medium flex items-center gap-2">
                      <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                      Password requirements:
                    </p>
                    <ul className="text-red-600 dark:text-red-400 text-xs space-y-1 ml-4">
                      <li>• At least 8 characters long</li>
                      <li>• At least one uppercase letter (A-Z)</li>
                      <li>• At least one lowercase letter (a-z)</li>
                      <li>• At least one number (0-9)</li>
                      <li>• At least one special character (!@#$%^&*)</li>
                    </ul>
                  </div>
                )}
              </div>
              {/* Confirm Password Field */}
<div className="space-y-2">
  <label className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
    Confirm Password
  </label>
  <div className="relative group">
    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
      <Lock
        size={18}
        className="text-gray-500 dark:text-gray-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors duration-200"
      />
    </div>
    <input
      {...register("confirmPassword")}
      type="password"
      placeholder="Confirm your new password"
      disabled={successMessage}
      className={`w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-900 border rounded-xl text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 focus:border-black dark:focus:border-white font-medium disabled:opacity-50 disabled:cursor-not-allowed ${
        errors.confirmPassword
          ? "border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/10"
          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
      }`}
    />
  </div>
  {errors.confirmPassword && (
    <p className="text-red-600 dark:text-red-400 text-sm font-medium flex items-center gap-2">
      <div className="w-1 h-1 bg-red-500 rounded-full"></div>
      {errors.confirmPassword.message}
    </p>
  )}
</div>


              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || isUpdating || successMessage}
                className="w-full py-4 bg-black dark:bg-white text-white dark:text-black rounded-xl font-bold text-lg hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-lg flex items-center justify-center gap-2 group"
              >
                {loading || isUpdating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 dark:border-black/30 border-t-white dark:border-t-black rounded-full animate-spin"></div>
                    Updating Password...
                  </>
                ) : successMessage ? (
                  <>
                    <CheckCircle size={18} />
                    Password Updated
                  </>
                ) : (
                  <>
                    RESET PASSWORD
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-200" />
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

