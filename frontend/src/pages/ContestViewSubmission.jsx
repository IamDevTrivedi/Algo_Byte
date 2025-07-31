
"use client"

import { useState, useEffect, memo } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Editor from "@monaco-editor/react"
import axiosClient from "../utils/axiosClient" // Ensure this path is correct
import { Calendar, Clock, Code, Sun, Moon, ChevronDown, ChevronUp, CheckCircle, XCircle, Timer, MemoryStickIcon as Memory, Award, ArrowLeft, Eye, X, Copy } from 'lucide-react'


const Button = ({ children, onClick, disabled, variant = "default", className = "", ...props }) => {
  const baseClasses =
    "px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2"
  const variants = {
    default: "bg-green-600 hover:bg-green-700 text-white disabled:opacity-50",
    outline:
      "border border-gray-300 dark:border-gray-600 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300",
    primary: "bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50",
    secondary: "bg-gray-600 hover:bg-gray-700 text-white disabled:opacity-50",
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

const Card = ({ children, className = "", ...props }) => {
  return (
    <div
      className={`rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

const Badge = ({ children, className = "" }) => {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
      {children}
    </span>
  )
}

const DynamicBackground = memo(({ darkMode }) => {
  useEffect(() => {
    let animationFrameId = null
    const handleMouseMove = (e) => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
      animationFrameId = requestAnimationFrame(() => {
        document.documentElement.style.setProperty("--mouse-x", `${e.clientX}px`)
        document.documentElement.style.setProperty("--mouse-y", `${e.clientY + window.scrollY}px`)
      })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return (
    <>
      <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black">
        <div className="absolute inset-0">
          <svg className="w-full h-full opacity-[0.03] dark:opacity-[0.08]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="circuit-contest" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <path d="M20 20h60v60h-60z" fill="none" stroke="currentColor" strokeWidth="0.5" />
                <circle cx="20" cy="20" r="2" fill="currentColor" />
                <circle cx="80" cy="20" r="2" fill="currentColor" />
                <circle cx="20" cy="80" r="2" fill="currentColor" />
                <circle cx="80" cy="80" r="2" fill="currentColor" />
                <path d="M20 20L80 20M20 80L80 80M20 20L20 80M80 20L80 80" stroke="currentColor" strokeWidth="0.3" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#circuit-contest)" />
          </svg>
        </div>
        <div className="absolute inset-0 z-20 transition-opacity duration-300" style={{ backgroundImage: `radial-gradient(500px circle at var(--mouse-x) var(--mouse-y), rgba(34, 197, 94, 0.08), transparent 40%), radial-gradient(700px circle at var(--mouse-x) var(--mouse-y), rgba(251, 191, 36, 0.06), transparent 50%), radial-gradient(900px circle at var(--mouse-x) var(--mouse-y), rgba(239, 68, 68, 0.04), transparent 60%)` }} />
      </div>
    </>
  )
})

const CodeViewerModal = ({ submission, darkMode, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onClose])

  if (!submission) return null

  return (
    <div className="absolute inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in-0 duration-300" onClick={onClose}>
      <div className="w-full max-w-4xl bg-white dark:bg-black rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()}>
        <div className="flex-shrink-0 p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <div className="p-1.5 rounded bg-gray-100 dark:bg-gray-800 shadow-lg"> <Code className="w-4 h-4 text-black dark:text-white" /></div> Submission Code
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 font-medium"> Language: {submission.language} | Status: {submission.status} | Score: {submission.score} </p>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => navigator.clipboard.writeText(submission.code)} className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-all duration-200" title="Copy code"><Copy size={14} /></button>
            <button onClick={onClose} className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-all duration-200" aria-label="Close modal"><X size={16} /></button>
          </div>
        </div>
        <div className="flex-grow p-4 h-[500px] overflow-hidden">
          <Editor height="100%" language={submission.language?.toLowerCase() || "javascript"} theme={darkMode ? "vs-dark" : "light"} value={submission.code} options={{ minimap: { enabled: true }, readOnly: true, fontSize: 13, scrollBeyondLastLine: false, fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'SF Mono', Monaco, 'Inconsolata', 'Roboto Mono', 'Source Code Pro', Menlo, 'Ubuntu Mono', monospace", lineHeight: 1.6, padding: { top: 12, bottom: 12 }, lineNumbers: "on", folding: true, bracketMatching: "always", fontLigatures: true, renderWhitespace: "selection" }} />
        </div>
      </div>
    </div>
  )
}

const ProblemCard = ({ problem, index, darkMode }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showCodeModal, setShowCodeModal] = useState(false)

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "easy": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      case "hard": return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "accepted": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "wrong answer": case "runtime error": case "time limit exceeded": return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  const formatDate = (dateString) => new Date(dateString).toLocaleString()

  return (
    <>
      <Card className="bg-white/95 dark:bg-black/95 backdrop-blur-xl transition-all duration-300">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center font-bold text-sm">{String.fromCharCode(65 + index)}</div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{problem.title}</h3>
                <Badge className={getDifficultyColor(problem.difficulty)}>{problem.difficulty}</Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {problem.submission ? (problem.submission.status === "accepted" ? <CheckCircle className="w-5 h-5 text-green-500" /> : <XCircle className="w-5 h-5 text-red-500" />) : <div className="w-5 h-5 rounded-full bg-gray-300 dark:bg-gray-600"></div>}
            </div>
          </div>
          <div className="mb-4"><p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">{problem.description}</p></div>
          {problem.submission ? (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">Submission Details</h4>
                  <button onClick={() => setIsExpanded(!isExpanded)} className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">{isExpanded ? "Hide Details" : "Show Details"}{isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}</button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div><span className="text-gray-500 dark:text-gray-400">Status:</span><Badge className={`${getStatusColor(problem.submission.status)} ml-2`}>{problem.submission.status}</Badge></div>
                  <div><span className="text-gray-500 dark:text-gray-400">Score:</span><span className="ml-2 font-medium">{problem.submission.score}</span></div>
                  <div><span className="text-gray-500 dark:text-gray-400">Language:</span><span className="ml-2 font-medium">{problem.submission.language}</span></div>
                  <div><span className="text-gray-500 dark:text-gray-400">Time:</span><span className="ml-2 font-medium">{problem.submission.executionTime}ms</span></div>
                </div>
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                      <div className="flex items-center gap-2"><Memory className="w-4 h-4 text-gray-400" /><span className="text-gray-500 dark:text-gray-400">Memory Used:</span><span className="font-medium">{problem.submission.memoryUsed} KB</span></div>
                      <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-gray-400" /><span className="text-gray-500 dark:text-gray-400">Submitted:</span><span className="font-medium">{formatDate(problem.submission.submittedAt)}</span></div>
                    </div>
                    <Button variant="outline" onClick={() => setShowCodeModal(true)} className="w-full"><Eye className="w-4 h-4" />View Submitted Code</Button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center"><div className="text-gray-500 dark:text-gray-400 text-sm"><XCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />Not attempted</div></div>
          )}
        </div>
      </Card>
      {showCodeModal && problem.submission && (<CodeViewerModal submission={problem.submission} darkMode={darkMode} onClose={() => setShowCodeModal(false)} />)}
    </>
  )
}


const LeaderboardTable = ({ leaderboard, currentUserEmail }) => {
  if (!leaderboard || leaderboard.length === 0) {
    return (
      <Card className="bg-white/95 dark:bg-black/95 backdrop-blur-xl p-6 text-center">
        <p className="text-gray-500 dark:text-gray-400">Leaderboard data is not available yet.</p>
      </Card>
    )
  }

  return (
    <Card className="bg-white/95 dark:bg-black/95 backdrop-blur-xl">
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Award className="w-6 h-6 text-yellow-500" />
          Leaderboard
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3 rounded-l-lg">Rank</th>
                <th scope="col" className="px-6 py-3">Name</th>
                <th scope="col" className="px-6 py-3 text-right rounded-r-lg">Total Score</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry) => (
                <tr
                  key={entry.rank}
                  className={`border-b border-gray-200 dark:border-gray-700 transition-colors ${entry.email === currentUserEmail ? 'bg-green-50 dark:bg-green-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}
                >
                  <td className="px-6 py-4 font-bold text-lg text-gray-900 dark:text-white">{entry.rank}</td>
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                    {entry.name}
                    {entry.email === currentUserEmail && <span className="ml-2 text-xs text-green-600 dark:text-green-400">(You)</span>}
                  </td>
                  <td className="px-6 py-4 font-bold text-right text-lg text-gray-900 dark:text-white">{entry.totalScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  )
}



export default function ContestViewSubmissions() {
  const { contestId } = useParams()
  const navigate = useNavigate()
  const [darkMode, setDarkMode] = useState(false)
  const [contest, setContest] = useState(null)
  const [problems, setProblems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  

  const [leaderboard, setLeaderboard] = useState([])
  const [currentUserEmail, setCurrentUserEmail] = useState(null)

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode)
  }, [darkMode])


  useEffect(() => {
    const fetchAllContestData = async () => {
      setLoading(true)
      setError(null)
      try {

        const [contestResponse, leaderboardResponse] = await Promise.all([
          axiosClient.get(`/contest/myContest/${contestId}`),
          axiosClient.get(`/contest/contestLeaderboard/${contestId}`)
        ])
        
  
        if (contestResponse.data) {
          setContest(contestResponse.data.contest)
          const fetchedProblems = contestResponse.data.problems || []
          setProblems(fetchedProblems)

    
          if (leaderboardResponse.data.success) {
            const fetchedLeaderboard = leaderboardResponse.data.leaderboard || []
            setLeaderboard(fetchedLeaderboard)


            const myTotalScore = fetchedProblems.reduce((acc, p) => acc + (p.submission?.score || 0), 0)
            const myEntry = fetchedLeaderboard.find(entry => entry.totalScore === myTotalScore)
            if (myEntry) {
              setCurrentUserEmail(myEntry.email)
            }
          } else {
            console.warn("Could not fetch leaderboard data.")
          }
        } else {
          throw new Error("Contest not found or you are not authorized to view it.")
        }
      } catch (err) {
        setError("You did not participate in this contest or failed to load data.")
        console.error("Error fetching contest page data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchAllContestData()
  }, [contestId])

  const formatDate = (dateString) => new Date(dateString).toLocaleString()

  const getContestStats = () => {
    const solved = problems.filter(p => p.submission?.status === "accepted").length
    return { solved, total: problems.length }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-black dark:via-gray-900 dark:to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading contest results...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-black dark:via-gray-900 dark:to-black flex items-center justify-center text-center p-4">
        <div>
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <Button onClick={() => navigate("/contest")} className="mt-4">
            Back to Contests
          </Button>
        </div>
      </div>
    )
  }

  const stats = getContestStats()

  return (
    <div className="relative min-h-screen text-gray-700 dark:text-gray-300 isolate">
      <DynamicBackground darkMode={darkMode} />
      <div className="relative min-h-screen p-4">
        <header className="absolute top-0 left-0 right-0 p-4 z-10">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <button onClick={() => navigate("/contest")} className="flex items-center gap-2 text-xl font-bold text-black dark:text-white transition-all duration-300 hover:text-gray-700 dark:hover:text-gray-300 hover:scale-105">
              <ArrowLeft className="w-5 h-5" />
              <div className="p-1.5 rounded-lg bg-black dark:bg-white shadow-lg"><Code className="w-4 h-4 text-white dark:text-black" /></div>Back to Contests
            </button>
            <button onClick={() => setDarkMode(!darkMode)} className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/90 dark:bg-black/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 hover:scale-110 shadow-lg">
              {darkMode ? <Sun className="w-5 h-5 text-yellow-500 transition-transform duration-300 hover:rotate-180" /> : <Moon className="w-5 h-5 text-gray-700 transition-transform duration-300 hover:rotate-12" />}
            </button>
          </div>
        </header>

        <main className="flex flex-col items-center justify-center min-h-screen pt-20 pb-12">
          <div className="w-full max-w-6xl">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-black dark:text-white mb-2">{contest?.title}</h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Contest Submissions & Results</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card className="bg-white/95 dark:bg-black/95 backdrop-blur-xl p-4"><div className="flex items-center gap-2 justify-center"><Calendar className="w-5 h-5 text-blue-500" /><div><div className="text-xs text-gray-500 dark:text-gray-400">Start Time</div><div className="font-medium">{formatDate(contest?.startTime)}</div></div></div></Card>
                <Card className="bg-white/95 dark:bg-black/95 backdrop-blur-xl p-4"><div className="flex items-center gap-2 justify-center"><Clock className="w-5 h-5 text-orange-500" /><div><div className="text-xs text-gray-500 dark:text-gray-400">End Time</div><div className="font-medium">{formatDate(contest?.endTime)}</div></div></div></Card>
                <Card className="bg-white/95 dark:bg-black/95 backdrop-blur-xl p-4"><div className="flex items-center gap-2 justify-center"><Award className="w-5 h-5 text-green-500" /><div><div className="text-xs text-gray-500 dark:text-gray-400">Progress</div><div className="font-medium">{stats.solved}/{stats.total} Solved</div></div></div></Card>
              </div>
            </div>
            
            <div className="space-y-6">
              {problems.length > 0 ? (problems.map((problem, index) => (<ProblemCard key={problem._id} problem={problem} index={index} darkMode={darkMode} />))) : (<div className="text-center py-12"><div className="text-6xl mb-4">📝</div><h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No problems found</h3><p className="text-gray-600 dark:text-gray-400">This contest doesn't have any problems.</p></div>)}
            </div>

            {/* NEW: Leaderboard Section */}
            <div className="mt-12">
              <LeaderboardTable leaderboard={leaderboard} currentUserEmail={currentUserEmail} />
            </div>

          </div>
        </main>
      </div>
    </div>
  )
}
