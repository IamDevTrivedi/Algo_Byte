"use client"

import { useEffect, useState, useMemo } from "react"
import axiosClient from "../utils/axiosClient"
import { useNavigate,Link } from "react-router-dom"
import logo from "../Images/logo.png"
import { Sun, Moon, Code, Search, Star } from "lucide-react"


const useTypewriter = (text, speed = 80) => {
  const [displayText, setDisplayText] = useState("")

  useEffect(() => {
    setDisplayText("")
    let i = 0
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayText(text.slice(0, i + 1))
        i++
      } else {
        clearInterval(timer)
      }
    }, speed)
    return () => clearInterval(timer)
  }, [text, speed])

  return displayText
}


const CircuitBoardBackground = () => (
  <div className="absolute inset-0 -z-10 h-full w-full overflow-hidden bg-white dark:bg-black">
    <div
      className="absolute inset-0 z-20 transition-opacity duration-300"
      style={{
        backgroundImage: `
          radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(99, 102, 241, 0.08), transparent 50%),
          radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(99, 102, 241, 0.04), transparent 70%)
        `,
      }}
    />
  </div>
)

// SVG Icons
const AllTopicsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
    <path d="M1 3.5A1.5 1.5 0 0 1 2.5 2h11A1.5 1.5 0 0 1 15 3.5v1.944a2 2 0 0 1-2 1.944H3a2 2 0 0 1-2-1.944V3.5zM2.5 3a.5.5 0 0 0-.5.5v1.944a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V3.5a.5.5 0 0 0-.5-.5h-11z" />
    <path d="M14 8a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h12zM2 9v3h12V9H2z" />
  </svg>
)
const ArrayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#FFB800" }}><path d="M14.5 17.5L19 22l-5-5m-5-5L5 8l4.5 4.5M8 22l14-14" /></svg>
)
const LinkedListIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#4A90E2" }}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72" /></svg>
)
const GraphIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#00C853" }}><path d="M18 8a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2Z" /><path d="M12 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h4" /><path d="M12 10V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4" /></svg>
)
const DPIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#9063F2" }}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>
)


const TopicFilters = ({ activeFilter, onFilterChange }) => {
  const topics = [{ name: "All Topics", value: "all", icon: <AllTopicsIcon /> },{ name: "Array", value: "array", icon: <ArrayIcon /> },{ name: "Linked List", value: "linkedList", icon: <LinkedListIcon /> },{ name: "Graph", value: "graph", icon: <GraphIcon /> },{ name: "DP", value: "dp", icon: <DPIcon /> },]
  return (
    <div className="relative mb-5"><div className="flex space-x-2 overflow-x-auto pb-3 scrollbar-hide">{topics.map((topic) => (<button key={topic.value} onClick={() => onFilterChange(topic.value)} className={`relative flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-300 hover:scale-105 ${activeFilter === topic.value ? "bg-black dark:bg-white text-white dark:text-black shadow-lg" : "bg-white dark:bg-black text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 border border-gray-200 dark:border-gray-700"}`}><div className="relative z-10 flex items-center gap-2">{topic.icon}<span>{topic.name}</span></div></button>))}</div></div>
  )
}


const ConfirmationModal = ({ isOpen, onClose, onConfirm, problem, isSubmitting }) => {
  const [scrollTop, setScrollTop] = useState(0)

  useEffect(() => {
    if (isOpen) {
      // Get current scroll position
      setScrollTop(window.scrollY)
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      className="absolute left-0 w-full z-50 bg-black/60 backdrop-blur-sm"
      style={{ top: scrollTop, height: "100vh" }}
      onClick={onClose}
    >
      <div
        className="relative mx-auto mt-40 w-full max-w-md rounded-2xl border border-slate-700 bg-slate-800/60 p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/20">
            <Star className="h-6 w-6 text-indigo-400" />
          </div>
          <h2 className="text-xl font-bold text-white">Confirm Selection</h2>
          <p className="mt-2 text-sm text-slate-400">
            Are you sure you want to set <span className="font-bold text-slate-200">"{problem.title}"</span> as the new Problem of the Day?
          </p>
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isSubmitting}
            className="flex min-w-[100px] items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-indigo-600/50"
          >
            {isSubmitting ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/50 border-t-white"></div>
            ) : (
              "Confirm"
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

const SuccessMessage = ({ message, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 4000)
    return () => clearTimeout(timer)
  }, [onDismiss])

  return (
    <div className="animate-fade-in-down fixed top-24 left-1/2 z-50 -translate-x-1/2 rounded-full border border-green-500/30 bg-green-500/20 px-6 py-3 text-sm font-semibold text-white shadow-lg backdrop-blur-md">
      {message}
    </div>
  )
}



const ProblemCard = ({ problem, index, onSelect }) => {
  const getDifficultyStyles = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "easy": return "text-green-800 dark:text-green-300 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
      case "medium": return "text-yellow-800 dark:text-yellow-300 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800"
      case "hard": return "text-red-800 dark:text-red-300 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
      default: return "text-gray-800 dark:text-gray-300 bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-800"
    }
  }

  return (
    <div className="syntax-border-container group w-full transition-all duration-300 ease-out">
      <div className="relative z-10 rounded-xl border border-gray-200 bg-white/95 p-4 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl dark:border-gray-700 dark:bg-black/95">
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-1 items-center gap-3">
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-gray-200 bg-gradient-to-br from-gray-100 to-gray-200 text-xs font-semibold text-gray-600 dark:border-gray-600 dark:from-gray-900/30 dark:to-gray-800/30 dark:text-gray-400">
              {index + 1}
            </span>
            <div className="flex flex-1 flex-col gap-2">
              <h2 className="text-sm font-semibold text-black dark:text-white">{problem.title}</h2>
              <div className="flex flex-wrap items-center gap-1.5">
                <div className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ${getDifficultyStyles(problem.difficulty)}`}>{problem.difficulty}</div>
                <div className="inline-flex items-center rounded-md border border-blue-200 bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-800 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-300">{problem.tags}</div>
              </div>
            </div>
          </div>
          <button
            onClick={() => onSelect(problem)}
            className="flex-shrink-0 flex items-center justify-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-100 px-3 py-1.5 text-xs font-semibold text-indigo-700 transition-all duration-300 hover:scale-110 dark:border-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 dark:hover:bg-indigo-900/50"
            title="Select as Problem of the Day"
          >
            <Star className="h-3 w-3" />
            <span className="hidden sm:inline">Select</span>
          </button>
        </div>
      </div>
    </div>
  )
}


export function CreatePOTD() {
  const navigate = useNavigate()
  const [problems, setProblems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [darkMode, setDarkMode] = useState(false)
  const [activeFilter, setActiveFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")


  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProblem, setSelectedProblem] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  const displayText = useTypewriter("Create Problem of the Day", 80)

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode)
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

  const handleSelectClick = (problem) => {
    setSelectedProblem(problem)
    setIsModalOpen(true)
    setSuccessMessage("") 
  }

  const handleConfirmSetPOTD = async () => {
    if (!selectedProblem) return;
    
    setIsSubmitting(true)
    try {

      await axiosClient.post("/potd/create", { problemId: selectedProblem._id })
      setSuccessMessage(`"${selectedProblem.title}" is now the Problem of the Day!`)
    } catch (apiError) {
      setError("Failed to set Problem of the Day.")
      console.error("API Error:", apiError)
    } finally {
      setIsSubmitting(false)
      setIsModalOpen(false)
      setSelectedProblem(null)
    }
  }

  return (
    <>
    
    <div className="min-h-screen relative text-black dark:text-white transition-colors duration-300 isolate">
      <CircuitBoardBackground />
      {successMessage && <SuccessMessage message={successMessage} onDismiss={() => setSuccessMessage("")} />}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmSetPOTD}
        problem={selectedProblem}
        isSubmitting={isSubmitting}
      />

      <nav className="sticky top-0 z-40 border-b border-gray-200 bg-white/90 shadow-lg backdrop-blur-xl dark:border-gray-700 dark:bg-black/90">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link to="/"><div className="relative top-1 left-2">
          <img
            src={logo}
            alt="Logo"
            className="h-12 w-auto max-w-[150px] object-contain"
          />
        </div>
        </Link>
            <div className="flex items-center gap-3">
                <button onClick={() => setDarkMode(!darkMode)} className="group rounded-xl border border-gray-200 bg-gray-100 p-2.5 transition-all duration-300 hover:scale-110 hover:bg-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700" title="Toggle theme">
                    {darkMode ? <Sun className="h-4 w-4 text-yellow-500 transition-transform duration-300 group-hover:rotate-180" /> : <Moon className="h-4 w-4 text-gray-700 transition-transform duration-300 group-hover:rotate-12" />}
                </button>
            </div>
        </div>
      </nav>

      <main className="relative z-10 mx-auto mb-12 mt-6 max-w-4xl p-5">
        <div className="relative z-10 rounded-2xl border border-gray-300 bg-white/95 p-6 shadow-2xl backdrop-blur-xl dark:border-gray-600 dark:bg-black/95">
          <div className="mb-8 text-center">
            <div className="mb-4 flex items-center justify-center gap-3">
              <div className="rounded-xl bg-indigo-600 p-2 shadow-lg"><Star className="h-5 w-5 text-white" /></div>
              <h1 className="text-2xl font-bold text-black dark:text-white sm:text-3xl">{displayText}</h1>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Select a problem to feature as the daily challenge.</p>
          </div>
          <TopicFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} />
          <div className="mb-6 flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
              <div className="relative w-full max-w-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><Search className="h-4 w-4 text-gray-400" /></div>
                <input type="text" placeholder="Search problems..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full rounded-xl border border-gray-200 bg-gray-50/80 py-2.5 pl-10 pr-3 text-sm font-medium text-black placeholder:text-gray-500 transition-all duration-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-900/80 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-indigo-400 dark:focus:ring-indigo-400/20"/>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <div className="text-sm font-black text-black dark:text-white">{filteredProblems.length}</div>
                  <div className="text-xs font-medium text-gray-600 dark:text-gray-400">Problems</div>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-6 dark:border-gray-700">
            {loading && <div className="flex justify-center items-center p-10"><div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-indigo-500"></div></div>}
            {error && <div className="p-10 text-center font-medium text-red-500">{error}</div>}
            {!loading && !error && (
              <div className="flex flex-col gap-3">
                {filteredProblems.length > 0 ? (
                  filteredProblems.map((problem, index) => (
                    <ProblemCard key={problem._id} problem={problem} index={index} onSelect={handleSelectClick} />
                  ))
                ) : (
                  <div className="py-12 text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-gradient-to-br from-gray-100 to-gray-200 dark:border-gray-600 dark:from-gray-800 dark:to-gray-700"><Search className="h-6 w-6 text-gray-400" /></div>
                    <h3 className="mb-1 text-base font-bold text-black dark:text-white">No problems found</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{searchTerm ? `No results found for "${searchTerm}".` : "No problems match the current filter."}</p>
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

export default CreatePOTD;