"use client"

import { useState, useEffect, memo } from "react"
import { useNavigate, Link } from "react-router-dom"
import axiosClient from "../utils/axiosClient"
import logo from "../Images/logo.png"
import { Calendar, Clock, Users, Trophy, Play, Eye, Sun, Moon, Timer, Target } from "lucide-react"


const CircuitBoardBackground = ({ isDark }) => {
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
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return (
    <div className="absolute inset-0 -z-10 min-h-full w-full bg-slate-100 dark:bg-slate-950">
      <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.02]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `
              linear-gradient(to right, #475569 1px, transparent 1px),
              linear-gradient(to bottom, #475569 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>
      <div
        className="absolute inset-0 z-20 transition-opacity duration-300"
        style={{
          backgroundImage: `
            radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(34, 197, 94, 0.08), transparent 40%),
            radial-gradient(800px circle at var(--mouse-x) var(--mouse-y), rgba(59, 130, 246, 0.06), transparent 50%)
          `,
        }}
      />
    </div>
  )
}

const Badge = ({ children, className = "" }) => {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${className}`}>
      {children}
    </span>
  )
}

const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-center gap-2.5">
    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center transition-colors duration-300">
      {icon}
    </div>
    <div>
      <div className="text-xs text-slate-500 dark:text-slate-400">{label}</div>
      <div className="font-semibold text-sm text-slate-800 dark:text-slate-200">{value}</div>
    </div>
  </div>
)


