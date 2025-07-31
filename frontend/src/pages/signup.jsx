"use client"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import logo from "../Images/logo.png"
import { User, Mail, Lock, Eye, EyeOff, CheckCircle, ArrowRight, Code } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
// Removed registerVerifiedUser as it's not used here
import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom" // Changed to react-router-dom for standard practice
import axiosClient from "../utils/axiosClient"
import { registerVerifiedUser } from "../authSlice"

const signupSchema = z.object({
  firstName: z.string().min(3, "Name should contain at least 3 characters"),
  emailId: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password should contain at least 8 characters"),
})

function SignUp() {
  const [showPassword, setShowPassword] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  // --- NEW: State for success message from API ---
  const [successMessage, setSuccessMessage] = useState(null)
  // --- NEW: Local loading state for the form submission ---
  const [isSubmitting, setIsSubmitting] = useState(false)

  const dispatch = useDispatch()
  const { isAuthenticated, error } = useSelector((state) => state.auth)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(signupSchema),
  })

  const watchedFields = watch()

  useEffect(() => {
    if (isAuthenticated) navigate("/")
  }, [isAuthenticated])

  const onSubmit = async (data) => {
    if (!agreedToTerms) {
      return
    }
    setIsSubmitting(true)
    setSuccessMessage(null) 
    try {
      dispatch(registerVerifiedUser({...data}))
    } catch (err) {
       console.error("Registration failed:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: "", color: "" }

    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++

    const labels = ["Very Weak", "Weak", "Fair", "Good", "Strong"]
    const colors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-blue-500", "bg-green-500"]

    return {
      strength: Math.min(strength, 5),
      label: labels[Math.min(strength - 1, 4)] || "",
      color: colors[Math.min(strength - 1, 4)] || "bg-gray-300",
    }
  }

  const passwordStrength = getPasswordStrength(watchedFields.password)

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
          <h1 className="text-3xl md:text-4xl font-black text-black dark:text-white mb-3">Join Our Community</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
            Start your coding journey with thousands of developers worldwide
          </p>
        </div>

        {/* Signup Card */}
        <div className="squiggly-border-container">
          <div className="squiggly-border"></div>
          <div className="relative z-10 bg-white dark:bg-black rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
           
            {successMessage && (
              <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                <p className="text-green-700 dark:text-green-400 text-sm font-medium">{successMessage}</p>
              </div>
            )}

            {/* Error Display */}
            {error && error !== "Request failed with status code 401" && !successMessage && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                <p className="text-red-700 dark:text-red-400 text-sm font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              {/* ... Name Field ... */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                    <User
                      size={18}
                      className="text-gray-500 dark:text-gray-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors duration-200"
                    />
                  </div>
                  <input
                    {...register("firstName")}
                    type="text"
                    placeholder="Enter your full name"
                    className={`w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-900 border rounded-xl text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 focus:border-black dark:focus:border-white font-medium ${
                      errors.firstName
                        ? "border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/10"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                  />
                </div>
                {errors.firstName && (
                  <p className="text-red-600 dark:text-red-400 text-sm font-medium flex items-center gap-2">
                    <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              {/* ... Email Field ... */}
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
              {/* ... Password Field ... */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Password
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
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
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
                {watchedFields.password && (
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Password Strength</span>
                      <span
                        className={`text-xs font-bold ${
                          passwordStrength.strength >= 4
                            ? "text-green-600 dark:text-green-400"
                            : passwordStrength.strength >= 3
                              ? "text-blue-600 dark:text-blue-400"
                              : passwordStrength.strength >= 2
                                ? "text-yellow-600 dark:text-yellow-400"
                                : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                            i < passwordStrength.strength ? passwordStrength.color : "bg-gray-200 dark:bg-gray-700"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
                {errors.password && (
                  <p className="text-red-600 dark:text-red-400 text-sm font-medium flex items-center gap-2">
                    <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                    {errors.password.message}
                  </p>
                )}
              </div>
              {/* ... Terms and Conditions ... */}
              <div className="space-y-4">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex-shrink-0 mt-0.5">
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="sr-only"
                    />
                    <div
                      className={`w-5 h-5 rounded border-2 transition-all duration-200 flex items-center justify-center ${
                        agreedToTerms
                          ? "bg-black dark:bg-white border-black dark:border-white"
                          : "border-gray-300 dark:border-gray-600 group-hover:border-gray-400 dark:group-hover:border-gray-500"
                      }`}
                    >
                      {agreedToTerms && <CheckCircle size={12} className="text-white dark:text-black" />}
                    </div>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    I agree to the{" "}
                    <button
                      type="button"
                      className="text-black dark:text-white font-semibold hover:underline transition-all duration-200"
                    >
                      Terms & Conditions
                    </button>{" "}
                    and{" "}
                    <button
                      type="button"
                      className="text-black dark:text-white font-semibold hover:underline transition-all duration-200"
                    >
                      Privacy Policy
                    </button>
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !agreedToTerms || successMessage}
                className="w-full py-4 bg-black dark:bg-white text-white dark:text-black rounded-xl font-bold text-lg hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-lg flex items-center justify-center gap-2 group"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 dark:border-black/30 border-t-white dark:border-t-black rounded-full animate-spin"></div>
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-200" />
                  </>
                )}
              </button>
            </form>

            {/* Sign In Link */}
            <div className="mt-8 text-center">
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-black dark:text-white font-bold hover:underline transition-all duration-200 hover:scale-105 inline-block"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* ... Features Preview  ... */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-white/50 dark:bg-black/50 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 hover:scale-105 transition-all duration-300">
            <div className="w-8 h-8 bg-black dark:bg-white rounded-lg mx-auto mb-2 flex items-center justify-center">
              <Code size={16} className="text-white dark:text-black" />
            </div>
            <p className="text-xs font-bold text-gray-700 dark:text-gray-300">1000+ Problems</p>
          </div>
          <div className="p-4 bg-white/50 dark:bg-black/50 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 hover:scale-105 transition-all duration-300">
            <div className="w-8 h-8 bg-black dark:bg-white rounded-lg mx-auto mb-2 flex items-center justify-center">
              <User size={16} className="text-white dark:text-black" />
            </div>
            <p className="text-xs font-bold text-gray-700 dark:text-gray-300">50K+ Users</p>
          </div>
          <div className="p-4 bg-white/50 dark:bg-black/50 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 hover:scale-105 transition-all duration-300">
            <div className="w-8 h-8 bg-black dark:bg-white rounded-lg mx-auto mb-2 flex items-center justify-center">
              <CheckCircle size={16} className="text-white dark:text-black" />
            </div>
            <p className="text-xs font-bold text-gray-700 dark:text-gray-300">AI Powered</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUp
