"use client"

import { useState, useEffect, useCallback, memo, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import Editor from "@monaco-editor/react"
import axiosClient from "../utils/axiosClient"
import {
  Sun,
  Moon,
  Send,
  RotateCcw,
  Maximize,
  Minimize,
  CheckCircle,
  Code,
  ChevronDown,
  Check,
  X,
  AlertCircle,
  Info,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Timer,
} from "lucide-react"


const Toast = memo(({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000)
    return () => clearTimeout(timer)
  }, [onClose])

  const icons = {
    success: CheckCircle2,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
  }

  const Icon = icons[type]

  return (
    <div
      className={`fixed top-4 right-4 z-50 flex items-center gap-2 p-3 rounded-lg shadow-xl border backdrop-blur-sm animate-in slide-in-from-right-full duration-300 text-sm ${
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

// Custom Dropdown Component 
const CustomDropdown = memo(({ value, onChange, options, placeholder, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState(null)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const selected = options.find((opt) => opt.value === value)
    setSelectedOption(selected)
  }, [value, options])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSelect = (option) => {
    console.log(option.value)
    onChange(option.value)
    setIsOpen(false)
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 text-xs bg-white border border-gray-300 dark:border-gray-700 rounded-lg hover:shadow-md transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-900 focus:outline-none focus:ring-1 focus:ring-black/20 dark:focus:ring-white/20 focus:border-black dark:focus:border-white text-gray-900 dark:bg-black dark:text-white font-bold shadow-lg"
      >
        <span className="truncate font-medium">{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown
          size={12}
          className={`ml-1 text-gray-500 dark:text-gray-400 transition-all duration-200 ${isOpen ? "rotate-180 scale-110" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl backdrop-blur-sm">
          <div className="py-1 max-h-48 overflow-y-auto">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option)}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium hover:bg-gray-50 dark:hover:bg-gray-900 transition-all duration-150 text-gray-900 dark:text-gray-100 ${value === option.value ? "bg-gray-100 dark:bg-gray-800 text-black dark:text-white" : ""}`}
              >
                <span>{option.label}</span>
                {value === option.value && <Check size={12} className="text-black dark:text-white" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
})

const LoadingSpinner = memo(({ className = "h-3 w-3" }) => (
  <div
    className={`animate-spin rounded-full border-2 border-gray-200 dark:border-gray-700 border-t-black dark:border-t-white shadow-lg ${className}`}
  ></div>
))

export function ContestProblemPage() {
  const { contestId, problemId } = useParams()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  const [darkMode, setDarkMode] = useState(false)
  const [isEditorFullscreen, setIsEditorFullscreen] = useState(false)
  const [problem, setProblem] = useState(null)
  const [contest, setContest] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [submissionResult, setSubmissionResult] = useState(null)
  const [toast, setToast] = useState(null)
  const [timeRemaining, setTimeRemaining] = useState("")

  // Editor states
  const [activeLanguage, setActiveLanguage] = useState("javascript")
  const [code, setCode] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode)
  }, [darkMode])

  useEffect(() => {
    fetchProblemData()
    fetchContestData()
  }, [problemId, contestId, user])

  
  useEffect(() => {
    if (!contest?.endTime) return

    const timer = setInterval(() => {
      const now = new Date()
      const end = new Date(contest.endTime)
      const diff = end - now

      if (diff <= 0) {
        setTimeRemaining("Contest Ended")
        clearInterval(timer)
        return
      }

      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setTimeRemaining(
        `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
      )
    }, 1000)

    return () => clearInterval(timer)
  }, [contest])

  const fetchProblemData = async () => {
    try {
      setLoading(true)
      const res = await axiosClient.get(`/problem/problemById/${problemId}`)
      setProblem(res.data)
    } catch (err) {
      setError("Could not load the problem.")
    } finally {
      setLoading(false)
    }
  }

  const fetchContestData = async () => {
    try {
      const res = await axiosClient.get(`/contest/myContest/${contestId}`)
      setContest(res.data.contest)

     
      const problemData = res.data.problems?.find((p) => p._id === problemId)
      if (problemData?.submission) {
        setCode(problemData.submission.code)
        setActiveLanguage(problemData.submission.language)
      }
    } catch (err) {
      console.error("Error fetching contest data:", err)
    }
  }

  const showToast = useCallback((message, type = "info") => {
    setToast({ message, type })
  }, [])

  const hideToast = useCallback(() => {
    setToast(null)
  }, [])


  useEffect(() => {
    if (problem) {
      console.log(problem)
      setCode(problem?._doc?.startCode?.find((c) => c?.language.toLowerCase() === activeLanguage)?.initialCode || "")
    }
  }, [activeLanguage, problem])

  const handleSubmit = useCallback(async () => {
    if (!problem || !code.trim()) return

    setIsSubmitting(true)
    showToast("Submitting solution...", "info")

    try {

      const response = await axiosClient.post(`/submission/submit/${problemId}`, {
        
        language: activeLanguage,
        code: code.trim(),
      })
      const result=response.data
     


      const contestSubmissionData = {
        contestId,
        problemId,
        code: code.trim(),
        language: activeLanguage,
        status: result.status || "accepted",
        executionTime: result.runtime || 0,
        memoryUsed: result.memory || 0,
        testCasePassedCount: result.testCasesPassed || 0,
        totalTestCases: result.testCasesTotal || 0,
        score: result.status === "accepted" ? 100 : 0,
      }

      await axiosClient.post("/contest/contestProblemSubmission", contestSubmissionData)

      const submissionData = {
        status: result.status || "accepted",
        runtime: result.runtime || 0,
        memory: result.memory || 0,
        testCasesPassed: result.testCasesPassed || 0,
        totalTestCases: result.testCasesTotal || 0,
        error: result.errorMessage || null,
        testCaseResults: result.testCaseResults || null,
      }

      setSubmissionResult(submissionData)
      showToast(
        submissionData.status === "accepted" ? "Solution accepted!" : "Solution needs improvement",
        submissionData.status === "accepted" ? "success" : "error",
      )
    } catch (err) {
      const errorData = {
        status: "error",
        runtime: 0,
        memory: 0,
        testCasesPassed: 0,
        totalTestCases: problem._doc?.visibleTestCases?.length || 0,
        error: err.response?.data?.message || err.message || "Submission failed. Please try again.",
        testCaseResults: null,
      }
      setSubmissionResult(errorData)
      showToast("Submission failed", "error")
    } finally {
      setIsSubmitting(false)
    }
  }, [problem, code, activeLanguage, problemId, contestId, showToast])

  const onClick=()=>{
    navigate(`/contest/${contestId}/start`)
  }

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-black dark:via-gray-900 dark:to-black">
        <div className="flex flex-col items-center gap-4 p-6 rounded-xl bg-white/80 dark:bg-black/80 backdrop-blur-sm shadow-2xl border border-gray-200 dark:border-gray-700">
          <LoadingSpinner className="h-8 w-8" />
          <span className="text-base font-bold text-gray-700 dark:text-gray-300">Loading Problem...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-black dark:via-gray-900 dark:to-black">
        <div className="text-center p-6 rounded-xl bg-white/80 dark:bg-black/80 backdrop-blur-sm shadow-2xl border border-gray-200 dark:border-gray-700">
          <div className="text-4xl mb-4 text-red-500 animate-bounce">⚠️</div>
          <div className="text-base font-bold text-gray-900 dark:text-white">{error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-black dark:via-gray-900 dark:to-black text-gray-900 dark:text-white relative overflow-hidden">
      <div className="flex flex-col h-screen relative z-10">
        {/* Header */}
        <header className="flex-shrink-0 bg-white/90 dark:bg-black/90 border-b border-gray-200 dark:border-gray-800 shadow-lg backdrop-blur-sm">
          <div className="w-full flex items-center justify-between px-6 h-12">
            <div className="flex items-center gap-4">
              <button
                onClick={onClick}
                className="flex items-center gap-2 text-base font-bold text-gray-900 dark:text-white hover:text-black dark:hover:text-white transition-all duration-300 hover:scale-105"
              >
                <ArrowLeft className="w-4 h-4" />
                <div className="p-1.5 rounded-lg bg-gray-100 dark:bg-white shadow-lg hover:shadow-xl transition-all duration-200">
                  <Code className="w-4 h-4 text-black dark:text-black" />
                </div>
                <div>Back to Contest</div>
              </button>
            </div>

            <div className="flex items-center gap-4">
              {/* Contest Timer */}
              <div className="flex items-center gap-2 px-4 py-2 bg-white/90 dark:bg-black/90 rounded-lg border border-gray-200 dark:border-gray-700">
                <Timer className="w-4 h-4 text-red-500" />
                <span className="font-mono font-bold text-red-500">{timeRemaining}</span>
              </div>

              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-110"
              >
                {darkMode ? (
                  <Sun size={16} className="text-yellow-500" />
                ) : (
                  <Moon size={16} className="text-gray-700" />
                )}
              </button>
            </div>
          </div>
        </header>

        <main className="flex-grow flex w-full overflow-hidden px-6 py-4 gap-4">
          {/* Problem Panel */}
          <div
            className={`transition-all duration-500 ease-in-out ${isEditorFullscreen ? "w-0 opacity-0 overflow-hidden" : "w-1/2 opacity-100"}`}
          >
            <ContestProblemPanel
              problem={problem}
              contest={contest}
              isVisible={!isEditorFullscreen}
              submissionResult={submissionResult}
            />
          </div>

          {/* Editor Panel */}
          <div
            className={`transition-all duration-500 ease-in-out ${isEditorFullscreen ? "w-full" : "flex-1"} flex flex-col`}
          >
            <ContestEditorPanel
              problem={problem}
              darkMode={darkMode}
              isEditorFullscreen={isEditorFullscreen}
              setIsEditorFullscreen={setIsEditorFullscreen}
              code={code}
              setCode={setCode}
              activeLanguage={activeLanguage}
              setActiveLanguage={setActiveLanguage}
              isSubmitting={isSubmitting}
              handleSubmit={handleSubmit}
              showToast={showToast}
            />
          </div>
        </main>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </div>
  )
}


