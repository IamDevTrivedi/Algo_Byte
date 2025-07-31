"use client"

import { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Swords, LogIn, History, PlusCircle, User, Hash, BrainCircuit, Tag, 
    Loader2, XCircle, Crown, Sun, Moon, ChevronDown, Users, ArrowRight 
} from "lucide-react";
import axiosClient from "../utils/axiosClient";
import { useSelector } from "react-redux";

// --- Thematic Background ---
const FloatingCodeBackground = ({ isDark }) => {
    const codeSnippets = [ "const", "() =>", "{}", "[]", "if (err)", "await", "import", "useState", "export", "null", "class", "...", "&&", "||", "flex", "async", "grid", "gap-4", "p-4", "SELECT *", "FROM users", "WHERE id=?", "<span>", "git push", "npm i", "useEffect", "return" ];
    return (
        <div className="fixed inset-0 -z-10 h-full w-full overflow-hidden bg-white dark:bg-black">
            <div className="absolute inset-0 bg-white dark:bg-black" style={{ backgroundImage: `radial-gradient(${isDark ? '#1E293B' : '#E2E8F0'} 1px, transparent 1px)`, backgroundSize: '30px 30px' }} />
            {codeSnippets.map((snippet, index) => (
                <span key={index} className={`absolute font-mono text-xs ${isDark ? "text-slate-700" : "text-slate-300"} animate-float select-none`} style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, animationDuration: `${25 + Math.random() * 20}s`, animationDelay: `${Math.random() * 15}s` }}>{snippet}</span>
            ))}
            <style jsx>{`
                @keyframes float {
                    0% { transform: translateY(0); opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { transform: translateY(-100vh); opacity: 0; }
                }
            `}</style>
        </div>
    );
};

// --- Helper Components ---
const ThemeToggle = ({ theme, toggleTheme }) => (
    <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 h-10 w-10 flex items-center justify-center rounded-lg bg-white/60 dark:bg-black/60 backdrop-blur-sm border border-slate-200 dark:border-slate-800 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition-all duration-300"
        aria-label="Toggle theme"
    >
        {theme === 'dark' ? <Sun size={20} className="text-yellow-400"/> : <Moon size={20} className="text-slate-700"/>}
    </button>
);

