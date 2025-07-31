
"use client"

import { useState, useEffect, memo, useRef, useMemo } from "react"
import { useSelector, useDispatch } from "react-redux"
import axiosClient from "../utils/axiosClient"
import { allProblemsFetch, getUserImage } from "../authSlice"
import logo from "../Images/logo.png"
import { Link } from "react-router-dom" // Corrected import
import axios from "axios"
import {
  LayoutDashboard,
  Code,
  Trophy,
  FileText,
  Settings,
  Search,
  Bell,
  ChevronDown,
  CheckCircle,
  Target,
  MoreHorizontal,
  Plus,
  Sun,
  Moon,
  Monitor,
  X,
  Brain,
  Flame,
  ArrowUp,
  ArrowDown,
  Minus,
  User,
  Trash,
  Camera,
  Mail,
  Lock,
  Save,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Trash2,
  Clock,
  Filter,
} from "lucide-react"

// Professional Toast Notification System
const Toast = memo(({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000)
    return () => clearTimeout(timer)
  }, [onClose])

  const icons = {
    success: CheckCircle,
    error: X,
    warning: Target,
    info: Brain,
  }

  const Icon = icons[type]

  return (
    <div
      className={`fixed top-4 right-4 z-50 flex items-center gap-2 p-3 rounded-lg shadow-xl border backdrop-blur-sm animate-slide-in-right text-sm ${
        type === "success"
          ? "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400"
          : type === "error"
            ? "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400"
            : type === "warning"
              ? "bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-400"
              : "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400"
      }`}
    >
      <Icon size={16} />
      <span className="font-medium">{message}</span>
      <button onClick={onClose} className="ml-1 hover:opacity-70 transition-opacity">
        <X size={14} />
      </button>
    </div>
  )
})

// Professional Loading Spinner
const LoadingSpinner = memo(({ size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  }

  return (
    <div
      className={`animate-spin rounded-full border-2 border-gray-200 dark:border-gray-700 border-t-black dark:border-t-white shadow-lg ${sizeClasses[size]} ${className}`}
    />
  )
})

// Professional Stats Counter
const StatsCounter = memo(({ end, duration = 2000, suffix = "" }) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime = null
    const animate = (currentTime) => {
      if (startTime === null) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      setCount(Math.floor(progress * end))
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    requestAnimationFrame(animate)
  }, [end, duration])

  return (
    <span className="font-black text-2xl lg:text-3xl text-black dark:text-white">
      {count.toLocaleString()}
      {suffix}
    </span>
  )
})

// Premium Input Field Component
const PremiumInput = memo(({ label, type = "text", value, onChange, placeholder, icon: Icon, ...props }) => {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div className="relative group">
      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300 group-focus-within:text-black dark:group-focus-within:text-white">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors duration-300">
            <Icon size={18} />
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full ${Icon ? "pl-11" : "pl-4"} pr-4 py-3 rounded-xl border-2 transition-all duration-300 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 ${
            isFocused
              ? "border-black dark:border-white shadow-lg scale-[1.02] bg-gray-50 dark:bg-gray-800"
              : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
          } focus:outline-none focus:ring-0`}
          {...props}
        />
        <div
          className={`absolute inset-0 rounded-xl pointer-events-none transition-all duration-300 ${
            isFocused ? "bg-gradient-to-r from-black/5 to-transparent dark:from-white/5" : ""
          }`}
        />
      </div>
    </div>
  )
})

// Premium Stat Card with Hover Animation
const StatCard = memo(({ title, value, subtitle, icon: Icon, color = "gray", progress, trend, loading = false }) => {
  if (loading) {
    return (
      <div className="group relative transition-all duration-500 hover:scale-105 hover:-translate-y-2">
        <div className="p-6 bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg h-full">
          <div className="animate-pulse">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
            </div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-2"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-4"></div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  const colorClasses = {
    gray: "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400",
    green: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
    red: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
    yellow: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400",
    blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
  }

  const progressColors = {
    gray: "bg-gray-500",
    green: "bg-green-500",
    red: "bg-red-500",
    yellow: "bg-yellow-500",
    blue: "bg-blue-500",
  }

  return (
    <div className="group relative transition-all duration-500 hover:scale-105 hover:-translate-y-2">
      <div className="p-6 bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-white shadow-lg hover:shadow-2xl transition-all duration-500 hover:border-gray-300 dark:hover:border-gray-600 h-full group-hover:bg-gray-50 dark:group-hover:bg-gray-900">
        <div className="flex items-center gap-3 mb-4">
          <div
            className={`p-2.5 rounded-lg ${colorClasses[color]} group-hover:scale-110 transition-all duration-300 shadow-lg`}
          >
            <Icon className="h-5 w-5 transition-colors duration-300" />
          </div>
          <span className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide">{title}</span>
        </div>
        <div className="mb-2">
          <div className="text-3xl font-black text-black dark:text-white mb-1">{value}</div>
          {subtitle && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</span>
              {trend !== undefined && (
                <div
                  className={`flex items-center gap-1 text-xs font-bold transition-all duration-300 ${
                    trend > 0 ? "text-green-600" : trend < 0 ? "text-red-600" : "text-gray-500"
                  }`}
                >
                  {trend > 0 ? <ArrowUp size={12} /> : trend < 0 ? <ArrowDown size={12} /> : <Minus size={12} />}
                  {Math.abs(trend)}%
                </div>
              )}
            </div>
          )}
        </div>
        {progress !== undefined && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${progressColors[color]} transition-all duration-1000 ease-out shadow-lg`}
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
})

// Enhanced User Profile Card with Black & White Matte Finish