const ContestProblemPanel = memo(({ problem, contest, isVisible, submissionResult }) => {
  if (!isVisible) return null

  const getDifficultyStyles = () => ({
    easy: `bg-gradient-to-r from-green-50 to-green-100 text-green-800 border border-green-300 dark:from-green-900/30 dark:to-green-800/20 dark:text-green-400 dark:border-green-700 shadow-lg`,
    medium: `bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-800 border border-yellow-300 dark:from-yellow-900/30 dark:to-yellow-800/20 dark:text-yellow-400 dark:border-yellow-700 shadow-lg`,
    hard: `bg-gradient-to-r from-red-50 to-red-100 text-red-800 border border-red-300 dark:from-red-900/30 dark:to-red-800/20 dark:text-red-400 dark:border-red-700 shadow-lg`,
  })

  const difficultyStyles = getDifficultyStyles()

  return (
    <div className="w-full h-full flex flex-col bg-white/90 dark:bg-black/90 rounded-xl border-2 border-white dark:border-black shadow-2xl backdrop-blur-sm">
      <div className="flex-shrink-0 p-3 border-b-2 border-gray-900 dark:border-white bg-gray-50/50 dark:bg-gray-900/50 rounded-t-xl">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Problem Description</h2>
      </div>

      <div className="p-4 flex-grow overflow-y-auto">
        <div className="space-y-6">
          {/* Submission Result */}
          {submissionResult && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Submission Result</h3>
              <div
                className={`p-6 rounded-xl border-2 transition-all duration-300 shadow-2xl ${
                  submissionResult.status === "accepted"
                    ? "bg-gradient-to-br from-green-50 via-green-100 to-green-50 border-green-300 dark:from-green-900/30 dark:via-green-800/20 dark:to-green-900/30 dark:border-green-700"
                    : "bg-gradient-to-br from-red-50 via-red-100 to-red-50 border-red-300 dark:from-red-900/30 dark:via-red-800/20 dark:to-red-900/30 dark:border-red-700"
                }`}
              >
                <div className="flex items-center gap-4 mb-4">
                  {submissionResult.status === "accepted" ? (
                    <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                  ) : (
                    <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                  )}
                  <div>
                    <h3
                      className={`text-lg font-bold capitalize ${
                        submissionResult.status === "accepted"
                          ? "text-green-800 dark:text-green-400"
                          : "text-red-800 dark:text-red-400"
                      }`}
                    >
                      {submissionResult.status}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                      {submissionResult.status === "accepted"
                        ? "Great job! Your solution passed all test cases."
                        : "Your solution needs some work."}
                    </p>
                  </div>
                </div>

                {submissionResult.status === "accepted" && (
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-white dark:bg-black rounded-xl border-2 border-gray-200 dark:border-gray-700">
                      <p className="text-xs text-gray-600 dark:text-gray-400 font-bold uppercase tracking-wide">
                        Runtime
                      </p>
                      <p className="text-lg font-black text-black dark:text-white">{submissionResult.runtime}ms</p>
                    </div>
                    <div className="text-center p-4 bg-white dark:bg-black rounded-xl border-2 border-gray-200 dark:border-gray-700">
                      <p className="text-xs text-gray-600 dark:text-gray-400 font-bold uppercase tracking-wide">
                        Memory
                      </p>
                      <p className="text-lg font-black text-black dark:text-white">{submissionResult.memory}KB</p>
                    </div>
                    <div className="text-center p-4 bg-white dark:bg-black rounded-xl border-2 border-gray-200 dark:border-gray-700">
                      <p className="text-xs text-gray-600 dark:text-gray-400 font-bold uppercase tracking-wide">
                        Test Cases
                      </p>
                      <p className="text-lg font-black text-black dark:text-white">
                        {submissionResult.testCasesPassed}/{submissionResult.totalTestCases}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          <div>
            <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white mb-4">
              {problem._doc?.title}
            </h1>
            <div className="flex items-center gap-3 mb-6">
              <span
                className={`inline-flex items-center rounded-lg px-3 py-1 text-xs font-bold ${difficultyStyles[problem._doc.difficulty]}`}
              >
                {problem._doc?.difficulty}
              </span>
              <span className="inline-flex items-center rounded-lg px-3 py-1 text-xs font-bold bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white shadow-lg">
                {problem._doc?.tags}
              </span>
            </div>
          </div>

          <div
            className="prose dark:prose-invert max-w-none text-gray-700 dark:text-white font-bold leading-relaxed text-sm"
            dangerouslySetInnerHTML={{ __html: problem?._doc?.description?.replace(/\n/g, "<br/>") }}
          />

          <div className="space-y-6">
            {problem?._doc?.visibleTestCases?.map((tc, i) => (
              <div key={i} className="space-y-3">
                <h4 className="font-bold text-base text-gray-900 dark:text-white">Example {i + 1}:</h4>
                <div className="bg-white dark:bg-black p-4 rounded-xl border-2 border-white dark:border-black hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 shadow-lg hover:shadow-xl">
                  <div className="space-y-3 font-mono text-xs">
                    <div>
                      <div className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2 flex items-center gap-1">
                        <div className="w-1.5 h-1.5 bg-black dark:bg-white rounded-full"></div>
                        Input:
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg border-2 border-gray-200 dark:border-gray-500 shadow-inner font-medium">
                        {tc.input}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2 flex items-center gap-1">
                        <div className="w-1.5 h-1.5 bg-black dark:bg-white rounded-full"></div>
                        Output:
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg border-2 border-gray-200 dark:border-gray-500 shadow-inner font-medium">
                        {tc.output}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          
        </div>
      </div>
    </div>
  )
})

const ContestEditorPanel = memo(
  ({
    problem,
    darkMode,
    isEditorFullscreen,
    setIsEditorFullscreen,
    code,
    setCode,
    activeLanguage,
    setActiveLanguage,
    isSubmitting,
    handleSubmit,
    showToast,
  }) => {
    const languageOptions = [
      { value: "javascript", label: "JavaScript" },
      { value: "java", label: "Java" },
      { value: "c++", label: "C++" }
    ]

    const handleResetCode = useCallback(() => {
      if (problem) {
        console.log(problem)
        setCode(problem._doc?.startCode.find((c) => c.language.toLowerCase() === activeLanguage)?.initialCode || "")
        showToast("Code reset to initial state", "info")
      }
    }, [problem, activeLanguage, showToast, setCode])

    const toggleFullscreen = useCallback(() => {
      setIsEditorFullscreen((prev) => !prev)
      showToast(isEditorFullscreen ? "Exited fullscreen mode" : "Entered fullscreen mode", "info")
    }, [setIsEditorFullscreen, isEditorFullscreen, showToast])

    return (
      <div className="w-full h-full flex flex-col bg-white/90 dark:bg-black/90 rounded-xl border-2 border-white dark:border-black shadow-2xl backdrop-blur-sm">
        {/* Editor Header */}
        <div className="flex-shrink-0 p-3 flex justify-between items-center border-b-2 border-black dark:border-white bg-gray-50/50 dark:bg-gray-900/50 rounded-t-xl">
          <div className="flex items-center gap-3">
            <CustomDropdown
              value={activeLanguage}
              onChange={setActiveLanguage}
              options={languageOptions}
              placeholder="Select Language"
              className="w-32"
            />
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleResetCode}
              title="Reset Code"
              className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-all duration-200 hover:scale-110 hover:rotate-180"
            >
              <RotateCcw size={14} />
            </button>
            <button
              onClick={toggleFullscreen}
              title={isEditorFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-all duration-200 hover:scale-110"
            >
              {isEditorFullscreen ? <Minimize size={14} /> : <Maximize size={14} />}
            </button>
          </div>
        </div>

        {/* Editor */}
        <div className="flex-grow relative overflow-hidden">
          <Editor
            height="100%"
            language={activeLanguage}
            theme={darkMode ? "vs-dark" : "light"}
            value={code}
            onChange={(v) => setCode(v || "")}
            options={{
              minimap: { enabled: true },
              fontSize: 13,
              scrollBeyondLastLine: false,
              fontFamily:
                "'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'SF Mono', Monaco, 'Inconsolata', 'Roboto Mono', 'Source Code Pro', Menlo, 'Ubuntu Mono', monospace",
              lineHeight: 1.6,
              padding: { top: 16, bottom: 16 },
              lineNumbers: "on",
              folding: true,
              bracketMatching: "always",
              fontLigatures: true,
              renderWhitespace: "selection",
            }}
          />
        </div>

        {/* Submit Button */}
        <div className="flex-shrink-0 p-4 border-t-2 border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 rounded-b-xl">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !code.trim()}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-black dark:bg-white px-4 py-3 text-sm font-bold text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 hover:shadow-xl hover:scale-105 shadow-lg border-2 border-gray-900 dark:border-white"
          >
            {isSubmitting ? (
              <LoadingSpinner className="h-4 w-4" />
            ) : (
              <>
                <Send size={16} />
                Submit Solution
              </>
            )}
          </button>
        </div>
      </div>
    )
  },
)
