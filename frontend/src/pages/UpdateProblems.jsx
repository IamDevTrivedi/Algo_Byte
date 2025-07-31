"use client"

import { useEffect, useState, useMemo } from "react"
import axiosClient from "../utils/axiosClient"
import { useNavigate,Link } from "react-router-dom"
import { Sun, Moon, Code, Search, Edit } from "lucide-react"
import logo from "../Images/logo.png"


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
       
        setTimeout(() => setShowCursor(false), 2000)
      }
    }, speed)

    return () => clearInterval(timer)
  }, [text, speed])

  return { displayText, isComplete, showCursor }
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
            className="absolute w-1 h-1 bg-yellow-500 dark:bg-yellow-400 rounded-full animate-pulse"
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

      {/* Hexagonal Tech Pattern */}
      <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.04]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hexagon" x="0" y="0" width="60" height="52" patternUnits="userSpaceOnUse">
              <polygon
                points="30,2 45,15 45,37 30,50 15,37 15,15"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hexagon)" />
        </svg>
      </div>

      {/* Binary Rain Effect (Dark Mode) */}
      <div className="hidden dark:block absolute inset-0 overflow-hidden opacity-[0.08]">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-yellow-400 text-xs font-mono animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          >
            {Math.random() > 0.5 ? "1" : "0"}
          </div>
        ))}
      </div>

      {/* Code Matrix Effect (Dark Mode) */}
      <div className="hidden dark:block absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-yellow-900/5 to-transparent animate-pulse" />
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-yellow-300 text-[8px] font-mono opacity-30"
            style={{
              left: `${10 + i * 12}%`,
              top: `${Math.random() * 80}%`,
              transform: `rotate(${Math.random() * 10 - 5}deg)`,
            }}
          >
            {"</>"}
          </div>
        ))}
      </div>

      {/* Interactive Lightning/Neural Network Effect */}
      <div
        className="absolute inset-0 z-20 transition-opacity duration-300"
        style={{
          backgroundImage: `
            radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(251, 191, 36, 0.08), transparent 50%),
            radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(245, 158, 11, 0.04), transparent 70%)
          `,
        }}
      />

      {/* Algorithmic Flow Lines */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <path
            d="M0,100 Q200,50 400,100 T800,100"
            fill="none"
            stroke="url(#flowGradient)"
            strokeWidth="1"
            className="animate-pulse"
          />
          <path
            d="M0,200 Q300,150 600,200 T1200,200"
            fill="none"
            stroke="url(#flowGradient)"
            strokeWidth="1"
            className="animate-pulse"
            style={{ animationDelay: "1s" }}
          />
        </svg>
      </div>

      {/* Particle System */}
      <div className="absolute inset-0 overflow-hidden opacity-[0.04] dark:opacity-[0.08]">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-0.5 bg-yellow-400 dark:bg-yellow-300 rounded-full animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${4 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Geometric Code Blocks */}
      <div className="absolute inset-0 opacity-[0.01] dark:opacity-[0.03]">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="absolute border border-current transform rotate-45"
            style={{
              width: `${20 + Math.random() * 30}px`,
              height: `${20 + Math.random() * 30}px`,
              left: `${Math.random() * 90}%`,
              top: `${Math.random() * 90}%`,
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          />
        ))}
      </div>
    </div>
  )
}

// --- Enhanced Fire Particles with Code Matrix ---
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
      {/* Code symbols floating */}
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={`code-${i}`}
          className="absolute text-yellow-400 dark:text-yellow-400 text-xs font-mono opacity-20 animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 4}s`,
          }}
        >
          {["</>", "{}", "[]", "()", "&&", "||"][i]}
        </div>
      ))}
    </div>
  )
}

// --- Enhanced SVG Icons with preserved colors ---
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

