"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { io } from "socket.io-client"
import { motion, AnimatePresence } from "framer-motion"
import axiosClient from "../utils/axiosClient" // Your configured Axios client
import {
  Sun, Moon, Home, Trophy, CheckCircle, Clock, XCircle, UserCog, ShieldQuestion, Award
} from "lucide-react"
import socket from "../utils/socket"
import { memo } from "react"

// --- Helper Components ---

const LoadingSpinner = memo(({ className = "h-4 w-4" }) => (
  <div className={`animate-spin rounded-full border-2 border-current border-t-transparent ${className}`}></div>
));

const RankIcon = memo(({ rank }) => {
  if (rank === 1) return <Trophy size={22} className="text-yellow-400" fill="currentColor" />;
  if (rank === 2) return <Trophy size={20} className="text-gray-400" fill="currentColor" />;
  if (rank === 3) return <Trophy size={18} className="text-yellow-600" fill="currentColor" />;
  return <span className="font-bold text-sm text-gray-500 dark:text-gray-400">#{rank}</span>;
});

const StatusBadge = memo(({ status }) => {
  const statusConfig = {
    finished: { Icon: CheckCircle, text: "Finished", color: "text-green-500" },
    coding: { Icon: UserCog, text: "Coding...", color: "text-blue-500" },
    left: { Icon: XCircle, text: "Forfeited", color: "text-gray-500" },
  };
  const { Icon, text, color } = statusConfig[status] || statusConfig.coding;

  return (
    <div className={`flex items-center gap-2 text-sm font-medium ${color}`}>
      <Icon size={16} />
      <span>{text}</span>
    </div>
  );
});

// --- Main Battle Leaderboard Page Component ---

export function BattleLeaderboard() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const socketRef = useRef(null);

  const [leaderboard, setLeaderboard] = useState([]);
  const [battleInfo, setBattleInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBattleOver, setIsBattleOver] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  // Sort leaderboard with memoization for performance
  const sortedLeaderboard = useMemo(() => {
    return [...leaderboard].sort((a, b) => {
      // Sort by score descending
      if ((b.score ?? -1) > (a.score ?? -1)) return 1;
      if ((b.score ?? -1) < (a.score ?? -1)) return -1;
      // Then by time ascending (null time is considered last)
      if ((a.time ?? Infinity) < (b.time ?? Infinity)) return -1;
      if ((a.time ?? Infinity) > (b.time ?? Infinity)) return 1;
      return 0;
    });
  }, [leaderboard]);

  // --- Data Fetching and Socket.IO Connection ---
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);

        const res = await axiosClient.get(`/battle/leaderBoard/${roomId}`);
        
        setBattleInfo(res.data.battle);
        setLeaderboard(res.data.leaderboard);
        setIsBattleOver(res.data.isBattleOver);
      } catch (err) {
        setError("Could not load battle results. The battle may have expired.");
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();


    const currentSocket = socket; // shared socket instance
  socketRef.current = currentSocket;

  currentSocket.emit('join-results-page', { roomId });

  const handleLeaderboardUpdate = (updatedLeaderboard) => {
   
    setLeaderboard(updatedLeaderboard);
  };

  const handleBattleConcluded = (finalResults) => {
    setLeaderboard(finalResults);
    setIsBattleOver(true);
  };

  currentSocket.on('leaderboard-update', handleLeaderboardUpdate);
  currentSocket.on('battle-concluded', handleBattleConcluded);


  return () => {
    currentSocket.off('leaderboard-update', handleLeaderboardUpdate);
    currentSocket.off('battle-concluded', handleBattleConcluded);
  };
  }, [roomId]);


  if (loading) return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="flex flex-col items-center gap-4 text-gray-700 dark:text-gray-300">
        <LoadingSpinner className="h-10 w-10 text-indigo-500" />
        <span className="text-lg font-semibold">Loading Results...</span>
      </div>
    </div>
  );

  if (error) return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="text-center p-8 rounded-xl bg-white dark:bg-gray-800 shadow-2xl border border-red-500/30">
        <ShieldQuestion className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Results Unavailable</h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-sm">{error}</p>
        <button onClick={() => navigate('/battleRoom')} className="mt-6 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700">Back to Lobby</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full bg-grid-gray-200/50 dark:bg-grid-gray-700/30 [mask-image:radial-gradient(ellipse_at_center,white,transparent_80%)]"></div>

      <main className="w-full max-w-4xl relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/80 dark:bg-black/70 backdrop-blur-2xl border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl"
        >
          {/* Header */}
          <header className="p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
                <Award size={28} className="text-indigo-500"/>
                Battle Results
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Problem: {battleInfo?.problemId?.title || "..."}</p>
            </div>
            <div className="flex items-center gap-3">
                <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                </button>
                <button onClick={() => navigate('/battleRoom')} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-all duration-200">
                    <Home size={16} /> Return to Lobby
                </button>
            </div>
          </header>

          {/* Leaderboard Table */}
          <div className="p-6">
            {isBattleOver && (
                <div className="p-4 mb-6 text-center bg-green-50 dark:bg-green-900/20 border border-green-500/30 rounded-lg">
                    <h3 className="font-bold text-green-700 dark:text-green-300">Battle Concluded!</h3>
                    <p className="text-sm text-green-600 dark:text-green-400">The final results are in. Well played to all participants!</p>
                </div>
            )}
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700 text-xs uppercase text-gray-500 dark:text-gray-400">
                    <th className="p-3">Rank</th>
                    <th className="p-3">Player</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Score</th>
                    <th className="p-3 text-right">Time</th>
                  </tr>
                </thead>
                <tbody >
                    <AnimatePresence>
                    {sortedLeaderboard.map((player, index) => (
                        <motion.tr 
                            key={player.userId}
                            layout
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3, type: 'spring', stiffness: 300, damping: 30 }}
                            className={`border-b border-gray-100 dark:border-gray-800/50 ${player.userId === user.id ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''}`}
                        >
                            <td className="p-4 font-semibold w-20"><RankIcon rank={index + 1} /></td>
                            <td className="p-4 font-semibold text-gray-800 dark:text-gray-200">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-bold text-sm">
                                        {player.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span>{player.name} {player.userId === user.id && '(You)'}</span>
                                </div>
                            </td>
                            <td className="p-4 w-40"><StatusBadge status={player.status} /></td>
                            <td className="p-4 text-right font-bold text-lg">{player.score ?? '---'}</td>
                            <td className="p-4 text-right font-mono text-sm">{player.time ? `${player.time.toFixed(2)}s` : '---'}</td>
                        </motion.tr>
                    ))}
                    </AnimatePresence>
                </tbody>
              </table>
               {leaderboard.length === 0 && (
                 <div className="text-center py-10 text-gray-500">
                    <p>Waiting for participants to finish...</p>
                 </div>
               )}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}