const ContestCard = ({ contest, type, onAction, lengthOf, index }) => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 10)
    return () => clearTimeout(timer)
  }, [])

  const getStatusInfo = (type) => {
    switch (type) {
      case "upcoming":
        return {
          badge: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
          gradient: "from-blue-500 to-cyan-400",
        }
      case "ongoing":
        return {
          badge: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
          gradient: "from-green-500 to-emerald-400",
        }
      case "past":
        return {
          badge: "bg-slate-100 text-slate-800 dark:bg-slate-800/60 dark:text-slate-400",
          gradient: "from-slate-500 to-slate-400",
        }
      default:
        return {
          badge: "bg-slate-100 text-slate-800 dark:bg-slate-800/60 dark:text-slate-400",
          gradient: "from-slate-500 to-slate-400",
        }
    }
  }

  const { badge, gradient } = getStatusInfo(type)

  const getActionButton = () => {
    switch (type) {
      case "ongoing":
        return (
          <button
            onClick={() => onAction(contest._id, "start")}
            className="w-full px-4 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 text-sm bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-500/20 hover:shadow-green-500/30"
          >
            <Play className="w-4 h-4" /> Start Now
          </button>
        )
      case "past":
        return (
          <button
            onClick={() => onAction(contest._id, "view")}
            className="w-full px-4 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 text-sm border border-slate-300 dark:border-slate-700 bg-transparent hover:bg-slate-100/50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300"
          >
            <Eye className="w-4 h-4" /> View Details
          </button>
        )
      case "upcoming":
        return (
          <button disabled className="relative w-full overflow-hidden px-4 py-2 rounded-lg font-semibold text-sm bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center gap-2 cursor-not-allowed">
            <span className="absolute inset-[-100%] animate-[shimmer_2s_infinite] bg-[linear-gradient(110deg,transparent,45%,rgba(255,255,255,0.2),55%,transparent)] dark:bg-[linear-gradient(110deg,transparent,45%,rgba(255,255,255,0.1),55%,transparent)]"></span>
            <Timer className="w-4 h-4" /> Starts Soon
          </button>
        )
      default:
        return null
    }
  }

  const formatDate = (dateString) => new Date(dateString).toLocaleString([], { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
  
  const getTimeRemaining = (startTime) => {
    const diff = new Date(startTime) - new Date()
    if (diff <= 0) return "Started"
    const d = Math.floor(diff / (1000 * 60 * 60 * 24))
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24)
    const m = Math.floor((diff / 1000 / 60) % 60)
    if (d > 0) return `${d}d ${h}h`
    if (h > 0) return `${h}h ${m}m`
    return `${m}m`
  }

  return (
    <div
      className={`relative group transition-all duration-500 ease-out ${isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className={`absolute -inset-px rounded-xl bg-gradient-to-r ${gradient} opacity-20 group-hover:opacity-50 blur-md group-hover:blur-lg transition-all duration-300`} />
      

      <div className="relative flex flex-col rounded-xl border border-slate-200 dark:border-slate-800/70 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl group-hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-1 overflow-hidden">
        {type === "ongoing" && (
          <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 text-xs font-medium text-green-400">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </div>
            Live
          </div>
        )}

        {/* Card Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800/70">
          <div className="flex items-start justify-between">
            <Badge className={badge}>{type.charAt(0).toUpperCase() + type.slice(1)}</Badge>
            {type === "upcoming" && (
              <div className="text-right">
                <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold">Starts in</div>
                <div className="text-sm font-bold text-slate-800 dark:text-slate-200">{getTimeRemaining(contest.startTime)}</div>
              </div>
            )}
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-3">{contest.title}</h3>
        </div>
        
        {/* Card Body - flex-grow allows this section to fill available space */}
        <div className="flex-grow p-5">
          <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 mb-4">{contest.description || "No description available for this contest."}</p>
          <div className="space-y-3">
            <InfoItem icon={<Calendar className="w-4 h-4 text-blue-500" />} label="Starts" value={formatDate(contest.startTime)} />
            <InfoItem icon={<Clock className="w-4 h-4 text-red-500" />} label="Ends" value={formatDate(contest.endTime)} />
          </div>
        </div>

        {/* Card Footer - mt-auto pushes it to the bottom */}
        <div className="mt-auto p-5 border-t border-slate-200 dark:border-slate-800/70 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
            <Target className="w-4 h-4" />
            <span>{lengthOf || 0} Problems</span>
          </div>
          <div className="w-1/2">
            {getActionButton()}
          </div>
        </div>
      </div>
    </div>
  )
}



const TabButton = ({ active, onClick, children, count }) => (
  <button
    onClick={onClick}
    className={`relative px-4 py-2 rounded-lg font-semibold text-sm transition-colors duration-300 flex items-center justify-center gap-2
      ${active 
        ? "text-slate-900 dark:text-white" 
        : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
      }`
    }
  >
    {active && <div className="absolute inset-0 bg-white dark:bg-slate-800 rounded-lg shadow-md z-0" />}
    <span className="relative z-10 flex items-center gap-2">{children}</span>
    {count > 0 && <Badge className={`relative z-10 ml-1 ${active ? "bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200" : "bg-slate-200/50 dark:bg-slate-700/50"}`}>{count}</Badge>}
  </button>
)

export default function ContestPage() {
  const navigate = useNavigate()
  const [darkMode, setDarkMode] = useState(false)
  const [activeTab, setActiveTab] = useState("upcoming")
  const [contests, setContests] = useState({ upcoming: [], ongoing: [], past: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode)
  }, [darkMode])

  useEffect(() => {
    fetchContests()
  }, [])

  const fetchContests = async () => {
    try {
      setLoading(true)
      const response = await axiosClient.get("/contest/getAllContests")
      if (response.data.success) {
        setContests({
          upcoming: response.data.upcoming || [],
          ongoing: response.data.ongoing || [],
          past: response.data.past || [],
        })
      }
    } catch (err) {
      setError("Failed to load contests")
      console.error("Error fetching contests:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleContestAction = async (contestId, action) => {
    if (action === "start") {
      navigate(`/contest/${contestId}/start`)
    } else if (action === "view") {
      navigate(`/contest/view/${contestId}`)
    }
  }

  const customStyles = `
    @keyframes shimmer {
      100% { transform: translateX(100%); }
    }
  `

  return (
    <div className=" relative min-h-screen text-slate-700 dark:text-slate-300 isolate font-sans">
      <style>{customStyles}</style>
      
      <CircuitBoardBackground isDark={darkMode} />
      <div className="relative min-h-screen p-4 sm:p-6">
        <header className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/">
            <div className="relative top-1">
              <img src={logo} alt="Logo" className="h-12 w-auto max-w-[150px] object-contain" />
            </div>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <button 
              onClick={() => navigate("/myContests")} 
              className="h-10 px-3 rounded-lg flex items-center gap-2 text-sm font-semibold bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border border-slate-200 dark:border-slate-800 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition-all duration-300"
            >
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">My Contests</span>
            </button>
            <button 
              onClick={() => setDarkMode(!darkMode)} 
              className="h-10 w-10 flex items-center justify-center rounded-lg bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border border-slate-200 dark:border-slate-800 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition-all duration-300"
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-yellow-400 transition-transform duration-300 hover:rotate-180" />
              ) : (
                <Moon className="w-5 h-5 text-slate-700 transition-transform duration-300 hover:rotate-12" />
              )}
            </button>
          </div>
        </header>

        <main className="flex flex-col items-center pt-20 sm:pt-24">
          <div className="w-full max-w-7xl">
            <div className="text-center mb-10">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-3">Compete & Conquer</h1>
              <p className="text-md sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Hone your skills in our lineup of competitive programming challenges.</p>
            </div>
            <div className="flex justify-center mb-10">
              <div className="flex gap-2 p-1.5 bg-slate-100/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-200 dark:border-slate-800">
                <TabButton active={activeTab === "upcoming"} onClick={() => setActiveTab("upcoming")} count={contests.upcoming.length}>
                  <Calendar className="w-4 h-4" />Upcoming
                </TabButton>
                <TabButton active={activeTab === "ongoing"} onClick={() => setActiveTab("ongoing")} count={contests.ongoing.length}>
                  <Play className="w-4 h-4" />Ongoing
                </TabButton>
                <TabButton active={activeTab === "past"} onClick={() => setActiveTab("past")} count={contests.past.length}>
                  <Trophy className="w-4 h-4" />Past
                </TabButton>
              </div>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                {[...Array(3)].map((_, i) => <div key={i} className="h-[420px] rounded-xl bg-slate-200 dark:bg-slate-800"></div>)}
              </div>
            ) : contests[activeTab].length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {contests[activeTab].map((contest, index) => (
                  <ContestCard key={contest._id} contest={contest} type={activeTab} lengthOf={contest.problems.length} onAction={handleContestAction} index={index} />
                ))}
              </div>
            ) : (
              <div className="col-span-full text-center py-16">
                <div className="text-6xl mb-4 opacity-50">{activeTab === "upcoming" ? "📅" : activeTab === "ongoing" ? "🏃‍♂️" : "🏆"}</div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">No {activeTab} contests found</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  {activeTab === "upcoming" && "Stay tuned! New challenges are on the horizon."}
                  {activeTab === "ongoing" && "The arena is quiet for now. Check the upcoming tab!"}
                  {activeTab === "past" && "The hall of fame is empty. Time to make history!"}
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}