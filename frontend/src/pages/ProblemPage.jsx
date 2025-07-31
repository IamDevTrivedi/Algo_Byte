"use client";
import { ChatAI } from "../customCompo/ChatAi";
import { useEffect, useState, useCallback, memo, useRef } from "react";
import { useParams, NavLink } from "react-router-dom";

import { useSelector } from "react-redux";
import Editor from "@monaco-editor/react";
import * as monaco from "@monaco-editor/react";
import logo from "../Images/logo.png";
import axiosClient from "../utils/axiosClient";
import { Resizable } from "re-resizable";
import socket from "../utils/socket";
import { Link } from "react-router-dom";
import {
  Sun,
  Moon,
  Play,
  Send,
  Lock,
  RotateCcw,
  Maximize,
  Minimize,
  FileText,
  Lightbulb,
  History,
  CheckCircle,
  Code,
  ChevronDown,
  Check,
  Search,
  Filter,
  Bookmark,
  Share2,
  Settings,
  Command,
  ChevronRight,
  Eye,
  Copy,
  RefreshCw,
  X,
  AlertCircle,
  Info,
  CheckCircle2,
  XCircle,
  LayoutGrid, // New Icon for layout toggle
  Users, // Icon for the new Collaborate button
} from "lucide-react";
import Editorial from "../customCompo/Editorial";

// Design System Tokens
const designTokens = {
  colors: {
    primary: "black",
    secondary: "gray",
    success: "green",
    warning: "yellow",
    error: "red",
    neutral: "gray",
  },
  spacing: [0, 2, 4, 6, 8, 12, 16, 20, 24, 32],
  borderRadius: [0, 4, 6, 8, 12, 16],
  shadows: ["none", "sm", "md", "lg", "xl", "2xl"],
};

// Professional Toast Notification System
const Toast = memo(({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: CheckCircle2,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
  };

  const Icon = icons[type];

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
      <button
        onClick={onClose}
        className="ml-1 hover:opacity-70 transition-opacity"
      >
        <X size={14} />
      </button>
    </div>
  );
});

// Professional Loading Skeleton
const SkeletonLoader = memo(() => (
  <div className="animate-pulse space-y-4 p-4">
    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
    <div className="space-y-2">
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
    </div>
    <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
  </div>
));

// Professional Search Component
const SearchInput = memo(({ placeholder, value, onChange }) => (
  <div className="relative flex-1 max-w-xs">
    <Search
      size={14}
      className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
    />
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full pl-7 pr-3 py-1.5 text-xs font-medium bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md focus:outline-none focus:ring-1 focus:ring-black/20 dark:focus:ring-white/20 focus:border-black dark:focus:border-white transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-600"
    />
  </div>
));