// --- Enhanced Topic Filters with Neural Network Borders ---
const TopicFilters = ({ activeFilter, onFilterChange }) => {
  const topics = [
    { name: "All Topics", value: "all", icon: <AllTopicsIcon /> },
    { name: "Array", value: "array", icon: <ArrayIcon /> },
    { name: "Linked List", value: "linkedList", icon: <LinkedListIcon /> },
    { name: "Graph", value: "graph", icon: <GraphIcon /> },
    { name: "DP", value: "dp", icon: <DPIcon /> },
  ]

  return (
    <div className="relative mb-5">
      <div className="flex space-x-2 overflow-x-auto pb-3 scrollbar-hide">
        {topics.map((topic) => {
          const isActive = activeFilter === topic.value
          return (
            <button
              key={topic.value}
              onClick={() => onFilterChange(topic.value)}
              className={`neural-border-container relative flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-300 hover:scale-105 ${
                isActive
                  ? "bg-black dark:bg-white text-white dark:text-black shadow-lg"
                  : "bg-white dark:bg-black text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 border border-gray-200 dark:border-gray-700"
              }`}
            >
              <div className="relative z-10 flex items-center gap-2">
                {topic.icon}
                <span>{topic.name}</span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// --- Enhanced Problem Card with Syntax Highlighting Border ---
const ProblemCard = ({ problem, index, onUpdate }) => {
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
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 flex items-center justify-center text-xs font-semibold text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600">
              {index + 1}
            </span>
            <div className="flex flex-col gap-2 flex-1">
              <h2 className="text-sm font-semibold text-black dark:text-white">{problem.title}</h2>
              <div className="flex flex-wrap items-center gap-1.5">
                <div
                  className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ${getDifficultyStyles(problem.difficulty)}`}
                >
                  {problem.difficulty}
                </div>
                <div className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold text-blue-800 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                  {problem.tags}
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={() => onUpdate(problem._id)}
            className="flex-shrink-0 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-all duration-300 hover:scale-110 border border-yellow-200 dark:border-yellow-800 text-xs font-semibold"
            title="Update Problem"
          >
            <Edit className="w-3 h-3" />
            <span className="hidden sm:inline">Update</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export function UpdateProblem() {
  const navigate = useNavigate()
  const [problems, setProblems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [darkMode, setDarkMode] = useState(false)
  const [activeFilter, setActiveFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  // Typewriter effect for title
  const { displayText, isComplete, showCursor } = useTypewriter("Update Problems", 80)

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark")
    else document.documentElement.classList.remove("dark")
  }, [darkMode])

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setLoading(true)
        const { data } = await axiosClient.get("/problem/getAllProblem")
        setProblems(data.problemNeeded)
        setError(null)
      } catch (err) {
        setError("Failed to fetch problems. Please try again later.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchProblems()
  }, [])

  const filteredProblems = useMemo(() => {
    return problems
      .filter((p) => activeFilter === "all" || p.tags === activeFilter)
      .filter((p) => p.title.toLowerCase().includes(searchTerm.toLowerCase()))
  }, [problems, activeFilter, searchTerm])

  const handleUpdate = (problemId) => {
    
    navigate(`/problem/update/${problemId}`)
  }

  return (
    <>
    
    <div className="min-h-screen relative text-black dark:text-white transition-colors duration-300 isolate">
    <CircuitBoardBackground />

      {/* Enhanced Navigation (Homepage Style) */}
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

      {/* Enhanced Main Content (Homepage Style) */}
      <main className="fire-container max-w-4xl mx-auto p-5 mt-6 mb-12 relative z-10">
        <FireParticles />
        <div className="relative z-10 bg-white/95 dark:bg-black/95 backdrop-blur-xl rounded-2xl border border-gray-300 dark:border-gray-600 shadow-2xl p-6">
          {/* Enhanced Header with Typewriter Effect */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-yellow-600 shadow-lg">
                <Edit className="w-5 h-5 text-white" />
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
              Select a problem to edit and enhance its details.
            </p>
          </div>

          <TopicFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} />

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
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 dark:focus:ring-yellow-400/20 focus:border-yellow-500 dark:focus:border-yellow-400 transition-all duration-300 font-medium text-sm"
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
                <div className="w-8 h-8 border-4 border-gray-300 border-t-yellow-500 rounded-full animate-spin"></div>
              </div>
            )}

            {error && <div className="text-center p-10 text-red-500 font-medium">{error}</div>}

            {!loading && !error && (
              <div className="flex flex-col gap-3">
                {filteredProblems.length > 0 ? (
                  filteredProblems.map((problem, index) => (
                    <ProblemCard key={problem._id} problem={problem} index={index} onUpdate={handleUpdate} />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center border border-gray-200 dark:border-gray-600">
                      <Search className="w-6 h-6 text-gray-400" />
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
    </div>
    </>
  )
}

export default UpdateProblem

