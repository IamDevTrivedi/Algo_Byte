"use client"

import { useState, useEffect, useCallback, memo, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { io } from "socket.io-client"
import Editor from "@monaco-editor/react"

import axiosClient from "../utils/axiosClient" // Your configured Axios client
import {
  Sun, Moon, Send, RotateCcw, Maximize, Minimize, Code, ChevronDown,
  Check, X, AlertCircle, Info, CheckCircle2, XCircle, LogOut, Timer,
  UserCheck, UserX, UserCog, ShieldQuestion
} from "lucide-react"
import socket from "../utils/socket"

// --- Reusable UI Components (from your example) ---

const Toast = memo(({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = { success: CheckCircle2, error: XCircle, warning: AlertCircle, info: Info };
  const Icon = icons[type];
  const styles = {
    success: "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400",
    error: "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-400",
    info: "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400",
  };

  return (
    <div className={`fixed top-4 right-4 z-[100] flex items-center gap-3 p-3 rounded-lg shadow-xl border backdrop-blur-sm animate-in slide-in-from-right-full duration-300 text-sm ${styles[type]}`}>
      <Icon size={18} />
      <span className="font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100 transition-opacity"><X size={16} /></button>
    </div>
  );
});

const CustomDropdown = memo(({ value, onChange, options, placeholder, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button type="button" onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between px-3 py-2 text-sm bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all">
        <span className="font-medium truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown size={16} className={`ml-2 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl py-1 animate-in fade-in zoom-in-95">
          {options.map((option) => (
            <button key={option.value} type="button" onClick={() => { onChange(option.value); setIsOpen(false); }} className={`w-full text-left flex items-center justify-between px-3 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${value === option.value ? "text-indigo-600 dark:text-indigo-400" : ""}`}>
              {option.label}
              {value === option.value && <Check size={16} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
});

const LoadingSpinner = memo(({ className = "h-4 w-4" }) => (
  <div className={`animate-spin rounded-full border-2 border-current border-t-transparent ${className}`}></div>
));


// --- Main Battle Arena Page Component ---
export function BattleProblemPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const socketRef = useRef(null);

  const [darkMode, setDarkMode] = useState(false);
  const [isEditorFullscreen, setIsEditorFullscreen] = useState(false);
  
  const [battleDetails, setBattleDetails] = useState(null);
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [submissionResult, setSubmissionResult] = useState(null);
  const [toast, setToast] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState("00:00:00");
  const [opponentStatus, setOpponentStatus] = useState([]);

  // Editor states
  const [activeLanguage, setActiveLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  // --- Data Fetching ---
  useEffect(() => {
    const fetchBattleData = async () => {
      try {
        setLoading(true);
        // This endpoint should return battle details, including the problem object and participants
        const res = await axiosClient.get(`/battle/${roomId}`);
        
        setBattleDetails(res.data.battle);
        const res2=await axiosClient.get(`/problem/problemById/${res.data.battle.problemId}`)
        
        setProblem(res2.data._doc);
        setOpponentStatus(res.data.battle.players.map(p => ({ ...p, status: 'coding' })));
      } catch (err) {
        setError("Could not load the battle arena. It might have ended or does not exist.");
        showToast("Failed to load battle", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchBattleData();
  }, [roomId]);
  
  // --- Socket.IO Connection ---
  useEffect(() => {
    if (!battleDetails) return;

    
    socketRef.current = socket;

    socket.emit('join-battle-arena', { roomId, userId: user.id });
    socket.on('status-update', ({ userId, status }) => {
       
        setOpponentStatus((prev) => {
            const updated = prev.map((p) => {
              
              return String(p.userId) === String(userId) ? { ...p, status } : p;
            });
            
            return updated;
          });
        
      });
      
    socket.on('timer-update', (remaining) => setTimeRemaining(formatTime(remaining)));
    socket.on('player-finished', ({ userId, name }) => {
    
      setOpponentStatus(prev => prev.map(p => p._id == userId ? { ...p, status: 'finished' } : p));
      if (userId !== user.id) showToast(`${name} has finished!`, 'info');
    });
    socket.on('battle-ended', () => {
      showToast('The battle has ended!', 'warning');
      setTimeout(() => navigate(`/battle/${roomId}/results`), 3000);
    });

    return () => socket.disconnect();
  }, [battleDetails, roomId, user, navigate]);



  useEffect(() => {
    if (problem && !code) {
      const initialCode = problem.startCode?.find(c => c.language.toLowerCase() === activeLanguage)?.initialCode;
      setCode(initialCode || `// Start coding in ${activeLanguage}`);
    }
  }, [activeLanguage, problem, code]);
  
  const showToast = useCallback((message, type = "info") => {
    setToast({ id: Date.now(), message, type });
  }, []);
  
  const hideToast = useCallback(() => setToast(null), []);

  const formatTime = (seconds) => {
      if (seconds <= 0) return "00:00:00";
      const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
      const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
      const s = Math.floor(seconds % 60).toString().padStart(2, '0');
      return `${h}:${m}:${s}`;
  };

  const handleSubmit = useCallback(async () => {
    if (!problem || !code.trim()) return;
    setIsSubmitting(true);
    showToast("Submitting your solution...", "info");

    try {
      const response = await axiosClient.post(`/battle/submit`, {
        roomId,
        problemId: problem._id,
        language: activeLanguage,
        code: code.trim(),
      });
      const result = response.data;
      setSubmissionResult(result);
      
      
      if (result.status === "accepted") {
        showToast("Solution Accepted! Well done!", "success");
        socketRef.current.emit("update-user-status", {
            roomId,
            userId: user._id,
            name: user.firstName || user.name,
            status: "finished"
          });
        
      } else {
        showToast("Incorrect solution. Keep trying!", "error");
      }

    } catch (err) {
      const errorData = {
        status: "error",
        error: err.response?.data?.message || "Submission failed unexpectedly.",
      };
      setSubmissionResult(errorData);
      showToast(errorData.error, "error");
    } finally {
      setIsSubmitting(false);
    }
  }, [problem, code, activeLanguage, roomId, user, showToast]);

  const handleExitBattle = () => {
    if (window.confirm("Are you sure you want to leave the battle? This will count as a forfeit.")) {
      socketRef.current?.emit('leave-battle', { roomId, userId: user.id });
      navigate(`/battle/LeaderBoard/${roomId}`);
    }
  };

  if (loading) return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-4">
            <LoadingSpinner className="h-10 w-10 text-indigo-500" />
            <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">Entering Arena...</span>
        </div>
    </div>
  );

  if (error) return (
     <div className="h-screen w-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center p-8 rounded-xl bg-white dark:bg-gray-800 shadow-2xl border border-red-500/30">
            <ShieldQuestion className="mx-auto h-12 w-12 text-red-500 mb-4"/>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Arena Error</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-sm">{error}</p>
            <button onClick={() => navigate('/battle-lobby')} className="mt-6 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700">Back to Lobby</button>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white relative overflow-hidden">
      <div className="flex flex-col h-screen relative z-10">
        <header className="flex-shrink-0 bg-white/80 dark:bg-black/50 border-b border-gray-200 dark:border-gray-800 shadow-md backdrop-blur-sm">
          <div className="w-full flex items-center justify-between px-4 h-14">
            <div className="flex items-center gap-4">
                <Code className="h-7 w-7 text-indigo-500 p-1 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg"/>
                <h1 className="text-lg font-bold tracking-tight">{problem.title}</h1>
            </div>

            <div className="flex items-center gap-4">
              
              <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button onClick={handleExitBattle} className="flex items-center gap-2 px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-sm font-semibold rounded-lg hover:bg-red-500 hover:text-white dark:hover:bg-red-600 transition-all duration-200">
                <LogOut size={16} /> Exit Battle
              </button>
            </div>
          </div>
        </header>

        <main className={`flex-grow flex w-full overflow-hidden p-4 gap-4 transition-all duration-300 ${isEditorFullscreen ? 'p-0' : ''}`}>
          <div className={`transition-all duration-500 ease-in-out ${isEditorFullscreen ? "w-0 opacity-0 p-0" : "w-1/2 opacity-100"}`}>
            <BattleProblemPanel problem={problem} submissionResult={submissionResult} opponentStatus={opponentStatus} />
          </div>

          <div className={`transition-all duration-500 ease-in-out ${isEditorFullscreen ? "w-full h-full" : "flex-1"} flex flex-col`}>
            <BattleEditorPanel problem={problem} darkMode={darkMode} isEditorFullscreen={isEditorFullscreen} setIsEditorFullscreen={setIsEditorFullscreen} code={code} setCode={setCode} activeLanguage={activeLanguage} setActiveLanguage={setActiveLanguage} isSubmitting={isSubmitting} handleSubmit={handleSubmit} showToast={showToast} />
          </div>
        </main>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} key={toast.id} />}
    </div>
  )
}

// --- Child Components for the Battle Arena ---

const BattleProblemPanel = memo(({ problem, submissionResult, opponentStatus }) => {
  const difficultyStyles = {
    easy: "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-700",
    hard: "bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700",
  };

  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-black/80 rounded-xl border border-gray-200 dark:border-gray-800 shadow-lg backdrop-blur-sm">
      <div className="p-4 flex-grow overflow-y-auto">
        <div className="space-y-6">
        <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
             <h3 className="text-base font-bold text-gray-900 dark:text-white">Opponent Status</h3>
             <div className="space-y-2">
                {opponentStatus.map(op => (
                    <div key={op._id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800/50 rounded-md">
                        <span className="font-medium text-sm">{op.userName} </span>
                        {op.status === 'coding' && <div className="flex items-center gap-2 text-sm text-blue-500"><UserCog size={16} /> <span>Coding...</span></div>}
                        {op.status === 'finished' && <div className="flex items-center gap-2 text-sm text-green-500"><UserCheck size={16} /> <span>Finished</span></div>}
                        {op.status === 'left' && <div className="flex items-center gap-2 text-sm text-gray-500"><UserX size={16} /> <span>Left</span></div>}
                    </div>
                ))}
             </div>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{problem.title}</h1>
          <div className="flex items-center gap-3">
              <span className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold border ${difficultyStyles[problem.difficulty]}`}>{problem.difficulty}</span>
              <span className="inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300">{problem.tags}</span>
          </div>

          <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: problem.description?.replace(/\n/g, "<br/>") }} />

          {problem.visibleTestCases?.map((tc, i) => (
            <div key={i} className="space-y-2">
              <h4 className="font-semibold text-gray-800 dark:text-gray-200">Example {i + 1}:</h4>
              <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg border border-gray-200 dark:border-gray-700 font-mono text-xs space-y-2">
                <div><strong className="text-gray-600 dark:text-gray-400">Input:</strong> <span className="text-gray-800 dark:text-gray-200">{tc.input}</span></div>
                <div><strong className="text-gray-600 dark:text-gray-400">Output:</strong> <span className="text-gray-800 dark:text-gray-200">{tc.output}</span></div>
              </div>
            </div>
          ))}

         
          
        </div>
      </div>
    </div>
  );
});

const BattleEditorPanel = memo(({ problem, darkMode, isEditorFullscreen, setIsEditorFullscreen, code, setCode, activeLanguage, setActiveLanguage, isSubmitting, handleSubmit, showToast }) => {
    const languageOptions = [{ value: "javascript", label: "JavaScript" }, { value: "java", label: "Java" }, { value: "c++", label: "C++" }];
    
    useEffect(() => {
        if (problem) {
          const initialCode = problem.startCode.find(c => c.language.toLowerCase() === activeLanguage)?.initialCode;
          
          setCode(initialCode || "");
          showToast("Code has been reset", "info");
        }
    }, [problem, activeLanguage, showToast, setCode]);
    
    
    return (
      <div className="w-full h-full flex flex-col bg-white dark:bg-black/80 rounded-xl border border-gray-200 dark:border-gray-800 shadow-lg backdrop-blur-sm">
        <div className="flex-shrink-0 p-2 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
            <CustomDropdown value={activeLanguage} onChange={setActiveLanguage} options={languageOptions} placeholder="Language" className="w-36"/>
            
        </div>

        <div className="flex-grow relative overflow-hidden">
          <Editor height="100%" language={activeLanguage} theme={darkMode ? "vs-dark" : "light"} value={code} onChange={v => setCode(v || "")} options={{ minimap: { enabled: false }, fontSize: 14, scrollBeyondLastLine: false, fontFamily: "Fira Code, monospace", padding: { top: 16, bottom: 16 }, fontLigatures: true }} />
        </div>

        <div className="flex-shrink-0 p-3 border-t border-gray-200 dark:border-gray-700">
          <button onClick={handleSubmit} disabled={isSubmitting || !code.trim()} className="w-full flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-indigo-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 transition-colors shadow-lg hover:shadow-indigo-500/30">
            {isSubmitting ? <LoadingSpinner /> : <Send size={16} />}
            Submit Solution
          </button>
        </div>
      </div>
    );
});