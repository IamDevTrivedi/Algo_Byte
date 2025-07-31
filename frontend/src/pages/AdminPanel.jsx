"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import logo from "../Images/logo.png"
import {
  PlusCircle,
  FilePenLine,
  Trash2,
  Code,
  Video,
  Star,
  LayoutGrid,
  Sun,
  Moon,
  ArrowRight,
} from "lucide-react"

const DynamicBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 h-full w-full bg-slate-50 dark:bg-slate-950">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 dark:bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-sky-400/10 dark:bg-gray-300/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-indigo-500/10 dark:bg-white/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>
    </div>
  )
}


const DarkModeToggle = ({ darkMode, setDarkMode }) => {
  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="p-2.5 rounded-xl border bg-white/50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700/80 hover:bg-gray-200 dark:hover:bg-slate-800 transition-all duration-300"
      title="Toggle theme"
    >
      {darkMode ? (
        <Sun className="h-4 w-4 text-yellow-400" />
      ) : (
        <Moon className="h-4 w-4 text-slate-700" />
      )}
    </button>
  )
}


const ActionCard = ({ to, icon: Icon, title, description, variant }) => {
  const getVariantStyles = (variant) => {

    switch (variant) {
      case "create": return {
        borderColor: "hover:border-green-500",
        shadow: "dark:group-hover:shadow-[0_0_25px_-5px_rgba(34,197,94,0.4)]",
        iconColor: "text-green-500",
        buttonHover: "hover:bg-green-500/10 hover:text-green-500 dark:hover:border-green-500/30",
      };
      case "update": return {
        borderColor: "hover:border-amber-500",
        shadow: "dark:group-hover:shadow-[0_0_25px_-5px_rgba(245,158,11,0.4)]",
        iconColor: "text-amber-500",
        buttonHover: "hover:bg-amber-500/10 hover:text-amber-500 dark:hover:border-amber-500/30",
      };
      case "delete": return {
        borderColor: "hover:border-red-500",
        shadow: "dark:group-hover:shadow-[0_0_25px_-5px_rgba(239,68,68,0.4)]",
        iconColor: "text-red-500",
        buttonHover: "hover:bg-red-500/10 hover:text-red-500 dark:hover:border-red-500/30",
      };
      case "video": return {
        borderColor: "hover:border-sky-500",
        shadow: "dark:group-hover:shadow-[0_0_25px_-5px_rgba(14,165,233,0.4)]",
        iconColor: "text-sky-500",
        buttonHover: "hover:bg-sky-500/10 hover:text-sky-500 dark:hover:border-sky-500/30",
      };
      case "contest": return {
        borderColor: "hover:border-indigo-500",
        shadow: "dark:group-hover:shadow-[0_0_25px_-5px_rgba(99,102,241,0.4)]",
        iconColor: "text-indigo-500",
        buttonHover: "hover:bg-indigo-500/10 hover:text-indigo-500 dark:hover:border-indigo-500/30",
      };
      case "potd": return {
        borderColor: "hover:border-fuchsia-500",
        shadow: "dark:group-hover:shadow-[0_0_25px_-5px_rgba(217,70,239,0.4)]",
        iconColor: "text-fuchsia-500",
        buttonHover: "hover:bg-fuchsia-500/10 hover:text-fuchsia-500 dark:hover:border-fuchsia-500/30",
      };
      default: return {
        borderColor: "hover:border-blue-500",
        shadow: "dark:group-hover:shadow-[0_0_25px_-5px_rgba(59,130,246,0.4)]",
        iconColor: "text-blue-500",
        buttonHover: "hover:bg-blue-500/10 hover:text-blue-500 dark:hover:border-blue-500/30",
      };
    }
  };

  const styles = getVariantStyles(variant);

  return (

    <div className={`group relative flex h-full w-full max-w-sm flex-col justify-between overflow-hidden rounded-2xl border-2 bg-white p-6 shadow-lg shadow-slate-200/50 transition-all duration-300 border-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none hover:-translate-y-1 ${styles.borderColor}`}>
      <div className="flex flex-col">

        <div className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 transition-all duration-300 group-hover:-translate-y-4 ${styles.shadow}`}>

          <Icon className={`h-7 w-7 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6 ${styles.iconColor}`} strokeWidth={1.5} />
        </div>
        <h3 className="mb-2 text-xl font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">{description}</p>
      </div>
      
      <Link
        to={to}
        className={`group/button mt-8 flex w-full items-center justify-center gap-2 rounded-lg border py-2.5 text-center text-sm font-semibold text-slate-500 transition-all duration-300 border-slate-200 dark:border-slate-700 dark:text-slate-400 ${styles.buttonHover}`}
      >
        <span>Manage</span>
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/button:translate-x-1" />
      </Link>
    </div>
  )
}


const cardData = [
  { to: "/admin/createProblem", title: "Create Problem", description: "Design and deploy new coding challenges with a streamlined creation process.", icon: PlusCircle, variant: 'create' },
  { to: "/admin/updateProblem", title: "Update Problem", description: "Modify existing challenges, update test cases, and manage problem versions.", icon: FilePenLine, variant: 'update' },
  { to: "/admin/deleteProblem", title: "Delete Problem", description: "Safely remove challenges from the platform with administrative controls.", icon: Trash2, variant: 'delete' },
  { to: "/admin/video", title: "Manage Videos", description: "Upload, organize, and manage all educational video content and their metadata.", icon: Video, variant: 'video' },
  { to: "/admin/createContest", title: "Organize Contest", description: "Build and schedule competitive contests with custom rules and problem sets.", icon: LayoutGrid, variant: 'contest' },
  { to: "/admin/createPotd", title: "Problem of the Day", description: "Select and feature a daily challenge to drive consistent community engagement.", icon: Star, variant: 'potd' },
]

export function AdminPanel() {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode)
  }, [darkMode])

  return (
    <div className="isolate min-h-screen">
      <DynamicBackground />
      <div className="relative flex min-h-screen flex-col items-center justify-center p-4">
        <header className="absolute top-0 left-0 right-0 p-4">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link to="/"><div className="relative top-1 left-2">
          <img
            src={logo}
            alt="Logo"
            className="h-12 w-auto max-w-[150px] object-contain"
          />
        </div>
        </Link>
            <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
          </div>
        </header>

        <div className="mb-12 text-center">
          <h1 className="mb-3 text-4xl font-bold text-slate-900 dark:text-slate-50 md:text-5xl">
            Admin Control Hub
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            A minimal and efficient interface to manage your platform.
          </p>
        </div>

        <div className="grid w-full max-w-7xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cardData.map((card) => (
            <ActionCard
              key={card.to}
              to={card.to}
              title={card.title}
              description={card.description}
              icon={card.icon}
              variant={card.variant}
            />
          ))}
        </div>
      </div>
    </div>
  )
}