// --- Sub-component for "Create Battle" section ---
const CreateBattleRoom = ({ user }) => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [problems, setProblems] = useState([]);
    const [selectedProblemId, setSelectedProblemId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleFetchProblems = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axiosClient.get('/problem/getAllProblem');
            setProblems(response.data.problemNeeded);
            setStep(2);
        } catch (err) {
            setError("Failed to load problems. Please try again.");
            setStep(1);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateRoom = async () => {
        if (!selectedProblemId) return;
        setLoading(true);
        setError(null);
        setStep(3);
        try {
            const response = await axiosClient.post('/battle/createBattleRoom', { problemId: selectedProblemId, hostId:user._id, userName:user.firstName });
            const { roomId } = response.data;
            navigate(`/battle/${roomId}`);
        } catch (err) {
            setError("Could not create room. Please try again.");
            setStep(2);
        } finally {
            setLoading(false);
        }
    };

    const difficultyStyles = {
        easy: "text-green-700 bg-green-100/80 dark:text-green-300 dark:bg-green-900/40",
        medium: "text-yellow-700 bg-yellow-100/80 dark:text-yellow-300 dark:bg-yellow-900/40",
        hard: "text-red-700 bg-red-100/80 dark:text-red-300 dark:bg-red-900/40",
    };

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.div key="step1" exit={{ opacity: 0, scale: 0.95 }} className="text-center">
                        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">Start a New Challenge</h2>
                        <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm">Create a private room and invite a friend to a code duel.</p>
                        <button
                            onClick={handleFetchProblems}
                            disabled={loading}
                            className="w-full max-w-xs mx-auto py-2.5 px-4 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 shadow-md shadow-blue-500/20"
                        >
                            {loading ? <Loader2 className="animate-spin" size={18} /> : <PlusCircle size={18} />}
                            Create Battle Room
                        </button>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div key="step2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4 text-center">Select a Problem</h2>
                        <div className="space-y-2 max-h-[280px] overflow-y-auto pr-2 custom-scrollbar">
                            {problems.map(problem => (
                                <div
                                    key={problem._id}
                                    onClick={() => setSelectedProblemId(problem._id)}
                                    className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 ${selectedProblemId === problem._id ? 'border-blue-500 bg-blue-50 dark:bg-slate-700/50 ring-2 ring-blue-500' : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-400 dark:hover:border-slate-600'}`}
                                >
                                    <div className="flex justify-between items-center">
                                        <p className="font-medium text-sm text-slate-800 dark:text-slate-200">{problem.title}</p>
                                        <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded-full ${difficultyStyles[problem.difficulty]}`}>
                                            {problem.difficulty}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                                        <Tag size={12} />
                                        <span>{problem.tags}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={handleGenerateRoom}
                            disabled={!selectedProblemId || loading}
                            className="mt-6 w-full py-2.5 px-4 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-700 disabled:bg-blue-400 dark:disabled:bg-blue-800/60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 shadow-md shadow-blue-500/20"
                        >
                           <BrainCircuit size={18} /> Generate Room
                        </button>
                    </motion.div>
                )}

                {step === 3 && (
                     <motion.div key="step3" className="text-center flex flex-col items-center justify-center h-full min-h-[280px]">
                        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">Generating Your Arena...</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Please wait a moment.</p>
                    </motion.div>
                )}
            </AnimatePresence>
            {error && <p className="text-red-500 dark:text-red-400 text-center text-sm mt-4">{error}</p>}
        </motion.div>
    );
};

const JoinBattleRoom = ({ user }) => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState(null);

    const onSubmit = async (data) => {
        setLoading(true);
        setApiError(null);
        try {
            await axiosClient.post('/battle/joinBattleRoom', { roomId: data.roomId, userId:user._id, userName:user.firstName });
            navigate(`/battle/${data.roomId}`);
        } catch (err) {
            setApiError(err.response?.data?.message || "Failed to join room. Check the ID and try again.");
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2 text-center">Join an Existing Battle</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm text-center">Enter the Room ID to begin.</p>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="relative">
                    <Hash size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"/>
                    <input
                        {...register("roomId", { required: "Room ID is required" })}
                        placeholder="Enter Room ID"
                        className={`w-full pl-9 pr-3 py-2.5 bg-slate-100/50 dark:bg-slate-900/50 border rounded-lg text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.roomId ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'}`}
                    />
                </div>
                {errors.roomId && <p className="text-red-500 text-xs">{errors.roomId.message}</p>}
                {apiError && <p className="text-red-500 text-xs text-center">{apiError}</p>}
                
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 px-4 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 shadow-md shadow-blue-500/20"
                >
                    {loading ? <Loader2 className="animate-spin" size={18} /> : <LogIn size={18} />}
                    Join Battle
                </button>
            </form>
        </motion.div>
    );
};

// --- MODIFIED: PastBattles with bug fix and UI enhancements ---
const PastBattles = () => {
    const navigate = useNavigate();
    const [battles, setBattles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true);
            try {
                const response = await axiosClient.get('/battle/getAllBattles');
                setBattles(response.data.battles);
            } catch (err) {
                setError("Could not fetch battle history.");
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const redirectToLeaderBoard = (roomId) => {
        navigate(`/battle/LeaderBoard/${roomId}`);
    };

    const difficultyStyles = {
        easy: "text-green-700 bg-green-100/80 dark:text-green-300 dark:bg-green-900/40",
        medium: "text-yellow-700 bg-yellow-100/80 dark:text-yellow-300 dark:bg-yellow-900/40",
        hard: "text-red-700 bg-red-100/80 dark:text-red-300 dark:bg-red-900/40",
    };
    
    if (loading) {
        return <div className="flex justify-center items-center h-full min-h-[300px]"><Loader2 className="w-8 h-8 text-slate-500 dark:text-slate-400 animate-spin" /></div>;
    }
    
    if (error) {
        return <p className="text-red-500 dark:text-red-400 text-center">{error}</p>;
    }
console.log(battles);
    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4 text-center">Your Battle History</h2>
            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                {battles.length > 0 ? battles.map(battle => (
                    // BUG FIX: onClick is now on the main div, making the entire card clickable
                    <div 
                        key={battle._id} 
                        onClick={() => redirectToLeaderBoard(battle.roomId)}
                        className="group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 transition-all duration-200 hover:shadow-md dark:hover:border-slate-600 hover:scale-[1.02] cursor-pointer"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <p className="font-semibold text-sm text-slate-900 dark:text-slate-100">{battle?.problemId?.title}</p>
                                <div className="flex items-center gap-4 mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                                    <span className={`font-bold uppercase px-2 py-0.5 rounded-full ${difficultyStyles[battle?.problemId?.difficulty.toLowerCase()]}`}>
                                        {battle?.problemId?.difficulty}
                                    </span>
                                    <span>{new Date(battle?.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <ArrowRight className="w-5 h-5 text-slate-400 dark:text-slate-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-transform duration-200 group-hover:translate-x-1" />
                        </div>
                    </div>
                )) : <p className="text-slate-500 dark:text-slate-400 text-center text-sm py-8">No past battles found.</p>}
            </div>
        </motion.div>
    );
};

// --- Main Page Component ---
export default function BattleRoom() {
    const [activeTab, setActiveTab] = useState('create');
    const [theme, setTheme] = useState('light');
    const { user } = useSelector(state => state.auth);
   
    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
    }, [theme]);

    const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

    const tabs = useMemo(() => [
        { id: 'create', label: 'Create Room', icon: PlusCircle },
        { id: 'join', label: 'Join Room', icon: LogIn },
        { id: 'past', label: 'Past Battles', icon: History },
    ], []);

    return (
        <div className="min-h-screen bg-white dark:bg-black text-slate-800 dark:text-slate-200 flex items-center justify-center p-4 transition-colors duration-300 font-mono">
            <FloatingCodeBackground isDark={theme === 'dark'} />
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />

            <main className="w-full max-w-lg relative z-10">
                <div className="text-center mb-8">
                    <Swords className="mx-auto h-10 w-10 text-blue-600 dark:text-blue-500 mb-2" />
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Code Battle Arena</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Challenge others, sharpen your skills.</p>
                </div>

                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg p-2 sm:p-6">
                    <div className="flex justify-center border-b border-slate-200 dark:border-slate-700 mb-6">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`${
                                    activeTab === tab.id ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                                } relative flex items-center gap-2 py-3 px-4 text-sm font-medium transition-colors focus:outline-none`}
                            >
                                <tab.icon size={16} />
                                {tab.label}
                                {activeTab === tab.id && (
                                    <motion.div
                                        className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"
                                        layoutId="underline"
                                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                    />
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="min-h-[360px] px-2">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -10, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                {activeTab === 'create' && <CreateBattleRoom user={user} />}
                                {activeTab === 'join' && <JoinBattleRoom user={user} />}
                                {activeTab === 'past' && <PastBattles />}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </main>
        </div>
    );
}
