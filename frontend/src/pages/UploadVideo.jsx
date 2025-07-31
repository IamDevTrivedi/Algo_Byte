
"use client"

import { useEffect, useState, useMemo } from "react"
import axiosClient from "../utils/axiosClient"
import { useNavigate,Link } from "react-router-dom"
import logo from "../Images/logo.png"
import { Sun, Moon, Code, Search, Trash2, Check, AlertTriangle, Video, Upload, Play } from "lucide-react"


const useTypewriter = (text, speed = 80) => {
  const [displayText, setDisplayText] = useState("")
  const [isComplete, setIsComplete] = useState(false)
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    let i = 0
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayText(text.slice(0, i + 1))
        i++
      } else {
        setIsComplete(true)
        clearInterval(timer)
        // Blink cursor for 2 seconds after completion
        setTimeout(() => setShowCursor(false), 2000)
      }
    }, speed)

    return () => clearInterval(timer)
  }, [text, speed])

  return { displayText, isComplete, showCursor }
}

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
  
      <div
        className="absolute inset-0 bg-black/20 dark:bg-white/10 backdrop-blur-md transition-all duration-500"
        onClick={onClose}
      />

      {/* Success Content */}
      <div className="relative z-10 flex flex-col items-center justify-center">
      
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
          <h2 className="text-3xl font-bold text-black dark:text-white mb-2">Video Deleted Successfully!</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            Video solution for <strong>"{problemTitle}"</strong> has been removed.
          </p>
          <p className="text-gray-500 dark:text-gray-500 text-sm mb-6">This action cannot be undone.</p>
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
const ConfirmationModal = ({ isVisible, onClose, onConfirm, problemTitle, isDeleting }) => {
  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
   
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-white/95 dark:bg-black/95 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl p-6 transform transition-all duration-300 scale-100">
        {/* Warning Icon */}
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30">
          <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-center text-black dark:text-white mb-2">Confirm Video Deletion</h3>

        {/* Message */}
        <div className="text-center text-gray-600 dark:text-gray-400 mb-6">
          <p className="mb-2">Are you sure you want to permanently delete the video solution for:</p>
          <p className="font-bold text-black dark:text-white bg-gray-100 dark:bg-gray-800 p-2 rounded-lg">
            "{problemTitle}"
          </p>
          <p className="text-sm text-red-600 dark:text-red-400 mt-2">This action cannot be undone.</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 px-4 py-3 text-sm font-bold rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 px-4 py-3 text-sm font-bold rounded-xl bg-red-600 text-white hover:bg-red-700 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isDeleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Video
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}


const CircuitBoardBackground = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    let animationFrameId = null
    const handleMouseMove = (e) => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
      animationFrameId = requestAnimationFrame(() => {
        setMousePos({ x: e.clientX, y: e.clientY + window.scrollY })
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
    <div className="absolute inset-0 -z-10 h-full w-full overflow-hidden bg-white dark:bg-black">
      {/* Neural Network Nodes */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.08]">
        {Array.from({ length: 25 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-500 dark:bg-blue-400 rounded-full animate-pulse"
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
            <pattern id="circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M20 20h60v60h-60z" fill="none" stroke="currentColor" strokeWidth="0.5" />
              <circle cx="20" cy="20" r="2" fill="currentColor" />
              <circle cx="80" cy="20" r="2" fill="currentColor" />
              <circle cx="20" cy="80" r="2" fill="currentColor" />
              <circle cx="80" cy="80" r="2" fill="currentColor" />
              <path d="M20 20L80 20M20 80L80 80M20 20L20 80M80 20L80 80" stroke="currentColor" strokeWidth="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit)" />
        </svg>
      </div>

      {/* Interactive Mouse Glow */}
      <div
        className="absolute inset-0 z-20 transition-opacity duration-300"
        style={{
          backgroundImage: `
            radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(59, 130, 246, 0.08), transparent 50%),
            radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(37, 99, 235, 0.04), transparent 70%)
          `,
        }}
      />
    </div>
  )
}


const FireParticles = () => {
  const particles = Array.from({ length: 12 }, (_, i) => i)

  return (
    <div className="fire-particles">
      {particles.map((i) => (
        <div
          key={i}
          className="fire-particle"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
          }}
        />
      ))}
      {/* Video symbols floating */}
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={`video-${i}`}
          className="absolute text-blue-400 dark:text-blue-400 text-xs font-mono opacity-20 animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 4}s`,
          }}
        >
          {["▶", "⏸", "⏹", "🎬", "📹", "🎥"][i]}
        </div>
      ))}
    </div>
  )
}

