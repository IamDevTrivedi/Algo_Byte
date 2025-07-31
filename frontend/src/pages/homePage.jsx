
"use client"

import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState, useMemo, useRef } from "react"
import { allProblemsFetch, logoutUser, getUserImage } from "../authSlice"
import axiosClient from "../utils/axiosClient"
import { NavLink, Link } from "react-router-dom"
import logo from "../Images/logo.png"
import {
  Search,
  Filter,
  X,
  Sun,
  Moon,
  ChevronDown,
  BarChart3,
  CheckSquare,
  User,
  Shield,
  Zap,
  LogOut,
  Bookmark,
  Flame,
  Plus,
  ChevronLeft,
  ChevronRight,
  Star,
  Trophy,
  CheckCircle,
  Calendar,
  Target,
  Sparkles,
  Clock,
  Eye,
  TrendingUp,
  Check,
  Trash2,
  MoreVertical,
  AlertTriangle,
  MessageSquare,
  Award,
  Home,
  Swords, 
} from "lucide-react"

const CircuitBoardBackground = ({ isDark }) => {
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
    <div className="fixed inset-0 -z-10 h-full w-full overflow-hidden">
      <div className={`absolute inset-0 ${isDark ? "opacity-[0.04]" : "opacity-[0.02]"}`}>
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `
              linear-gradient(to right, #475569 1px, transparent 1px),
              linear-gradient(to bottom, #475569 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />
      </div>
      <div className={`absolute inset-0 overflow-hidden ${isDark ? "opacity-[0.08]" : "opacity-[0.03]"}`}>
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 ${isDark ? "bg-slate-600" : "bg-slate-400"} rounded-full animate-pulse`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          backgroundImage: `
            radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(148, 163, 184, 0.08), transparent 50%),
            radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(100, 116, 139, 0.04), transparent 70%)
          `,
        }}
      />
    </div>
  )
}

