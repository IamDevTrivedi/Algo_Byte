
"use client"

import { useState, useEffect, memo } from "react"
import { useNavigate } from "react-router-dom"
import axiosClient from "../utils/axiosClient"
import { Calendar, Clock, Trophy, Eye, Sun, Moon, ArrowLeft, CheckCircle } from "lucide-react"

const Button = ({ children, onClick, disabled, variant = "default", className = "", ...props }) => {
  const baseClasses = "px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2"
  const variants = {
    default: "bg-green-600 hover:bg-green-700 text-white disabled:opacity-50",
    outline: "border border-gray-300 dark:border-gray-600 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300",
  }
  return <button onClick={onClick} disabled={disabled} className={`${baseClasses} ${variants[variant]} ${className}`} {...props}>{children}</button>
}

const Card = ({ children, className = "" }) => <div className={`rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg ${className}`}>{children}</div>
const CardContent = ({ children, className = "" }) => <div className={`p-6 ${className}`}>{children}</div>

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
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <>
      <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black">
        <div className="absolute inset-0">
          <svg className="w-full h-full opacity-[0.03] dark:opacity-[0.08]" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="circuit-my-contest" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse"><path d="M20 20h60v60h-60z" fill="none" stroke="currentColor" strokeWidth="0.5" /><circle cx="20" cy="20" r="2" fill="currentColor" /><circle cx="80" cy="20" r="2" fill="currentColor" /><circle cx="20" cy="80" r="2" fill="currentColor" /><circle cx="80" cy="80" r="2" fill="currentColor" /><path d="M20 20L80 20M20 80L80 80M20 20L20 80M80 20L80 80" stroke="currentColor" strokeWidth="0.3" /></pattern></defs><rect width="100%" height="100%" fill="url(#circuit-my-contest)" /></svg>
        </div>
        <div className="absolute inset-0 z-20 transition-opacity duration-300" style={{ backgroundImage: `radial-gradient(500px circle at var(--mouse-x) var(--mouse-y), rgba(59, 130, 246, 0.08), transparent 40%), radial-gradient(900px circle at var(--mouse-x) var(--mouse-y), rgba(34, 197, 94, 0.04), transparent 60%)` }} />
      </div>
    </>
  )
})


const MyContestCard = ({ contest }) => {
  const navigate = useNavigate()
  const formatDate = (dateString) => new Date(dateString).toLocaleString()

  return (
    <Card className="bg-white/95 dark:bg-black/95 backdrop-blur-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
      <CardContent>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-grow">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{contest.title}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-4">{contest.description}</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-gray-400" /><div><div className="text-xs text-gray-500 dark:text-gray-400">Start Time</div><div className="font-medium">{formatDate(contest.startTime)}</div></div></div>
              <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-gray-400" /><div><div className="text-xs text-gray-500 dark:text-gray-400">End Time</div><div className="font-medium">{formatDate(contest.endTime)}</div></div></div>
            </div>
          </div>
          <div className="flex-shrink-0 w-full md:w-56 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 space-y-3">
            <div className="text-center">
              <div className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Your Score</div>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{contest.totalScore}</div>
            </div>
            <div className="flex justify-around text-xs text-center text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1.5"><CheckCircle className="w-3 h-3 text-green-500" />{contest.testCasePassedCount} Cases</div>
              <div className="flex items-center gap-1.5"><Trophy className="w-3 h-3 text-yellow-500" />{contest.problems.length} Problems</div>
            </div>
            <Button variant="outline" onClick={() => navigate(`/contest/view/${contest._id}`)} className="w-full !mt-4">
              <Eye className="w-4 h-4" />View My Submissions
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// =================================================================================
// Main Page Component
// =================================================================================

export default function MyContests() {
  const navigate = useNavigate()
  const [darkMode, setDarkMode] = useState(false)
  const [myContests, setMyContests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode)
  }, [darkMode])

  useEffect(() => {
    const fetchMyContests = async () => {
      try {
        setLoading(true)
        const response = await axiosClient.get("/contest/myContest")
        
        if (response.data.success) {
          setMyContests(response.data.contests || [])
        }
      } catch (err) {
        setError("Failed to load your participated contests.")
        console.error("Error fetching my contests:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchMyContests()
  }, [])

  return (
    <div className="relative min-h-screen text-gray-700 dark:text-gray-300 isolate">
      <DynamicBackground darkMode={darkMode} />
      <div className="relative min-h-screen p-4">
        <header className="absolute top-0 left-0 right-0 p-4 z-10">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <Button variant="outline" onClick={() => navigate("/contest")} className="backdrop-blur-sm shadow-lg">
              <ArrowLeft className="w-4 h-4" />Back to All Contests
            </Button>
            <button onClick={() => setDarkMode(!darkMode)} className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/90 dark:bg-black/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 hover:scale-110 shadow-lg">
              {darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </header>

        <main className="flex flex-col items-center justify-center min-h-screen pt-20 pb-12">
          <div className="w-full max-w-6xl">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-black dark:text-white mb-2">My Contests</h1>
              <p className="text-gray-600 dark:text-gray-400">A history of all the contests you've participated in.</p>
            </div>
            {loading ? (
              <div className="text-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div></div>
            ) : error ? (
              <div className="text-center py-12 text-red-500">{error}</div>
            ) : myContests.length > 0 ? (
              <div className="space-y-6">
                {myContests.map((contest) => (
                  <MyContestCard key={contest._id} contest={contest} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🤷</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No Contests Found</h3>
                <p className="text-gray-600 dark:text-gray-400">You haven't participated in any contests yet. Go join one!</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}