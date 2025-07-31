"use client"

import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Swords, Users, Copy, Check, Sun, Moon, Play, Loader2, Link2, Crown, LogOut 
} from "lucide-react";
import socket from "../utils/socket";
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

// BUG FIX: Corrected useTheme hook logic
const useTheme = () => {
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined' && window.localStorage) {
            const storedTheme = window.localStorage.getItem('theme');
            if (storedTheme) return storedTheme;
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return 'dark'; // Default theme
    });

    useEffect(() => {
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');

    return { theme, toggleTheme };
};

// --- COMPONENT: Main Battle Page ---
export default function BattlePage() {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const { user: currentUser } = useSelector(state => state.auth);
    const { theme, toggleTheme } = useTheme();
    const socketRef = useRef(null);

    const [players, setPlayers] = useState([]);
    const [connectionStatus, setConnectionStatus] = useState('connecting');
    const [isCopied, setIsCopied] = useState(false);
    const flag = useRef(false);
    
    useEffect(() => {
        if (!currentUser || !roomId) return;
        
        socketRef.current = socket;
        
        socket.emit("join-battle-room", { roomId, user: currentUser });
        
        socket.on("update-players", (updatedPlayers) => {
             setPlayers(Array.isArray(updatedPlayers) ? updatedPlayers : []);
            setConnectionStatus('connected');
        });

        socketRef.current.on("navigating-battle", (roomId) => {
            if (!flag.current) {
                flag.current = true;
                navigate(`/battle/problem/${roomId}`);
            }
        });

        return () => {
            socket.off("update-players");
            socket.off('start-battle');
            // Consider adding a leave-room emit here if applicable
        };
    }, [roomId, currentUser, navigate]);

    const handleCopyRoomId = () => {
        navigator.clipboard.writeText(roomId)
            .then(() => {
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000);
            })
            .catch(err => console.error('Failed to copy text: ', err));
    };
    
    const handleStartBattle = () => {
        if (socketRef.current) {
            flag.current = true;
            socketRef.current.emit("start-battle", { roomId });
            navigate(`/battle/problem/${roomId}`);
        }
    };
   console.log("curr",currentUser)
   console.log("host",players)
    const host = useMemo(() => players.find(p => p.isHost), [players]);
    console.log(host)
    const isHost = currentUser?._id === host?._id;
    console.log(isHost)

    return (
        <div className={`min-h-screen bg-white dark:bg-black text-slate-900 dark:text-slate-100 flex items-center justify-center p-4 transition-colors duration-300 font-mono`}>
            <FloatingCodeBackground isDark={theme === 'dark'} />
            
            <button
                onClick={toggleTheme}
                className="absolute top-4 right-4 h-10 w-10 flex items-center justify-center rounded-lg bg-white/60 dark:bg-black/60 backdrop-blur-sm border border-slate-200 dark:border-slate-800 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition-all duration-300"
                aria-label="Toggle theme"
            >
                {theme === 'dark' ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-slate-700" />}
            </button>
            <Link to="/battleRoom" className="absolute top-4 left-4 p-2 rounded-lg bg-white/60 dark:bg-black/60 backdrop-blur-sm border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition-colors">
                <LogOut size={20} className="transform rotate-180" />
            </Link>


            <main className="w-full max-w-3xl relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8"
                >
                    <div className="text-center mb-8">
                        <Swords className="mx-auto h-10 w-10 text-blue-500 mb-2" />
                        <h1 className="text-3xl font-bold tracking-tight">Battle Lobby</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">Waiting for players to join the arena.</p>
                        <div className="mt-4 inline-flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-2 border border-slate-200 dark:border-slate-700">
                           <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 mr-3">ROOM ID:</span>
                           <span className="text-base text-blue-600 dark:text-blue-400">{roomId}</span>
                           <button onClick={handleCopyRoomId} className="ml-3 p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" title="Copy Room ID">
                               {isCopied ? <Check size={16} className="text-green-500" /> : <Copy size={16} className="text-slate-500" />}
                           </button>
                        </div>
                    </div>

                    <div className="min-h-[250px]">
                        {connectionStatus === 'connecting' && (
                            <div className="flex flex-col items-center justify-center h-full text-slate-500 dark:text-slate-400">
                                <Loader2 className="w-8 h-8 animate-spin mb-3" />
                                <p>Connecting to Arena...</p>
                            </div>
                        )}
                        {connectionStatus === 'error' && (
                            <div className="flex flex-col items-center justify-center h-full text-red-500 dark:text-red-400">
                                <Link2 className="w-8 h-8 mb-3" />
                                <p className="font-semibold">Connection Failed</p>
                                <p className="text-sm">Could not connect to the battle server.</p>
                            </div>
                        )}
                        {connectionStatus === 'connected' && (
                            <div>
                                <h2 className="text-lg font-semibold flex items-center gap-2 mb-4 text-slate-800 dark:text-slate-200">
                                    <Users size={20} />
                                    Participants ({players.length})
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <AnimatePresence>
                                        {players.map((player) => (
                                            <motion.div
                                                key={player._id}
                                                layout
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                                                className="flex items-center p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-lg"
                                            >
                                                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center font-bold text-blue-600 dark:text-blue-300 mr-3 flex-shrink-0">
                                                    {player.firstName.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="flex-grow overflow-hidden">
                                                    <p className="font-semibold truncate flex items-center gap-2 text-slate-800 dark:text-slate-200">
                                                        {player.firstName}
                                                        {player._id === currentUser._id && <span className="text-xs text-blue-500 dark:text-blue-400 font-sans">(You)</span>}
                                                        {player.isHost && <Crown size={14} className="text-yellow-500 flex-shrink-0" title="Host" />}
                                                    </p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{player.emailId}</p>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                                {players.length < 2 && <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-8">Share the Room ID to invite another player.</p>}
                            </div>
                        )}
                    </div>
                    
                    <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 text-center">
                        {isHost ? (
                            <>
                                <motion.button
                                    onClick={handleStartBattle}
                                    disabled={players.length < 2 || connectionStatus !== 'connected'}
                                    className="w-full max-w-xs mx-auto py-3 px-6 bg-blue-600 text-white rounded-lg font-bold text-base shadow-lg shadow-blue-500/20 hover:bg-blue-700 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:shadow-none disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
                                    whileHover={{ scale: players.length < 2 ? 1 : 1.05 }}
                                    whileTap={{ scale: players.length < 2 ? 1 : 0.98 }}
                                >
                                    <Play size={20} />
                                    Start Battle
                                </motion.button>
                                {players.length < 2 && connectionStatus === 'connected' && <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">At least 2 players are needed to start.</p>}
                            </>
                        ) : (
                             <p className="text-sm text-slate-500 dark:text-slate-400">Waiting for the host ({host?.firstName || '...'}) to start the battle.</p>
                        )}
                    </div>
                </motion.div>
            </main>
        </div>
    );
}