// Welcome Animation Component
const WelcomeAnimation = ({ user, onComplete, isDark }) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onComplete, 500)
    }, 3000)

    return () => clearTimeout(timer)
  }, [onComplete])

  if (!isVisible) return null

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${isDark ? "bg-slate-950/95" : "bg-white/95"} backdrop-blur-xl`}
    >
      <div className="text-center space-y-6 animate-pulse">
        <div
          className={`w-24 h-24 mx-auto rounded-full ${isDark ? "bg-slate-900 border-slate-200" : "bg-white border-slate-800"} border-4 flex items-center justify-center shadow-2xl animate-bounce`}
        >
          <Sparkles className="w-12 h-12 text-yellow-500" />
        </div>
        <div className="space-y-2">
          <h1 className={`text-4xl font-black ${isDark ? "text-slate-100" : "text-slate-900"} animate-fade-in`}>
            Welcome to CodeArena, {user?.firstName}!
          </h1>
          <p className={`text-xl ${isDark ? "text-slate-400" : "text-slate-600"} animate-fade-in-delay`}>
            Ready to start your coding journey?
          </p>
        </div>
        <div className="flex justify-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
        </div>
      </div>
    </div>
  )
}

// Modal components
const CreateBookmarkListModal = ({ isOpen, onClose, onListCreated, isDark }) => {
  const [newListName, setNewListName] = useState("")
  const [creating, setCreating] = useState(false)

  const createNewList = async () => {
    if (!newListName.trim()) return

    setCreating(true)
    try {
      const response = await axiosClient.post("/bookmarks/createBookmarkList", {
        name: newListName.trim(),
        problemIds: [],
      })
      if (response.data) {
        onListCreated?.(response.data)
        setNewListName("")
        onClose()
      }
    } catch (error) {
      console.error("Error creating bookmark list:", error)
    } finally {
      setCreating(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        className={`${isDark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200"} rounded-2xl border shadow-2xl p-6 max-w-md w-full mx-4`}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-xl font-bold ${isDark ? "text-slate-100" : "text-slate-900"} flex items-center gap-2`}>
            <Plus className="h-5 w-5 text-blue-500" />
            Create New List
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg ${isDark ? "hover:bg-slate-800" : "hover:bg-slate-100"} transition-all duration-300`}
          >
            <X
              className={`h-4 w-4 ${isDark ? "text-slate-500 hover:text-slate-100" : "text-slate-500 hover:text-slate-900"}`}
            />
          </button>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Enter list name..."
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            className={`w-full px-4 py-2.5 rounded-xl ${isDark ? "bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-400 focus:border-blue-400" : "bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-500 focus:border-blue-500"} border focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-all duration-300`}
            onKeyPress={(e) => e.key === "Enter" && createNewList()}
          />
          <div className="flex gap-2">
            <button
              onClick={createNewList}
              disabled={!newListName.trim() || creating}
              className={`flex-1 bg-blue-600 text-white hover:bg-blue-700 py-2.5 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
            >
              {creating ? (
                <div
                  className={`w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin`}
                ></div>
              ) : (
                <Check className="h-4 w-4" />
              )}
              Create List
            </button>
            <button
              onClick={onClose}
              className={`px-4 py-2.5 rounded-xl border ${isDark ? "border-slate-700 text-slate-400 hover:bg-slate-800" : "border-slate-200 text-slate-600 hover:bg-slate-50"} transition-all duration-300`}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const DeleteListModal = ({ isOpen, onClose, list, onListDeleted, isDark }) => {
  const [deleting, setDeleting] = useState(false)

  const deleteList = async () => {
    if (!list?._id) return

    setDeleting(true)
    try {
      await axiosClient.delete(`/bookmarks/deleteList/${list._id}`)
      onListDeleted?.(list._id)
      onClose()
    } catch (error) {
      console.error("Error deleting bookmark list:", error)
    } finally {
      setDeleting(false)
    }
  }

  if (!isOpen || !list) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        className={`${isDark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200"} rounded-2xl border shadow-2xl p-6 max-w-md w-full mx-4`}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-xl font-bold ${isDark ? "text-slate-100" : "text-slate-900"} flex items-center gap-2`}>
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Delete List
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg ${isDark ? "hover:bg-slate-800" : "hover:bg-slate-100"} transition-all duration-300`}
          >
            <X
              className={`h-4 w-4 ${isDark ? "text-slate-500 hover:text-slate-100" : "text-slate-500 hover:text-slate-900"}`}
            />
          </button>
        </div>

        <div className="space-y-4">
          <p className={isDark ? "text-slate-400" : "text-slate-600"}>
            Are you sure you want to delete the list <strong>"{list.name}"</strong>? This action cannot be undone.
          </p>

          <div className="flex gap-2">
            <button
              onClick={deleteList}
              disabled={deleting}
              className="flex-1 bg-red-600 text-white py-2.5 rounded-xl font-semibold hover:bg-red-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {deleting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              Delete List
            </button>
            <button
              onClick={onClose}
              className={`px-4 py-2.5 rounded-xl border ${isDark ? "border-slate-700 text-slate-400 hover:bg-slate-800" : "border-slate-200 text-slate-600 hover:bg-slate-50"} transition-all duration-300`}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const ManageProblemsModal = ({ isOpen, onClose, list, onProblemsUpdated, isDark }) => {
  const [problems, setProblems] = useState([])
  const [loading, setLoading] = useState(false)
  const [removing, setRemoving] = useState(null)

  useEffect(() => {
    if (isOpen && list?.problemIds?.length > 0) {
      fetchProblems()
    } else if (isOpen) {
      setProblems([])
    }
  }, [isOpen, list])

  const fetchProblems = async () => {
    setLoading(true)
    try {
      const response = await axiosClient.post("/bookmarks/getBookmarkProblems", {
        problemIds: list.problemIds,
      })
      setProblems(response.data || [])
    } catch (error) {
      console.error("Error fetching problems:", error)
      setProblems([])
    } finally {
      setLoading(false)
    }
  }

  const removeProblem = async (problemId) => {
    setRemoving(problemId)
    try {
      await axiosClient.post("/bookmarks/removeProblemFromList", {
        listId: list._id,
        problemId: problemId,
      })
      setProblems(problems.filter((p) => p._id !== problemId))
      onProblemsUpdated?.()
    } catch (error) {
      console.error("Error removing problem from list:", error)
    } finally {
      setRemoving(null)
    }
  }

  const getDifficultyStyles = (difficulty) => {
    if (isDark) {
      switch (difficulty?.toLowerCase()) {
        case "easy":
          return "text-green-300 bg-green-900/50 border border-green-800/50"
        case "medium":
          return "text-yellow-300 bg-yellow-900/50 border border-yellow-800/50"
        case "hard":
          return "text-red-300 bg-red-900/50 border border-red-800/50"
        default:
          return "text-slate-300 bg-slate-900/50 border border-slate-800/50"
      }
    } else {
      switch (difficulty?.toLowerCase()) {
        case "easy":
          return "text-green-800 bg-green-100/50 border border-green-200"
        case "medium":
          return "text-yellow-800 bg-yellow-100/50 border border-yellow-200"
        case "hard":
          return "text-red-800 bg-red-100/50 border border-red-200"
        default:
          return "text-slate-800 bg-slate-100/50 border border-slate-200"
      }
    }
  }

  if (!isOpen || !list) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        className={`${isDark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200"} rounded-2xl border shadow-2xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto`}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-xl font-bold ${isDark ? "text-slate-100" : "text-slate-900"} flex items-center gap-2`}>
            <Bookmark className="h-5 w-5 text-blue-500" />
            Manage Problems - {list.name}
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg ${isDark ? "hover:bg-slate-800" : "hover:bg-slate-100"} transition-all duration-300`}
          >
            <X
              className={`h-4 w-4 ${isDark ? "text-slate-500 hover:text-slate-100" : "text-slate-500 hover:text-slate-900"}`}
            />
          </button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`h-16 ${isDark ? "bg-slate-700" : "bg-slate-200"} rounded-xl animate-pulse`}></div>
            ))}
          </div>
        ) : problems.length > 0 ? (
          <div className="space-y-3">
            {problems.map((problem) => (
              <div
                key={problem._id}
                className={`flex items-center justify-between p-4 ${isDark ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200"} rounded-xl border`}
              >
                <div className="flex-1">
                  <h3 className={`font-semibold ${isDark ? "text-slate-100" : "text-slate-900"} mb-2`}>{problem.title}</h3>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 rounded-md text-xs font-semibold ${getDifficultyStyles(problem.difficulty)}`}
                    >
                      {problem.difficulty}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-md text-xs font-semibold ${isDark ? "text-blue-300 bg-blue-900/50 border-blue-800/50" : "text-blue-800 bg-blue-100/50 border-blue-200"} border`}
                    >
                      {problem.tags}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <NavLink
                    to={`/problem/${problem._id}`}
                    className={`px-3 py-1 rounded-md ${isDark ? "bg-slate-100 text-slate-900 hover:bg-slate-200" : "bg-slate-900 text-white hover:bg-slate-800"} text-xs font-bold transition-colors duration-200`}
                  >
                    Solve
                  </NavLink>
                  <button
                    onClick={() => removeProblem(problem._id)}
                    disabled={removing === problem._id}
                    className={`p-2 rounded-lg ${isDark ? "bg-red-900/20 text-red-400 hover:bg-red-900/40" : "bg-red-50 text-red-600 hover:bg-red-100"} transition-all duration-300 disabled:opacity-50`}
                  >
                    {removing === problem._id ? (
                      <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Bookmark className="h-8 w-8 text-slate-400 mx-auto mb-2" />
            <p className={`${isDark ? "text-slate-400" : "text-slate-500"} text-sm`}>No problems in this list</p>
          </div>
        )}
      </div>
    </div>
  )
}

const ViewListProblemsModal = ({ isOpen, onClose, list, isDark }) => {
  const [problems, setProblems] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen && list?.problemIds?.length > 0) {
      fetchProblems()
    } else if (isOpen) {
      setProblems([])
    }
  }, [isOpen, list])

  const fetchProblems = async () => {
    setLoading(true)
    try {
      const response = await axiosClient.post("/bookmarks/getBookmarkProblems", {
        problemIds: list.problemIds,
      })
      setProblems(response.data || [])
    } catch (error) {
      console.error("Error fetching problems:", error)
      setProblems([])
    } finally {
      setLoading(false)
    }
  }

  const getDifficultyStyles = (difficulty) => {
    if (isDark) {
      switch (difficulty?.toLowerCase()) {
        case "easy":
          return "text-green-300 bg-green-900/50 border border-green-800/50"
        case "medium":
          return "text-yellow-300 bg-yellow-900/50 border border-yellow-800/50"
        case "hard":
          return "text-red-300 bg-red-900/50 border border-red-800/50"
        default:
          return "text-slate-300 bg-slate-900/50 border border-slate-800/50"
      }
    } else {
      switch (difficulty?.toLowerCase()) {
        case "easy":
          return "text-green-800 bg-green-100/50 border border-green-200"
        case "medium":
          return "text-yellow-800 bg-yellow-100/50 border border-yellow-200"
        case "hard":
          return "text-red-800 bg-red-100/50 border border-red-200"
        default:
          return "text-slate-800 bg-slate-100/50 border border-slate-200"
      }
    }
  }

  if (!isOpen || !list) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        className={`${isDark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200"} rounded-2xl border shadow-2xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto`}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-xl font-bold ${isDark ? "text-slate-100" : "text-slate-900"} flex items-center gap-2`}>
            <Bookmark className="h-5 w-5 text-blue-500" />
            {list.name} ({problems.length} problems)
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg ${isDark ? "hover:bg-slate-800" : "hover:bg-slate-100"} transition-all duration-300`}
          >
            <X
              className={`h-4 w-4 ${isDark ? "text-slate-500 hover:text-slate-100" : "text-slate-500 hover:text-slate-900"}`}
            />
          </button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`h-16 ${isDark ? "bg-slate-700" : "bg-slate-200"} rounded-xl animate-pulse`}></div>
            ))}
          </div>
        ) : problems.length > 0 ? (
          <div className="space-y-3">
            {problems.map((problem, index) => (
              <NavLink
                key={problem._id}
                to={`/problem/${problem._id}`}
                className={`block p-4 ${isDark ? "bg-slate-800 hover:bg-slate-700/50 border-slate-700" : "bg-slate-50 hover:bg-slate-100 border-slate-200"} rounded-xl border transition-all duration-200`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-lg ${isDark ? "bg-slate-900 border-slate-700 text-slate-100" : "bg-white border-slate-200 text-slate-900"} border flex items-center justify-center text-xs font-bold`}
                    >
                      {index + 1}
                    </span>
                    <div>
                      <h3 className={`font-semibold ${isDark ? "text-slate-100" : "text-slate-900"} mb-1`}>
                        {problem.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-1 rounded-md text-xs font-semibold ${getDifficultyStyles(problem.difficulty)}`}
                        >
                          {problem.difficulty}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-md text-xs font-semibold ${isDark ? "text-blue-300 bg-blue-900/50 border-blue-800/50" : "text-blue-800 bg-blue-100/50 border-blue-200"} border`}
                        >
                          {problem.tags}
                        </span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </div>
              </NavLink>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Bookmark className="h-8 w-8 text-slate-400 mx-auto mb-2" />
            <p className={`${isDark ? "text-slate-400" : "text-slate-500"} text-sm`}>No problems in this list</p>
          </div>
        )}
      </div>
    </div>
  )
}

const BookmarkModal = ({ isOpen, onClose, problem, onBookmarkAdded, isDark }) => {
  const [bookmarkLists, setBookmarkLists] = useState([])
  const [loading, setLoading] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newListName, setNewListName] = useState("")
  const [creating, setCreating] = useState(false)
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    if (isOpen) {
      fetchBookmarkLists()
    }
  }, [isOpen])

  const fetchBookmarkLists = async () => {
    setLoading(true)
    try {
      const response = await axiosClient.get("/bookmarks/getUserBookmarks")
      setBookmarkLists(response.data || [])
    } catch (error) {
      console.error("Error fetching bookmark lists:", error)
      setBookmarkLists([])
    } finally {
      setLoading(false)
    }
  }

  const createNewList = async () => {
    if (!newListName.trim()) return

    setCreating(true)
    try {
      const response = await axiosClient.post("/bookmarks/createBookmarkList", {
        name: newListName.trim(),
        problemIds: [problem._id],
      })
      if (response.data) {
        setBookmarkLists([...bookmarkLists, response.data])
        setNewListName("")
        setShowCreateForm(false)
        onBookmarkAdded?.()
        onClose()
      }
    } catch (error) {
      console.error("Error creating bookmark list:", error)
    } finally {
      setCreating(false)
    }
  }

  const addToExistingList = async (listId) => {
    setAdding(true)
    try {
      await axiosClient.post("/bookmarks/addProblemToList", {
        listId,
        problemId: problem._id,
      })
      onBookmarkAdded?.()
      onClose()
    } catch (error) {
      console.error("Error adding problem to list:", error)
    } finally {
      setAdding(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        className={`${isDark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200"} rounded-2xl border shadow-2xl p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto`}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-xl font-bold ${isDark ? "text-slate-100" : "text-slate-900"} flex items-center gap-2`}>
            <Bookmark className="h-5 w-5 text-blue-500" />
            Add to Bookmark
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg ${isDark ? "hover:bg-slate-800" : "hover:bg-slate-100"} transition-all duration-300`}
          >
            <X
              className={`h-4 w-4 ${isDark ? "text-slate-500 hover:text-slate-100" : "text-slate-500 hover:text-slate-900"}`}
            />
          </button>
        </div>

        <div
          className={`mb-4 p-3 ${isDark ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200"} rounded-xl border`}
        >
          <h3 className={`font-semibold ${isDark ? "text-slate-100" : "text-slate-900"} text-sm mb-1`}>{problem?.title}</h3>
          <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            {problem?.difficulty} • {problem?.tags}
          </p>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`h-12 ${isDark ? "bg-slate-700" : "bg-slate-200"} rounded-xl animate-pulse`}></div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <h3 className={`text-sm font-semibold ${isDark ? "text-slate-100" : "text-slate-900"} mb-3`}>Select a list:</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {bookmarkLists.length > 0 ? (
                  bookmarkLists.map((list) => (
                    <button
                      key={list._id}
                      onClick={() => addToExistingList(list._id)}
                      disabled={adding}
                      className={`w-full flex items-center justify-between p-3 ${isDark ? "bg-slate-800 hover:bg-slate-700/50 border-slate-700" : "bg-slate-50 hover:bg-slate-100 border-slate-200"} rounded-xl border transition-all duration-200 disabled:opacity-50`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg ${isDark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200"} border flex items-center justify-center`}
                        >
                          <Bookmark className="h-4 w-4 text-blue-500" />
                        </div>
                        <div className="text-left">
                          <h4 className={`font-semibold ${isDark ? "text-slate-100" : "text-slate-900"} text-sm`}>
                            {list.name}
                          </h4>
                          <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                            {list.problemIds?.length || 0} problems
                          </p>
                        </div>
                      </div>
                      {adding ? (
                        <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Plus className="h-4 w-4 text-slate-400" />
                      )}
                    </button>
                  ))
                ) : (
                  <p className={`text-center ${isDark ? "text-slate-400" : "text-slate-500"} text-sm py-4`}>
                    No bookmark lists yet
                  </p>
                )}
              </div>
            </div>

            <div className={`border-t ${isDark ? "border-slate-700" : "border-slate-200"} pt-4`}>
              {!showCreateForm ? (
                <button
                  onClick={() => setShowCreateForm(true)}
                  className={`w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed ${isDark ? "border-slate-600 hover:border-blue-400 hover:bg-slate-800 text-slate-400 hover:text-blue-400" : "border-slate-300 hover:border-blue-500 hover:bg-slate-50 text-slate-600 hover:text-blue-600"} rounded-xl transition-all duration-200`}
                >
                  <Plus className="h-4 w-4" />
                  <span className="font-medium">Create New List</span>
                </button>
              ) : (
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Enter list name..."
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl ${isDark ? "bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-400 focus:border-blue-400" : "bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-500 focus:border-blue-500"} border focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-all duration-300`}
                    onKeyPress={(e) => e.key === "Enter" && createNewList()}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={createNewList}
                      disabled={!newListName.trim() || creating}
                      className={`flex-1 bg-blue-600 text-white hover:bg-blue-700 py-2.5 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
                    >
                      {creating ? (
                        <div
                          className={`w-4 h-4 border-2 ${isDark ? "border-slate-900" : "border-white"} border-t-transparent rounded-full animate-spin`}
                        ></div>
                      ) : (
                        <Check className="h-4 w-4" />
                      )}
                      Create & Add
                    </button>
                    <button
                      onClick={() => {
                        setShowCreateForm(false)
                        setNewListName("")
                      }}
                      className={`px-4 py-2.5 rounded-xl border ${isDark ? "border-slate-700 text-slate-400 hover:bg-slate-800" : "border-slate-200 text-slate-600 hover:bg-slate-50"} transition-all duration-300`}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Topic Filter Icons
const AllTopicsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
    <path d="M1 3.5A1.5 1.5 0 0 1 2.5 2h11A1.5 1.5 0 0 1 15 3.5v1.944a2 2 0 0 1-2 1.944H3a2 2 0 0 1-2-1.944V3.5zM2.5 3a.5.5 0 0 0-.5.5v1.944a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V3.5a.5.5 0 0 0-.5-.5h-11z" />
    <path d="M14 8a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h12zM2 9v3h12V9H2z" />
  </svg>
)

const ArrayIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ color: "#FFB800" }}
  >
    <path d="M14.5 17.5L19 22l-5-5m-5-5L5 8l4.5 4.5M8 22l14-14" />
  </svg>
)

const LinkedListIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ color: "#4A90E2" }}
  >
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72" />
  </svg>
)

const GraphIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ color: "#00C853" }}
  >
    <path d="M18 8a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2Z" />
    <path d="M12 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h4" />
    <path d="M12 10V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4" />
  </svg>
)

const DPIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ color: "#9063F2" }}
  >
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
)

const TopicFilters = ({ activeFilter, onFilterChange, isDark }) => {
  const topics = [
    { name: "All Topics", value: "all", icon: <AllTopicsIcon /> },
    { name: "Array", value: "array", icon: <ArrayIcon /> },
    { name: "Linked List", value: "linkedList", icon: <LinkedListIcon /> },
    { name: "Graph", value: "graph", icon: <GraphIcon /> },
    { name: "DP", value: "dp", icon: <DPIcon /> },
  ]

  return (
    <div className="relative mb-6">
      <div className="flex space-x-2 overflow-x-auto pb-3 scrollbar-hide">
        {topics.map((topic) => {
          const isActive = activeFilter === topic.value
          return (
            <button
              key={topic.value}
              onClick={() => onFilterChange(topic.value)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105 ${
                isActive
                  ? isDark
                    ? "bg-slate-100 text-slate-900 shadow-md"
                    : "bg-slate-900 text-white shadow-md"
                  : isDark
                    ? "bg-slate-900 text-slate-100 hover:bg-slate-800 border border-slate-700"
                    : "bg-white text-slate-900 hover:bg-slate-50 border border-slate-200"
              }`}
            >
              {topic.icon}
              <span>{topic.name}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

const ProblemCard = ({ problem, isSolved, index, onBookmarkClick, isDark }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const getDifficultyStyles = (difficulty) => {
    if (isDark) {
      switch (difficulty?.toLowerCase()) {
        case "easy":
          return "text-green-300 bg-green-900/50 border border-green-800/50"
        case "medium":
          return "text-yellow-300 bg-yellow-900/50 border border-yellow-800/50"
        case "hard":
          return "text-red-300 bg-red-900/50 border border-red-800/50"
        default:
          return "text-slate-300 bg-slate-900/50 border border-slate-800/50"
      }
    } else {
      switch (difficulty?.toLowerCase()) {
        case "easy":
          return "text-green-800 bg-green-100/50 border border-green-200"
        case "medium":
          return "text-yellow-800 bg-yellow-100/50 border border-yellow-200"
        case "hard":
          return "text-red-800 bg-red-100/50 border border-red-200"
        default:
          return "text-slate-800 bg-slate-100/50 border border-slate-200"
      }
    }
  }

  useEffect(() => {
    const animationDelayIndex = index % 10
    const timer = setTimeout(() => setIsMounted(true), 50 * animationDelayIndex)
    return () => clearTimeout(timer)
  }, [index])

  const problemDescription =
    problem.description ||
    `This is a ${problem.difficulty} level problem focusing on ${problem.tags}. Click to view the full problem statement and start solving!`

  return (
    <div
      className={`group w-full transition-all duration-300 ease-out hover:-translate-y-1 ${
        isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
      onMouseEnter={() => {
        setIsHovered(true)
        setTimeout(() => setShowPreview(true), 300)
      }}
      onMouseLeave={() => {
        setIsHovered(false)
        setShowPreview(false)
      }}
    >
      <div
        className={`relative p-4 rounded-xl ${isDark ? "bg-slate-900 border-slate-800 group-hover:bg-slate-800/50 hover:border-blue-800" : "bg-white border-slate-200 group-hover:bg-slate-50 hover:border-blue-500"} backdrop-blur-sm border shadow-sm hover:shadow-lg transition-all duration-300`}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-4 flex-1">
            <span
              className={`flex-shrink-0 w-8 h-8 rounded-lg ${isDark ? "bg-slate-800 border-slate-700 text-slate-300" : "bg-slate-100 border-slate-200 text-slate-600"} border flex items-center justify-center text-sm font-bold shadow-sm`}
            >
              {index + 1}
            </span>
            <div className="flex flex-col gap-2 flex-1">
              <NavLink to={`/problem/${problem._id}`} className="focus:outline-none group">
                <h2
                  className={`text-base font-semibold ${isDark ? "text-slate-100 group-hover:text-blue-400" : "text-slate-800 group-hover:text-blue-600"} transition-colors duration-200`}
                >
                  {problem.title}
                </h2>
              </NavLink>
              <div className="flex flex-wrap items-center gap-2">
                <div
                  className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ${getDifficultyStyles(problem.difficulty)}`}
                >
                  {problem.difficulty}
                </div>
                <div
                  className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ${isDark ? "text-blue-300 bg-blue-900/50 border-blue-800/50" : "text-blue-800 bg-blue-100/50 border-blue-200"} border`}
                >
                  {problem.tags}
                </div>
                
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onBookmarkClick(problem)
              }}
              className={`p-2 rounded-lg ${isDark ? "bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-blue-400" : "bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-blue-600"} transition-all duration-300 group/bookmark`}
              title="Add to bookmark"
            >
              <Bookmark className="w-4 h-4" />
            </button>

            {isSolved && (
              <div
                className={`flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full ${isDark ? "bg-slate-800" : "bg-white"} border-2 border-green-500 relative shadow-md`}
              >
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div className="absolute inset-0 rounded-full bg-green-400/20 animate-ping"></div>
              </div>
            )}
          </div>
        </div>

        {showPreview && isHovered && (
          <div
            className={`mt-4 p-4 rounded-lg ${isDark ? "bg-slate-800/50 border-slate-700/50" : "bg-slate-50/50 border-slate-200/50"} border animate-fade-in`}
          >
            <h4 className={`font-semibold ${isDark ? "text-slate-200" : "text-slate-700"} mb-2 text-sm`}>Quick Preview</h4>
            <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"} line-clamp-3 leading-relaxed`}>
              {problemDescription}
            </p>
            <div className="flex items-center justify-between mt-3">
              <div className={`flex items-center gap-4 text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                <span>Acceptance Rate: {Math.floor(Math.random() * 80) + 20}%</span>
                <span>Submissions: {Math.floor(Math.random() * 5000) + 1000}</span>
              </div>
              <NavLink
                to={`/problem/${problem._id}`}
                className={`px-3 py-1.5 rounded-md ${isDark ? "bg-slate-100 text-slate-900 hover:bg-slate-200" : "bg-slate-900 text-white hover:bg-slate-800"} text-xs font-bold transition-colors duration-200`}
              >
                Solve Now
              </NavLink>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Small Problem of the Day Card for Left Sidebar
const ProblemOfTheDay = ({ problem, loading = false, isDark }) => {
  if (loading) {
    return (
      <div
        className={`${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"} rounded-xl border shadow-lg p-4`}
      >
        <div className="animate-pulse">
          <div className={`h-4 ${isDark ? "bg-slate-700" : "bg-slate-300"} rounded w-32 mb-3`}></div>
          <div className={`h-12 ${isDark ? "bg-slate-700" : "bg-slate-300"} rounded`}></div>
        </div>
      </div>
    )
  }

  if (!problem) {
    return (
      <div
        className={`${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"} rounded-xl border shadow-lg p-4 group hover:-translate-y-1 transition-all duration-300`}
      >
        <h3 className={`text-sm font-bold ${isDark ? "text-slate-100" : "text-slate-900"} mb-3 flex items-center gap-2`}>
          <Star className="h-4 w-4 text-yellow-500" />
          Problem of the Day
        </h3>
        <p className={`${isDark ? "text-slate-400" : "text-slate-500"} text-xs`}>No problem available today</p>
      </div>
    )
  }

  const getDifficultyColor = (difficulty) => {
    if (isDark) {
      switch (difficulty?.toLowerCase()) {
        case "easy":
          return "text-green-400 bg-green-900/50 border-green-800/50"
        case "medium":
          return "text-yellow-400 bg-yellow-900/50 border-yellow-800/50"
        case "hard":
          return "text-red-400 bg-red-900/50 border-red-800/50"
        default:
          return "text-slate-400 bg-slate-900/50 border-slate-800/50"
      }
    } else {
      switch (difficulty?.toLowerCase()) {
        case "easy":
          return "text-green-600 bg-green-100/50 border-green-200"
        case "medium":
          return "text-yellow-600 bg-yellow-100/50 border-yellow-200"
        case "hard":
          return "text-red-600 bg-red-100/50 border-red-200"
        default:
          return "text-slate-600 bg-slate-100/50 border-slate-200"
      }
    }
  }

  return (
    <div
      className={`${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"} rounded-xl w-full border shadow-lg hover:shadow-xl transition-all duration-300 p-4 group hover:-translate-y-1`}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className={`text-sm font-bold ${isDark ? "text-slate-100" : "text-slate-900"} flex items-center gap-2`}>
          <Star className="h-4 w-4 text-yellow-500" />
          Daily Challenge
        </h3>
        <div className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"} font-medium`}>
          {new Date().toLocaleDateString("en", { month: "short", day: "numeric" })}
        </div>
      </div>

      <div className="space-y-3">
        <div
          className={`p-3 rounded-lg bg-gradient-to-r ${isDark ? "from-slate-800/50 to-slate-800/20 border-slate-700" : "from-slate-50/50 to-slate-50/20 border-slate-200"} border`}
        >
          <h4 className={`font-semibold ${isDark ? "text-slate-100" : "text-slate-900"} text-sm mb-2 leading-tight`}>
            {problem.title}
          </h4>

          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-1 rounded text-xs font-semibold border ${getDifficultyColor(problem.difficulty)}`}>
              {problem.difficulty}
            </span>
            <span
              className={`px-2 py-1 rounded text-xs font-semibold ${isDark ? "text-blue-400 bg-blue-900/50 border-blue-800/50" : "text-blue-600 bg-blue-100/50 border-blue-200"} border`}
            >
              {problem.tags}
            </span>
          </div>

          
        </div>

        <NavLink
          to={`/problem/${problem._id}`}
          className={`block w-full text-center bg-gradient-to-r ${isDark ? "from-slate-100 to-slate-200 text-slate-900 hover:from-slate-200 hover:to-slate-300" : "from-slate-900 to-slate-800 text-white hover:from-slate-800 hover:to-slate-700"} py-2 rounded-lg font-bold transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-[1.02] text-sm`}
        >
          Solve Today's Challenge
        </NavLink>
      </div>
    </div>
  )
}

const StreakCalendar = ({ userStreak, loading = false, isDark }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const toLocalDateString = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };


  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    return { daysInMonth, startingDayOfWeek }
  }

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth)
  const solvedDates = userStreak?.solvedDates || []
  const solvedDateStrings = solvedDates.map(date => toLocalDateString(date));

  const isDateSolved = (day) => {
    const calendarDayDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    
    const dateString = toLocalDateString(calendarDayDate);
    return solvedDateStrings.includes(dateString);
  };

  const navigateMonth = (direction) => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() + direction)
      return newDate
    })
  }

  

  if (loading) {
    return (
      <div
        className={`${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"} rounded-xl border shadow-lg p-6`}
      >
        <div className="animate-pulse">
          <div className={`h-5 ${isDark ? "bg-slate-700" : "bg-slate-300"} rounded w-32 mb-4`}></div>
          <div className={`h-32 ${isDark ? "bg-slate-700" : "bg-slate-300"} rounded`}></div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"} rounded-xl w-full border shadow-lg hover:shadow-xl transition-all duration-300 p-6 group hover:-translate-y-1`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-bold ${isDark ? "text-slate-100" : "text-slate-900"} flex items-center gap-2`}>
          <Calendar className="h-5 w-5 text-green-500" />
          Streak Calendar
        </h3>
        <div className="flex items-center gap-1">
          <button
            onClick={() => navigateMonth(-1)}
            className={` rounded-lg ${isDark ? "hover:bg-slate-800" : "hover:bg-slate-100"} transition-all duration-300`}
          >
            <ChevronLeft
              className={`h-4 w-4 ${isDark ? "text-slate-500 hover:text-slate-100" : "text-slate-500 hover:text-slate-900"}`}
            />
          </button>
          <span className={`text-sm font-semibold ${isDark ? "text-slate-100" : "text-slate-900"} min-w-[120px] text-center`}>
            {currentMonth.toLocaleDateString("en", { month: "long", year: "numeric" })}
          </span>
          <button
            onClick={() => navigateMonth(1)}
            className={` rounded-lg ${isDark ? "hover:bg-slate-800" : "hover:bg-slate-100"} transition-all duration-300`}
          >
            <ChevronRight
              className={`h-4 w-4 ${isDark ? "text-slate-500 hover:text-slate-100" : "text-slate-500 hover:text-slate-900"}`}
            />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
          <div
            key={index}
            className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"} text-center p-1 font-bold`}
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: startingDayOfWeek }).map((_, index) => (
          <div key={`empty-${index}`} className="w-8 h-8"></div>
        ))}

        {Array.from({ length: daysInMonth }).map((_, index) => {
          const isTodays = (day) => {
            const todayString = toLocalDateString(new Date());
            const dayString = toLocalDateString(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day));
            return todayString === dayString;
          }
          const day = index + 1
          const isSolved = isDateSolved(day)
          const isToday =isTodays(day);
          return (
            <div
              key={day}
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all duration-200 hover:scale-110 cursor-pointer ${
                isToday ? (isDark ? "ring-2 ring-slate-100" : "ring-2 ring-slate-900") : ""
              } ${isSolved ? "bg-green-500 text-white shadow-md" : isDark ? "bg-slate-800 text-slate-400 hover:bg-slate-700" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
              title={`${day} ${currentMonth.toLocaleDateString("en", { month: "long" })}: ${isSolved ? "Active" : "Inactive"}`}
            >
              {day}
            </div>
          )
        })}
      </div>

      <div
        className={`flex items-center justify-between mt-4 pt-4 border-t ${isDark ? "border-slate-700" : "border-slate-200"}`}
      >
        <div className="flex items-center gap-2 text-sm">
          <Flame className="h-4 w-4 text-red-500" />
          <span className={isDark ? "text-slate-400" : "text-slate-500"}>Current:</span>
          <span className={`font-bold ${isDark ? "text-slate-100" : "text-slate-900"}`}>
            {userStreak?.currentStreak || 0}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Trophy className="h-4 w-4 text-yellow-500" />
          <span className={isDark ? "text-slate-400" : "text-slate-500"}>Best:</span>
          <span className={`font-bold ${isDark ? "text-slate-100" : "text-slate-900"}`}>
            {userStreak?.maxStreak || 0}
          </span>
        </div>
      </div>
    </div>
  )
}

const BookmarkLists = ({
  bookmarks,
  loading = false,
  onBookmarkSelect,
  selectedBookmark,
  onBookmarksUpdated,
  isDark,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showManageModal, setShowManageModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedList, setSelectedList] = useState(null)
  const [activeDropdown, setActiveDropdown] = useState(null)

  const handleCreateList = (newList) => {
    onBookmarksUpdated?.()
  }

  const handleDeleteList = async (listId) => {
    try {
      await axiosClient.delete(`/bookmarks/deleteList/${listId}`)
      onBookmarksUpdated?.()
      if (selectedBookmark?._id === listId) {
        onBookmarkSelect(null)
      }
      setShowDeleteModal(false)
    } catch (error) {
      console.error("Failed to delete bookmark list:", error)
    }
  }

  const handleManageProblems = () => {
    onBookmarksUpdated?.()
  }

  const handleListClick = (bookmark, e) => {
    e.stopPropagation()
    setSelectedList(bookmark)
    setShowViewModal(true)
  }

  const handleCheckboxChange = (bookmark, e) => {
    e.stopPropagation()
    if (selectedBookmark?._id === bookmark._id) {
      onBookmarkSelect(null)
    } else {
      onBookmarkSelect(bookmark)
    }
  }

  const handleDropdownToggle = (listId, e) => {
    e.stopPropagation()
    setActiveDropdown(activeDropdown === listId ? null : listId)
  }

  const handleManageClick = (bookmark, e) => {
    e.stopPropagation()
    setSelectedList(bookmark)
    setShowManageModal(true)
    setActiveDropdown(null)
  }

  const handleDeleteClick = (bookmark, e) => {
    e.stopPropagation()
    setSelectedList(bookmark)
    setShowDeleteModal(true)
    setActiveDropdown(null)
  }

  useEffect(() => {
    const handleClickOutside = () => {
      setActiveDropdown(null)
    }
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  if (loading) {
    return (
      <div
        className={`${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"} rounded-xl border shadow-lg p-6`}
      >
        <div className="animate-pulse">
          <div className={`h-5 ${isDark ? "bg-slate-700" : "bg-slate-300"} rounded w-32 mb-4`}></div>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`h-12 ${isDark ? "bg-slate-700" : "bg-slate-300"} rounded`}></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div
        className={`${isDark ? "bg-slate-900 w-full border-slate-800" : "bg-white border-slate-200"} rounded-xl border shadow-lg hover:shadow-xl transition-all duration-300 p-6 group hover:-translate-y-1`}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-bold ${isDark ? "text-slate-100" : "text-slate-900"} flex items-center gap-2`}>
            <Bookmark className="h-5 w-5 text-blue-500" />
            My Bookmarks
          </h3>
          <button
            onClick={() => setShowCreateModal(true)}
            className={`p-2 rounded-lg ${isDark ? "bg-slate-800 text-slate-300 hover:bg-slate-700" : "bg-slate-100 text-slate-600 hover:bg-slate-200"} transition-all duration-300`}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-2">
          {bookmarks?.length > 0 ? (
            bookmarks.map((bookmark, index) => (
              <div
                key={index}
                className={`relative flex items-center justify-between p-2 rounded-lg border transition-all duration-200 cursor-pointer group/item ${
                  selectedBookmark?._id === bookmark._id
                    ? isDark
                      ? "bg-blue-900/20 border-blue-700"
                      : "bg-blue-50 border-blue-300"
                    : isDark
                      ? "bg-slate-800/50 border-slate-800 hover:bg-slate-700/50 hover:border-slate-700"
                      : "bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300"
                }`}
              >
                <div
                  className="flex items-center gap-3 flex-1"
                  onClick={(e) => {
                    if (e.target.type !== "checkbox" && !e.target.closest('input[type="checkbox"]')) {
                      handleListClick(bookmark, e)
                    }
                  }}
                >
                  <div className="pl-1">
                      <input
                        type="checkbox"
                        checked={selectedBookmark?._id === bookmark._id}
                        onChange={(e) => handleCheckboxChange(bookmark, e)}
                        className={`w-4 h-4 rounded text-blue-600 focus:ring-blue-500 ${isDark ? 'bg-slate-700 border-slate-600 focus:ring-offset-slate-900' : 'bg-slate-100 border-slate-300 focus:ring-offset-white'}`}
                      />
                  </div>
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center ${isDark ? "bg-slate-900 border border-slate-700" : "bg-white border border-slate-200"}`}
                  >
                    <Bookmark className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <h4 className={`font-semibold text-sm ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>{bookmark.name}</h4>
                    <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                      {bookmark.problemIds?.length || 0} problems
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <button
                    onClick={(e) => handleDropdownToggle(bookmark._id, e)}
                    className={`p-2 rounded-full transition-all duration-300 ${ isDark ? 'text-slate-400 hover:bg-slate-700' : 'text-slate-500 hover:bg-slate-200'}`}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>

                  {activeDropdown === bookmark._id && (
                    <div
                      className={`absolute right-0 top-full mt-1 w-48 ${isDark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200"} border rounded-lg shadow-xl z-50`}
                    >
                      <button
                        onClick={(e) => handleManageClick(bookmark, e)}
                        className={`w-full flex items-center gap-2 px-3 py-2 text-left text-sm ${isDark ? "text-slate-100 hover:bg-slate-800" : "text-slate-900 hover:bg-slate-100"} rounded-t-lg transition-colors duration-200`}
                      >
                         <Shield className="h-4 w-4 text-orange-500" />
                        Manage Problems
                      </button>
                      <button
                        onClick={(e) => handleDeleteClick(bookmark, e)}
                        className={`w-full flex items-center gap-2 px-3 py-2 text-left text-sm ${isDark ? "text-red-400 hover:bg-red-900/20" : "text-red-600 hover:bg-red-50"} rounded-b-lg transition-colors duration-200`}
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete List
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <Bookmark className="h-8 w-8 text-slate-400 mx-auto mb-2" />
              <p className={`${isDark ? "text-slate-400" : "text-slate-500"} text-sm`}>No bookmarks yet</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className={`mt-2 text-blue-500 text-sm font-semibold hover:underline`}
              >
                Create your first list
              </button>
            </div>
          )}
        </div>
      </div>

      <CreateBookmarkListModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onListCreated={handleCreateList}
        isDark={isDark}
      />

      <DeleteListModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        list={selectedList}
        onListDeleted={handleDeleteList}
        isDark={isDark}
      />

      <ManageProblemsModal
        isOpen={showManageModal}
        onClose={() => setShowManageModal(false)}
        list={selectedList}
        onProblemsUpdated={handleManageProblems}
        isDark={isDark}
      />

      <ViewListProblemsModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        list={selectedList}
        isDark={isDark}
      />
    </>
  )
}

const TagChips = ({ problems, onTagSelect, selectedTag, isDark }) => {
  const tagCounts = useMemo(() => {
    const counts = {}
    problems?.problemNeeded?.forEach((problem) => {
      const tag = problem.tags
      if (tag) {
        counts[tag] = (counts[tag] || 0) + 1
      }
    })
    return Object.entries(counts).sort((a, b) => b[1] - a[1])
  }, [problems])

  return (
    <div
      className={`${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"} rounded-xl border shadow-lg hover:shadow-xl transition-all duration-300 p-6 group hover:-translate-y-1`}
    >
      <h3 className={`text-lg font-bold ${isDark ? "text-slate-100" : "text-slate-900"} mb-4 flex items-center gap-2`}>
        <Target className="h-5 w-5 text-purple-500" />
        Problem Tags
      </h3>

      <div className="flex flex-wrap gap-2">
        {tagCounts.map(([tag, count]) => (
          <button
            key={tag}
            onClick={() => onTagSelect(tag === selectedTag ? null : tag)}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 ${
              selectedTag === tag
                ? isDark
                  ? "bg-slate-100 text-slate-900 shadow-md"
                  : "bg-slate-900 text-white shadow-md"
                : isDark
                  ? "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
            }`}
          >
            <span>{tag}</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-xs ${
                selectedTag === tag
                  ? isDark
                    ? "bg-slate-900 text-slate-100"
                    : "bg-white text-slate-900"
                  : isDark
                    ? "bg-slate-700 text-slate-400"
                    : "bg-slate-200 text-slate-600"
              }`}
            >
              {count}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

const StreakModal = ({ isOpen, onClose, userStreak, loading, isDark }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        className={`${isDark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200"} rounded-2xl border shadow-2xl p-8 max-w-md w-full mx-4`}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-2xl font-bold ${isDark ? "text-slate-100" : "text-slate-900"} flex items-center gap-2`}>
            <Flame className="h-6 w-6 text-red-500" />
            Your Streak
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg ${isDark ? "hover:bg-slate-800" : "hover:bg-slate-100"} transition-all duration-300`}
          >
            <X
              className={`h-5 w-5 ${isDark ? "text-slate-500 hover:text-slate-100" : "text-slate-500 hover:text-slate-900"}`}
            />
          </button>
        </div>

        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className={`h-16 ${isDark ? "bg-slate-700" : "bg-slate-200"} rounded-xl`}></div>
            <div className={`h-16 ${isDark ? "bg-slate-700" : "bg-slate-200"} rounded-xl`}></div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div
                className={`${isDark ? "bg-slate-800/50 border-red-800" : "bg-white border-red-200"} border rounded-xl p-4`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Flame className="h-5 w-5 text-red-500" />
                  <span className={`text-sm font-semibold ${isDark ? "text-red-300" : "text-red-700"}`}>Current</span>
                </div>
                <div className={`text-3xl font-bold ${isDark ? "text-red-200" : "text-red-800"}`}>
                  {userStreak?.currentStreak || 0}
                </div>
                <div className={`text-xs ${isDark ? "text-red-400" : "text-red-600"}`}>days</div>
              </div>

              <div
                className={`${isDark ? "bg-slate-800/50 border-yellow-800" : "bg-white border-yellow-200"} border rounded-xl p-4`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  <span className={`text-sm font-semibold ${isDark ? "text-yellow-300" : "text-yellow-700"}`}>Best</span>
                </div>
                <div className={`text-3xl font-bold ${isDark ? "text-yellow-200" : "text-yellow-800"}`}>
                  {userStreak?.maxStreak || 0}
                </div>
                <div className={`text-xs ${isDark ? "text-yellow-400" : "text-yellow-600"}`}>days</div>
              </div>
            </div>

            <div
              className={`${isDark ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200"} rounded-xl p-4 border`}
            >
              <h3 className={`font-semibold ${isDark ? "text-slate-100" : "text-slate-900"} mb-2`}>Keep it up!</h3>
              <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                Solve at least one problem daily to maintain your streak. Consistency is key to improving your coding
                skills!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function Homepage() {
  const dispatch = useDispatch()
  const { user, userImage } = useSelector((state) => state.auth)
  const problems = useSelector((state) => state.auth.problemsBySlice)
  const [solvedProblems, setSolvedProblems] = useState([])
  const [userStreak, setUserStreak] = useState(null)
  const [problemOfTheDay, setProblemOfTheDay] = useState(null)
  const [bookmarks, setBookmarks] = useState([])
  const [filters, setFilters] = useState({ difficulty: "all", tag: "all", status: "all" })
  const [searchTerm, setSearchTerm] = useState("")
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [selectedBookmark, setSelectedBookmark] = useState(null)
  const [selectedTag, setSelectedTag] = useState(null)
  const [bookmarkProblems, setBookmarkProblems] = useState([])
  const [showWelcome, setShowWelcome] = useState(false)
  const [isFirstLogin, setIsFirstLogin] = useState(false)
  const [showStreakModal, setShowStreakModal] = useState(false)
  const [showBookmarkModal, setShowBookmarkModal] = useState(false)
  const [selectedProblemForBookmark, setSelectedProblemForBookmark] = useState(null)
  const menuRef = useRef(null)

  // --- PAGINATION STATE ---
  const [currentPage, setCurrentPage] = useState(1)
  const problemsPerPage = 10

  useEffect(() => {
    dispatch(getUserImage())
    dispatch(allProblemsFetch())
  }, [dispatch])

  useEffect(() => {
    const fetchSolvedProblems = async () => {
      if (!user) return
      try {
        const { data } = await axiosClient.get("/problem/problemSolvedByUser")
        setSolvedProblems(data)
      } catch (error) {
        console.error("Error fetching solved problems:", error)
      }
    }
    fetchSolvedProblems()
  }, [user])

  useEffect(() => {
    if (user) {
      const hasSeenWelcome = localStorage.getItem(`welcome_seen_${user._id}`)
      const isNewLogin = sessionStorage.getItem(`new_login_${user._id}`)
      if (!hasSeenWelcome && isNewLogin) {
        setIsFirstLogin(true)
        setShowWelcome(true)
        sessionStorage.removeItem(`new_login_${user._id}`)
      }
    }
  }, [user])

  const handleWelcomeComplete = () => {
    setShowWelcome(false)
    if (user) {
      localStorage.setItem(`welcome_seen_${user._id}`, "true")
    }
  }

  const handleBookmarkClick = (problem) => {
    setSelectedProblemForBookmark(problem)
    setShowBookmarkModal(true)
  }

  const handleBookmarkAdded = () => {
    fetchBookmarks()
  }

  const fetchBookmarks = async () => {
    try {
      const bookmarksRes = await axiosClient.get("/bookmarks/getUserBookmarks")
      setBookmarks(bookmarksRes.data)
    } catch (error) {
      console.error("Error fetching bookmarks:", error)
      setBookmarks([])
    }
  }
  
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        setLoading(false)
        return
      }
      setLoading(true)
      try {
        const [solvedRes, streakRes, POTD] = await Promise.all([
          axiosClient.get("/problem/problemSolvedByUser"),
          axiosClient.get("/activity/useractivity"),
          axiosClient.get("/problem/problemOfTheDay"),
        ])
        setSolvedProblems(solvedRes.data)

        setUserStreak(streakRes.data)
        setProblemOfTheDay(POTD.data)

        await fetchBookmarks()
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchUserData()
  }, [user])

  useEffect(() => {
    const fetchBookmarkProblems = async () => {
      if (!selectedBookmark?.problemIds?.length) {
        setBookmarkProblems([])
        return
      }
      try {
        const response = await axiosClient.post("/bookmarks/getBookmarkProblems", {
          problemIds: selectedBookmark.problemIds,
        })
        setBookmarkProblems(response.data)
      } catch (error) {
        console.error("Error fetching bookmark problems:", error)
        setBookmarkProblems([])
      }
    }
    fetchBookmarkProblems()
  }, [selectedBookmark])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    setCurrentPage(1)
  }, [filters, searchTerm, selectedTag, selectedBookmark])

  const solvedProblemIds = useMemo(() => new Set(solvedProblems.map((p) => p._id)), [solvedProblems])

  const displayProblems = useMemo(() => {
    if (selectedBookmark) {
      return bookmarkProblems
    }
    return problems || []
  }, [selectedBookmark, bookmarkProblems, problems])

  const filteredProblems = useMemo(() => {
    const sourceArray = selectedBookmark ? displayProblems : displayProblems?.problemNeeded
    if (!Array.isArray(sourceArray)) {
      return []
    }
    return sourceArray.filter((problem) => {
      const searchMatch = problem.title.toLowerCase().includes(searchTerm.toLowerCase())
      const difficultyMatch = filters.difficulty === "all" || problem.difficulty === filters.difficulty
      const tagMatch = filters.tag === "all" || problem.tags === filters.tag
      const selectedTagMatch = !selectedTag || problem.tags === selectedTag
      const isSolved = solvedProblemIds.has(problem._id)
      const statusMatch =
        filters.status === "all" ||
        (filters.status === "solved" && isSolved) ||
        (filters.status === "unsolved" && !isSolved)
      return searchMatch && difficultyMatch && tagMatch && selectedTagMatch && statusMatch
    })
  }, [displayProblems, selectedBookmark, searchTerm, filters, selectedTag, solvedProblemIds])

  const totalPages = Math.ceil(filteredProblems.length / problemsPerPage)

  const paginatedProblems = useMemo(() => {
    const startIndex = (currentPage - 1) * problemsPerPage
    const endIndex = startIndex + problemsPerPage
    return filteredProblems.slice(startIndex, endIndex)
  }, [filteredProblems, currentPage, problemsPerPage])

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  }

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }

  const progress = problems?.problemNeeded?.length > 0 ? (solvedProblemIds.size / problems.problemNeeded.length) * 100 : 0

  const areFiltersActive = useMemo(() => {
    return (
      searchTerm !== "" ||
      filters.difficulty !== "all" ||
      filters.tag !== "all" ||
      filters.status !== "all" ||
      selectedTag !== null ||
      selectedBookmark !== null
    )
  }, [searchTerm, filters, selectedTag, selectedBookmark])

  const handleClearFilters = () => {
    setSearchTerm("")
    setFilters({ difficulty: "all", tag: "all", status: "all" })
    setSelectedTag(null)
    setSelectedBookmark(null)
    setShowAdvancedFilters(false)
  }

  const handleBookmarkSelect = (bookmark) => {
    if (selectedBookmark?._id === bookmark?._id) {
      setSelectedBookmark(null)
    } else {
      setSelectedBookmark(bookmark)
    }
  }

  const handleTagSelect = (tag) => {
    setSelectedTag(tag)
  }

  const getUserInitials = (user) => {
    if (!user) return "U"
    const firstName = user.firstName || ""
    const lastName = user.lastName || ""
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase() || user.emailId?.charAt(0).toUpperCase() || "U"
  }

  const NavItem = ({ to, icon, label, isDark }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 ${
          isActive
            ? isDark
              ? "bg-slate-700/50 text-white"
              : "bg-slate-200/60 text-slate-900"
            : isDark
              ? "text-slate-300 hover:bg-slate-700/50 hover:text-white"
              : "text-slate-600 hover:bg-slate-200/60 hover:text-slate-900"
        }`
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  )

  return (
    // MODIFICATION: Added background color to the root div to ensure it covers the entire viewport.
    <div
      className={`min-h-screen relative font-sans ${isDark ? "bg-slate-950 text-slate-200" : "bg-white text-slate-800"} transition-colors duration-300`}
    >
      <CircuitBoardBackground isDark={isDark} />
      {showWelcome && isFirstLogin && (
        <WelcomeAnimation user={user} onComplete={handleWelcomeComplete} isDark={isDark} />
      )}
      <StreakModal
        isOpen={showStreakModal}
        onClose={() => setShowStreakModal(false)}
        userStreak={userStreak}
        loading={loading}
        isDark={isDark}
      />
      <BookmarkModal
        isOpen={showBookmarkModal}
        onClose={() => setShowBookmarkModal(false)}
        problem={selectedProblemForBookmark}
        onBookmarkAdded={handleBookmarkAdded}
        isDark={isDark}
      />

      <nav
        className={`sticky top-0 z-40 ${isDark ? "bg-slate-950/80 border-slate-800" : "bg-white/80 border-slate-200"} backdrop-blur-xl border-b`}
      >
        <div className="max-w-[1600px] mx-auto flex items-center justify-between px-6 py-3">
           <div className="flex items-center gap-6">
                <Link to="/" className="flex-shrink-0">
                    <div className="relative top-1">
                    <img src={logo} alt="Logo" className="h-12 w-auto max-w-[150px] object-contain" />
                    </div>
                </Link>
                <div className="hidden md:flex items-center gap-2">
                    <NavItem
                    to="/discussionForum"
                    icon={<MessageSquare className="w-5 h-5" />}
                    label="Discuss"
                    isDark={isDark}
                    />
                    <NavItem to="/contest" icon={<Award className="w-5 h-5" />} label="Contest" isDark={isDark} />
                    <NavItem to="/battleRoom" icon={<Swords className="w-5 h-5" />} label="CodeBattle" isDark={isDark} />
                </div>
           </div>

          <div className="flex items-center gap-4">
            {user && (
              <button
                onClick={() => setShowStreakModal(true)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg ${isDark ? "bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-800" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"} border transition-all duration-300 font-semibold text-sm`}
                title="View your streak"
              >
                <Flame className="w-4 h-4 text-red-500" />
                <span className="hidden sm:block">{userStreak?.currentStreak || 0}</span>
              </button>
            )}
            <button
              onClick={() => setIsDark(!isDark)}
              className={`p-2 rounded-lg ${isDark ? "bg-slate-800/50 text-slate-300 hover:bg-slate-800" : "bg-white text-slate-600 hover:bg-slate-100"} border border-transparent hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 group`}
              title="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-yellow-400 group-hover:rotate-180 transition-transform duration-300" />
              ) : (
                <Moon className="w-5 h-5 text-slate-700 group-hover:rotate-12 transition-transform duration-300" />
              )}
            </button>

            {user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className={`flex items-center gap-2 p-1.5 rounded-full ${isDark ? "hover:bg-slate-800" : "hover:bg-slate-100"} transition-all duration-300`}
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold overflow-hidden ring-2 ring-offset-2 ring-offset-transparent ring-transparent group-hover:ring-blue-500 transition-all duration-300">
                    {userImage && userImage.secureUrl ? (
                      <img
                        src={userImage.secureUrl}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{getUserInitials(user)}</span>
                    )}
                  </div>
                   <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${isDark ? 'text-slate-400' : 'text-slate-600'} ${isMenuOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isMenuOpen && (
                  <div
                    className={`absolute top-full right-0 mt-3 w-64 ${isDark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200"}  border rounded-xl shadow-2xl z-70 overflow-hidden animate-fade-in-dropdown`}
                  >
                    <div className={`p-4 border-b ${isDark ? "border-slate-700/50" : "border-slate-200"}`}>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-lg font-bold shadow-lg overflow-hidden">
                          {userImage && userImage.secureUrl ? (
                            <img
                              src={userImage.secureUrl}
                              alt="Profile"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                             <span>{getUserInitials(user)}</span>
                          )}
                        </div>
                        <div>
                          <p className={`font-semibold ${isDark ? "text-slate-100" : "text-slate-900"}`}>
                            {user.firstName} {user.lastName}
                          </p>
                          <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"} truncate max-w-[150px]`}>{user.emailId}</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-2">
                       <Link
                        to="/userDashboard"
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-md ${isDark ? "text-slate-200 hover:bg-slate-800" : "text-slate-700 hover:bg-slate-100"} transition-colors duration-200 text-sm font-medium`}
                      >
                        <User className="w-4 h-4" />
                        <span>Dashboard</span>
                        <span
                          className={`ml-auto text-xs ${isDark ? "bg-green-900/50 text-green-400" : "bg-green-100 text-green-600"} px-2 py-0.5 rounded-full font-semibold`}
                        >
                          NEW
                        </span>
                      </Link>
                      {user?.role?.trim().toLowerCase() === "admin" && (
                        <Link
                          to="/adminPanel"
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-md ${isDark ? "text-slate-200 hover:bg-slate-800" : "text-slate-700 hover:bg-slate-100"} transition-colors duration-200 text-sm font-medium`}
                        >
                          <Shield className="w-4 h-4" />
                          <span>Admin Panel</span>
                          <span
                            className={`ml-auto text-xs ${isDark ? "bg-red-900/50 text-red-400" : "bg-red-100 text-red-600"} px-2 py-0.5 rounded-full font-semibold`}
                          >
                            ADMIN
                          </span>
                        </Link>
                      )}
                    </div>

                     <div className="px-2">
                        <div className={`h-px w-full ${isDark ? 'bg-slate-700/50' : 'bg-slate-200'}`}></div>
                     </div>

                    <div className="p-2">
                       <button
                        onClick={() => dispatch(logoutUser())}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-md ${isDark ? "text-red-400 hover:bg-red-900/20" : "text-red-600 hover:bg-red-50"} transition-colors duration-200 w-full text-left text-sm font-medium`}
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>

                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className={`px-4 py-2.5 text-sm font-bold rounded-lg ${isDark ? "bg-slate-100 text-slate-900 hover:bg-slate-200" : "bg-slate-900 text-white hover:bg-slate-800"} transition-all duration-300 shadow-md`}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* MODIFICATION: Removed h-full from the main tag */}
      <main className="max-w-[1600px] mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-3 space-y-6">
            {user && <ProblemOfTheDay problem={problemOfTheDay} loading={loading} isDark={isDark} />}
            {user && (
              <BookmarkLists
                bookmarks={bookmarks}
                loading={loading}
                onBookmarkSelect={handleBookmarkSelect}
                selectedBookmark={selectedBookmark}
                onBookmarksUpdated={fetchBookmarks}
                isDark={isDark}
              />
            )}
          </div>

          {/* Middle - Problems List */}
          <div className="lg:col-span-6 space-y-6">
            <div
              className={`${isDark ? "bg-slate-900/80 border-slate-800" : "bg-white/80 border-slate-200"} backdrop-blur-xl rounded-2xl border shadow-xl p-6`}
            >
              <TopicFilters
                activeFilter={filters.tag}
                onFilterChange={(tag) => setFilters({ ...filters, tag: tag })}
                isDark={isDark}
              />

              <div className="mb-6 flex flex-col gap-4 ">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 flex-1">
                    <div className="relative w-full max-w-sm">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                        <Search className="w-4 h-4 z-10 text-slate-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="Search problems..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`w-full pl-11 pr-4 py-2.5 rounded-xl ${isDark ? "bg-slate-800/50 border-slate-700 text-slate-100 placeholder:text-slate-400 focus:border-blue-500" : "bg-slate-100/50 border-slate-200 text-slate-900 placeholder:text-slate-500 focus:border-blue-500"} backdrop-blur-sm border focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 font-medium text-sm`}
                      />
                    </div>

                    <button
                      onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                      className={`flex-shrink-0 p-2.5 rounded-xl border transition-all duration-300 shadow-sm ${
                        showAdvancedFilters
                          ? isDark
                            ? "bg-slate-700 text-white border-slate-600"
                            : "bg-slate-800 text-white border-slate-800"
                          : isDark
                            ? "bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-800"
                            : "bg-slate-100/50 border-slate-200 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      <Filter className="w-4 h-4" />
                    </button>

                    {areFiltersActive && (
                      <div className="transition-all duration-300 ease-in-out">
                        <button
                          onClick={handleClearFilters}
                          className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2.5 rounded-xl ${isDark ? "bg-red-900/20 border-red-800/50 text-red-400 hover:bg-red-900/40" : "bg-red-50 border-red-200 text-red-600 hover:bg-red-100"} backdrop-blur-sm border transition-all duration-300 font-semibold text-xs shadow-sm`}
                        >
                          <X className="w-3 h-3" />
                          Clear
                        </button>
                      </div>
                    )}
                  </div>

                  {user && (
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <svg className="w-8 h-8 transform -rotate-90">
                          <circle
                            cx="16"
                            cy="16"
                            r="14"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            fill="transparent"
                            className={isDark ? "text-slate-700" : "text-slate-200"}
                          />
                          <circle
                            cx="16"
                            cy="16"
                            r="14"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            fill="transparent"
                            strokeDasharray={`${2 * Math.PI * 14}`}
                            strokeDashoffset={`${2 * Math.PI * 14 * (1 - progress / 100)}`}
                            className="text-green-500 transition-all duration-1000 ease-out"
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                           <span className={`text-[10px] font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                                {Math.round(progress)}%
                           </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-bold ${isDark ? "text-slate-100" : "text-slate-900"}`}>
                          {solvedProblemIds.size}/{problems?.problemNeeded?.length || 0}
                        </div>
                        <div className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"} font-medium`}>Solved</div>
                      </div>
                    </div>
                  )}
                </div>

                <div
                  className={`transition-all duration-500 ease-in-out overflow-hidden ${
                    showAdvancedFilters ? "max-h-32 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div
                    className={`grid grid-cols-1 sm:grid-cols-2 gap-3 border-t ${isDark ? "border-slate-800" : "border-slate-200"} pt-4`}
                  >
                    <div className="relative">
                      <select
                        className={`w-full pl-11 pr-8 py-2.5 rounded-xl ${isDark ? "bg-slate-800/50 border-slate-700 text-slate-100 focus:border-blue-500" : "bg-slate-100/50 border-slate-200 text-slate-900 focus:border-blue-500"} backdrop-blur-sm border focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 appearance-none font-medium text-sm`}
                        value={filters.difficulty}
                        onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
                      >
                        <option value="all">All Difficulties</option>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      </div>
                    </div>

                    <div className="relative">                      
                      <select
                        className={`w-full pl-11 pr-8 py-2.5 rounded-xl ${isDark ? "bg-slate-800/50 border-slate-700 text-slate-100 focus:border-blue-500" : "bg-slate-100/50 border-slate-200 text-slate-900 focus:border-blue-500"} backdrop-blur-sm border focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 appearance-none font-medium text-sm`}
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                      >
                        <option value="all">All Status</option>
                        <option value="solved">Solved</option>
                        <option value="unsolved">Unsolved</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {(selectedBookmark || selectedTag) && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {selectedBookmark && (
                    <div
                      className={`flex items-center gap-2 px-3 py-1.5 ${isDark ? "bg-blue-900/20 border-blue-800/50" : "bg-blue-50 border-blue-200"} border rounded-lg text-sm`}
                    >
                      <Bookmark className={`w-3 h-3 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
                      <span className={`${isDark ? "text-blue-300" : "text-blue-800"} font-semibold`}>
                        {selectedBookmark.name}
                      </span>
                      <button
                        onClick={() => setSelectedBookmark(null)}
                        className={`${isDark ? "text-blue-400 hover:text-blue-200" : "text-blue-600 hover:text-blue-800"}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                  {selectedTag && (
                    <div
                      className={`flex items-center gap-2 px-3 py-1.5 ${isDark ? "bg-purple-900/20 border-purple-800/50" : "bg-purple-50 border-purple-200"} border rounded-lg text-sm`}
                    >
                      <Target className={`w-3 h-3 ${isDark ? "text-purple-400" : "text-purple-600"}`} />
                      <span className={`${isDark ? "text-purple-300" : "text-purple-800"} font-semibold`}>
                        {selectedTag}
                      </span>
                      <button
                        onClick={() => setSelectedTag(null)}
                        className={`${isDark ? "text-purple-400 hover:text-purple-200" : "text-purple-600 hover:text-purple-800"}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className="flex flex-col gap-3">
                {paginatedProblems?.length > 0 ? (
                  paginatedProblems.map((problem, index) => (
                    <ProblemCard
                      key={problem._id}
                      problem={problem}
                      isSolved={solvedProblemIds.has(problem._id)}
                      index={index + (currentPage - 1) * problemsPerPage}
                      onBookmarkClick={handleBookmarkClick}
                      isDark={isDark}
                    />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div
                      className={`w-12 h-12 mx-auto mb-4 rounded-full ${isDark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200"} border flex items-center justify-center shadow-md`}
                    >
                      <Search className="w-6 h-6 text-slate-400" />
                    </div>
                    <h3 className={`text-lg font-semibold ${isDark ? "text-slate-100" : "text-slate-900"} mb-1`}>
                      No problems found
                    </h3>
                    <p className={`${isDark ? "text-slate-400" : "text-slate-500"} text-sm`}>
                      Try adjusting your search or filter criteria.
                    </p>
                  </div>
                )}
              </div>

              {/* --- PAGINATION CONTROLS --- */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                      isDark
                        ? "bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-100"
                        : "bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-900"
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>
                  <span className={`text-sm font-semibold ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                      isDark
                        ? "bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-100"
                        : "bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-900"
                    }`}
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          {user && (
            <div className="lg:col-span-3 space-y-6">
              <StreakCalendar userStreak={userStreak} loading={loading} isDark={isDark} />
              <TagChips problems={problems} onTagSelect={handleTagSelect} selectedTag={selectedTag} isDark={isDark} />
            </div>
          )}
        </div>

        {!user && (
          <div
            className={`mt-6 ${isDark ? "bg-slate-900/80 border-slate-800" : "bg-white/80 border-slate-200"} backdrop-blur-xl rounded-2xl border shadow-xl p-8 text-center`}
          >
            <h1 className={`text-3xl font-bold ${isDark ? "text-slate-100" : "text-slate-900"} mb-4`}>
              Welcome to CodeArena
            </h1>
            <p className={`${isDark ? "text-slate-400" : "text-slate-600"} mb-6 max-w-md mx-auto`}>
              Sign in to track your progress, create bookmarks, and maintain your coding streak!
            </p>
            <Link
              to="/login"
              className={`inline-block px-6 py-3 ${isDark ? "bg-slate-100 text-slate-900 hover:bg-slate-200" : "bg-slate-900 text-white hover:bg-slate-800"} rounded-xl font-semibold transition-all duration-300 shadow-lg`}
            >
              Get Started
            </Link>
          </div>
        )}
      </main>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fade-in-delay {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-dropdown {
          from { opacity: 0; transform: translateY(-10px) scale(0.95); transform-origin: top right; }
          to { opacity: 1; transform: translateY(0) scale(1); transform-origin: top right; }
        }
        .animate-fade-in { animation: fade-in 0.2s ease-out; }
        .animate-fade-in-delay { animation: fade-in-delay 1s ease-out 0.5s both; }
        .animate-fade-in-dropdown { animation: fade-in-dropdown 0.2s ease-out; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
        body { font-family: 'Inter', sans-serif; }
      `}</style>
    </div>
  )
}

export default Homepage

