
"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axiosClient from "../utils/axiosClient"
import { Clock, Code, Sun, Moon, ChevronRight, Target, CheckCircle, XCircle, Timer, Award } from "lucide-react"

// Unchanged Button component
const Button = ({ children, onClick, disabled, variant = "default", className = "", ...props }) => {
  const baseClasses = "px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 text-sm disabled:opacity-60 disabled:cursor-not-allowed";
  const variants = {
    default: "bg-green-600 hover:bg-green-700 text-white",
    outline: "border border-slate-300 dark:border-slate-700 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300",
  };
  return (<button onClick={onClick} disabled={disabled} className={`${baseClasses} ${variants[variant]} ${className}`} {...props}>{children}</button>);
};

// Unchanged Card component
const Card = ({ children, className = "" }) => (<div className={`rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm ${className}`}>{children}</div>);

// Unchanged Badge component
const Badge = ({ children, className = "" }) => (<span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${className}`}>{children}</span>);

// MODIFIED ProblemCard Component
const ProblemCard = ({ problem, index, submission, onProblemClick }) => {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "easy": return "text-green-600 dark:text-green-400";
      case "medium": return "text-yellow-600 dark:text-yellow-400";
      case "hard": return "text-red-600 dark:text-red-400";
      default: return "text-slate-600 dark:text-slate-400";
    }
  };

  const getStatusBorderColor = () => {
    if (!submission) return "border-l-slate-300 dark:border-l-slate-600";
    // If submission status is "accepted", border is green
    if (submission.status === "accepted") return "border-l-green-500 dark:border-l-green-400";
    // For any other status (e.g., "wrong answer"), border is red
    return "border-l-red-500 dark:border-l-red-400";
  };

  const isSolved = submission?.status === 'accepted';

  return (
    <div
      className="group w-full cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl dark:hover:shadow-black/40"
      onClick={() => onProblemClick(problem)}
    >
      <Card className={`bg-white dark:bg-slate-900 border-l-4 transition-colors duration-300 ${getStatusBorderColor()} dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] dark:hover:border-slate-700`}>
        <div className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-1">Problem {String.fromCharCode(65 + index)}</p>
              {/* START OF CHANGE: Added a flex container to show checkmark next to title */}
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-50">{problem.title}</h3>
                {isSolved && (
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                )}
              </div>
              {/* END OF CHANGE */}
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-slate-500 mb-1">Points</p>
              <p className="font-bold text-slate-800 dark:text-slate-200">{problem.points || 100}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <Badge className={`font-semibold ${getDifficultyColor(problem.difficulty)} bg-slate-100 dark:bg-slate-800`}>{problem.difficulty}</Badge>
            <div className="flex items-center gap-1 text-sm font-semibold text-slate-600 dark:text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span>Solve Problem</span>
              <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default function ContestStart() {
  const { contestId } = useParams();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [contest, setContest] = useState(null);
  const [problems, setProblems] = useState([]);
  const [submissions, setSubmissions] = useState({}); // This will now be populated
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState("abcd");
  const [isExiting, setIsExiting] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  useEffect(() => { document.documentElement.classList.toggle("dark", darkMode); }, [darkMode]);
  
  // This useEffect will run once when the component mounts or contestId changes
  useEffect(() => { 
    startContest(); 
  }, [contestId]);
  

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

  // MODIFIED startContest function
  const startContest = async () => {
    try {
      setLoading(true);
      // 1. Fetch contest details and problems
      const response = await axiosClient.get(`/contest/startContest/${contestId}`);
      if (response.data.success) {
        setContest(response.data.contest || {});
        setProblems(response.data.problems || []);
        
        // START OF CHANGE: Fetch user's submissions for this contest
        // Uses the backend controller you provided
        const submissionResponse = await axiosClient.post(`/contest/getSolvedContestProb`, { contestId });
        
        if (submissionResponse.data.solved) {
            const submissionsData = submissionResponse.data.solved; // This is an array of submissions
            const submissionsMap = {};
            
            // Process the array into a map for easy lookup.
            // The key will be the problemId.
            submissionsData.forEach(sub => {
                // We prioritize showing an 'accepted' status. If we already have a submission
                // for this problem, we only overwrite it if the new one is 'accepted'.
                const existingSubmission = submissionsMap[sub.problemId];
                if (!existingSubmission || sub.status === 'accepted') {
                    submissionsMap[sub.problemId] = sub;
                }
            });
            setSubmissions(submissionsMap);
        }
        // END OF CHANGE

      }
    } catch (err) {
      setError("Failed to load contest data. Please try again.");
      console.error("Error loading contest:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleExitContest = async () => {
    try {
      setIsExiting(true);
      const response = await axiosClient.post(`/contest/exitContest/${contestId}`);
      if (response.data.success) navigate("/contest");
      else alert("Failed to exit contest.");
    } catch (err) {
      console.error("Error exiting contest:", err);
      alert("Failed to exit contest.");
    } finally {
      setIsExiting(false);
      setShowExitConfirm(false);
    }
  };

  const handleProblemClick = (problem) => {
    navigate(`/contest/${contestId}/problem/${problem._id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading Contest...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <p className="text-slate-600 dark:text-slate-400">{error}</p>
          <Button onClick={() => navigate("/contest")} className="mt-4">Back to Contests</Button>
        </div>
      </div>
    );
  }
  
  
  const solvedCount = Object.values(submissions).filter((sub) => sub.status === "accepted").length;

  return (
    <div className="min-h-screen text-slate-800 dark:text-slate-200 isolate bg-slate-50 dark:bg-slate-950">
      <div className="relative min-h-screen p-4">
        <header className="absolute top-0 left-0 right-0 p-4 z-10">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => setShowExitConfirm(true)} disabled={isExiting} className="border-red-500/50 text-red-600 dark:text-red-400 hover:bg-red-500/10 !px-3">
                {isExiting ? "Exiting..." : "Exit"}
              </Button>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/60 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 backdrop-blur-md shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]">
                <Timer className="w-4 h-4 text-red-500" />
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{timeRemaining}</span>
              </div>
              <button onClick={() => setDarkMode(!darkMode)} className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/60 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 backdrop-blur-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-all hover:scale-110 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]">
                {darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-slate-700" />}
              </button>
            </div>
          </div>
        </header>

        <main className="flex flex-col items-center justify-center min-h-screen pt-24 pb-12">
          <div className="w-full max-w-7xl">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2">{contest?.title}</h1>
              <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-2xl mx-auto">{contest?.description}</p>
              <div className="flex justify-center gap-6 text-sm font-semibold">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400"><Target className="w-4 h-4 text-blue-500" /><span>{problems.length} Problems</span></div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400"><Award className="w-4 h-4 text-green-500" /><span>{solvedCount} Solved</span></div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {problems.map((problem, index) => (
                <ProblemCard 
                    key={problem._id} 
                    problem={problem} 
                    index={index} 
                    submission={submissions[problem._id]} // Pass the specific submission for this problem
                    onProblemClick={handleProblemClick}
                />
              ))}
            </div>

            {problems.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">No Problems Available</h3>
                <p className="text-slate-600 dark:text-slate-400">This contest doesn't have any problems yet.</p>
              </div>
            )}
          </div>
        </main>

        {showExitConfirm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 max-w-md w-full shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Exit Contest</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">Are you sure you want to exit? You will not be able to rejoin this contest.</p>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setShowExitConfirm(false)} className="flex-1">Cancel</Button>
                <Button onClick={handleExitContest} disabled={isExiting} className="flex-1 bg-red-600 hover:bg-red-700">{isExiting ? "Exiting..." : "Confirm Exit"}</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}