// Professional Filter Dropdown
const FilterDropdown = memo(({ options, selected, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md hover:border-gray-400 dark:hover:border-gray-600 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-900"
      >
        <Filter size={12} />
        <span>Filter</span>
        <ChevronDown
          size={10}
          className={`transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-1 w-32 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50 animate-in fade-in-0 zoom-in-95 duration-200">
          <div className="py-1">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-1.5 text-xs font-medium hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors duration-150 ${
                  selected === option
                    ? "bg-gray-100 dark:bg-gray-800 text-black dark:text-white"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

// Professional Status Badge
const StatusBadge = memo(({ status, count, size = "sm" }) => {
  const sizeClasses = {
    sm: "px-1.5 py-0.5 text-xs",
    md: "px-2 py-1 text-xs",
    lg: "px-3 py-1.5 text-sm",
  };

  const statusColors = {
    solved:
      "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
    wrong:
      "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
    unsolved:
      "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700",
  };

  return (
    <div
      className={`inline-flex items-center gap-1 rounded-full border font-medium ${sizeClasses[size]} ${statusColors[status]}`}
    >
      <div
        className={`w-1.5 h-1.5 rounded-full ${
          status === "solved"
            ? "bg-green-500"
            : status === "wrong"
            ? "bg-red-500"
            : "bg-gray-400"
        }`}
      />
      <span>
        {count} {status}
      </span>
    </div>
  );
});

// Professional Breadcrumb Navigation
const Breadcrumb = memo(({ items }) => (
  <nav className="flex items-center space-x-1 text-xs text-gray-600 dark:text-gray-400 mb-4">
    {items.map((item, index) => (
      <div key={index} className="flex items-center">
        {index > 0 && <ChevronRight size={12} className="mx-1" />}
        <span
          className={`${
            index === items.length - 1
              ? "text-black dark:text-white font-medium"
              : "hover:text-gray-900 dark:hover:text-gray-200 cursor-pointer"
          }`}
        >
          {item}
        </span>
      </div>
    ))}
  </nav>
));

// Professional Keyboard Shortcuts Panel
const KeyboardShortcuts = memo(({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: "⌘ + K", action: "Quick search" },
    { key: "⌘ + Enter", action: "Submit code" },
    { key: "⌘ + R", action: "Run code" },
    { key: "⌘ + /", action: "Toggle comments" },
    { key: "F11", action: "Toggle fullscreen" },
    { key: "Esc", action: "Close dialogs" },
  ];

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-gray-700 shadow-2xl max-w-sm w-full p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            Keyboard Shortcuts
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
          >
            <X size={16} />
          </button>
        </div>
        <div className="space-y-2">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="flex items-center justify-between py-1">
              <span className="text-gray-700 dark:text-gray-300 text-sm">
                {shortcut.action}
              </span>
              <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono font-medium">
                {shortcut.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

// Custom Dropdown Component with Professional Styling
const CustomDropdown = memo(
  ({ value, onChange, options, placeholder, className = "" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const dropdownRef = useRef(null);

    useEffect(() => {
      const selected = options.find((opt) => opt.value === value);
      setSelectedOption(selected);
      if (value && onChange) {
        onChange(value);
      }
    }, [value, options, onChange]);

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target)
        ) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (option) => {
      if (onChange) {
        onChange(option.value);
      }
      setIsOpen(false);
    };

    const groupedOptions = options.reduce((acc, option) => {
      const category = option.category || "Other";
      if (!acc[category]) acc[category] = [];
      acc[category].push(option);
      return acc;
    }, {});

    return (
      <div className={`relative ${className}`} ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`
          w-full flex items-center justify-between px-3 py-2 text-xs 
          bg-white  border border-gray-300 dark:border-gray-700
          rounded-lg  hover:shadow-md transition-all duration-200
          hover:border-gray-400 dark:hover:border-gray-600
          hover:bg-gray-50 dark:hover:bg-gray-900
          focus:outline-none focus:ring-1 focus:ring-black/20 dark:focus:ring-white/20 focus:border-black dark:focus:border-white
          text-gray-900 dark:bg-black dark:text-white font-bold dark:font-bold shadow-lg
          ${
            isOpen
              ? "border-black dark:border-white ring-1 ring-black/20 dark:ring-white/20"
              : ""
          }
        `}
        >
          <span className="truncate font-medium">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown
            size={12}
            className={`ml-1 text-gray-500 dark:text-gray-400 transition-all duration-200 ${
              isOpen ? "rotate-180 scale-110" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl backdrop-blur-sm animate-in fade-in-0 zoom-in-95 duration-200">
            <div className="py-1 max-h-48 overflow-y-auto">
              {Object.entries(groupedOptions).map(
                ([category, categoryOptions]) => (
                  <div key={category}>
                    {Object.keys(groupedOptions).length > 1 && (
                      <div className="px-3 py-1 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                        {category}
                      </div>
                    )}
                    {categoryOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleSelect(option)}
                        className={`
                      w-full flex items-center justify-between px-3 py-2 text-xs font-medium
                      hover:bg-gray-50 dark:hover:bg-gray-900 transition-all duration-150
                      text-gray-900 dark:text-gray-100
                      ${
                        value === option.value
                          ? "bg-gray-100 dark:bg-gray-800 text-black dark:text-white"
                          : ""
                      }
                    `}
                      >
                        <span>{option.label}</span>
                        {value === option.value && (
                          <Check
                            size={12}
                            className="text-black dark:text-white"
                          />
                        )}
                      </button>
                    ))}
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
);

// Enhanced UI Icons with Professional Styling
const CheckIcon = memo(({ className = "w-4 h-4" }) => (
  <CheckCircle
    className={`text-green-600 dark:text-green-400 drop-shadow-lg ${className}`}
  />
));
const CrossIcon = memo(({ className = "w-4 h-4" }) => (
  <div
    className={`rounded-full bg-red-100 dark:bg-red-900/40 p-0.5 shadow-lg ${className}`}
  >
    <div className="w-2.5 h-2.5 bg-red-600 dark:bg-red-500 rounded-full flex items-center justify-center shadow-inner">
      <span className="text-white text-xs font-bold">×</span>
    </div>
  </div>
));
const LoadingSpinner = memo(({ className = "h-3 w-3" }) => (
  <div
    className={`animate-spin rounded-full border-2 border-gray-200 dark:border-gray-700 border-t-black dark:border-t-white shadow-lg ${className}`}
  ></div>
));

const getDifficultyStyles = () => ({
  easy: `bg-gradient-to-r from-green-50 to-green-100 text-green-800 border border-green-300 dark:from-green-900/30 dark:to-green-800/20 dark:text-green-400 dark:border-green-700 shadow-lg`,
  medium: `bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-800 border border-yellow-300 dark:from-yellow-900/30 dark:to-yellow-800/20 dark:text-yellow-400 dark:border-yellow-700 shadow-lg`,
  hard: `bg-gradient-to-r from-red-50 to-red-100 text-red-800 border border-red-300 dark:from-red-900/30 dark:to-red-800/20 dark:text-red-400 dark:border-red-700 shadow-lg`,
});

// Professional Code Viewer Modal
const CodeViewerModal = memo(({ submission, darkMode, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!submission) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-md z-50  flex items-center justify-center p-4 animate-in fade-in-0 duration-300"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl bg-white dark:bg-black rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-shrink-0 p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <div className="p-1.5 rounded bg-gray-100 dark:bg-gray-800 shadow-lg">
                <Code className="w-4 h-4 text-black dark:text-white" />
              </div>
              Submission Details
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 font-medium">
              {new Date(submission.createdAt).toLocaleString()}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => navigator.clipboard.writeText(submission.code)}
              className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-all duration-200"
              title="Copy code"
            >
              <Copy size={14} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-all duration-200"
              aria-label="Close modal"
            >
              <X size={16} />
            </button>
          </div>
        </div>
        <div className="flex-grow p-4 h-100 overflow-hidden">
          <Editor
            height="100%"
            language={submission.language?.toLowerCase() || "javascript"}
            theme={darkMode ? "vs-dark" : "light"}
            value={submission.code}
            options={{
              minimap: { enabled: true },
              readOnly: true,
              fontSize: 13,
              scrollBeyondLastLine: false,
              fontFamily:
                "'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'SF Mono', Monaco, 'Inconsolata', 'Roboto Mono', 'Source Code Pro', Menlo, 'Ubuntu Mono', monospace",
              lineHeight: 1.6,
              padding: { top: 12, bottom: 12 },
              lineNumbers: "on",
              folding: true,
              bracketMatching: "always",
              fontLigatures: true,
              renderWhitespace: "selection",
            }}
          />
        </div>
      </div>
    </div>
  );
});

// NEW: Share Modal Component for generating a backend-created link
const ShareModal = memo(
  ({
    isOpen,
    onClose,
    problemId,
    showToast,
    setCode,
    setRoomId,
    user,
    code,
    liveRoomRef,
    socket,
    realEdit,
    setRealEdit,
  }) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedLink, setGeneratedLink] = useState(null);
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
      // Reset state when the modal closes for a clean slate next time
      if (!isOpen) {
        setTimeout(() => {
          setIsGenerating(false);
          setGeneratedLink(null);
          setError(null);
          setCopied(false);
        }, 300); // Allow for closing animation
      }
    }, [isOpen]);

    useEffect(() => {
      const handleKeyDown = (e) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    const handleGenerateLink = async () => {
      setIsGenerating(true);
      setError(null);
      try {
        const res = await axiosClient.post("/create-room", { code });

        const roomId = res.data.roomId;
        setRoomId(roomId);
        liveRoomRef.current = roomId;

        socket.emit("joinRoom", { roomId, user }, () => {
          socket.emit("codeChange", { roomId, code });
        });

        const shareUrl = `https://algo-byte-eight.vercel.app//problem/${problemId}/room/${roomId}`;

        if (shareUrl) {
          setGeneratedLink(shareUrl);
          showToast("Live session link generated!", "success");
        } else {
          throw new Error("Did not receive a shareable URL from the server.");
        }
      } catch (err) {
        const errorMessage = "Failed to create session link. Please try again.";
        setError(err.message);
        showToast(err.message);
      } finally {
        setIsGenerating(false);
      }
    };

    const handleCopyLink = () => {
      if (!generatedLink) return;
      navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      showToast("Link copied to clipboard!", "success");
      setTimeout(() => setCopied(false), 2000);
    };

    if (!isOpen) return null;

    return (
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in-0 duration-300"
        onClick={onClose}
      >
        <div
          className="w-full max-w-md bg-white dark:bg-black rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col animate-in zoom-in-95 duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex-shrink-0 p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Users size={16} />
              Collaborate & Share
            </h3>
            <button
              onClick={onClose}
              className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X size={16} />
            </button>
          </div>
          <div className="p-6 space-y-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Generate a unique link to invite others to a real-time
              collaborative coding session for this problem.
            </p>

            {generatedLink ? (
              <div className="space-y-4">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Your Shareable Link
                </label>
                <div className="relative">
                  <input
                    type="text"
                    readOnly
                    value={generatedLink}
                    className="w-full pl-3 pr-10 py-2 text-sm font-mono bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                    title="Copy link"
                  >
                    {copied ? (
                      <Check size={16} className="text-green-500" />
                    ) : (
                      <Copy size={16} />
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <button
                  onClick={handleGenerateLink}
                  disabled={isGenerating}
                  className="flex items-center justify-center gap-2 w-full rounded-lg bg-black dark:bg-white px-4 py-2.5 text-sm font-bold text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 hover:shadow-xl hover:scale-105 shadow-lg border-2 border-gray-900 dark:border-white"
                >
                  {isGenerating ? (
                    <>
                      <LoadingSpinner className="h-4 w-4" />
                      <span>Generating Link...</span>
                    </>
                  ) : (
                    "Generate Live Session Link"
                  )}
                </button>
              </div>
            )}

            {error && (
              <p className="text-xs text-center text-red-600 dark:text-red-400">
                {error}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }
);

export function ProblemPage() {
  const { id: problemId, roomId: roomIdFromParams } = useParams();
  const { user } = useSelector((state) => state.auth);
  const isRemoteUpdateRef = useRef(false);

  // Core State
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [toast, setToast] = useState(null);

  // UI/Layout State
  const [darkMode, setDarkMode] = useState(false);
  const [isEditorFullscreen, setIsEditorFullscreen] = useState(false);
  const [isSidebarLayout, setIsSidebarLayout] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [isSidebarPanelOpen, setIsSidebarPanelOpen] = useState(true);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [realEdit, setRealEdit] = useState(true);

  // Collaboration & Editor State
  const [code, setCode] = useState("// Write your solution here");
  const [roomId, setRoomId] = useState(roomIdFromParams || null);
  const editorRef = useRef(null);
  const liveRoomRef = useRef(null);
  const [roomUsers, setRoomUsers] = useState([]);

  // ... (All socket and other useEffects remain the same, they are correct)

  useEffect(() => {
    if (!roomId || !user) {
      liveRoomRef.current = null;
      return;
    }
    liveRoomRef.current = roomId;
    const handleLoadCode = (initialCode) => {
      // setRealEdit(false)
      const codeToSet = initialCode || "// Start collaborating...";
      setCode(codeToSet);
      if (editorRef.current) {
        editorRef.current.setValue(codeToSet);
      }
    };

    const handleRemoteCodeChange = (newCode) => {
      if (editorRef.current) {
        const editor = editorRef.current;
        const currentEditorValue = editor.getValue();

        if (currentEditorValue !== newCode) {
          isRemoteUpdateRef.current = true;

          // Get the current model and the full range of the text
          const model = editor.getModel();
          const fullRange = model.getFullModelRange();

          // Apply the new code as a single, non-destructive edit
          editor.executeEdits("remote-source", [
            {
              range: fullRange,
              text: newCode,
              // This is an optional flag that helps Monaco keep the cursor
              // in a more intuitive position after the edit.
              forceMoveMarkers: true,
            },
          ]);

          // We still need to update React's state, but the editor is handled.
          setCode(newCode);
        }
      }
    };
    socket.emit("joinRoom", { roomId, user });
    socket.on("loadCode", handleLoadCode);
    socket.on("remoteCodeChange", handleRemoteCodeChange);
    return () => {
      if (liveRoomRef.current) {
        socket.emit("leaveRoom", { roomId: liveRoomRef.current });
      }
      socket.off("loadCode", handleLoadCode);
      socket.off("remoteCodeChange", handleRemoteCodeChange);
      liveRoomRef.current = null;
    };
  }, [roomId]);

  useEffect(() => {
    socket.on("roomUsersUpdate", (users) => {
      setRoomUsers(users);
    });

    return () => {
      socket.off("roomUsersUpdate");
    };
  }, []);

  const handleEditorMount = (editor) => {
    editorRef.current = editor;

    editor.onDidChangeModelContent(() => {
      if (isRemoteUpdateRef.current) {
        isRemoteUpdateRef.current = false;
        return; // Skip emitting if this change came from remote
      }
      if (!realEdit) {
        return;
      }
      const updatedCode = editor.getValue();
      setCode(updatedCode);

      const currentRoom = liveRoomRef.current;
      if (currentRoom) {
        socket.emit("codeChange", { roomId: currentRoom, code: updatedCode });
      }
    });
  };

  const handleExitRoom = () => {
    if (liveRoomRef.current) {
      setRoomId(null);
      showToast("Exited collaboration room", "info");

      if (roomIdFromParams) {
        const newUrl = window.location.pathname.split("/room")[0];
        window.history.replaceState(null, "", newUrl);
      }
    }
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    const fetchProblemData = async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get(`/problem/problemById/${problemId}`);
        setProblem(res.data);
      } catch (err) {
        setError("Could not load the problem.");
      } finally {
        setLoading(false);
      }
    };
    if (problemId && user) fetchProblemData();
    else if (!user) {
      setLoading(false);
      setError("Please log in to view the problem.");
    }
  }, [problemId, user]);

  useEffect(() => {
    if (submissionResult) {
      setActiveTab("answer");
      if (isSidebarLayout) {
        setIsSidebarPanelOpen(true);
      }
    }
  }, [submissionResult, isSidebarLayout]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.metaKey || e.ctrlKey) {
        if (e.key === "k") {
          e.preventDefault();
          setShowKeyboardShortcuts(true);
        }
      }
      if (e.key === "F11") {
        e.preventDefault();
        setIsEditorFullscreen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const showToast = useCallback((message, type = "info") => {
    setToast({ message, type });
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  // Loading and Error states
  if (loading)
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-black dark:via-gray-900 dark:to-black">
        <div className="flex flex-col items-center gap-4 p-6 rounded-xl bg-white/80 dark:bg-black/80 backdrop-blur-sm shadow-2xl border border-gray-200 dark:border-gray-700">
          <LoadingSpinner className="h-8 w-8" />
          <span className="text-base font-bold text-gray-700 dark:text-gray-300">
            Loading Problem...
          </span>
        </div>
      </div>
    );
  if (error)
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-black dark:via-gray-900 dark:to-black">
        <div className="text-center p-6 rounded-xl bg-white/80 dark:bg-black/80 backdrop-blur-sm shadow-2xl border border-gray-200 dark:border-gray-700">
          <div className="text-4xl mb-4 text-red-500 animate-bounce">⚠️</div>
          <div className="text-base font-bold text-gray-900 dark:text-white">
            {error}
          </div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-black dark:via-gray-900 dark:to-black text-gray-900 dark:text-white relative overflow-hidden">
      {/* Background and Header JSX ... */}
      {darkMode && (
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-gray-300/3 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-white/4 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>
      )}

      <div className="flex flex-col h-screen relative z-10">
        <header className="flex-shrink-0 bg-white/90 dark:bg-black/90 border-b border-gray-200 dark:border-gray-800 shadow-lg backdrop-blur-sm">
          <div className="w-full flex items-center justify-between px-6 h-12">
            <div className="flex items-center gap-4">
              <Link to="/">
                <div className="relative top-1 left-2">
                  <img
                    src={logo}
                    alt="Logo"
                    className="h-12 w-auto max-w-[150px] object-contain"
                  />
                </div>
              </Link>
            </div>
            <div className="flex items-center gap-2">
              {roomId && (
                <div className="flex gap-2 items-center text-sm text-gray-500 dark:text-gray-300">
                  👥 {roomUsers.length} user(s) in room:
                  {roomUsers.map((u) => (
                    <span
                      key={u.userId}
                      className="bg-gray-200 dark:bg-gray-700 rounded px-2 py-0.5 mx-1"
                    >
                      {u.firstName}
                    </span>
                  ))}
                </div>
              )}
              {roomId ? (
                <button
                  onClick={handleExitRoom}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-red-50 dark:bg-red-900 text-red-600 dark:text-red-300 border border-red-300 dark:border-red-700 rounded-lg shadow-sm hover:shadow-md hover:border-red-400 dark:hover:border-red-500 transition-all duration-200 hover:bg-red-100 dark:hover:bg-red-800"
                  title="Exit Collaboration Room"
                >
                  <X size={14} />
                  <span>Exit Room</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsShareModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md hover:border-gray-400 dark:hover:border-gray-600 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-900"
                  title="Collaborate on this problem"
                >
                  <Users size={14} />
                  <span>Collaborate</span>
                </button>
              )}
              <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-1"></div>

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

        <main className="flex-grow flex w-full overflow-hidden px-1 py-1 gap-1">
          {isSidebarLayout ? (
            <>
              <SidebarMenu
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isPanelOpen={isSidebarPanelOpen}
                setIsPanelOpen={setIsPanelOpen}
                submissionResult={submissionResult}
              />
              <div
                className={`transition-all duration-500 ease-in-out ${
                  isEditorFullscreen || !isSidebarPanelOpen
                    ? "w-0 opacity-0 p-0 overflow-hidden"
                    : "w-1/2 opacity-100"
                }`}
              >
                <ProblemPanel
                  problem={problem}
                  user={user}
                  darkMode={darkMode}
                  showToast={showToast}
                  activeTab={activeTab}
                  submissionResult={submissionResult}
                  layout="sidebar"
                />
              </div>
              <div
                className={`transition-all duration-500 ease-in-out ${
                  isSidebarPanelOpen && !isEditorFullscreen
                    ? "flex-1"
                    : "w-full"
                } flex flex-col`}
              >
                <EditorPanel
                  problem={problem}
                  darkMode={darkMode}
                  isEditorFullscreen={isEditorFullscreen}
                  setIsEditorFullscreen={setIsEditorFullscreen}
                  setSubmissionResult={setSubmissionResult}
                  showToast={showToast}
                  onMount={handleEditorMount}
                  code={code}
                  roomId={roomId}
                  setCode={setCode} // FIX: Pass the setCode function
                />
              </div>
            </>
          ) : (
            <>
              {/* Default Layout */}
              <div
                className={`transition-all duration-500 ease-in-out ${
                  isEditorFullscreen
                    ? "w-0 opacity-0 overflow-hidden"
                    : "w-1/2 opacity-100"
                }`}
              >
                <ProblemPanel
                  problem={problem}
                  user={user}
                  darkMode={darkMode}
                  showToast={showToast}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  submissionResult={submissionResult}
                  layout="default"
                />
              </div>
              <div
                className={`transition-all duration-500 ease-in-out ${
                  isEditorFullscreen ? "w-full" : "flex-1"
                } flex flex-col`}
              >
                <EditorPanel
                  problem={problem}
                  darkMode={darkMode}
                  isEditorFullscreen={isEditorFullscreen}
                  setIsEditorFullscreen={setIsEditorFullscreen}
                  setSubmissionResult={setSubmissionResult}
                  liveRoomRef={liveRoomRef}
                  showToast={showToast}
                  onMount={handleEditorMount}
                  code={code}
                  setCode={setCode}
                  setRealEdit={setRealEdit}
                  realEdit={realEdit} // FIX: Pass the setCode function
                />
              </div>
            </>
          )}
        </main>
      </div>

      {/* Modals and Overlays */}
      <KeyboardShortcuts
        isOpen={showKeyboardShortcuts}
        onClose={() => setShowKeyboardShortcuts(false)}
      />
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        problemId={problemId}
        showToast={showToast}
        setRoomId={setRoomId}
        user={user}
        code={code}
        socket={socket}
        liveRoomRef={liveRoomRef}
        setRealEdit={setRealEdit}
        realEdit={realEdit}
      />
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </div>
  );
}
const SidebarMenu = memo(
  ({
    activeTab,
    setActiveTab,
    isPanelOpen,
    setIsPanelOpen,
    submissionResult,
  }) => {
    const tabs = [
      { name: "description", label: "Description", IconComponent: FileText },
      { name: "solution", label: "Solutions", IconComponent: Lightbulb },
      { name: "submissions", label: "Submissions", IconComponent: History },
      { name: "chatAI", label: "Chat AI", IconComponent: Code },
      { name: "editorial", label: "Editorial", IconComponent: FileText },
      ...(submissionResult
        ? [{ name: "answer", label: "Answer", IconComponent: CheckCircle }]
        : []),
    ];

    const handleTabClick = (name) => {
      if (name === activeTab) {
        setIsPanelOpen(!isPanelOpen);
      } else {
        setActiveTab(name);
        setIsPanelOpen(true);
      }
    };

    return (
      <div className="flex-shrink-0 bg-white/90 dark:bg-black/90 rounded-xl border-2 border-gray-900 dark:border-white shadow-2xl backdrop-blur-sm p-2 flex flex-col items-center gap-2">
        {tabs.map(({ name, label, IconComponent }) => (
          <button
            key={name}
            onClick={() => handleTabClick(name)}
            title={label}
            className={`p-3 rounded-lg transition-all duration-300 hover:scale-110 relative ${
              activeTab === name
                ? "bg-black dark:bg-white text-white dark:text-black shadow-lg"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900 hover:shadow-lg"
            }`}
          >
            <IconComponent size={16} />
          </button>
        ))}
      </div>
    );
  }
);
const EditorPanel = memo(
  ({
    problem,
    darkMode,
    isEditorFullscreen,
    setIsEditorFullscreen,
    setSubmissionResult,
    showToast,
    onMount,
    code,
    setCode,
    realEdit,
    setRealEdit,
    roomId,
  }) => {
    const [activeLanguage, setActiveLanguage] = useState("javascript");

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editorHeight, setEditorHeight] = useState("65%");
    const problemId = problem?._doc?._id;

    // FIX: Set initial theme based on darkMode prop
    const [editorTheme, setEditorTheme] = useState(
      darkMode ? "page-dark" : "page-light"
    );
    const [showMinimap, setShowMinimap] = useState(true);
    const [fontSize, setFontSize] = useState(13);
    const [wordWrap, setWordWrap] = useState(true);

    const languageOptions = [
      { value: "javascript", label: "JavaScript", category: "Languages" },
      { value: "java", label: "Java", category: "Languages" },
      { value: "c++", label: "C++", category: "Languages" },
    ];

    const editorThemes = [
      { value: "page-light", label: "Page Light", category: "Page Match" },
      { value: "page-dark", label: "Page Dark", category: "Page Match" },
      { value: "light", label: "Light", category: "Default" },
      { value: "vs-dark", label: "Dark", category: "Default" },
      {
        value: "hc-black",
        label: "High Contrast Dark",
        category: "High Contrast",
      },
      {
        value: "hc-light",
        label: "High Contrast Light",
        category: "High Contrast",
      },
      { value: "monokai", label: "Monokai", category: "Popular" },
      { value: "dracula", label: "Dracula", category: "Popular" },
      { value: "github-dark", label: "GitHub Dark", category: "Popular" },
      { value: "github-light", label: "GitHub Light", category: "Popular" },
      { value: "one-dark-pro", label: "One Dark Pro", category: "Popular" },
      { value: "material-theme", label: "Material Theme", category: "Popular" },
      { value: "nord", label: "Nord", category: "Popular" },
      { value: "solarized-dark", label: "Solarized Dark", category: "Popular" },
      {
        value: "solarized-light",
        label: "Solarized Light",
        category: "Popular",
      },
    ];

    useEffect(() => {
      if (darkMode && editorTheme === "page-light") {
        setEditorTheme("page-dark");
      } else if (!darkMode && editorTheme === "page-dark") {
        setEditorTheme("page-light");
      }
    }, [darkMode, editorTheme]);

    const handleEditorWillMount = (monaco) => {
      Object.entries(customThemes).forEach(([themeName, themeData]) => {
        monaco.editor.defineTheme(themeName, themeData);
      });
    };

    useEffect(() => {
      if (roomId) {
        return;
      }
      console.log("active language is :", activeLanguage);

      setCode(
        problem?._doc?.startCode?.find(
          (c) => c?.language.toLowerCase() === activeLanguage
        )?.initialCode || ""
      );
    }, [activeLanguage, problem]);

    const handleResetCode = useCallback(() => {
      if (problem) {
        setCode(
          problem._doc?.startCode.find(
            (c) => c.language.toLowerCase() === activeLanguage
          )?.initialCode || ""
        );
        showToast("Code reset to initial state", "info");
      }
    }, [problem, activeLanguage, showToast]);

    const handleFormatCode = useCallback(() => {
      showToast("Code formatted successfully", "success");
    }, [showToast]);

    return (
      <div className="flex flex-col rounded-xl shadow-md border-2 backdrop-blur-sm z-40 w-full h-full bg-white/90 dark:bg-black/90 border-slate-50 dark:border-gray-900">
        {/* Professional Enhanced Header */}
        <div className="flex-shrink-0 p-3 flex justify-between items-center border-b-2 border-black dark:border-white bg-gray-50/50 dark:bg-gray-900/50 rounded-t-xl">
          <div className="flex items-center gap-3">
            <CustomDropdown
              value={activeLanguage}
              onChange={setActiveLanguage}
              options={languageOptions}
              placeholder="Select Language"
              className="w-32"
            />

            <CustomDropdown
              value={editorTheme}
              onChange={setEditorTheme}
              options={editorThemes}
              placeholder="Select Theme"
              className="w-36"
            />

            <div className="flex items-center gap-1">
              <button
                onClick={() => setFontSize((prev) => Math.max(10, prev - 1))}
                className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-all duration-200"
                title="Decrease font size"
              >
                <span className="text-xs font-bold">A-</span>
              </button>
              <span className="text-xs text-black dark:text-white font-mono px-1">
                {fontSize}px
              </span>
              <button
                onClick={() => setFontSize((prev) => Math.min(24, prev + 1))}
                className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-all duration-200"
                title="Increase font size"
              >
                <span className="text-xs font-bold">A+</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowMinimap(!showMinimap)}
              className={`p-1.5 rounded transition-all duration-200 hover:scale-110 ${
                showMinimap
                  ? "bg-gray-100 dark:bg-gray-800 text-black dark:text-white"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white"
              }`}
              title="Toggle minimap"
            >
              <Eye size={14} />
            </button>
            <button
              onClick={() => setWordWrap(!wordWrap)}
              className={`p-1.5 rounded transition-all duration-200 hover:scale-110 ${
                wordWrap
                  ? "bg-gray-100 dark:bg-gray-800 text-black dark:text-white"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white"
              }`}
              title="Toggle word wrap"
            >
              <RefreshCw size={14} />
            </button>
            <button
              onClick={handleFormatCode}
              className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-all duration-200 hover:scale-110"
              title="Format code"
            >
              <Settings size={14} />
            </button>
            <button
              onClick={handleResetCode}
              title="Reset Code"
              className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-all duration-200 hover:scale-110 hover:rotate-180"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>

        {/* Editor Section */}
        <Resizable
          defaultSize={{ width: "100%", height: editorHeight }}
          minHeight="150px"
          maxHeight="45%"
          enable={{ bottom: true }}
          handleClasses={{
            bottom:
              "w-full h-1.5 absolute bottom-0 left-0 cursor-row-resize z-10 bg-gray-300 dark:bg-gray-600 hover:bg-black dark:hover:bg-white transition-all duration-300 shadow-lg",
          }}
          onResizeStop={(e, direction, ref, d) =>
            setEditorHeight(ref.style.height)
          }
        >
          <div className="w-full h-full flex flex-col">
            <div className="flex-grow relative overflow-hidden">
              <Editor
                height="100%"
                language={activeLanguage}
                theme={editorTheme}
                value={code}
                onMount={onMount}
                onChange={(v) => {
                  setCode(v || "");
                }}
                beforeMount={handleEditorWillMount}
                options={{
                  minimap: { enabled: showMinimap, side: "right" },
                  fontSize: fontSize,
                  scrollBeyondLastLine: false,
                  contextmenu: true,
                  inlineSuggest: true,
                  fontFamily:
                    "'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'SF Mono', Monaco, 'Inconsolata', 'Roboto Mono', 'Source Code Pro', Menlo, 'Ubuntu Mono', monospace",
                  cursorBlinking: "smooth",
                  smoothScrolling: true,
                  lineHeight: 1.6,
                  padding: { top: 16, bottom: 16 },
                  renderLineHighlight: "all",
                  selectOnLineNumbers: true,
                  automaticLayout: true,
                  lineNumbers: "on",
                  folding: true,
                  bracketMatching: "always",
                  autoIndent: "full",
                  formatOnPaste: true,
                  formatOnType: true,
                  wordWrap: wordWrap ? "on" : "off",
                  rulers: [80, 120],
                  renderWhitespace: "selection",
                  showFoldingControls: "always",
                  fontLigatures: true,
                  cursorSmoothCaretAnimation: true,
                  renderControlCharacters: false,
                  renderIndentGuides: true,
                  highlightActiveIndentGuide: true,
                }}
              />
            </div>
          </div>
        </Resizable>

        {/* Console Panel */}
        <div className="flex-shrink">
          <ConsolePanel
            problem={problem}
            code={code}
            activeLanguage={activeLanguage}
            problemId={problemId}
            isSubmitting={isSubmitting}
            setIsSubmitting={setIsSubmitting}
            darkMode={darkMode}
            setSubmissionResult={setSubmissionResult}
            showToast={showToast}
          />
        </div>
      </div>
    );
  }
);
const ConsolePanel = memo(
  ({
    problem,
    code,
    activeLanguage,
    problemId,
    isSubmitting,
    setIsSubmitting,
    darkMode,
    setSubmissionResult,
    showToast,
  }) => {
    const [activeTestCaseIndex, setActiveTestCaseIndex] = useState(0);
    const [consoleTab, setConsoleTab] = useState("testcase");
    const [runResult, setRunResult] = useState(null);
    const [runStatus, setRunStatus] = useState({});

    const [customInput, setCustomInput] = useState("");
    const [customExpectedOutput, setCustomExpectedOutput] = useState("");

    const handleRun = useCallback(async () => {
      if (!problem) return;

      // Determine if we are running a custom test case or the default ones
      const isCustomRun = customInput.trim() !== "";
      const inputs = isCustomRun
        ? [customInput.trim()]
        : problem._doc?.visibleTestCases.map((tc) => tc.input);
      if (!inputs || inputs.length === 0) {
        showToast("No test cases to run.", "warning");
        return;
      }

      const initialStatuses = {};
      inputs.forEach((_, index) => {
        initialStatuses[index] = "loading";
      });
      setRunStatus(initialStatuses);
      setConsoleTab("result");
      setRunResult(null);
      showToast(
        isCustomRun
          ? "Running custom test case..."
          : "Running default test cases...",
        "info"
      );

      try {
        if (isCustomRun) {
          const { data: results } = await axiosClient.post(
            `/submission/customrun/${problemId}`,
            {
              language: activeLanguage,
              code,
              inputs,
              expectedOutputs: [customExpectedOutput.trim()],
            }
          );

          setRunResult(results);
          const finalStatuses = {};
          results.forEach((res, index) => {
            finalStatuses[index] = res.status_id === 3 ? "accepted" : "failed";
          });
          setRunStatus(finalStatuses);

          const passedCount = Object.values(finalStatuses).filter(
            (status) => status === "accepted"
          ).length;
          showToast(
            `Test completed: ${passedCount}/${results.length} passed`,
            passedCount === results.length ? "success" : "warning"
          );
        } else {
          const { data: results } = await axiosClient.post(
            `/submission/run/${problemId}`,
            {
              language: activeLanguage,
              code,
              inputs,
            }
          );

          setRunResult(results);
          const finalStatuses = {};
          results.forEach((res, index) => {
            finalStatuses[index] = res.status_id === 3 ? "accepted" : "failed";
          });
          setRunStatus(finalStatuses);

          const passedCount = Object.values(finalStatuses).filter(
            (status) => status === "accepted"
          ).length;
          showToast(
            `Test completed: ${passedCount}/${results.length} passed`,
            passedCount === results.length ? "success" : "warning"
          );
        }
      } catch (err) {
        setRunResult(Array(inputs.length).fill({ stderr: err.message }));
        const finalStatuses = {};
        inputs.forEach((_, index) => {
          finalStatuses[index] = "failed";
        });
        setRunStatus(finalStatuses);
        showToast("Test run failed", "error");
      }
    }, [
      problem,
      activeLanguage,
      code,
      problemId,
      showToast,
      customInput,
      customExpectedOutput,
    ]);

    const handleSubmit = useCallback(async () => {
      if (!problem || !code.trim()) return;

      setIsSubmitting(true);
      showToast("Submitting solution...", "info");

      try {
        const { data: result } = await axiosClient.post(
          `/submission/submit/${problemId}`,
          {
            language: activeLanguage,
            code: code.trim(),
          }
        );

        const submissionData = {
          status: result.status || "accepted",
          runtime: result.runtime || 0,
          memory: result.memory || 0,
          testCasesPassed: result.testCasesPassed || 0,
          totalTestCases: result.testCasesTotal || 0,
          error: result.error || null,
          testCaseResults: result.testCaseResults || null,
        };

        setSubmissionResult(submissionData);
        showToast(
          submissionData.status === "accepted"
            ? "Solution accepted!"
            : "Solution needs improvement",
          submissionData.status === "accepted" ? "success" : "error"
        );
      } catch (err) {
        const errorData = {
          status: "error",
          runtime: 0,
          memory: 0,
          testCasesPassed: 0,
          totalTestCases: problem._doc?.visibleTestCases?.length || 0,
          error:
            err.response?.data?.message ||
            err.message ||
            "Submission failed. Please try again.",
          testCaseResults: null,
        };
        setSubmissionResult(errorData);
        showToast("Submission failed", "error");
      } finally {
        setIsSubmitting(false);
      }
    }, [
      problem,
      code,
      activeLanguage,
      problemId,
      setSubmissionResult,
      showToast,
    ]);

    return (
      <div className="flex-1 flex flex-col min-h-20 bg-gray-50/50 dark:bg-gray-900/50 border-t-2 border-gray-200 dark:border-white rounded-b-xl">
        {/* Professional Console Header */}
        <div className="p-3 flex min-h-20 justify-between items-center border-b-2 border-gray-200 dark:border-gray-900 bg-white/50 dark:bg-black/50">
          <div className="flex gap-2">
            <button
              onClick={() => setConsoleTab("testcase")}
              className={`px-3 py-2 text-xs font-bold rounded-lg transition-all duration-300 hover:scale-105 ${
                consoleTab === "testcase"
                  ? "bg-gray-100 border-2 dark:bg-gray-800 text-black dark:text-white dark:border-gray-600 shadow-lg"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900 hover:shadow-lg border-2 border-transparent"
              }`}
            >
              Test Cases
            </button>
            <button
              onClick={() => setConsoleTab("custom")}
              className={`px-3 py-2 text-xs font-bold rounded-lg transition-all duration-300 hover:scale-105 ${
                consoleTab === "custom"
                  ? "bg-gray-100 border-2 dark:bg-gray-800 text-black dark:text-white dark:border-gray-600 shadow-lg"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900 hover:shadow-lg border-2 border-transparent"
              }`}
            >
              Custom Input
            </button>
            <button
              onClick={() => setConsoleTab("result")}
              className={`px-3 py-2 text-xs font-bold rounded-lg transition-all duration-300 hover:scale-105 ${
                consoleTab === "result"
                  ? "bg-gray-100 border-2 dark:border-gray-600 dark:bg-gray-800 text-black dark:text-white shadow-lg"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900 hover:shadow-lg border-2 border-transparent"
              }`}
            >
              Results
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRun}
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 rounded-lg bg-gray-100 dark:bg-gray-800 px-3 py-2 text-xs font-bold text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 hover:shadow-xl hover:scale-110 shadow-lg border-2 border-gray-300 dark:border-gray-600"
            >
              <Play size={12} />
              Run
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !code.trim()}
              className="flex items-center justify-center gap-2 rounded-lg bg-white dark:bg-gray-700 dark:border-green-500 px-3 py-2 text-xs font-bold text-green-500  hover:bg-green-500 hover:text-white  disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 hover:shadow-xl hover:scale-110 shadow-lg border-2 border-green-500 "
            >
              {isSubmitting ? (
                <LoadingSpinner className="h-3 w-3" />
              ) : (
                <>
                  <Send size={12} />
                  Submit
                </>
              )}
            </button>
          </div>
        </div>

        {/* Professional Console Content */}
        <div className="p-4 flex-1 overflow-y-auto">
          {consoleTab === "testcase" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                {problem?._doc.visibleTestCases.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTestCaseIndex(index)}
                    className={`px-3 py-2 rounded-lg text-xs font-bold transition-all duration-300 hover:scale-105 ${
                      activeTestCaseIndex === index
                        ? "bg-gray-100 border-2 dark:border-gray-600 dark:bg-gray-800 text-black dark:text-white shadow-lg"
                        : "bg-white dark:bg-black text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-lg"
                    }`}
                  >
                    Case {index + 1}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 block uppercase tracking-wider flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-black dark:bg-white rounded-full"></div>
                    Input
                  </label>
                  <pre className="p-3 rounded-lg bg-white dark:bg-black font-mono text-xs border-2 border-gray-200 dark:border-gray-900 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 shadow-lg hover:shadow-xl font-medium">
                    {
                      problem?._doc?.visibleTestCases[activeTestCaseIndex]
                        ?.input
                    }
                  </pre>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 block uppercase tracking-wider flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-black dark:bg-white rounded-full"></div>
                    Expected Output
                  </label>
                  <pre className="p-3 rounded-lg bg-white dark:bg-black font-mono text-xs border-2 border-gray-200 dark:border-gray-900 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 shadow-lg hover:shadow-xl font-medium">
                    {
                      problem?._doc?.visibleTestCases[activeTestCaseIndex]
                        ?.output
                    }
                  </pre>
                </div>
              </div>
            </div>
          )}

          {consoleTab === "custom" && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 block uppercase tracking-wider flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-black dark:bg-white rounded-full"></div>
                  Your Custom Input
                </label>
                <textarea
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder="Enter your custom input here."
                  className="w-full p-3 rounded-lg bg-white dark:bg-black font-mono text-xs border-2 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 shadow-lg hover:shadow-xl font-medium max-h-[80px] resize-y focus:outline-none focus:ring-2 focus:ring-black/50 dark:focus:ring-white/50"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 block uppercase tracking-wider flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-black dark:bg-white rounded-full"></div>
                  Expected Output
                </label>
                <textarea
                  value={customExpectedOutput}
                  onChange={(e) => setCustomExpectedOutput(e.target.value)}
                  placeholder="Enter the expected output for your custom input. This will be used for comparison."
                  className="w-full p-3 rounded-lg bg-white dark:bg-black font-mono text-xs border-2 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 shadow-lg hover:shadow-xl font-medium max-h-[80px] resize-y focus:outline-none focus:ring-2 focus:ring-black/50 dark:focus:ring-white/50"
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                To run the default test cases again, simply clear the custom
                input field.
              </p>
            </div>
          )}

          {consoleTab === "result" && (
            <div className="font-mono text-xs space-y-4">
              {Object.values(runStatus).includes("loading") ? (
                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300 justify-center py-8">
                  <LoadingSpinner className="h-4 w-4" />
                  <span className="font-bold text-sm">
                    Running all test cases...
                  </span>
                </div>
              ) : runResult ? (
                <div className="space-y-4">
                  {runResult.map((result, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center gap-3">
                        {runStatus[index] === "accepted" ? (
                          <CheckIcon className="w-4 h-4" />
                        ) : (
                          <CrossIcon className="w-4 h-4" />
                        )}
                        <span className="font-sans font-bold text-sm">
                          {customInput.trim() !== ""
                            ? "Custom Test Case"
                            : `Test Case ${index + 1}`}
                        </span>
                      </div>

                      {runStatus[index] === "failed" && result.stderr && (
                        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-400 border-2 border-red-300 dark:border-red-700 shadow-lg">
                          <div className="text-xs font-bold text-red-700 dark:text-red-400 mb-1 uppercase tracking-wide">
                            Error
                          </div>
                          <pre className="whitespace-pre-wrap bg-white dark:bg-black p-2 rounded border-2 border-red-200 dark:border-red-700 shadow-inner font-medium text-xs">
                            {result.stderr}
                          </pre>
                        </div>
                      )}

                      {runStatus[index] === "failed" && !result.stderr && (
                        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/30 border-2 border-red-300 dark:border-red-700 shadow-lg space-y-3">
                          <div>
                            <div className="text-xs font-bold text-red-800 dark:text-red-400 mb-1 uppercase tracking-wide">
                              Your Output
                            </div>
                            <pre className="whitespace-pre-wrap bg-white dark:bg-black p-2 rounded border-2 border-red-200 dark:border-red-700 shadow-inner font-medium text-xs text-red-700 dark:text-red-300">
                              {result.stdout || "(empty)"}
                            </pre>
                          </div>
                          <div>
                            <div className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1 uppercase tracking-wide">
                              Expected Output
                            </div>
                            <pre className="whitespace-pre-wrap bg-white dark:bg-black p-2 rounded border-2 border-gray-200 dark:border-gray-700 shadow-inner font-medium text-xs text-green-700 dark:text-green-400">
                              {customInput.trim() !== ""
                                ? customExpectedOutput
                                : problem?._doc?.visibleTestCases[index]
                                    ?.output}
                            </pre>
                          </div>
                        </div>
                      )}

                      {runStatus[index] === "accepted" && (
                        <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-400 border-2 border-green-300 dark:border-green-700 shadow-lg">
                          <div className="text-xs font-bold text-green-700 dark:text-green-400 mb-1 uppercase tracking-wide">
                            Output
                          </div>
                          <pre className="whitespace-pre-wrap bg-white dark:bg-black p-2 rounded border-2 border-green-200 dark:border-green-700 shadow-inner font-medium text-xs">
                            {result.stdout}
                          </pre>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4 animate-bounce">🚀</div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-bold">
                    Click "Run" to test your code
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
);
const ProblemPanel = memo(
  ({
    problem,
    user,
    darkMode,
    showToast,
    activeTab,
    setActiveTab,
    submissionResult,
    layout,
  }) => {
    const [pastSubmissions, setPastSubmissions] = useState([]);
    const [viewingSubmission, setViewingSubmission] = useState(null);
    const [isBookmarked, setIsBookmarked] = useState(false);

    useEffect(() => {
      const fetchSubmissions = async () => {
        if (!problem?._doc?._id || !user) return;
        try {
          const res = await axiosClient.get(
            `/submission/submit/prevsubmission/${problem._doc?._id}`
          );
          setPastSubmissions(res.data);
        } catch (error) {
          setPastSubmissions([]);
        }
      };
      fetchSubmissions();
    }, [problem, user]);

    const TabButton = ({ name, label, IconComponent, badge }) => (
      <button
        onClick={() => setActiveTab(name)}
        className={`flex items-center gap-2 px-3 py-2 text-xs font-bold rounded-lg transition-all duration-300 hover:scale-105 relative ${
          activeTab === name
            ? "bg-black dark:bg-white text-slate-100 dark:text-black shadow-lg"
            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900 hover:shadow-lg"
        }`}
      >
        <IconComponent size={12} className="drop-shadow-sm" />
        <span>{label}</span>
        {badge && (
          <span className="absolute -top-1.5 -right-0.5 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {badge}
          </span>
        )}
      </button>
    );

    const handleBookmark = () => {
      setIsBookmarked(!isBookmarked);
      showToast(
        isBookmarked ? "Removed from bookmarks" : "Added to bookmarks",
        "success"
      );
    };

    const handleShare = () => {
      navigator.clipboard.writeText(window.location.href);
      showToast("Problem link copied to clipboard", "success");
    };

    return (
      <>
        {viewingSubmission && (
          <CodeViewerModal
            submission={viewingSubmission}
            darkMode={darkMode}
            onClose={() => setViewingSubmission(null)}
          />
        )}

        <div className="w-full h-full flex flex-col bg-white/90 dark:bg-black/90 rounded-xl border-2 border-white dark:border-black shadow-md backdrop-blur-sm">
          {/* Professional Tab Header */}
          {layout === "default" && (
            <div className="flex-shrink-0 p-3 flex items-center justify-between border-b-2 border-gray-900 dark:border-white bg-gray-50/50 dark:bg-gray-900/50 rounded-t-xl">
              <div className="flex items-center gap-2">
                <TabButton
                  name="description"
                  label="Description"
                  IconComponent={FileText}
                />
                <TabButton
                  name="solution"
                  label="Solutions"
                  IconComponent={Lightbulb}
                />
                <TabButton
                  name="submissions"
                  label="Submissions"
                  IconComponent={History}
                  badge={pastSubmissions.length}
                />
                <TabButton name="chatAI" label="Chat AI" IconComponent={Code} />
                <TabButton
                  name="editorial"
                  label="Editorial"
                  IconComponent={FileText}
                />
                {submissionResult && (
                  <TabButton
                    name="answer"
                    label="Answer"
                    IconComponent={CheckCircle}
                  />
                )}
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handleShare}
                  className="p-1.5 rounded text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-110"
                  title="Share problem"
                >
                  <Share2 size={14} />
                </button>
              </div>
            </div>
          )}

          {/* Content Area */}
          <div
            className={`p-4 flex-grow overflow-y-auto ${
              layout === "sidebar" ? "rounded-xl" : "rounded-b-xl"
            }`}
          >
            <ProblemContent
              activeTab={activeTab}
              problem={problem}
              user={user}
              darkMode={darkMode}
              pastSubmissions={pastSubmissions}
              setViewingSubmission={setViewingSubmission}
              submissionResult={submissionResult}
            />
          </div>
        </div>
      </>
    );
  }
);

const ProblemContent = memo(
  ({
    activeTab,
    problem,
    user,
    darkMode,
    pastSubmissions,
    setViewingSubmission,
    submissionResult,
  }) => {
    const difficultyStyles = getDifficultyStyles();

    return (
      <>
        {activeTab === "description" && problem && (
          <div className="space-y-6">
            <Breadcrumb
              items={[
                "Problems",
                problem._doc?.tags || "General",
                problem._doc?.title,
              ]}
            />
            <div>
              <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white mb-4">
                {problem._doc?.title}
              </h1>
              <div className="flex items-center gap-3 mb-6">
                <span
                  className={`inline-flex items-center rounded-lg px-3 py-1 text-xs font-bold ${
                    difficultyStyles[problem._doc?.difficulty]
                  }`}
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
              dangerouslySetInnerHTML={{
                __html: problem?._doc?.description?.replace(/\n/g, "<br/>"),
              }}
            />
            <div className="space-y-6">
              {problem?._doc?.visibleTestCases?.map((tc, i) => (
                <div key={i} className="space-y-3">
                  <h4 className="font-bold text-base text-gray-900 dark:text-white">
                    Example {i + 1}:
                  </h4>
                  <div className="bg-white dark:bg-black p-4 rounded-xl border-2 border-white dark:border-black hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300  hover:shadow-xl">
                    <div className="space-y-3 font-mono text-xs">
                      <div>
                        <div className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2 flex items-center gap-1">
                          <div className="w-1.5 h-1.5 bg-black dark:bg-white rounded-full"></div>
                          Input:
                        </div>
                        <div className="bg-white dark:bg-gray-900 p-3 rounded-lg border-2 border-gray-200 dark:border-gray-900 shadow-none font-medium">
                          {tc.input}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2 flex items-center gap-1">
                          <div className="w-1.5 h-1.5 bg-black dark:font-bold dark:text-white dark:bg-white rounded-full"></div>
                          Output:
                        </div>
                        <div className="bg-white dark:bg-gray-900 p-3 rounded-lg border-2 border-gray-200 dark:border-gray-900 shadow-inner font-medium">
                          {tc.output}
                        </div>
                      </div>
                      {tc.explanation && (
                        <div>
                          <div className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2 flex items-center gap-1">
                            <div className="w-1.5 h-1.5 bg-black dark:bg-white rounded-full"></div>
                            Explanation:
                          </div>
                          <div className="text-gray-700 dark:text-gray-300 text-xs bg-white dark:bg-gray-900 p-3 rounded-lg border-2 border-gray-200 dark:border-gray-900 shadow-inner font-medium">
                            {tc.explanation}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === "solution" && problem && (
          <div className="space-y-4">
            {!user || user.role?.toLowerCase() !== "admin" ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="p-4 rounded-xl bg-gray-100 dark:bg-gray-800 mb-4 shadow-2xl">
                  <Lock
                    size={32}
                    className="text-gray-500 dark:text-gray-400"
                  />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  Admin Access Required
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Solutions are available for administrators only
                </p>
              </div>
            ) : (
              <>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Reference Solution
                </h2>
                <div className="rounded-xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden shadow-2xl">
                  <Editor
                    height="300px"
                    language={
                      problem._doc?.referenceSolution
                        .find((s) => s.language.toLowerCase() === "javascript")
                        ?.language.toLowerCase() || "javascript"
                    }
                    theme={darkMode ? "vs-dark" : "light"}
                    value={
                      problem._doc?.referenceSolution.find(
                        (s) => s.language.toLowerCase() === "javascript"
                      )?.completeCode || ""
                    }
                    options={{
                      minimap: { enabled: false },
                      readOnly: true,
                      fontFamily:
                        "'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'SF Mono', Monaco, 'Inconsolata', 'Roboto Mono', 'Source Code Pro', Menlo, 'Ubuntu Mono', monospace",
                      lineHeight: 1.6,
                      padding: { top: 12, bottom: 12 },
                      lineNumbers: "on",
                      folding: true,
                      bracketMatching: "always",
                      fontSize: 13,
                      fontLigatures: true,
                      renderWhitespace: "selection",
                    }}
                  />
                </div>
                <div className="rounded-xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden shadow-2xl">
                  <Editor
                    height="300px"
                    language={
                      problem._doc?.referenceSolution
                        .find((s) => s.language.toLowerCase() === "java")
                        ?.language.toLowerCase() || "java"
                    }
                    theme={darkMode ? "vs-dark" : "light"}
                    value={
                      problem._doc?.referenceSolution.find(
                        (s) => s.language.toLowerCase() === "java"
                      )?.completeCode || ""
                    }
                    options={{
                      minimap: { enabled: false },
                      readOnly: true,
                      fontFamily:
                        "'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'SF Mono', Monaco, 'Inconsolata', 'Roboto Mono', 'Source Code Pro', Menlo, 'Ubuntu Mono', monospace",
                      lineHeight: 1.6,
                      padding: { top: 12, bottom: 12 },
                      lineNumbers: "on",
                      folding: true,
                      bracketMatching: "always",
                      fontSize: 13,
                      fontLigatures: true,
                      renderWhitespace: "selection",
                    }}
                  />
                </div>
                <div className="rounded-xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden shadow-2xl">
                  <Editor
                    height="300px"
                    language={
                      problem._doc?.referenceSolution
                        .find((s) => s.language.toLowerCase() === "c++")
                        ?.language.toLowerCase() || "c++"
                    }
                    theme={darkMode ? "vs-dark" : "light"}
                    value={
                      problem._doc?.referenceSolution.find(
                        (s) => s.language.toLowerCase() === "c++"
                      )?.completeCode || ""
                    }
                    options={{
                      minimap: { enabled: false },
                      readOnly: true,
                      fontFamily:
                        "'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'SF Mono', Monaco, 'Inconsolata', 'Roboto Mono', 'Source Code Pro', Menlo, 'Ubuntu Mono', monospace",
                      lineHeight: 1.6,
                      padding: { top: 12, bottom: 12 },
                      lineNumbers: "on",
                      folding: true,
                      bracketMatching: "always",
                      fontSize: 13,
                      fontLigatures: true,
                      renderWhitespace: "selection",
                    }}
                  />
                </div>
              </>
            )}
          </div>
        )}
        {activeTab === "submissions" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Past Submissions
              </h2>
              <div className="flex items-center gap-2">
                <StatusBadge
                  status="solved"
                  count={
                    pastSubmissions.filter((s) => s.status === "accepted")
                      .length
                  }
                />
                <StatusBadge
                  status="wrong"
                  count={
                    pastSubmissions.filter((s) => s.status !== "accepted")
                      .length
                  }
                />
              </div>
            </div>
            <div className="bg-white dark:bg-black rounded-xl border-2 border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden">
              {pastSubmissions.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px]">
                    <thead className="bg-gray-50 dark:bg-gray-900 border-b-2 border-gray-200 dark:border-gray-700">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Runtime
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Memory
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Submitted
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {pastSubmissions.map((sub) => (
                        <tr
                          key={sub._id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors duration-150"
                        >
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              {sub.status === "accepted" ? (
                                <CheckIcon className="w-4 h-4" />
                              ) : (
                                <CrossIcon className="w-4 h-4" />
                              )}
                              <span
                                className={`font-bold capitalize text-xs ${
                                  sub.status === "accepted"
                                    ? "text-green-700 dark:text-green-400"
                                    : "text-red-700 dark:text-red-400"
                                }`}
                              >
                                {sub.status === "accepted"
                                  ? "accepted"
                                  : "wrong"}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap font-mono text-xs font-bold">
                            {sub.runtime}ms
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap font-mono text-xs font-bold">
                            {sub.memory}KB
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-600 dark:text-gray-400">
                            {new Date(sub.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-right">
                            <button
                              onClick={() => setViewingSubmission(sub)}
                              className="px-3 py-1.5 text-xs dark:hover:text-black font-bold rounded bg-black dark:bg-gray-600 text-white dark:text-white hover:bg-gray-800 dark:hover:bg-white transition-all duration-200 hover:shadow-lg hover:scale-105"
                            >
                              View Code
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4 animate-bounce">📝</div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                    No submissions for this problem yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
        {activeTab === "chatAI" && problem && (
          <ChatAI problem={problem}></ChatAI>
        )}
        {activeTab === "editorial" && problem && (
          <Editorial
            secureUrl={problem?.secureUrl}
            thumbnailUrl={problem?.thumbnailUrl}
            duration={problem.duration}
          ></Editorial>
        )}
        {activeTab === "answer" && submissionResult && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Submission Result
            </h2>
            <div
              className={`p-6 rounded-xl border-2 transition-all duration-300 shadow-2xl ${
                submissionResult.status === "accepted"
                  ? "bg-gradient-to-br from-green-50 via-green-100 to-green-50 border-green-300 dark:from-green-900/30 dark:via-green-800/20 dark:to-green-900/30 dark:border-green-700"
                  : "bg-gradient-to-br from-red-50 via-red-100 to-red-50 border-red-300 dark:from-red-900/30 dark:via-red-800/20 dark:to-red-900/30 dark:border-red-700"
              }`}
            >
              <div className="flex items-center gap-4 mb-4">
                {submissionResult.status === "accepted" ? (
                  <CheckIcon className="w-8 h-8" />
                ) : (
                  <CrossIcon className="w-8 h-8" />
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
                  <div className="text-center p-4 bg-white dark:bg-black rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <p className="text-xs text-gray-600 dark:text-gray-400 font-bold uppercase tracking-wide">
                      Runtime
                    </p>
                    <p className="text-lg font-black text-black dark:text-white">
                      {submissionResult.runtime}ms
                    </p>
                  </div>
                  <div className="text-center p-4 bg-white dark:bg-black rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <p className="text-xs text-gray-600 dark:text-gray-400 font-bold uppercase tracking-wide">
                      Memory
                    </p>
                    <p className="text-lg font-black text-black dark:text-white">
                      {submissionResult.memory}MB
                    </p>
                  </div>
                  <div className="text-center p-4 bg-white dark:bg-black rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <p className="text-xs text-gray-600 dark:text-gray-400 font-bold uppercase tracking-wide">
                      Test Cases
                    </p>
                    <p className="text-lg font-black text-black dark:text-white">
                      {submissionResult.testCasesPassed}/
                      {submissionResult.totalTestCases}
                    </p>
                  </div>
                </div>
              )}
            </div>
            {submissionResult.status !== "accepted" && (
              <div className="space-y-4">
                {submissionResult.error && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/30 border-2 border-red-300 dark:border-red-700 rounded-xl shadow-lg">
                    <h4 className="font-bold text-red-800 dark:text-red-400 mb-2 text-sm">
                      Error Details
                    </h4>
                    <pre className="text-xs text-red-700 dark:text-red-400 whitespace-pre-wrap font-mono bg-white dark:bg-black p-3 rounded-lg border-2 border-red-200 dark:border-red-700 shadow-inner">
                      {submissionResult.error}
                    </pre>
                  </div>
                )}
                <div className="p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-lg">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2 text-sm">
                    Test Cases Summary
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 font-medium text-sm">
                    Passed:{" "}
                    <span className="font-black text-green-700 dark:text-green-400">
                      {submissionResult.testCasesPassed}
                    </span>{" "}
                    of{" "}
                    <span className="font-black text-black dark:text-white">
                      {submissionResult.totalTestCases}
                    </span>
                  </p>
                </div>
              </div>
            )}
            {submissionResult.testCaseResults && (
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-4 text-base">
                  Detailed Test Results
                </h4>
                <div className="space-y-3">
                  {submissionResult.testCaseResults.map((result, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${
                        result.passed
                          ? "bg-green-50 dark:bg-green-900/30 border-green-300 dark:border-green-700"
                          : "bg-red-50 dark:bg-red-900/30 border-red-300 dark:border-red-700"
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        {result.passed ? (
                          <CheckIcon className="w-4 h-4" />
                        ) : (
                          <CrossIcon className="w-4 h-4" />
                        )}
                        <span className="font-sans font-bold text-sm">
                          Test Case {index + 1}
                        </span>
                      </div>
                      {!result.passed && result.error && (
                        <pre className="text-xs text-red-700 dark:text-red-400 mt-2 font-mono bg-white dark:bg-black p-2 rounded border-2 border-red-200 dark:border-red-700 shadow-inner">
                          {result.error}
                        </pre>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </>
    );
  }
);

const customThemes = {
  "page-light": {
    base: "vs",
    inherit: true,
    rules: [],
    colors: {
      "editor.background": "#FFFFFF",
      "editor.foreground": "#333333",
      "editorCursor.foreground": "#000000",
      "editor.lineHighlightBackground": "#F0F0F0",
      "editorLineNumber.foreground": "#AAAAAA",
      "editor.selectionBackground": "#D1E4FF",
    },
  },
  "page-dark": {
    base: "vs-dark",
    inherit: true,
    rules: [],
    colors: {
      "editor.background": "#000000",
      "editor.foreground": "#E0E0E0",
      "editorCursor.foreground": "#FFFFFF",
      "editor.lineHighlightBackground": "#1A1A1A",
      "editorLineNumber.foreground": "#555555",
      "editor.selectionBackground": "#253C5E",
    },
  },
  monokai: {
    base: "vs-dark",
    inherit: true,
    rules: [
      { foreground: "f8f8f2", token: "text" },
      { foreground: "f8f8f2", token: "source" },
      { foreground: "75715e", token: "comment" },
      { foreground: "ae81ff", token: "storage.type" },
      { foreground: "ae81ff", token: "storage.modifier" },
      { foreground: "f92672", token: "keyword" },
      { foreground: "f92672", token: "storage" },
      { foreground: "e6db74", token: "string" },
      { foreground: "a6e22e", token: "support.function" },
      {
        foreground: "66d9ef",
        fontStyle: "italic",
        token: "entity.other.inherited-class",
      },
      { foreground: "66d9ef", fontStyle: "bold", token: "entity.name.class" },
      {
        foreground: "66d9ef",
        fontStyle: "bold",
        token: "entity.name.type.class",
      },
      { foreground: "a6e22e", token: "entity.name.function" },
      { foreground: "f92672", token: "keyword.operator" },
      { foreground: "f92672", token: "punctuation.separator" },
      { foreground: "fd971f", token: "constant.numeric" },
      { foreground: "66d9ef", token: "entity.name.tag" },
    ],
    colors: {
      "editor.background": "#272822",
      "editor.foreground": "#F8F8F2",
      "editor.selection": "#49483E",
      "editor.lineHighlight": "#3E3D32",
      "editorCursor.foreground": "#F8F8F0",
      "editorWhitespace.foreground": "#3B3A32",
    },
  },
  dracula: {
    base: "vs-dark",
    inherit: true,
    rules: [
      { foreground: "f8f8f2", token: "" },
      { foreground: "6272a4", token: "comment" },
      { foreground: "f1fa8c", token: "string" },
      { foreground: "bd93f9", token: "constant.numeric" },
      { foreground: "bd93f9", token: "constant.language" },
      { foreground: "bd93f9", token: "constant.character" },
      { foreground: "bd93f9", token: "constant.other" },
      { foreground: "ffb86c", token: "variable.other.readwrite.instance" },
      { foreground: "ff79c6", token: "keyword" },
      { foreground: "ff79c6", token: "storage" },
      { foreground: "ff79c6", token: "storage.type" },
      { foreground: "8be9fd", fontStyle: "italic", token: "storage.modifier" },
      { foreground: "50fa7b", token: "entity.name.function" },
      { foreground: "50fa7b", token: "support.function" },
      { foreground: "66d9ef", token: "support.constant" },
      { foreground: "66d9ef", token: "support.type" },
      { foreground: "66d9ef", token: "support.class" },
      { foreground: "f8f8f2", background: "ff79c6", token: "invalid" },
      {
        foreground: "f8f8f2",
        background: "bd93f9",
        token: "invalid.deprecated",
      },
      {
        foreground: "cfcfc2",
        token: "meta.structure.dictionary.json string.quoted.double.json",
      },
      { foreground: "6272a4", token: "meta.diff" },
      { foreground: "6272a4", token: "meta.diff.header" },
      { foreground: "ff79c6", token: "markup.deleted" },
      { foreground: "50fa7b", token: "markup.inserted" },
      { foreground: "e6db74", token: "markup.changed" },
      {
        foreground: "bd93f9",
        token: "constant.numeric.line-number.find-in-files - match",
      },
      { foreground: "e6db74", token: "entity.name.tag" },
      { foreground: "ff79c6", token: "markup.heading" },
    ],
    colors: {
      "editor.background": "#282a36",
      "editor.foreground": "#f8f8f2",
      "editor.selection": "#44475a",
      "editor.lineHighlight": "#44475a",
      "editorCursor.foreground": "#f8f8f0",
      "editorWhitespace.foreground": "#3b3a32",
    },
  },
  "github-dark": {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "", foreground: "c9d1d9" },
      { token: "comment", foreground: "8b949e" },
      { token: "string", foreground: "a5d6ff" },
      { token: "constant.numeric", foreground: "79c0ff" },
      { token: "keyword", foreground: "ff7b72" },
      { token: "storage", foreground: "ff7b72" },
      { token: "entity.name.function", foreground: "d2a8ff" },
      { token: "variable.language", foreground: "ff7b72" },
      { token: "entity.name.type", foreground: "ffa657" },
      { token: "entity.name.class", foreground: "ffa657" },
      { token: "entity.name.tag", foreground: "7ee787" },
      { token: "support.function", foreground: "d2a8ff" },
    ],
    colors: {
      "editor.background": "#0d1117",
      "editor.foreground": "#c9d1d9",
      "editor.selection": "#264f78",
      "editor.lineHighlight": "#161b22",
      "editorCursor.foreground": "#58a6ff",
      "editorWhitespace.foreground": "#484f58",
    },
  },
  "github-light": {
    base: "vs",
    inherit: true,
    rules: [
      { token: "", foreground: "24292e" },
      { token: "comment", foreground: "6a737d" },
      { token: "string", foreground: "032f62" },
      { token: "constant.numeric", foreground: "005cc5" },
      { token: "keyword", foreground: "d73a49" },
      { token: "storage", foreground: "d73a49" },
      { token: "entity.name.function", foreground: "6f42c1" },
      { token: "variable.language", foreground: "005cc5" },
      { token: "entity.name.type", foreground: "e36209" },
      { token: "entity.name.class", foreground: "e36209" },
      { token: "entity.name.tag", foreground: "22863a" },
      { token: "support.function", foreground: "6f42c1" },
    ],
    colors: {
      "editor.background": "#ffffff",
      "editor.foreground": "#24292e",
      "editor.selection": "#cce5ff",
      "editor.lineHighlight": "#f1f8ff",
      "editorCursor.foreground": "#005cc5",
      "editorWhitespace.foreground": "#d1d5da",
    },
  },
  nord: {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "", foreground: "d8dee9" },
      { token: "comment", foreground: "4c566a" },
      { token: "string", foreground: "a3be8c" },
      { token: "constant.numeric", foreground: "b48ead" },
      { token: "keyword", foreground: "81a1c1" },
      { token: "storage", foreground: "81a1c1" },
      { token: "entity.name.function", foreground: "88c0d0" },
      { token: "variable.language", foreground: "81a1c1" },
      { token: "entity.name.type", foreground: "8fbcbb" },
      { token: "entity.name.class", foreground: "8fbcbb" },
      { token: "entity.name.tag", foreground: "81a1c1" },
      { token: "support.function", foreground: "88c0d0" },
      { token: "delimiter", foreground: "81a1c1" },
    ],
    colors: {
      "editor.background": "#2e3440",
      "editor.foreground": "#d8dee9",
      "editor.selection": "#434c5e",
      "editor.lineHighlight": "#3b4252",
      "editorCursor.foreground": "#d8dee9",
      "editorWhitespace.foreground": "#4c566a",
    },
  },
  "one-dark-pro": {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "comment", foreground: "5c6370" },
      { token: "string", foreground: "98c379" },
      { token: "constant.numeric", foreground: "d19a66" },
      { token: "keyword", foreground: "c678dd" },
      { token: "storage", foreground: "c678dd" },
      { token: "entity.name.function", foreground: "61afef" },
      { token: "variable", foreground: "e06c75" },
      { token: "entity.name.type", foreground: "e5c07b" },
      { token: "entity.name.class", foreground: "e5c07b" },
      { token: "entity.name.tag", foreground: "e06c75" },
      { token: "support.function", foreground: "56b6c2" },
    ],
    colors: {
      "editor.background": "#282c34",
      "editor.foreground": "#abb2bf",
      "editor.selection": "#3e4451",
      "editor.lineHighlight": "#2c313a",
      "editorCursor.foreground": "#528bff",
      "editorWhitespace.foreground": "#3b4048",
    },
  },
  "material-theme": {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "", foreground: "eeffff" },
      { token: "comment", foreground: "546e7a" },
      { token: "string", foreground: "c3e88d" },
      { token: "constant.numeric", foreground: "f78c6c" },
      { token: "keyword", foreground: "c792ea" },
      { token: "storage", foreground: "c792ea" },
      { token: "entity.name.function", foreground: "82aaff" },
      { token: "variable", foreground: "f07178" },
      { token: "entity.name.type", foreground: "ffcb6b" },
      { token: "entity.name.class", foreground: "ffcb6b" },
      { token: "entity.name.tag", foreground: "f07178" },
      { token: "support.function", foreground: "89ddff" },
    ],
    colors: {
      "editor.background": "#263238",
      "editor.foreground": "#eeffff",
      "editor.selection": "#546e7a",
      "editor.lineHighlight": "#2c3941",
      "editorCursor.foreground": "#ffcc00",
      "editorWhitespace.foreground": "#425b67",
    },
  },
  "solarized-dark": {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "", foreground: "839496" },
      { token: "comment", foreground: "586e75" },
      { token: "string", foreground: "2aa198" },
      { token: "constant.numeric", foreground: "d33682" },
      { token: "keyword", foreground: "859900" },
      { token: "storage", foreground: "cb4b16" },
      { token: "entity.name.function", foreground: "268bd2" },
      { token: "variable", foreground: "b58900" },
      { token: "entity.name.type", foreground: "b58900" },
      { token: "entity.name.class", foreground: "b58900" },
      { token: "entity.name.tag", foreground: "268bd2" },
      { token: "support.function", foreground: "6c71c4" },
    ],
    colors: {
      "editor.background": "#002b36",
      "editor.foreground": "#839496",
      "editor.selection": "#073642",
      "editor.lineHighlight": "#073642",
      "editorCursor.foreground": "#839496",
      "editorWhitespace.foreground": "#586e75",
    },
  },
  "solarized-light": {
    base: "vs",
    inherit: true,
    rules: [
      { token: "", foreground: "657b83" },
      { token: "comment", foreground: "93a1a1" },
      { token: "string", foreground: "2aa198" },
      { token: "constant.numeric", foreground: "d33682" },
      { token: "keyword", foreground: "859900" },
      { token: "storage", foreground: "cb4b16" },
      { token: "entity.name.function", foreground: "268bd2" },
      { token: "variable", foreground: "b58900" },
      { token: "entity.name.type", foreground: "b58900" },
      { token: "entity.name.class", foreground: "b58900" },
      { token: "entity.name.tag", foreground: "268bd2" },
      { token: "support.function", foreground: "6c71c4" },
    ],
    colors: {
      "editor.background": "#fdf6e3",
      "editor.foreground": "#657b83",
      "editor.selection": "#eee8d5",
      "editor.lineHighlight": "#eee8d5",
      "editorCursor.foreground": "#657b83",
      "editorWhitespace.foreground": "#93a1a1",
    },
  },
};
