"use client"

import { useState, useEffect, memo } from "react"
import { Link } from "react-router-dom"
import PropTypes from "prop-types"
import logo from "../Images/logo.png"

import {
  Code,
  Trophy,
  Users2,
  CalendarDays,
  Brain,
  Video,
  Flame,
  Bookmark,
  CheckCircle,
  Lightbulb,
  Target,
  Menu,
  X,
  Sun,
  Moon,
  Github,
  Twitter,
  Linkedin,
  Mail,
} from "lucide-react"

// --- Re-usable Components for this Page ---

// Professional Toast Notification System
const Toast = memo(({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000)
    return () => clearTimeout(timer)
  }, [onClose])

  const icons = { success: CheckCircle, error: X, warning: Target, info: Lightbulb }
  const Icon = icons[type] || Lightbulb

  return (
    <div
      className={`fixed top-4 right-4 z-[100] flex items-center gap-2 p-3 rounded-lg shadow-xl border backdrop-blur-sm animate-in slide-in-from-right-full duration-300 text-sm ${
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
      <button onClick={onClose} className="ml-1 hover:opacity-70 transition-opacity"><X size={14} /></button>
    </div>
  )
})

Toast.propTypes = {
  message: PropTypes.string.isRequired, type: PropTypes.string.isRequired, onClose: PropTypes.func.isRequired,
}


const InteractiveFeatureCard = memo(({ icon: Icon, title, description }) => {
  return (
    <div className="group h-80 w-full [perspective:1000px]">

      <div className="relative h-full w-full rounded-xl shadow-lg transition-all duration-700 ease-in-out [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
        
        {/* Front Face of the Card */}
        <div className="absolute inset-0 [backface-visibility:hidden]">
          <div className="h-full w-full rounded-xl bg-gradient-to-br from-white to-gray-100 dark:from-gray-900 dark:to-black p-6 flex flex-col items-center justify-center text-center border border-gray-200 dark:border-gray-800">
            <div className="p-4 rounded-full bg-blue-50 dark:bg-blue-900/20 mb-4">
              <Icon className="w-10 h-10 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-black dark:text-white">{title}</h3>
            <p className="text-xs text-gray-500 mt-2">Hover to learn more</p>
          </div>
        </div>

        {/* Back Face of the Card */}
        <div className="absolute inset-0 [transform:rotateY(180deg)] [backface-visibility:hidden]">
          <div className="h-full w-full rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-6 flex flex-col justify-center text-left">
            <div className="flex items-center gap-3 mb-3">
              <Icon className="w-6 h-6" />
              <h4 className="text-lg font-bold">{title}</h4>
            </div>
            <p className="text-sm text-blue-100 leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

InteractiveFeatureCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
}

// --- Main Features Page Component ---

export function FeaturesPage() {
  const [darkMode, setDarkMode] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [toast, setToast] = useState(null)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setDarkMode(true)
    }
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode)
    localStorage.setItem("theme", darkMode ? "dark" : "light")
  }, [darkMode])

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const showToast = (message, type = "info") => setToast({ message, type })
  const hideToast = () => setToast(null)

  const allFeatures = [
    { icon: Users2, title: "Collaboration", description: "Code together in real-time. Perfect for pair programming, interviews, or team projects. See your partner's cursor and make simultaneous edits." },
    { icon: Code, title: "Discussion Forum", description: "Stuck on a problem or want to share a solution? Dive into our forums to post questions, share insights, and engage with the community." },
    { icon: Trophy, title: "Contests", description: "Test your skills against the best. Participate in weekly coding contests and climb the global leaderboards to showcase your achievements." },
    { icon: CalendarDays, title: "Problem of the Day", description: "Stay sharp with a new, curated problem every single day. This feature helps you build a consistent practice habit and explore diverse topics." },
    { icon: Brain, title: "AI Assistant", description: "Never get truly stuck. Our AI helper provides intelligent hints, explains complex concepts, and helps debug your code without giving away the answer." },
    { icon: Video, title: "Video Solutions", description: "Go beyond text. Watch detailed video solutions from experts who break down problems, explain the logic, and code the solution step-by-step." },
    { icon: Flame, title: "Daily Streaks", description: "Stay motivated by tracking your progress. Maintain your daily coding streak and watch your activity heatmap grow to build discipline." },
    { icon: Bookmark, title: "Problem Bookmarks", description: "Organize your practice effectively. Bookmark challenging problems to revisit, or create custom lists like 'Interview Prep' to focus your efforts." },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-black dark:via-gray-900 dark:to-black text-gray-900 dark:text-white relative overflow-x-hidden">
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-white/90 dark:bg-black/90 backdrop-blur-sm shadow-lg border-b border-gray-200 dark:border-gray-800" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 h-16">
          <Link to="/" className="flex items-center gap-4">
            <div className="relative top-1 left-2"><img src={logo} alt="Logo" className="h-12 w-auto max-w-[150px] object-contain" /></div>
          </Link>
          <div className="flex items-center gap-3">
            <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-110" title="Toggle theme">
              {darkMode ? <Sun size={16} className="text-yellow-500" /> : <Moon size={16} className="text-gray-700" />}
            </button>
            <div className="hidden md:flex items-center gap-2">
              <Link to="/features"><button className="px-4 py-2 text-sm font-bold text-black dark:text-white ring-2 ring-black dark:ring-white rounded-lg">Features</button></Link>
              <Link to="/login"><button className="px-4 py-2 text-sm font-bold text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-all duration-200 hover:scale-105">Sign In</button></Link>
              <Link to="/signup"><button className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg text-sm font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">Register</button></Link>
            </div>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 rounded-lg">{isMenuOpen ? <X size={20} /> : <Menu size={20} />}</button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-black dark:text-white mb-4">
              Discover Our Features, <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-600 bg-clip-text text-transparent">Reimagined</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              A classic design with a modern interaction. Hover over any feature card to see how our platform can elevate your coding journey.
            </p>
          </div>
        </section>

        {/* Interactive Features Grid */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {allFeatures.map((feature) => (
              <InteractiveFeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-black dark:bg-white text-white dark:text-black">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-6">Ready to Start Building?</h2>
            <p className="text-lg opacity-90 mb-8 leading-relaxed">Join thousands of developers who are already leveling up their skills on our platform.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signup"><button className="px-8 py-4 bg-white dark:bg-black text-black dark:text-white rounded-xl text-lg font-bold hover:bg-gray-100 dark:hover:bg-gray-900 transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-3xl">Get Started for Free</button></Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer id="contact" className="py-16 px-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">© 2025 AlgoByte. All rights reserved.</p>
        </div>
      </footer>

      {/* Toast Notifications */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </div>
  )
}