// --- Video Status Filters ---
const VideoFilters = ({ activeFilter, onFilterChange }) => {
  const filters = [
    { name: "All Problems", value: "all", icon: <Video className="w-4 h-4" /> },
    { name: "Delete Videos", value: "delete", icon: <Trash2 className="w-4 h-4" /> },
    { name: "Upload Videos", value: "upload", icon: <Upload className="w-4 h-4" /> },
  ]

  return (
    <div className="relative mb-5">
      <div className="flex space-x-2 overflow-x-auto pb-3 scrollbar-hide">
        {filters.map((filter) => {
          const isActive = activeFilter === filter.value
          return (
            <button
              key={filter.value}
              onClick={() => onFilterChange(filter.value)}
              className={`neural-border-container relative flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-300 hover:scale-105 ${
                isActive
                  ? "bg-black dark:bg-white text-white dark:text-black shadow-lg"
                  : "bg-white dark:bg-black text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 border border-gray-200 dark:border-gray-700"
              }`}
            >
              <div className="relative z-10 flex items-center gap-2">
                {filter.icon}
                <span>{filter.name}</span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}


const ProblemCard = ({ problem, index, onDeleteVideo, onUploadVideo, hasVideo }) => {
  const getDifficultyStyles = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "text-green-800 dark:text-green-300 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
      case "medium":
        return "text-yellow-800 dark:text-yellow-300 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800"
      case "hard":
        return "text-red-800 dark:text-red-300 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
      default:
        return "text-gray-800 dark:text-gray-300 bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-800"
    }
  }

  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 50 * index)
    return () => clearTimeout(timer)
  }, [index])

  return (
    <div
      className={`syntax-border-container group w-full transition-all duration-500 ease-out ${
        isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <div className="relative z-10 p-4 rounded-xl bg-white/95 dark:bg-black/95 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-1">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center text-xs font-semibold text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600">
              {index + 1}
            </span>
            <div className="flex flex-col gap-2 flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-black dark:text-white">{problem.title}</h2>
                {hasVideo && (
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-medium">
                    <Play className="w-3 h-3" />
                    Video
                  </div>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <div
                  className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ${getDifficultyStyles(problem.difficulty)}`}
                >
                  {problem.difficulty}
                </div>
                <div className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold text-purple-800 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                  {problem.tags}
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          {hasVideo ? (
            <button
              onClick={() => onDeleteVideo(problem)}
              className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-all duration-300 hover:scale-110 border border-red-200 dark:border-red-800"
              title="Delete Video"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => onUploadVideo(problem)}
              className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50 transition-all duration-300 hover:scale-110 border border-green-200 dark:border-green-800"
              title="Upload Video"
            >
              <Upload className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

 function UploadVideo() {
  const navigate = useNavigate()
  const [problems, setProblems] = useState([])
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [problemToDelete, setProblemToDelete] = useState(null)
  const [darkMode, setDarkMode] = useState(false)
  const [activeFilter, setActiveFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [deletedProblemTitle, setDeletedProblemTitle] = useState("")

  // Typewriter effect for title
  const { displayText, isComplete, showCursor } = useTypewriter("Manage Videos", 80)

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark")
    else document.documentElement.classList.remove("dark")
  }, [darkMode])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        // Fetch both problems and videos
        const [problemsResponse, videosResponse] = await Promise.all([
          axiosClient.get("/problem/getAllProblem"),
          axiosClient.get("/video/getAllVideos"), // Assuming this endpoint exists
        ])

        setProblems(problemsResponse.data.problemNeeded)
        setVideos(videosResponse.data)
        setError(null)
      } catch (err) {
        setError("Failed to fetch data. Please try again later.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Check if problem has video
  const hasVideo = (problemId) => {
    return videos.some((video) => video.problemId === problemId)
  }

  const filteredProblems = useMemo(() => {
    let filtered = problems.filter((p) => p.title.toLowerCase().includes(searchTerm.toLowerCase()))

    if (activeFilter === "delete") {
      filtered = filtered.filter((p) => hasVideo(p._id))
    } else if (activeFilter === "upload") {
      filtered = filtered.filter((p) => !hasVideo(p._id))
    }

    return filtered
  }, [problems, videos, activeFilter, searchTerm])

  const openDeleteModal = (problem) => {
    setProblemToDelete(problem)
    setIsModalOpen(true)
  }

  const closeDeleteModal = () => {
    setProblemToDelete(null)
    setIsModalOpen(false)
  }

  const handleConfirmDelete = async () => {
    if (!problemToDelete) return
    setIsDeleting(true)
    try {
      // Delete video from Cloudinary and database
      await axiosClient.delete(`/videos/delete/${problemToDelete._id}`)

      // Update local state
      setVideos((prev) => prev.filter((v) => v.problemId !== problemToDelete._id))
      setDeletedProblemTitle(problemToDelete.title)
      closeDeleteModal()
      setShowSuccessModal(true)
    } catch (err) {
      alert("Failed to delete video. Please try again.")
      console.error(err)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleUploadVideo = (problem) => {
    // Navigate to upload video page with problem ID
    navigate(`/admin/videos/upload/${problem._id}`)
  }

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false)
    setDeletedProblemTitle("")
  }

  return (
    <div className="min-h-screen relative text-black dark:text-white transition-colors duration-300 isolate">
      <CircuitBoardBackground />

      {/* Success Modal */}
      <SuccessModal isVisible={showSuccessModal} onClose={handleSuccessModalClose} problemTitle={deletedProblemTitle} />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isVisible={isModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        problemTitle={problemToDelete?.title}
        isDeleting={isDeleting}
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

      {/* Enhanced Main Content */}
      <main className="fire-container max-w-4xl mx-auto p-5 mt-6 mb-12 relative z-10">
        <FireParticles />
        <div className="relative z-10 bg-white/95 dark:bg-black/95 backdrop-blur-xl rounded-2xl border border-gray-300 dark:border-gray-600 shadow-2xl p-6">
          {/* Enhanced Header with Typewriter Effect */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-blue-600 shadow-lg">
                <Video className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-black dark:text-white">
                {displayText}
                {showCursor && (
                  <span
                    className="inline-block w-0.5 h-8 bg-black dark:bg-white ml-1"
                    style={{ animation: "typewriter-cursor 1s infinite" }}
                  />
                )}
              </h1>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Upload and manage video solutions for coding challenges.
            </p>
          </div>

          <VideoFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} />

          <div className="mb-6 flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-1">
                <div className="relative w-full max-w-sm">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="w-4 h-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search problems..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300 font-medium text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-right">
                  <div className="text-sm font-black text-black dark:text-white">{filteredProblems.length}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">Problems</div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            {loading && (
              <div className="flex justify-center items-center p-10">
                <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
              </div>
            )}

            {error && <div className="text-center p-10 text-red-500 font-medium">{error}</div>}

            {!loading && !error && (
              <div className="flex flex-col gap-3">
                {filteredProblems.length > 0 ? (
                  filteredProblems.map((problem, index) => (
                    <ProblemCard
                      key={problem._id}
                      problem={problem}
                      index={index}
                      onDeleteVideo={openDeleteModal}
                      onUploadVideo={handleUploadVideo}
                      hasVideo={hasVideo(problem._id)}
                    />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center border border-gray-200 dark:border-gray-600">
                      <Video className="w-6 h-6 text-gray-400" />
                    </div>
                    <h3 className="text-base font-bold text-black dark:text-white mb-1">No problems found</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {searchTerm ? `No results found for "${searchTerm}".` : "No problems match the current filter."}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <style jsx="true" global="true">{`
        @keyframes typewriter-cursor {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        
        .fire-container {
          position: relative;
        }
        
        .fire-particles {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          overflow: hidden;
        }
        
        .fire-particle {
          position: absolute;
          bottom: -10px;
          width: 4px;
          height: 4px;
          background: linear-gradient(45deg, #3b82f6, #1d4ed8);
          border-radius: 50%;
          animation: fire-rise 4s infinite linear;
        }
        
        @keyframes fire-rise {
          0% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) scale(0);
            opacity: 0;
          }
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}

export default UploadVideo