// === MODIFICATION START: Replaced Circle Chart with Linear Progress Bars ===
const PerformanceChart = memo(({ data, finalTotalProblems, loading = false }) => {
  if (loading) {
    return (
      <div className="group relative transition-all duration-500 hover:scale-105 hover:-translate-y-2">
        <div className="p-6 bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg h-full">
          <div className="animate-pulse">
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-6"></div>
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i}>
                  <div className="flex justify-between mb-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
                  </div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const easy = data?.easy || 0
  const medium = data?.medium || 0
  const hard = data?.hard || 0
  const totalSolved = easy + medium + hard

  const totalEasy = finalTotalProblems?.difficulty?.easy || 0
  const totalMedium = finalTotalProblems?.difficulty?.medium || 0
  const totalHard = finalTotalProblems?.difficulty?.hard || 0
  const totalProblems = totalEasy + totalMedium + totalHard

  const ProgressLine = ({ difficulty, solved, total, color }) => {
    const percentage = total > 0 ? (solved / total) * 100 : 0
    return (
      <div className="w-full">
        <div className="flex justify-between items-center mb-1.5">
          <span className={`text-sm font-bold ${color}`}>{difficulty}</span>
          <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
            {solved} <span className="text-xs text-gray-500 dark:text-gray-400">/ {total}</span>
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700/50 rounded-full h-2.5">
          <div
            className={`h-2.5 rounded-full ${color.replace("text-", "bg-").replace("-600", "-500").replace("-400", "-500")} transition-all duration-1000 ease-out shadow-lg`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="group relative transition-all duration-500 hover:scale-105 hover:-translate-y-2">
      <div className="p-6 bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-500 hover:border-gray-300 dark:hover:border-gray-600 h-full group-hover:bg-gray-50 dark:group-hover:bg-gray-900">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-black text-black dark:text-white">Problem Performance</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              <span className="font-bold text-black dark:text-white">{totalSolved}</span> solved out of {totalProblems}
            </p>
          </div>
          <MoreHorizontal className="h-5 w-5 text-gray-400 cursor-pointer hover:text-black dark:hover:text-white transition-colors duration-200" />
        </div>
        <div className="space-y-5 mt-6">
          <ProgressLine difficulty="Easy" solved={easy} total={totalEasy} color="text-green-600 dark:text-green-400" />
          <ProgressLine difficulty="Medium" solved={medium} total={totalMedium} color="text-yellow-600 dark:text-yellow-400" />
          <ProgressLine difficulty="Hard" solved={hard} total={totalHard} color="text-red-600 dark:text-red-400" />
        </div>
      </div>
    </div>
  )
})



const ActivityHeatMap = memo(({ userStreak, loading = false }) => {
  const [scrollOffset, setScrollOffset] = useState(0)

  const toLocalDateString = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  

  const getMonthsData = () => {
    const months = []
    const today = new Date()
 
    for (let i = 0; i < 12; i++) {
      const monthDate = new Date(today.getFullYear(), today.getMonth() - i, 1)
      const monthName = monthDate.toLocaleDateString("en", { month: "short" })
      const year = monthDate.getFullYear()
     
      const days = []
      const daysInMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate()
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(monthDate.getFullYear(), monthDate.getMonth(), day)
        if (date <= today) {
          days.push(date)
        }
      }
      // Group days into weeks
      const weeks = []
      let currentWeek = []
      days.forEach((date, index) => {
        currentWeek.push(date)
        if (currentWeek.length === 7 || index === days.length - 1) {
          weeks.push([...currentWeek])
          currentWeek = []
        }
      })
      months.push({
        name: monthName,
        year: year,
        weeks: weeks,
        days: days,
      })
    }
    return months
  }

  const solvedDates = userStreak?.solvedDates || [];
  const solvedLocalDateStrings = solvedDates.map(date => toLocalDateString(date));

  const getActivityLevel = (date) => {
    const localDateString = toLocalDateString(date);
    // Count occurrences in the LOCAL date string array.
    const count = solvedLocalDateStrings.filter((d) => d === localDateString).length;
    if (count === 0) return 0;
    if (count === 1) return 1;
    if (count === 2) return 2;
    return 3;
  };

  const monthsData = getMonthsData();
  const visibleMonths = monthsData.slice(scrollOffset, scrollOffset + 6);
  const canScrollLeft = scrollOffset > 0;
  const canScrollRight = scrollOffset < monthsData.length - 6;
  

  if (loading) {
    return (
      <div className="group relative transition-all duration-500 hover:scale-105 hover:-translate-y-2">
        <div className="p-6 bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg h-full">
          <div className="animate-pulse">
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-4"></div>
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="group relative transition-all duration-500 hover:scale-105 hover:-translate-y-2">
      <div className="p-6 bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-500 hover:border-gray-300 dark:hover:border-gray-600 h-full group-hover:bg-gray-50 dark:group-hover:bg-gray-900">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-black text-black dark:text-white mb-1">Activity Heat Map</h3>
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span>Current: {userStreak?.currentStreak || 0} days</span>
              <span>Max: {userStreak?.maxStreak || 0} days</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setScrollOffset(Math.max(0, scrollOffset - 1))}
              disabled={!canScrollLeft}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4 text-gray-500 hover:text-black dark:hover:text-white" />
            </button>
            <button
              onClick={() => setScrollOffset(Math.min(monthsData.length - 6, scrollOffset + 1))}
              disabled={!canScrollRight}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4 text-gray-500 hover:text-black dark:hover:text-white" />
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <div className="flex gap-4 mb-4">
            {visibleMonths.map((month, index) => (
              <div key={`${month.name}-${month.year}`} className="min-w-[100px]">
                <div className="text-xs text-gray-500 dark:text-gray-400 text-center mb-2 font-medium">
                  {month.name} {month.year}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {/* Day headers */}
                  {["S", "M", "T", "W", "T", "F", "S"].map((day, dayIndex) => (
                    <div
                      key={dayIndex}
                      className="text-xs text-gray-400 text-center w-3 h-3 flex items-center justify-center"
                    >
                      {day}
                    </div>
                  ))}
                  {/* Fill empty cells for proper alignment */}
                  {month.days.length > 0 &&
                    Array.from({ length: month.days[0].getDay() }).map((_, emptyIndex) => (
                      <div key={`empty-${emptyIndex}`} className="w-3 h-3"></div>
                    ))}
                  {/* Actual days */}
                  {month.days.map((date, dayIndex) => {
                     const solvedLocalDateStrings = solvedDates.map(date => toLocalDateString(date));

                    const level = getActivityLevel(date); // This now works correctly
                    const isToday = toLocalDateString(date) === toLocalDateString(new Date());
                    const problemCount = solvedLocalDateStrings.filter((d) => d === toLocalDateString(date)).length; return (
                      <div
                        key={dayIndex}
                        className={`w-3 h-3 rounded-sm transition-all duration-200 hover:scale-125 cursor-pointer ${
                          isToday ? "ring-1 ring-green-200 dark:ring-white" : ""
                        } ${
                          level === 0
                            ? "bg-gray-100 dark:bg-gray-800"
                            : level === 1
                              ? "bg-green-200 dark:bg-green-200"
                              : level === 2
                                ? "bg-green-400 dark:bg-green-600"
                                : "bg-green-600 dark:bg-green-600"
                        }`}
                        title={`${date.toLocaleDateString()}: ${problemCount} problems solved`}
                      />
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <span>Less</span>
              <div className="flex gap-1">
                <div className="w-3 h-3 bg-gray-100 dark:bg-gray-800 rounded-sm"></div>
                <div className="w-3 h-3 bg-green-200 dark:bg-green-900/40 rounded-sm"></div>
                <div className="w-3 h-3 bg-green-400 dark:bg-green-700/70 rounded-sm"></div>
                <div className="w-3 h-3 bg-green-600 dark:bg-green-600 rounded-sm"></div>
              </div>
              <span>More</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

// Enhanced Photo Upload Modal with Delete Option
const PhotoUploadModal = memo(({ isOpen, onClose, onUploadSuccess, showToast, userImage }) => {
  const [selectedFile, setSelectedFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      showToast("Please select an image file", "error")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast("File size must be less than 5MB", "error")
      return
    }

    setSelectedFile(file)
    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target.result)
    reader.readAsDataURL(file)
  }

  const handleDeleteImage = async () => {
    setIsDeleting(true)
    try {
      await axiosClient.delete("/image/deleteImage")
      onUploadSuccess(null)
      showToast("Profile photo deleted successfully", "success")
      setShowDeleteConfirm(false)
      onClose()
    } catch (error) {
      console.error("Delete error:", error)
      showToast(error.response?.data?.message || "Failed to delete photo", "error")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    try {
      // Get upload signature from backend for profile images
      const signatureResponse = await axiosClient.get("/image/createImage")
      const { signature, timestamp, public_id, api_key, cloud_name, upload_url } = signatureResponse.data

      // Upload to Cloudinary
      const formData = new FormData()
      formData.append("file", selectedFile)
      formData.append("signature", signature)
      formData.append("timestamp", timestamp)
      formData.append("public_id", public_id)
      formData.append("api_key", api_key)

      const uploadResponse = await axios.post(upload_url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      const uploadResult = uploadResponse.data
      if (uploadResult.error) {
        throw new Error(uploadResult?.error?.message)
      }

      // Save metadata to backend
      await axiosClient.post("/image/saveImage", {
        cloudinaryPublicId: uploadResult.public_id,
        secureUrl: uploadResult.secure_url,
        type: "profile",
      })

      onUploadSuccess(uploadResult.secure_url)
      showToast("Profile photo updated successfully", "success")
      onClose()
    } catch (error) {
      console.error("Upload error:", error)
      showToast(error.message || "Failed to upload photo", "error")
    } finally {
      setIsUploading(false)
    }
  }

  const resetModal = () => {
    setSelectedFile(null)
    setPreview(null)
    setShowDeleteConfirm(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleClose = () => {
    resetModal()
    onClose()
  }

  if (!isOpen) return null

  // If user has an image and no file selected, show delete option first
  if (userImage?.secureUrl && !selectedFile && !showDeleteConfirm) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-black rounded-xl shadow-2xl max-w-md w-full border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-black dark:text-white">Profile Photo</h3>
              <button
                onClick={handleClose}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 hover:scale-110"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="text-center mb-6">
              <img
                src={userImage.secureUrl || "/placeholder.svg"}
                alt="Current Profile"
                className="w-32 h-32 rounded-2xl object-cover mx-auto border-4 border-gray-200 dark:border-gray-700 filter grayscale"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-300 hover:scale-105"
              >
                <Trash2 size={16} />
                Delete Photo
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-300 hover:scale-105"
              >
                <Camera size={16} />
                Change Photo
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Delete confirmation dialog
  if (showDeleteConfirm) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-black rounded-xl shadow-2xl max-w-md w-full border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-black text-black dark:text-white">Delete Profile Photo</h3>
          </div>
          <div className="p-6">
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete your profile photo? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-3 text-sm font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-105"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteImage}
                disabled={isDeleting}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-300 hover:scale-105 disabled:opacity-50"
              >
                {isDeleting ? <LoadingSpinner size="sm" /> : <Trash2 size={16} />}
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-black rounded-xl shadow-2xl max-w-md w-full border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-black dark:text-white">Upload Profile Photo</h3>
            <button
              onClick={handleClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 hover:scale-110"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="p-6">
          {!selectedFile ? (
            <div className="text-center">
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 hover:border-gray-400 dark:hover:border-gray-500 transition-colors duration-300">
                <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 mb-4">Choose a photo to upload</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-300 hover:scale-105"
                >
                  Select Photo
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Supported formats: JPG, PNG, GIF (max 5MB)
              </p>
            </div>
          ) : (
            <div className="text-center">
              <div className="mb-4">
                <img
                  src={preview || "/placeholder.svg"}
                  alt="Preview"
                  className="w-32 h-32 rounded-2xl object-cover mx-auto border-4 border-gray-200 dark:border-gray-700"
                />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">{selectedFile.name}</p>
              <div className="flex gap-3">
                <button
                  onClick={resetModal}
                  className="flex-1 px-4 py-3 text-sm font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-105"
                >
                  Choose Different
                </button>
                <button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-300 hover:scale-105 disabled:opacity-50"
                >
                  {isUploading ? <LoadingSpinner size="sm" /> : <Camera size={16} />}
                  {isUploading ? "Uploading..." : "Upload"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
})

// Personal Info Update Modal
const PersonalInfoModal = memo(({ isOpen, onClose, user, showToast }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    age: "",
    level: "Beginner",
  })
  const [isUpdating, setIsUpdating] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch user data when modal opens
  useEffect(() => {
    if (isOpen && user?._id) {
      fetchUserData()
    }
  }, [isOpen, user])

  const fetchUserData = async () => {
    setIsLoading(true)
    try {
      const response = await axiosClient.get(`/user/getProfile`)
      const userData = response.data
      setFormData({
        firstName: userData.firstName || userData.name?.split(" ")[0] || "",
        lastName: userData.lastName || userData.name?.split(" ").slice(1).join(" ") || "",
        email: userData.emailId || "",
        age: userData.age || "",
        level: userData.level || "Beginner",
      })
    } catch (error) {
      console.error("Failed to fetch user data:", error)
      // Fallback to existing user data
      setFormData({
        firstName: user.firstName || user.name?.split(" ")[0] || "",
        lastName: user.lastName || user.name?.split(" ").slice(1).join(" ") || "",
        email: user.email || "",
        age: user.age || "",
        level: user.level || "beginner",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleUpdateProfile = async () => {
    setIsUpdating(true)
    try {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        showToast("Please enter a valid email address", "error")
        return
      }

      // Validate required fields
      if (!formData.firstName || formData.firstName.length < 2) {
        showToast("First name must be at least 2 characters long", "error")
        return
      }

      // Update profile data
      await axiosClient.post(`/user/updateProfile`, {
        ...formData,
        name: `${formData.firstName} ${formData.lastName}`.trim(),
      })

      showToast("Personal information updated successfully", "success")
      onClose()
    } catch (error) {
      console.error("Profile update failed:", error)
      showToast(error.response?.data?.message || "Failed to update personal information", "error")
    } finally {
      setIsUpdating(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-black rounded-xl shadow-2xl max-w-lg w-full border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-black dark:text-white">Update Personal Information</h3>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 hover:scale-110"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="p-6 space-y-4">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2"></div>
                  <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <PremiumInput
                  label="First Name"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  placeholder="Enter your first name"
                  icon={User}
                  disabled
                />
                <PremiumInput
                  label="Last Name"
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  placeholder="Enter your last name"
                  icon={User}
                />
              </div>
              <PremiumInput
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Enter your email"
                icon={Mail}
                disabled
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <PremiumInput
                  label="Age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleInputChange("age", e.target.value)}
                  placeholder="Enter your age"
                  icon={User}
                />
                <div className="relative group">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300 group-focus-within:text-black dark:group-focus-within:text-white">
                    Coding Level
                  </label>
                  <select
                    value={formData.level}
                    onChange={(e) => handleInputChange("level", e.target.value)}
                    className="w-full h-13 pl-4 pr-4 py-3 rounded-2xl border-2 transition-all duration-300 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 focus:border-black dark:focus:border-white focus:outline-none focus:ring-0"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advance">Advanced</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={onClose}
                  className="px-6 py-3 text-sm font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-105"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateProfile}
                  disabled={isUpdating}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-300 hover:scale-105 disabled:opacity-50"
                >
                  {isUpdating ? <LoadingSpinner size="sm" /> : <Save size={16} />}
                  {isUpdating ? "Updating..." : "Update Information"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
})

// Password Change Modal
const PasswordChangeModal = memo(({ isOpen, onClose, showToast }) => {
  const [password, setPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrentPassword, setShowNewPassword] = useState(false)
  const [showNewPassword, setShowConfirmPassword] = useState(false)
  const [showConfirmPassword, setShowCurrentPassword] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleChangePassword = async () => {
    setIsUpdating(true)
    try {
      // Validate passwords
      if (!password) {
        showToast("Please enter your current password", "error")
        return
      }

      if (newPassword.length < 6) {
        showToast("New password must be at least 6 characters long", "error")
        return
      }

      if (newPassword !== confirmPassword) {
        showToast("New password and confirm password do not match", "error")
        return
      }

      // Change password
      await axiosClient.post("/user/change-password", {
        currentPassword: password,
        newPassword: newPassword,
      })

      showToast("Password changed successfully", "success")
      setPassword("")
      setNewPassword("")
      setConfirmPassword("")
      onClose()
    } catch (error) {
      console.error("Password change failed:", error)
      showToast(error.response?.data?.message || "Failed to change password", "error")
    } finally {
      setIsUpdating(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-black rounded-xl shadow-2xl max-w-lg w-full border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-black dark:text-white">Change Password</h3>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 hover:scale-110"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="relative">
            <PremiumInput
              label="Current Password"
              type={showCurrentPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter current password"
              icon={Lock}
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute top-9 right-3 text-gray-500 hover:text-black dark:hover:text-white transition-colors duration-200"
            >
              {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <div className="relative">
            <PremiumInput
              label="New Password"
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              icon={Lock}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute top-9 right-3 text-gray-500 hover:text-black dark:hover:text-white transition-colors duration-200"
            >
              {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <div className="relative">
            <PremiumInput
              label="Confirm New Password"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              icon={Lock}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute top-9 right-3 text-gray-500 hover:text-black dark:hover:text-white transition-colors duration-200"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={onClose}
              className="px-6 py-3 text-sm font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-105"
            >
              Cancel
            </button>
            <button
              onClick={handleChangePassword}
              disabled={isUpdating}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-300 hover:scale-105 disabled:opacity-50"
            >
              {isUpdating ? <LoadingSpinner size="sm" /> : <Lock size={16} />}
              {isUpdating ? "Changing..." : "Change Password"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
})

// Email Management Modal
const EmailModal = memo(({ isOpen, onClose, user, showToast }) => {
  const [emails, setEmails] = useState([])
  const [newEmail, setNewEmail] = useState("")
  const [isAdding, setIsAdding] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch user emails on modal open
  useEffect(() => {
    if (isOpen) {
      fetchUserEmails()
    }
  }, [isOpen])

  const fetchUserEmails = async () => {
    setIsLoading(true)
    try {
      const response = await axiosClient.get(`/user/emails/${user._id}`)
      setEmails(response.data.emails || [user?.email].filter(Boolean))
    } catch (error) {
      console.error("Failed to fetch emails:", error)
      setEmails([user?.email].filter(Boolean))
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddEmail = async () => {
    if (!newEmail) return

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(newEmail)) {
      showToast("Please enter a valid email address", "error")
      return
    }

    if (emails.includes(newEmail)) {
      showToast("This email is already added", "error")
      return
    }

    setIsAdding(true)
    try {
      await axiosClient.post("/user/add-email", { email: newEmail })
      setEmails((prev) => [...prev, newEmail])
      setNewEmail("")
      showToast("Email added successfully", "success")
    } catch (error) {
      console.error("Failed to add email:", error)
      showToast(error.response?.data?.message || "Failed to add email", "error")
    } finally {
      setIsAdding(false)
    }
  }

  const handleRemoveEmail = async (emailToRemove) => {
    if (emails.length === 1) {
      showToast("You must have at least one email address", "error")
      return
    }

    try {
      await axiosClient.delete("/user/remove-email", { data: { email: emailToRemove } })
      setEmails((prev) => prev.filter((email) => email !== emailToRemove))
      showToast("Email removed successfully", "success")
    } catch (error) {
      console.error("Failed to remove email:", error)
      showToast(error.response?.data?.message || "Failed to remove email", "error")
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-black rounded-xl shadow-2xl max-w-lg w-full border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-black dark:text-white">Manage Email Addresses</h3>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 hover:scale-110"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="p-6">
          {isLoading ? (
            <div className="space-y-3 mb-6">
              {[1, 2].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3 mb-6">
              {emails.map((email, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-black dark:text-white">{email}</span>
                    {index === 0 && (
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded-full">
                        Primary
                      </span>
                    )}
                  </div>
                  {emails.length > 1 && index > 0 && (
                    <button
                      onClick={() => handleRemoveEmail(email)}
                      className="p-1 text-red-500 hover:text-red-700 transition-colors duration-200"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
          <div className="space-y-4">
            <PremiumInput
              label="Add New Email"
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Enter new email address"
              icon={Mail}
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-6 py-3 text-sm font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-105"
              >
                Close
              </button>
              <button
                onClick={handleAddEmail}
                disabled={isAdding || !newEmail}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-300 hover:scale-105 disabled:opacity-50"
              >
                {isAdding ? <LoadingSpinner size="sm" /> : <Plus size={16} />}
                {isAdding ? "Adding..." : "Add Email"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

const AllSubmissions = memo(({ problems, totalPages, currentPage, setCurrentPage, SubData, submissions, loading = false, onViewCode }) => {
  const [filteredSubmissions, setFilteredSubmissions] = useState([])
  const [statusFilter, setStatusFilter] = useState("all")
  const [difficultyFilter, setDifficultyFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const enrichedSubmissions = useMemo(() => {
    if (!SubData || !problems?.problemNeeded) return []
    return SubData.map((submission) => {
      const problem = problems.problemNeeded.find((p) => p._id === submission.problemId)
      return {
        ...submission,
        problem: problem || { title: "Unknown Problem", difficulty: "unknown" },
      }
    })
  }, [SubData, problems])

  useEffect(() => {
    let filtered = [...enrichedSubmissions]

    if (statusFilter !== "all") {
      filtered = filtered.filter((submission) => submission.status === statusFilter)
    }

    if (difficultyFilter !== "all") {
      filtered = filtered.filter((submission) => submission.problem?.difficulty === difficultyFilter)
    }

    if (searchTerm) {
      filtered = filtered.filter((submission) =>
        submission.problem?.title?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    setFilteredSubmissions(filtered)
  }, [enrichedSubmissions, statusFilter, difficultyFilter, searchTerm])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
      case "wrong":
        return "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
      case "pending":
        return "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400"
      case "error":
        return "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
      default:
        return "bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400"
    }
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
      case "medium":
        return "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400"
      case "hard":
        return "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400"
    }
  }

  const getPaginationItems = () => {
    const pageCount = 7 // Total number of items to show in pagination
    if (totalPages <= pageCount) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const firstPage = 1
    const lastPage = totalPages
    const leftSiblingIndex = Math.max(currentPage - 1, firstPage)
    const rightSiblingIndex = Math.min(currentPage + 1, lastPage)

    const shouldShowLeftDots = leftSiblingIndex > firstPage + 2
    const shouldShowRightDots = rightSiblingIndex < lastPage - 2

    if (!shouldShowLeftDots && shouldShowRightDots) {
      let leftItemCount = 5
      let leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1)
      return [...leftRange, "...", totalPages]
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      let rightItemCount = 5
      let rightRange = Array.from({ length: rightItemCount }, (_, i) => totalPages - rightItemCount + i + 1)
      return [firstPage, "...", ...rightRange]
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      let middleRange = [currentPage - 1, currentPage, currentPage + 1]
      return [firstPage, "...", ...middleRange, "...", lastPage]
    }
    
    return [] 
  }

  const paginationItems = getPaginationItems()
  
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-4"></div>
          <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-black text-black dark:text-white">All Submissions</h3>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <FileText className="h-4 w-4" />
            <span>{filteredSubmissions.length} submissions</span>
          </div>
        </div>

        {/* Improved Filters */}
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all appearance-none"
              >
                <option value="all">All Status</option>
                <option value="accepted">Accepted</option>
                <option value="wrong">Wrong Answer</option>
                <option value="pending">Pending</option>
                <option value="error">Runtime Error</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Difficulty Filter */}
            <div className="relative">
              <Trophy className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all appearance-none"
              >
                <option value="all">All Difficulty</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Search Filter */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search problems..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
              />
            </div>
          </div>
        </div>

        {/* Submissions List */}
        <div className="space-y-3 min-h-[200px]">
          {filteredSubmissions.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-bold text-gray-600 dark:text-gray-400 mb-2">No submissions found</h4>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                {submissions?.length === 0 ? "You haven't made any submissions yet." : "Try adjusting your filters or changing the page."}
              </p>
            </div>
          ) : (
            filteredSubmissions.map((submission) => (
              <div
                key={submission._id}
                className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center text-black dark:text-white text-lg font-black shadow-lg group-hover:scale-110 transition-all duration-300">
                  {submission.problem?.title?.charAt(0)?.toUpperCase() || "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="font-bold text-black dark:text-white truncate">
                      {submission.problem?.title || "Unknown Problem"}
                    </h4>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-bold ${getDifficultyColor(
                        submission.problem?.difficulty,
                      )}`}
                    >
                      {submission.problem?.difficulty || "unknown"}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{formatDate(submission.createdAt)}</span>
                    </div>
                    <span>Language: {submission.language || "N/A"}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 ml-auto">
                  <span className={`px-3 py-1.5 rounded-xl text-xs font-bold ${getStatusColor(submission.status)}`}>
                    {submission.status}
                  </span>
                  <button
                    onClick={() => onViewCode(submission)}
                    className="p-2 rounded-lg text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-black dark:hover:text-white transition-all duration-300"
                    title="View Code"
                  >
                    <Code size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* --- STYLISH PAGINATION --- */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center pt-8 mt-6 border-t border-gray-200 dark:border-gray-700">
            <nav className="flex items-center gap-2" aria-label="Pagination">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="inline-flex items-center justify-center h-10 w-10 rounded-lg text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              {paginationItems.map((page, index) =>
                typeof page === "number" ? (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`inline-flex items-center justify-center h-10 w-10 rounded-lg text-sm font-bold transition-colors ${
                      currentPage === page
                        ? "bg-black text-white dark:bg-white dark:text-black"
                        : "text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    {page}
                  </button>
                ) : (
                  <span
                    key={`ellipsis-${index}`}
                    className="inline-flex items-center justify-center h-10 w-10 text-gray-400 dark:text-gray-500"
                  >
                    ...
                  </span>
                ),
              )}

              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="inline-flex items-center justify-center h-10 w-10 rounded-lg text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  )
})

// NEW: Code Viewer Modal
const CodeViewerModal = memo(({ isOpen, onClose, submission }) => {
  if (!isOpen || !submission) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-black rounded-xl shadow-2xl max-w-4xl w-full border border-gray-200 dark:border-gray-700 flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-black dark:text-white">Submission Details</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {submission.problem?.title || "Unknown Problem"} -{" "}
              <span className="font-semibold">{submission.language || "N/A"}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 hover:scale-110"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          <pre className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg text-sm text-black dark:text-gray-200 whitespace-pre-wrap font-mono">
            <code>{submission.code || "No code available for this submission."}</code>
          </pre>
        </div>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-3 text-sm font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-105"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
})

// Main Dashboard Component
export function UserDashboard() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [SubData, setSubData] = useState([]);

  const limit = 10;
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const problems = useSelector((state) => state.auth?.problemsBySlice || [])
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState(null)
  const [theme, setTheme] = useState("light")
  const [brightness, setBrightness] = useState(100)
  const [showSettings, setShowSettings] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [showPhotoUpload, setShowPhotoUpload] = useState(false)
  const [showPersonalInfo, setShowPersonalInfo] = useState(false)
  const [showPasswordChange, setShowPasswordChange] = useState(false)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [toast, setToast] = useState(null)
  const [activeSection, setActiveSection] = useState("dashboard")
  const [userProfileData, setUserProfileData] = useState(null)
  const userImage = useSelector((state) => state?.auth?.userImage || null)
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false)
  const [selectedSubmissionForCode, setSelectedSubmissionForCode] = useState(null)

  // Fetch problems from Redux if not already loaded
  useEffect(() => {
    dispatch(allProblemsFetch())
  }, [dispatch, problems.length])

  //user image
  useEffect(() => {
    dispatch(getUserImage())
  }, [dispatch])

  useEffect(()=>{
    const fetchSubmissions=async()=>{
      const result=await axiosClient.get(`/submission/submit/allPaginatedSubmission?page=${currentPage}&limit=${limit}`)
      setSubData(result.data.allSubmissions);
      setTotalPages(result.data.totalPages);
    }
    fetchSubmissions();
  },[currentPage,totalPages])
  
  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user?._id) return

      try {
        const response = await axiosClient.get(`/user/getProfile`)
        setUserProfileData(response.data)
      } catch (error) {
        console.error("Failed to fetch user profile:", error)
        setUserProfileData(user) // Fallback to Redux user data
      }
    }
    fetchUserProfile()
  }, [user])

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user || !problems?.problemNeeded) return

      setLoading(true)
      try {
        const [submissionsRes, activityRes, problemsRes, totalProblems] = await Promise.all([
          axiosClient.get(`/submission/submit/allsubmissions`),
          axiosClient.get("/activity/useractivity"),
          axiosClient.get("/problem/problemSolvedByUser"),
          axiosClient.get("/problem/getAllProblem"),
        ])

        const submissions = submissionsRes.data
        const activity = activityRes.data
        const solvedProblems = problemsRes.data

        const totalSubmissions = submissions.length
        const acceptedSubmissions = submissions.filter((s) => s.status === "accepted").length
        const successRate = totalSubmissions > 0 ? (acceptedSubmissions / totalSubmissions) * 100 : 0

        const enrichedSubmissions = submissions.map((submission) => {
          const problem = problems.problemNeeded.find((p) => p._id === submission.problemId)
          return {
            ...submission,
            problem: problem || { title: "Unknown Problem", difficulty: "unknown" },
          }
        })

        const seenProblemIds = new Set()
        const problemsByDifficulty = enrichedSubmissions.reduce(
          (acc, submission) => {
            if (submission.status === "accepted" && !seenProblemIds.has(submission.problemId)) {
              seenProblemIds.add(submission.problemId)
              const difficulty = submission.problem?.difficulty || "unknown"
              acc[difficulty] = (acc[difficulty] || 0) + 1
            }
            return acc
          },
          {},
        )

        const finalTotalProblems = totalProblems.data.problemNeeded.reduce(
          (acc, problem) => {
            const difficulty = problem.difficulty || "unknown"
            if (!acc.difficulty) acc.difficulty = {}
            acc.difficulty[difficulty] = (acc.difficulty[difficulty] || 0) + 1
            return acc
          },
          {},
        )

        setDashboardData({
          submissions: enrichedSubmissions,
          totalSubmissions,
          finalTotalProblems,
          acceptedSubmissions,
          successRate,
          problemsByDifficulty,
          userStreak: activity,
          solvedProblems: solvedProblems || [],
          problemsSolvedCount: solvedProblems?.length || 0,
        })
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
        showToast("Failed to load dashboard data", "error")
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [user, problems])

  const handlePhotoUploadSuccess = (imageUrl) => {
    showToast("Profile photo updated successfully", "success")
    setShowPhotoUpload(false)
    dispatch(getUserImage())
  }

  const handleDeleteProfile=async()=>{
    try{
      await axiosClient.post('/user/deleteProfile');
      
    }
    catch(err){
      showToast("Server Error")
    }

  }
  const handleImageUpload = () => {
    setShowPhotoUpload(true)
  }

  const handleViewCode = (submission) => {
    setSelectedSubmissionForCode(submission)
    setIsCodeModalOpen(true)
  }

  useEffect(() => {
    const root = document.documentElement
    if (theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
    document.body.style.filter = `brightness(${brightness}%)`
  }, [theme, brightness])

  const showToast = (message, type = "info") => {
    setToast({ message, type })
  }

  const hideToast = () => {
    setToast(null)
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-black dark:via-gray-900 dark:to-black">
        <div className="text-center p-8">
          <h2 className="text-2xl font-black text-black dark:text-white mb-4">Please log in to view your dashboard</h2>
        </div>
      </div>
    )
  }

  const currentDate = new Date()
  const formattedDate = currentDate.toLocaleDateString("en", {
    month: "long",
    day: "numeric",
    weekday: "long",
  })

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-black dark:via-gray-900 dark:to-black"
      style={{ filter: `brightness(${brightness}%)` }}
    >
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white dark:bg-black border-r border-gray-200 dark:border-gray-700 min-h-screen shadow-lg">
          <div className="p-6">
            
          <Link to="/"><div className="relative bottom-2 left-2">
          <img
            src={logo}
            alt="Logo"
            className="h-12 w-auto max-w-[150px] object-contain"
          />
        </div>
        </Link>
            <nav className="space-y-2">
              {[
                { icon: LayoutDashboard, label: "Dashboard", key: "dashboard" },
                { icon: User, label: "Profile", key: "profile" },
                { icon: Code, label: "Problems", key: "problems" },
                { icon: FileText, label: "Submissions", key: "submissions" },
              ].map((item, index) => (
                <button
                  key={index}
                  onClick={() => setActiveSection(item.key)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 hover:scale-105 ${
                    activeSection === item.key
                      ? "bg-gray-100 dark:bg-gray-800 text-black dark:text-white shadow-lg"
                      : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <header className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-700 px-8 py-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-black text-black dark:text-white">
                  Welcome back, {user.name?.split(" ")[0]}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{formattedDate}</p>
              </div>
              <div className="flex items-center gap-4">
                
                <button
                  onClick={() => setShowSettings(true)}
                  className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 hover:scale-110"
                >
                  <Settings className="h-5 w-5 text-gray-500" />
                </button>
                <button
                  onClick={() => setShowProfile(true)}
                  className="flex items-center gap-2 p-1 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 hover:scale-105"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center text-black dark:text-white text-sm font-black shadow-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                    {userImage?.secureUrl ? (
                      <img
                        src={userImage.secureUrl || "/placeholder.svg"}
                        alt="Profile"
                        className="w-full h-full object-cover filter grayscale"
                      />
                    ) : (
                      user.name?.charAt(0)?.toUpperCase() || "U"
                    )}
                  </div>
                 
                </button>
              </div>
            </div>
          </header>

          {/* Dashboard Content */}
          <main className="p-8">
            {activeSection === "dashboard" && (
              <>
                <div className="mb-8">
                  <h2 className="text-xl font-black text-black dark:text-white mb-6 uppercase tracking-wide">
                    Overview
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                      title="Problems Solved"
                      value={<StatsCounter end={dashboardData?.problemsSolvedCount || 0} />}
                      subtitle="Keep it up!"
                      icon={Target}
                      color="green"
                      progress={75}
                      trend={5.2}
                      loading={loading}
                    />
                    <StatCard
                      title="Total Submissions"
                      value={<StatsCounter end={dashboardData?.totalSubmissions || 0} />}
                      subtitle="All attempts"
                      icon={Code}
                      color="blue"
                      progress={60}
                      trend={12.1}
                      loading={loading}
                    />
                    <StatCard
                      title="Success Rate"
                      value={<StatsCounter end={dashboardData?.successRate || 0} suffix="%" />}
                      subtitle="Acceptance ratio"
                      icon={Trophy}
                      color="yellow"
                      progress={dashboardData?.successRate || 0}
                      trend={-2.3}
                      loading={loading}
                    />
                    <StatCard
                      title="Current Streak"
                      value={<StatsCounter end={dashboardData?.userStreak?.currentStreak || 0} />}
                      subtitle="Days active"
                      icon={Flame}
                      color="red"
                      progress={Math.min((dashboardData?.userStreak?.currentStreak || 0) * 10, 100)}
                      trend={8.7}
                      loading={loading}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Column */}
                  <div className="lg:col-span-2 space-y-8">
                    
                    <ActivityHeatMap userStreak={dashboardData?.userStreak} loading={loading} />
                  </div>

                  {/* Right Column */}
                  <div className="space-y-8">
                    
                    <PerformanceChart
                      data={dashboardData?.problemsByDifficulty}
                      finalTotalProblems={dashboardData?.finalTotalProblems}
                      loading={loading}
                    />
                  </div>
                </div>
              </>
            )}

            {activeSection === "problems" && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-black text-black dark:text-white mb-6 uppercase tracking-wide">
                    Your Problem Journey
                  </h2>
                </div>
                <ProblemsSolved problems={dashboardData?.solvedProblems} loading={loading} />
              </div>
            )}

            {activeSection === "submissions" && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-black text-black dark:text-white mb-6 uppercase tracking-wide">
                    Your Submissions
                  </h2>
                </div>
                <AllSubmissions
                  submissions={dashboardData?.submissions}
                  loading={loading}
                  onViewCode={handleViewCode}
                  SubData={SubData}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  totalPages={totalPages}
                  problems={problems}
                />
              </div>
            )}

            {activeSection === "profile" && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-black text-black dark:text-white mb-6 uppercase tracking-wide">
                    Profile Management
                  </h2>
                </div>

                {/* Main Profile Layout */}
                <div className="bg-white dark:bg-black rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl overflow-hidden">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
                    {/* Left Column - User Photo & Basic Info */}
                    <div className="flex flex-col items-center space-y-6">
                      <div className="relative">
                        <div className="w-48 h-48 rounded-3xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center text-gray-800 dark:text-gray-200 text-4xl font-black shadow-2xl overflow-hidden border-4 border-gray-300 dark:border-gray-600">
                          {userImage?.secureUrl ? (
                            <img
                              src={userImage.secureUrl || "/placeholder.svg"}
                              alt="Profile"
                              className="w-full h-full object-cover filter grayscale cursor-pointer"
                              onClick={handleImageUpload}
                            />
                          ) : (
                            <div className="cursor-pointer" onClick={handleImageUpload}>
                              {userProfileData?.firstName?.charAt(0)?.toUpperCase() || "U"}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={handleImageUpload}
                          className="absolute -bottom-2 -right-2 w-12 h-12 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-xl border-4 border-white dark:border-black"
                        >
                          <Camera size={20} />
                        </button>
                      </div>
                      <div className="text-center space-y-2">
                        <h3 className="text-xl font-black text-black dark:text-white">
                          {userProfileData?.firstName || "User Name"}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                          {userProfileData?.emailId || "user@example.com"}
                        </p>
                        <div className="flex items-center justify-center gap-2 mt-4">
                          <div className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-full">
                            <span className="text-sm font-bold">Premium Member</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    

                    {/* Center Column - Profile Information */}
                    <div className="space-y-6">
                      <div className="flex items-center justify-between mb-6">
                        <h4 className="text-lg font-black text-black dark:text-white">Profile Information</h4>
                        <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                          <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-800">
                          <span className="text-sm font-bold text-black dark:text-white">First Name:</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {userProfileData?.firstName || userProfileData?.name?.split(" ")[0] || "John"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-800">
                          <span className="text-sm font-bold text-black dark:text-white">Last Name:</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {userProfileData?.lastName || userProfileData?.name?.split(" ").slice(1).join(" ") || "Doe"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-800">
                          <span className="text-sm font-bold text-black dark:text-white">Email ID:</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {userProfileData?.emailId || "john.doe@example.com"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-800">
                          <span className="text-sm font-bold text-black dark:text-white">Age:</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {userProfileData?.age || "25"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-800">
                          <span className="text-sm font-bold text-black dark:text-white">Level:</span>
                          <div className="flex items-center gap-2">
                            <div
                              className={`px-3 py-1 rounded-full text-sm font-bold ${
                                (userProfileData?.levelOfUser || "beginner") === "beginner"
                                  ? "bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
                                  : (userProfileData?.levelOfUser || "beginner") === "intermediate"
                                    ? "bg-gray-300 dark:bg-gray-600 text-black dark:text-white"
                                    : "bg-black dark:bg-white text-white dark:text-black"
                              }`}
                            >
                              {(userProfileData?.levelOfUser || "beginner").charAt(0).toUpperCase() +
                                (userProfileData?.levelOfUser || "beginner").slice(1)}
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-between items-center py-3">
                          <span className="text-sm font-bold text-black dark:text-white">Member Since:</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {new Date(userProfileData?.createdAt || Date.now()).toLocaleDateString("en-US", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                    

                    {/* Right Column - Stats */}
                    <div className="space-y-6">
                      <div className="text-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                        <div className="w-16 h-16 bg-gradient-to-br from-yellow-200 to-yellow-300 dark:from-yellow-300 dark:to-yellow-400 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-300 shadow-lg">
                          <Trophy className="w-8 h-8 text-yellow-700 dark:text-yellow-800" />
                        </div>
                        <h5 className="text-sm font-black text-black dark:text-white mb-2">Problems Solved</h5>
                        <p className="text-xl font-black text-black dark:text-white">
                          {dashboardData?.problemsSolvedCount || 0}
                        </p>
                      </div>
                      <div className="text-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                        <div className="w-16 h-16 bg-gradient-to-br from-green-200 to-green-300 dark:from-green-300 dark:to-green-400 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-300 shadow-lg">
                          <Target className="w-8 h-8 text-green-700 dark:text-green-800" />
                        </div>
                        <h5 className="text-sm font-black text-black dark:text-white mb-2">Success Rate</h5>
                        <p className="text-xl font-black text-black dark:text-white">
                          {Math.round(dashboardData?.successRate || 0)}%
                        </p>
                      </div>
                      <div className="text-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                        <div className="w-16 h-16 bg-gradient-to-br from-red-200 to-red-300 dark:from-red-300 dark:to-red-400 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-300 shadow-lg">
                          <Flame className="w-8 h-8 text-red-700 dark:text-red-800" />
                        </div>
                        <h5 className="text-sm font-black text-black dark:text-white mb-2">Current Streak</h5>
                        <p className="text-xl font-black text-black dark:text-white">
                          {dashboardData?.userStreak?.currentStreak || 0} days
                        </p>
                      </div>
                    </div>
                    
                  </div>
                </div>

                {/* Edit Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  

                 

                  {/* Update Personal Info Section */}
                  <div className="bg-white dark:bg-black rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-200 to-green-300 dark:from-green-300 dark:to-green-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg">
                          <User className="w-5 h-5 text-green-700 dark:text-green-800" />
                        </div>
                        <h5 className="text-lg font-black text-black dark:text-white">Personal Info</h5>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Update your personal details</p>
                    </div>
                    <div className="p-6">
                      <button
                        onClick={() => setShowPersonalInfo(true)}
                        className="w-full bg-gradient-to-r from-black to-gray-800 dark:from-white dark:to-gray-200 text-white dark:text-black py-4 rounded-xl font-bold hover:scale-105 transition-all duration-300 shadow-lg"
                      >
                        Edit Profile
                      </button>
                    </div>
                  </div>
                  {/* Update Personal Info Section */}
                  <div className="bg-white dark:bg-black rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-red-500 dark:from-red-400 dark:to-red-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg">
                          <Trash2 className="w-5 h-5 text-black dark:text-white" />
                        </div>
                        <h5 className="text-lg font-black text-black dark:text-white">Delete</h5>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Delete your profile from AlgoByte</p>
                    </div>
                    <div className="p-6">
                      <button
                        onClick={handleDeleteProfile}
                        className="w-full bg-gradient-to-r from-black to-gray-800 dark:from-white dark:to-gray-200 text-white dark:text-black py-4 rounded-xl font-bold hover:scale-105 transition-all duration-300 shadow-lg"
                      >
                        Delete Profile
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection !== "dashboard" &&
              activeSection !== "problems" &&
              activeSection !== "profile" &&
              activeSection !== "submissions" && (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <h3 className="text-xl font-black text-black dark:text-white mb-2">Coming Soon</h3>
                    <p className="text-gray-500 dark:text-gray-400">This section is under development.</p>
                  </div>
                </div>
              )}
          </main>
        </div>
      </div>

      <PersonalInfoModal
        isOpen={showPersonalInfo}
        onClose={() => setShowPersonalInfo(false)}
        user={userProfileData || user}
        showToast={showToast}
      />
      <PasswordChangeModal
        isOpen={showPasswordChange}
        onClose={() => setShowPasswordChange(false)}
        showToast={showToast}
      />
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        theme={theme}
        setTheme={setTheme}
        brightness={brightness}
        setBrightness={setBrightness}
      />
      <EmailModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        user={userProfileData || user}
        showToast={showToast}
      />
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
      <PhotoUploadModal
        isOpen={showPhotoUpload}
        onClose={() => setShowPhotoUpload(false)}
        onUploadSuccess={handlePhotoUploadSuccess}
        showToast={showToast}
        userImage={userImage}
      />
      <CodeViewerModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
        submission={selectedSubmissionForCode}
      />
    </div>
  )
}

const ProblemsSolved = memo(({ problems, loading = false }) => {
  if (loading) {
    return (
      <div className="group relative transition-all duration-500 hover:scale-105 hover:-translate-y-2">
        <div className="p-6 bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg h-full">
          <div className="animate-pulse">
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-4"></div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                  <div className="flex-1 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="w-12 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="group relative transition-all duration-500 hover:scale-105 hover:-translate-y-2">
      <div className="p-6 bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-500 hover:border-gray-300 dark:hover:border-gray-600 h-full group-hover:bg-gray-50 dark:group-hover:bg-gray-900">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-black text-black dark:text-white">Problems Solved</h3>
          <MoreHorizontal className="h-5 w-5 text-gray-400 cursor-pointer hover:text-black dark:hover:text-white transition-colors duration-200" />
        </div>
        <div className="space-y-4">
          {problems?.slice(0, 5).map((problem) => (
            <div key={problem._id} className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center text-black dark:text-white text-sm font-black shadow-lg">
                {problem.title?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div className="flex-1">
                <div className="font-bold text-black dark:text-white">{problem.title || "Unknown"}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Difficulty: {problem.difficulty}</div>
              </div>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
})

const SettingsModal = memo(({ isOpen, onClose, theme, setTheme, brightness, setBrightness }) => {
  const [localBrightness, setLocalBrightness] = useState(brightness)

  useEffect(() => {
    setLocalBrightness(brightness)
  }, [brightness])

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme)
  }

  const handleBrightnessChange = (newBrightness) => {
    setLocalBrightness(newBrightness)
  }

  const handleSaveBrightness = () => {
    setBrightness(localBrightness)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-black rounded-xl shadow-2xl max-w-md w-full border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-black dark:text-white">Settings</h3>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 hover:scale-110 text-black dark:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="mb-4">
            <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Theme</h4>
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleThemeChange("light")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all duration-300 hover:scale-105 ${
                  theme === "light"
                    ? "bg-black dark:bg-white text-white dark:text-black shadow-lg"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                }`}
              >
                <Sun className="h-4 w-4" />
                Light
              </button>
              <button
                onClick={() => handleThemeChange("dark")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all duration-300 hover:scale-105 ${
                  theme === "dark"
                    ? "bg-black dark:bg-white text-white dark:text-black shadow-lg"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                }`}
              >
                <Moon className="h-4 w-4" />
                Dark
              </button>
              <button
                onClick={() => handleThemeChange("system")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all duration-300 hover:scale-105 ${
                  theme === "system"
                    ? "bg-black dark:bg-white text-white dark:text-black shadow-lg"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                }`}
              >
                <Monitor className="h-4 w-4" />
                System
              </button>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={handleSaveBrightness}
              className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-300 hover:scale-105"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  )
})

export default UserDashboard

