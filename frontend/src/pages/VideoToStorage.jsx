"use client"

import { useEffect, useState } from "react"
import axios from 'axios';
import { useNavigate, useParams,Link } from "react-router-dom"
import logo from "../Images/logo.png"
import axiosClient from "../utils/axiosClient"
import { Sun, Moon, Code, Upload, Video, Check, ArrowLeft, CloudUpload, FileVideo, X } from "lucide-react"

// --- Success Modal Component ---
const SuccessModal = ({ isVisible, onClose, problemTitle }) => {
  const [showTick, setShowTick] = useState(false)

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => setShowTick(true), 200)
      return () => clearTimeout(timer)
    } else {
      setShowTick(false)
    }
  }, [isVisible])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blurred Background */}
      <div
        className="absolute inset-0 bg-black/20 dark:bg-white/10 backdrop-blur-md transition-all duration-500"
        onClick={onClose}
      />

      {/* Success Content */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* Big Green Tick */}
        <div
          className={`w-32 h-32 rounded-full bg-green-500 flex items-center justify-center mb-6 transition-all duration-700 ease-out ${
            showTick ? "scale-100 opacity-100" : "scale-0 opacity-0"
          }`}
          style={{
            boxShadow: "0 0 50px rgba(34, 197, 94, 0.5), 0 0 100px rgba(34, 197, 94, 0.3)",
          }}
        >
          <Check className="w-16 h-16 text-white animate-pulse" strokeWidth={3} />
        </div>

        {/* Success Message */}
        <div
          className={`text-center transition-all duration-500 delay-300 ${
            showTick ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <h2 className="text-3xl font-bold text-black dark:text-white mb-2">Video Uploaded Successfully!</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            Video solution for <strong>"{problemTitle}"</strong> has been uploaded.
          </p>
          <p className="text-gray-500 dark:text-gray-500 text-sm mb-6">Students can now access this video solution.</p>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}

// --- Confirmation Modal Component ---
const ConfirmationModal = ({ isVisible, onClose, onConfirm, problemTitle, fileName, isUploading }) => {
  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-white/95 dark:bg-black/95 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl p-6 transform transition-all duration-300 scale-100">
        {/* Upload Icon */}
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30">
          <CloudUpload className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-center text-black dark:text-white mb-2">Confirm Video Upload</h3>

        {/* Message */}
        <div className="text-center text-gray-600 dark:text-gray-400 mb-6">
          <p className="mb-2">Are you sure you want to upload this video solution for:</p>
          <p className="font-bold text-black dark:text-white bg-gray-100 dark:bg-gray-800 p-2 rounded-lg mb-2">
            "{problemTitle}"
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            File: <span className="font-medium">{fileName}</span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isUploading}
            className="flex-1 px-4 py-3 text-sm font-bold rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isUploading}
            className="flex-1 px-4 py-3 text-sm font-bold rounded-xl bg-green-600 text-white hover:bg-green-700 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isUploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Uploading...
              </>
            ) : (
              <>
                <CloudUpload className="w-4 h-4 mr-2" />
                Upload Video
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

// --- Enhanced Circuit Board Background ---
const CircuitBoardBackground = () => {
  useEffect(() => {
    let animationFrameId = null
    const handleMouseMove = (e) => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
      animationFrameId = requestAnimationFrame(() => {
        document.documentElement.style.setProperty("--mouse-x", `${e.clientX}px`)
        document.documentElement.style.setProperty("--mouse-y", `${e.clientY + window.scrollY}px`)
      })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return (
    <div className="fixed inset-0 -z-10 h-full w-full overflow-hidden bg-white dark:bg-black">
      {/* Neural Network Nodes */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.08]">
        {Array.from({ length: 25 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-green-500 dark:bg-green-400 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Circuit Board Pattern */}
      <div className="absolute inset-0">
        <svg className="w-full h-full opacity-[0.02] dark:opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="circuit-upload" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M20 20h60v60h-60z" fill="none" stroke="currentColor" strokeWidth="0.5" />
              <circle cx="20" cy="20" r="2" fill="currentColor" />
              <circle cx="80" cy="20" r="2" fill="currentColor" />
              <circle cx="20" cy="80" r="2" fill="currentColor" />
              <circle cx="80" cy="80" r="2" fill="currentColor" />
              <path d="M20 20L80 20M20 80L80 80M20 20L20 80M80 20L80 80" stroke="currentColor" strokeWidth="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit-upload)" />
        </svg>
      </div>

      {/* Interactive Mouse Glow */}
      <div
        className="absolute inset-0 z-20 transition-opacity duration-300"
        style={{
          backgroundImage: `
            radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(34, 197, 94, 0.08), transparent 50%),
            radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(22, 163, 74, 0.04), transparent 70%)
          `,
        }}
      />

      {/* Floating Upload Icons */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-green-400 dark:text-green-400 text-xs opacity-20 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
            }}
          >
            {["📤", "🎬", "📹", "🎥", "▶", "⬆"][i % 6]}
          </div>
        ))}
      </div>
    </div>
  )
}

// --- Premium Upload Zone Component ---
const UploadZone = ({ onFileSelect, selectedFile, onRemoveFile, isDragOver, setIsDragOver }) => {
  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = e.dataTransfer.files
    if (files.length > 0 && files[0].type.startsWith("video/")) {
      onFileSelect(files[0])
    }
  }

  const handleFileInput = (e) => {
    const files = e.target.files
    if (files.length > 0) {
      onFileSelect(files[0])
    }
  }

  return (
    <div
      className={`relative border-2 border-dashed rounded-2xl p-8 transition-all duration-300 ${
        isDragOver
          ? "border-green-400 bg-green-50/50 dark:bg-green-900/20 scale-105"
          : selectedFile
            ? "border-green-300 bg-green-50/30 dark:bg-green-900/10"
            : "border-gray-300 dark:border-gray-600 hover:border-green-400 dark:hover:border-green-500"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Glow Effect */}
      {isDragOver && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-400/20 to-emerald-400/20 blur-xl" />
      )}

      <div className="relative z-10 text-center">
        {selectedFile ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-green-100 dark:bg-green-900/30 border-2 border-green-200 dark:border-green-800">
              <FileVideo className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-black dark:text-white mb-2">Video Selected</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{selectedFile.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                Size: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
            <button
              onClick={onRemoveFile}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
            >
              <X className="w-4 h-4" />
              Remove File
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700">
              <CloudUpload className="w-8 h-8 text-gray-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-black dark:text-white mb-2">Upload Video Solution</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Drag and drop your video file here, or click to browse
              </p>
              <label className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl transition-all duration-300 hover:scale-105 cursor-pointer shadow-lg">
                <Upload className="w-4 h-4" />
                Choose Video File
                <input type="file" accept="video/*" onChange={handleFileInput} className="hidden" />
              </label>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Supported formats: MP4, MOV, AVI, WebM (Max: 100MB)
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export function VideoToStorage() {
  const navigate = useNavigate()
  const { problemId } = useParams()
  const [problem, setProblem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [darkMode, setDarkMode] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark")
    else document.documentElement.classList.remove("dark")
  }, [darkMode])

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        setLoading(true)
        const { data } = await axiosClient.get(`/problem/problemById/${problemId}`)
        setProblem(data)
        setError(null)
      } catch (err) {
        setError("Failed to fetch problem details. Please try again later.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (problemId) {
      fetchProblem()
    }
  }, [problemId])

  const handleFileSelect = (file) => {
    if (file.size > 100 * 1024 * 1024) {
      // 100MB limit
      alert("File size must be less than 100MB")
      return
    }
    setSelectedFile(file)
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
  }

  const openUploadModal = () => {
    if (!selectedFile) {
      alert("Please select a video file first")
      return
    }
    setIsModalOpen(true)
  }

  const closeUploadModal = () => {
    setIsModalOpen(false)
  }

  const handleConfirmUpload = async () => {
    if (!selectedFile || !problem) return

    const signatureResponse = await axiosClient.get(`/video/create/${problemId}`);
    const { signature, timestamp, public_id, api_key, cloud_name, upload_url } = signatureResponse.data;
    

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", selectedFile)
      formData.append("problemId", problemId)
      formData.append("problemTitle", problem.title)
      formData.append('signature', signature);
      formData.append('timestamp', timestamp);
      formData.append('public_id', public_id);
      formData.append('api_key', api_key);
    

      // Upload to Cloudinary via your backend
      const response=await axios.post(upload_url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
     
      let cloudinaryResult=response.data
      

    const metadataResponse = await axiosClient.post('/video/save', {
        problemId:problemId,
        cloudinaryPublicId: cloudinaryResult.public_id,
        secureUrl: cloudinaryResult.secure_url,
        duration: cloudinaryResult.duration,
      });
      

      closeUploadModal()
      setShowSuccessModal(true)
    } catch (err) {
      alert("Failed to upload video. Please try again.")
      console.error(err)
    } finally {
      setIsUploading(false)
    }
  }

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false)
    navigate("/admin/video")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-green-500 rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error || !problem) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600 dark:text-gray-400">{error || "Problem not found"}</p>
          <button
            onClick={() => navigate("/admin/videos")}
            className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative text-black dark:text-white transition-colors duration-300 isolate">
      <CircuitBoardBackground />

      {/* Success Modal */}
      <SuccessModal isVisible={showSuccessModal} onClose={handleSuccessModalClose} problemTitle={problem?.title} />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isVisible={isModalOpen}
        onClose={closeUploadModal}
        onConfirm={handleConfirmUpload}
        problemTitle={problem?.title}
        fileName={selectedFile?.name}
        isUploading={isUploading}
      />

      {/* Enhanced Navigation */}
      <nav className="sticky top-0 z-40 bg-white/90 dark:bg-black/90 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
        <Link to="/"><div className="relative top-1 left-2">
          <img
            src={logo}
            alt="Logo"
            className="h-12 w-auto max-w-[150px] object-contain"
          />
        </div>
        </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-110 group border border-gray-200 dark:border-gray-600"
              title="Toggle theme"
            >
              {darkMode ? (
                <Sun className="w-4 h-4 text-yellow-500 group-hover:rotate-180 transition-transform duration-300" />
              ) : (
                <Moon className="w-4 h-4 text-gray-700 group-hover:rotate-12 transition-transform duration-300" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto p-6 mt-8 mb-12 relative z-10">
        <div className="bg-white/95 dark:bg-black/95 backdrop-blur-xl rounded-2xl border border-gray-300 dark:border-gray-600 shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-green-600 shadow-lg">
                <Video className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-black dark:text-white">Upload Video Solution</h1>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-6">
              <h2 className="text-lg font-semibold text-black dark:text-white mb-1">{problem.title}</h2>
              <div className="flex items-center justify-center gap-2">
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    problem.difficulty?.toLowerCase() === "easy"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                      : problem.difficulty?.toLowerCase() === "medium"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300"
                        : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
                  }`}
                >
                  {problem.difficulty}
                </span>
                <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                  {problem.tags}
                </span>
              </div>
            </div>
          </div>

          {/* Upload Zone */}
          <UploadZone
            onFileSelect={handleFileSelect}
            selectedFile={selectedFile}
            onRemoveFile={handleRemoveFile}
            isDragOver={isDragOver}
            setIsDragOver={setIsDragOver}
          />

          {/* Upload Button */}
          {selectedFile && (
            <div className="mt-8 text-center">
              <button
                onClick={openUploadModal}
                className="inline-flex items-center gap-3 px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <CloudUpload className="w-5 h-5" />
                Upload Video Solution
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default VideoToStorage
