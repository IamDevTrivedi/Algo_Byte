
"use client"

import { useState, useEffect, memo, useRef } from "react"
import { Link } from "react-router"
import { useThemeStore } from "../stores/themeStore"
import logo from "../Images/logo.png"

import {
  Code,
  Trophy,
  Target,
  ArrowRight,
  CheckCircle,
  Star,
  Github,
  Twitter,
  Linkedin,
  Mail,
  Menu,
  X,
  Sun,
  Moon,
  Brain,
  Rocket,
  Lightbulb,
  BarChart3,
  Users2,
  Play,
  Pause,
  RotateCcw,
  Copy,
} from "lucide-react"

// Professional Toast Notification System
const Toast = memo(({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000)
    return () => clearTimeout(timer)
  }, [onClose])

  const icons = {
    success: CheckCircle,
    error: X,
    warning: Target,
    info: Lightbulb,
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

// Typewriter Effect for Main Heading
const TypewriterHeading = memo(() => {
  const [displayText, setDisplayText] = useState("")
  const [isComplete, setIsComplete] = useState(false)
  const fullText = "Master Coding with Interactive Practice"

  useEffect(() => {
    if (isComplete) return

    let currentIndex = 0
    const timer = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setDisplayText(fullText.slice(0, currentIndex))
        currentIndex++
      } else {
        setIsComplete(true)
        clearInterval(timer)
      }
    }, 100)

    return () => clearInterval(timer)
  }, [isComplete])

  return (
    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-black dark:text-white mb-6 leading-tight min-h-[1.2em]">
      {displayText.split(" ").map((word, index) => {
        if (word === "Interactive") {
          return (
            <span
              key={index}
              className="bg-gradient-to-r from-gray-600 via-black to-gray-600 dark:from-gray-400 dark:via-white dark:to-gray-400 bg-clip-text text-transparent"
            >
              {word}{" "}
            </span>
          )
        }
        return <span key={index}>{word} </span>
      })}
      {!isComplete && <span className="animate-pulse text-black dark:text-white">|</span>}
    </h1>
  )
})

// Enhanced Syntax Highlighter
const SyntaxHighlighter = memo(({ code }) => {
  const highlightCode = (code) => {
    return code
      .replace(/(\/\/.*$)/gm, '<span class="text-gray-500 dark:text-gray-400 italic">$1</span>')
      .replace(
        /(function|const|let|var|if|else|for|while|return|class|import|export|from|async|await|try|catch|finally|throw|new|this|super|extends|static|public|private|protected)/g,
        '<span class="text-purple-400 font-semibold">$1</span>',
      )
      .replace(/(true|false|null|undefined|NaN|Infinity)/g, '<span class="text-orange-400 font-semibold">$1</span>')
      .replace(/(\d+)/g, '<span class="text-blue-400 font-semibold">$1</span>')
      .replace(/(["'`])((?:\\.|(?!\1)[^\\])*?)\1/g, '<span class="text-green-400">$1$2$1</span>')
      .replace(/([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(?=\()/g, '<span class="text-yellow-400 font-semibold">$1</span>')
      .replace(
        /(console|Math|Array|Object|String|Number|Date|JSON|Promise|setTimeout|setInterval|clearTimeout|clearInterval)/g,
        '<span class="text-cyan-400 font-semibold">$1</span>',
      )
      .replace(/(\{|\}|\[|\]|$$|$$)/g, '<span class="text-pink-400 font-bold">$1</span>')
      .replace(
        /(===|!==|==|!=|<=|>=|<|>|&&|\|\||!|\+|-|\*|\/|%|=|\+=|-=|\*=|\/=|%=)/g,
        '<span class="text-red-400 font-semibold">$1</span>',
      )
  }

  return (
    <pre className="text-sm font-mono leading-relaxed whitespace-pre-wrap">
      <code dangerouslySetInnerHTML={{ __html: highlightCode(code) }} />
    </pre>
  )
})

// Fixed Size Animated Code Card Component
const AnimatedCodeCard = memo(() => {
  const [displayCode, setDisplayCode] = useState("")
  const [currentCodeIndex, setCurrentCodeIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const intervalRef = useRef(null)
  const timeoutRef = useRef(null)

  const codeExamples = [
    {
      title: "Binary Search",
      code: `// Binary Search Algorithm
function binarySearch(arr, target) {
  let left = 0, right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) return mid;
    else if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  
  return -1;
}

console.log(binarySearch([1,3,5,7,9], 5)); // 2`,
    },
    {
      title: "Quick Sort",
      code: `// Quick Sort Algorithm
function quickSort(arr) {
  if (arr.length <= 1) return arr;
  
  const pivot = arr[Math.floor(arr.length / 2)];
  const left = arr.filter(x => x < pivot);
  const middle = arr.filter(x => x === pivot);
  const right = arr.filter(x => x > pivot);
  
  return [...quickSort(left), ...middle, ...quickSort(right)];
}

console.log(quickSort([3,1,4,1,5,9,2,6]));`,
    },
    {
      title: "Fibonacci",
      code: `// Fibonacci Sequence
function fibonacci(n) {
  if (n <= 1) return n;
  
  let a = 0, b = 1;
  for (let i = 2; i <= n; i++) {
    [a, b] = [b, a + b];
  }
  
  return b;
}

// Generate sequence
for (let i = 0; i < 8; i++) {
  console.log(fibonacci(i));
}`,
    },
  ]

  const currentExample = codeExamples[currentCodeIndex]

  const typeCode = () => {
    if (isPaused) return

    const code = currentExample.code
    let currentIndex = 0

    const typing = () => {
      if (isPaused) return

      intervalRef.current = setInterval(() => {
        if (currentIndex <= code.length && !isPaused) {
          setDisplayCode(code.slice(0, currentIndex))
          currentIndex++
        } else {
          clearInterval(intervalRef.current)
          if (!isPaused) {
            timeoutRef.current = setTimeout(() => {
              if (!isPaused) eraseCode()
            }, 2000)
          }
        }
      }, 50)
    }

    typing()
  }

  const eraseCode = () => {
    if (isPaused) return

    const code = currentExample.code
    let currentIndex = code.length

    intervalRef.current = setInterval(() => {
      if (currentIndex > 0 && !isPaused) {
        currentIndex -= 2
        setDisplayCode(code.slice(0, Math.max(0, currentIndex)))
      } else {
        clearInterval(intervalRef.current)
        if (!isPaused) {
          setCurrentCodeIndex((prev) => (prev + 1) % codeExamples.length)
          timeoutRef.current = setTimeout(() => {
            if (!isPaused) typeCode()
          }, 500)
        }
      }
    }, 30)
  }

  useEffect(() => {
    if (!isPaused) {
      typeCode()
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [currentCodeIndex, isPaused])

  const handlePlayPause = () => {
    setIsPaused(!isPaused)
    if (isPaused) {
      typeCode()
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }

  const handleReset = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setDisplayCode("")
    setCurrentCodeIndex(0)
    setIsPaused(false)
    setTimeout(() => typeCode(), 100)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(currentExample.code)
  }

  return (
    <div className="w-full max-w-3xl mx-auto mb-16">
      <div
        className={`squiggly-border-container relative bg-white dark:bg-black rounded-2xl shadow-2xl overflow-hidden transition-all duration-500 hover:shadow-3xl ${
          isHovered ? "scale-[1.02]" : ""
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Animated Squiggly Border */}
        <div className="squiggly-border"></div>

        {/* Code Editor Header */}
        <div className="relative z-10 flex items-center justify-between px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors cursor-pointer shadow-lg"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors cursor-pointer shadow-lg"></div>
              <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors cursor-pointer shadow-lg"></div>
            </div>
            <div className="flex items-center gap-3 ml-4">
              <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <Code className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{currentExample.title}</span>
                <div className="text-xs text-gray-500 dark:text-gray-400">algorithm.js</div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePlayPause}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-110 group"
              title={isPaused ? "Resume" : "Pause"}
            >
              {isPaused ? (
                <Play className="w-4 h-4 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform" />
              ) : (
                <Pause className="w-4 h-4 text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform" />
              )}
            </button>
            <button
              onClick={handleReset}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-110 group"
              title="Reset"
            >
              <RotateCcw className="w-4 h-4 text-blue-600 dark:text-blue-400 group-hover:scale-110 group-hover:rotate-180 transition-all duration-300" />
            </button>
            <button
              onClick={handleCopy}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-110 group"
              title="Copy Code"
            >
              <Copy className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>

        {/* Code Content - Fixed Height */}
        <div className="relative z-10 bg-gradient-to-br from-gray-900 via-black to-gray-900 dark:from-black dark:via-gray-900 dark:to-black h-80 overflow-hidden">
          {/* Line Numbers */}
          <div className="absolute left-0 top-0 p-4 text-xs font-mono text-gray-500 dark:text-gray-600 select-none border-r border-gray-700 dark:border-gray-600 bg-gray-800/50 dark:bg-gray-900/50 h-full">
            {displayCode.split("\n").map((_, index) => (
              <div key={index} className="leading-relaxed h-[21px] flex items-center justify-end pr-3 min-w-[2.5rem]">
                {index + 1}
              </div>
            ))}
          </div>

          {/* Code Content */}
          <div className="pl-16 p-4 relative z-10 h-full overflow-hidden">
            <SyntaxHighlighter code={displayCode} />
            <span className="inline-block w-2 h-5 bg-green-400 animate-pulse ml-1 shadow-lg shadow-green-400/50"></span>
          </div>

          {/* Progress Indicator */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700 dark:bg-gray-800">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-300 shadow-lg"
              style={{
                width: `${(displayCode.length / currentExample.code.length) * 100}%`,
              }}
            ></div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  {isPaused ? "Paused" : "Live Coding"}
                </span>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-500">
                Example {currentCodeIndex + 1} of {codeExamples.length}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                {codeExamples.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentCodeIndex
                        ? "bg-blue-500 shadow-lg shadow-blue-500/50"
                        : "bg-gray-300 dark:bg-gray-600"
                    }`}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

// Professional Loading Spinner
const LoadingSpinner = memo(({ className = "h-3 w-3" }) => (
  <div
    className={`animate-spin rounded-full border-2 border-gray-200 dark:border-gray-700 border-t-black dark:border-t-white shadow-lg ${className}`}
  ></div>
))

// Professional Stats Counter
const StatsCounter = memo(({ end, duration = 2000, suffix = "" }) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime = null
    const animate = (currentTime) => {
      if (startTime === null) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      setCount(Math.floor(progress * end))
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    requestAnimationFrame(animate)
  }, [end, duration])

  return (
    <span className="font-black text-2xl lg:text-3xl text-black dark:text-white">
      {count.toLocaleString()}
      {suffix}
    </span>
  )
})

// Enhanced Feature Card with Squiggly Border
const FeatureCard = memo(({ icon: Icon, title, description, delay = 0, featured = false }) => (
  <div
    className={`group relative transition-all duration-500 hover:scale-105  squiggly-border-container-land-page`}
    style={{ animationDelay: `${delay}ms` }}
  >
     <div className="squiggly-border"></div>
    <div
      className={`relative z-10 p-6 bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-500 hover:border-gray-300 dark:hover:border-gray-600 h-full`}
    >
      <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800 w-fit mb-4 group-hover:bg-black dark:group-hover:bg-white transition-all duration-300 shadow-lg">
        <Icon className="w-6 h-6 text-black dark:text-white group-hover:text-white dark:group-hover:text-black transition-colors duration-300" />
      </div>
      <h3 className="text-lg font-bold text-black dark:text-white mb-2 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors duration-300">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
        {description}
      </p>
    </div>
  </div>
))

// Professional Testimonial Card
const TestimonialCard = memo(({ name, role, company, content, avatar, rating = 5 }) => (
  <div className="p-6 bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105">
    <div className="flex items-center gap-1 mb-4">
      {[...Array(rating)].map((_, i) => (
        <Star key={i} size={14} className="text-yellow-500 fill-current" />
      ))}
    </div>
    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-6 italic">"{content}"</p>
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center shadow-lg">
        <span className="text-sm font-bold text-black dark:text-white">{avatar}</span>
      </div>
      <div>
        <div className="font-bold text-black dark:text-white text-sm">{name}</div>
        <div className="text-gray-600 dark:text-gray-400 text-xs">
          {role} at {company}
        </div>
      </div>
    </div>
  </div>
))

export function LandingPage() {
  const [darkMode, setDarkMode] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [toast, setToast] = useState(null)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode)
  }, [darkMode])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const showToast = (message, type = "info") => {
    setToast({ message, type })
  }

  const hideToast = () => {
    setToast(null)
  }

  const features = [
    {
      icon: Code,
      title: "Interactive Coding",
      description: "Practice with real coding problems in multiple programming languages with instant feedback.",
      featured: true,
    },
    {
      icon: Brain,
      title: "AI-Powered Hints",
      description: "Get intelligent hints and explanations to help you learn and improve your problem-solving skills.",
    },
    {
      icon: Trophy,
      title: "Competitive Challenges",
      description: "Participate in coding contests and challenges to test your skills against other developers.",
    },
    {
      icon: BarChart3,
      title: "Progress Tracking",
      description: "Monitor your coding journey with detailed analytics and performance insights.",
      featured: true,
    },
    {
      icon: Users2,
      title: "Community Learning",
      description: "Connect with fellow developers, share solutions, and learn from the community.",
    },
    {
      icon: Rocket,
      title: "Career Growth",
      description: "Prepare for technical interviews and advance your programming career with targeted practice.",
      featured: true,
    },
  ]

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Software Engineer",
      company: "Google",
      content:
        "This platform transformed my coding skills. The interactive problems and instant feedback helped me land my dream job at Google.",
      avatar: "SC",
      rating: 5,
    },
    {
      name: "Marcus Johnson",
      role: "Full Stack Developer",
      company: "Microsoft",
      content:
        "The AI-powered hints are incredible. They guide you without giving away the solution, making learning so much more effective.",
      avatar: "MJ",
      rating: 5,
    },
    {
      name: "Elena Rodriguez",
      role: "Tech Lead",
      company: "Meta",
      content:
        "I use this platform to prepare my team for technical interviews. The variety of problems and difficulty levels is perfect.",
      avatar: "ER",
      rating: 5,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-black dark:via-gray-900 dark:to-black text-gray-900 dark:text-white relative overflow-hidden">
      {/* Professional Background Effects */}
      {darkMode && (
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-gray-300/3 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-white/4 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>
      )}

      {/* Professional Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/90 dark:bg-black/90 backdrop-blur-sm shadow-lg border-b border-gray-200 dark:border-gray-800"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 h-16">
          <div className="flex items-center gap-4">
          <Link to="/"><div className="relative top-1 left-2">
          <img
            src={logo}
            alt="Logo"
            className="h-12 w-auto max-w-[150px] object-contain"
          />
        </div>
        </Link>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-110"
              title="Toggle theme"
            >
              {darkMode ? <Sun size={16} className="text-yellow-500" /> : <Moon size={16} className="text-gray-700" />}
            </button>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center gap-2">
            <Link to="/features"><button className="px-4 py-2 text-sm font-bold text-black dark:text-white ring-2 ring-black dark:ring-white rounded-lg">Features</button></Link>
              <Link to="/login">
                <button className="px-4 py-2 text-sm font-bold text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-all duration-200 hover:scale-105">
                  Sign In
                </button>
              </Link>
              <Link to="/signup">
                <button className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg text-sm font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
                  Register
                </button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 shadow-lg">
            <div className="px-4 py-4 space-y-4">
              <a
                href="#features"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </a>
              <a
                href="#testimonials"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Testimonials
              </a>
              <a
                href="#contact"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </a>
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                <Link to="/login" className="block">
                  <button className="w-full text-left px-4 py-2 text-sm font-bold text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors duration-200">
                    Sign In
                  </button>
                </Link>
                <Link to="/signup" className="block">
                  <button className="w-full px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg text-sm font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-300 shadow-lg">
                    Register
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <TypewriterHeading />
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed max-w-3xl mx-auto">
              Elevate your programming skills with our comprehensive platform featuring real-world coding challenges,
              AI-powered assistance, and a thriving developer community.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link to="/signup">
                <button className="px-8 py-4 bg-black dark:bg-white text-white dark:text-black rounded-xl text-lg font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-3xl flex items-center gap-2">
                  Start Coding Now
                  <ArrowRight size={20} />
                </button>
              </Link>
            </div>

            {/* Enhanced Animated Code Card */}
            {/* <AnimatedCodeCard /> */}

            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <StatsCounter end={50000} suffix="+" />
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mt-1">Active Users</p>
              </div>
              <div className="text-center">
                <StatsCounter end={1000} suffix="+" />
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mt-1">Coding Problems</p>
              </div>
              <div className="text-center">
                <StatsCounter end={95} suffix="%" />
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mt-1">Success Rate</p>
              </div>
              <div className="text-center">
                <StatsCounter end={24} suffix="/7" />
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mt-1">Support</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-black dark:text-white mb-4">
              Why Choose <span className=" bg-gradient-to-r from-amber-400 via-amber-300 to-amber-600 bg-clip-text text-transparent">AlgoByte</span>?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Our platform combines cutting-edge technology with proven learning methodologies to accelerate your coding
              journey.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} delay={index * 100} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-black dark:text-white mb-4">
              Loved by Developers
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Join thousands of developers who have transformed their careers with our platform.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-black dark:bg-white text-white dark:text-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-6">Ready to Level Up Your Coding?</h2>
          <p className="text-lg opacity-90 mb-8 leading-relaxed">
            Join our community of passionate developers and start your journey to coding mastery today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup">
              <button className="px-8 py-4 bg-white dark:bg-black text-black dark:text-white rounded-xl text-lg font-bold hover:bg-gray-100 dark:hover:bg-gray-900 transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-3xl">
                Get Started Free
              </button>
            </Link>
            
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        id="contact"
        className="py-16 px-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-800"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 rounded-lg bg-gray-100 dark:bg-white shadow-lg">
                  <Code className="w-5 h-5 text-black dark:text-black" />
                </div>
                <span className="text-xl font-bold text-black dark:text-white">AlgoByte</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6 max-w-md">
                Empowering developers worldwide with interactive coding challenges, AI-powered learning, and a
                supportive community.
              </p>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => showToast("GitHub coming soon!", "info")}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-all duration-200 hover:scale-110"
                >
                  <Github size={20} />
                </button>
                <button
                  onClick={() => showToast("Twitter coming soon!", "info")}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-all duration-200 hover:scale-110"
                >
                  <Twitter size={20} />
                </button>
                <button
                  onClick={() => showToast("LinkedIn coming soon!", "info")}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-all duration-200 hover:scale-110"
                >
                  <Linkedin size={20} />
                </button>
                <button
                  onClick={() => showToast("Email contact coming soon!", "info")}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-all duration-200 hover:scale-110"
                >
                  <Mail size={20} />
                </button>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-black dark:text-white mb-4">Product</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/features">
                  <a
                    href="#features"
                    className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors duration-200"
                  >
                    Features
                  </a>
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => showToast("API docs coming soon!", "info")}
                    className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors duration-200"
                  >
                    API
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => showToast("Documentation coming soon!", "info")}
                    className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors duration-200"
                  >
                    Documentation
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-black dark:text-white mb-4">Support</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <button
                    onClick={() => showToast("Help center coming soon!", "info")}
                    className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors duration-200"
                  >
                    Help Center
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => showToast("Community forum coming soon!", "info")}
                    className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors duration-200"
                  >
                    Community
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => showToast("Contact support coming soon!", "info")}
                    className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors duration-200"
                  >
                    Contact Us
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => showToast("Status page coming soon!", "info")}
                    className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors duration-200"
                  >
                    Status
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-200 dark:border-gray-700 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-600 dark:text-gray-400 text-sm">© 2025 AlgoByte. All rights reserved.</p>
            <div className="flex items-center gap-6 text-sm">
              <button
                onClick={() => showToast("Privacy policy coming soon!", "info")}
                className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors duration-200"
              >
                Privacy Policy
              </button>
              <button
                onClick={() => showToast("Terms of service coming soon!", "info")}
                className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors duration-200"
              >
                Terms of Service
              </button>
              <button
                onClick={() => showToast("Cookie policy coming soon!", "info")}
                className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors duration-200"
              >
                Cookies
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Toast Notifications */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </div>
  )
}




