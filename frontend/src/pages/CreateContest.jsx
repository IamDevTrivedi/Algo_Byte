"use client"

import React, { useState, useEffect, memo,useRef } from "react"
import { useNavigate,Link } from "react-router-dom"
import logo from "../Images/logo.png"
import {
  Calendar,
  Clock,
  FileText,
  Search,
  Check,
  ChevronRight,
  ChevronLeft,
  Sun,
  Moon,
  Code,
  AlertCircle,
  X,
} from "lucide-react"
import axiosClient from "../utils/axiosClient"


const Button = ({ children, onClick, disabled, variant = "default", className = "", ...props }) => {
  const baseClasses = "px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center"
  const variants = {
    default: "bg-green-600 hover:bg-green-700 text-white disabled:opacity-50",
    outline:
      "border border-gray-300 dark:border-gray-600 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300",
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}


const Input = ({ className = "", ...props }) => {
  return (
    <input
      className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-black text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${className}`}
      {...props}
    />
  )
}


const Textarea = ({ className = "", ...props }) => {
  return (
    <textarea
      className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-black text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-vertical ${className}`}
      {...props}
    />
  )
}


const Card = ({ children, className = "" }) => {
  return (
    <div className={`rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg ${className}`}>{children}</div>
  )
}

const CardHeader = ({ children }) => {
  return <div className="p-6 pb-4">{children}</div>
}

const CardTitle = ({ children, className = "" }) => {
  return <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>
}

const CardContent = ({ children, className = "" }) => {
  return <div className={`p-6 pt-0 ${className}`}>{children}</div>
}


const Badge = ({ children, className = "" }) => {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
      {children}
    </span>
  )
}


const DynamicBackground = memo(({ darkMode }) => {
  useEffect(() => {
    let animationFrameId = null
    const handleMouseMove = (e) => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
      animationFrameId = requestAnimationFrame(() => {
        document.documentElement.style.setProperty("--mouse-x", `${e.clientX}px`)
        document.documentElement.style.setProperty("--mouse-y", `${e.clientY + window.scrollY}px`)
      })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return (
    <>
      <div className="absolute inset-0 -z-10 min-h-full w-full bg-white dark:bg-black">
        <div className="absolute inset-0">
          <svg className="w-full h-full opacity-[0.03] dark:opacity-[0.08]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="circuit-contest" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <path d="M20 20h60v60h-60z" fill="none" stroke="currentColor" strokeWidth="0.5" />
                <circle cx="20" cy="20" r="2" fill="currentColor" />
                <circle cx="80" cy="20" r="2" fill="currentColor" />
                <circle cx="20" cy="80" r="2" fill="currentColor" />
                <circle cx="80" cy="80" r="2" fill="currentColor" />
                <path d="M20 20L80 20M20 80L80 80M20 20L20 80M80 20L80 80" stroke="currentColor" strokeWidth="0.3" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#circuit-contest)" />
          </svg>
        </div>

        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.06]">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="hexagon-contest" x="0" y="0" width="60" height="52" patternUnits="userSpaceOnUse">
                <polygon
                  points="30,2 45,15 45,37 30,50 15,37 15,15"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hexagon-contest)" />
          </svg>
        </div>

        <div
          className="absolute inset-0 z-20 transition-opacity duration-300"
          style={{
            backgroundImage: `
              radial-gradient(500px circle at var(--mouse-x) var(--mouse-y), rgba(34, 197, 94, 0.08), transparent 40%),
              radial-gradient(700px circle at var(--mouse-x) var(--mouse-y), rgba(251, 191, 36, 0.06), transparent 50%),
              radial-gradient(900px circle at var(--mouse-x) var(--mouse-y), rgba(239, 68, 68, 0.04), transparent 60%)
            `,
          }}
        />
      </div>

      <style>{`
        @keyframes premium-glow {
          0%, 100% {
            box-shadow: 0 0 25px rgba(34, 197, 94, 0.4), 0 0 50px rgba(34, 197, 94, 0.2);
          }
          50% {
            box-shadow: 0 0 35px rgba(34, 197, 94, 0.6), 0 0 70px rgba(34, 197, 94, 0.3);
          }
        }
      `}</style>
    </>
  )
})

const StepIndicator = ({ steps, currentStep, completedSteps }) => {
  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                completedSteps.includes(index)
                  ? "bg-green-500 border-green-500 text-white"
                  : currentStep === index
                    ? "bg-white dark:bg-black border-green-500 text-green-500"
                    : "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400"
              }`}
            >
              {completedSteps.includes(index) ? (
                <Check className="w-6 h-6" />
              ) : (
                <span className="text-sm font-semibold">{index + 1}</span>
              )}
            </div>
            <span className="text-xs mt-2 text-center text-gray-600 dark:text-gray-400 max-w-20">{step.title}</span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`w-16 h-0.5 mx-4 transition-colors duration-300 ${
                completedSteps.includes(index) ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )
}



const SearchIcon = ({ className }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
      />
    </svg>
  );
  
  const XIcon = ({ className }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={className}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
  
  const CheckIcon = ({ className }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={className}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );

const ProblemSelector = ({ selectedProblems, onProblemsChange, searchTerm, onSearchChange }) => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const fetchProblems = async () => {
      setLoading(true);
      try {
        const response = await axiosClient.get("/problem/getAllProblem");

        setProblems( response.data.problemNeeded);
      } catch (error) {
        console.error("Failed to fetch problems:", error);
        setProblems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  const filteredProblems = problems.filter(
    (problem) =>
      problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      problem.difficulty.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const toggleProblem = (problem) => {

    const isSelected = selectedProblems.some((p) => p._id === problem._id);

    if (isSelected) {
     
      onProblemsChange(selectedProblems.filter((p) => p._id !== problem._id));
    } else {
      onProblemsChange([...selectedProblems, problem]);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "hard":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  return (
    <div className="space-y-4">
     
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search problems by title or difficulty..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Selected Problems Display */}
      {selectedProblems.length > 0 && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <h4 className="text-sm font-medium text-green-800 dark:text-green-300 mb-2">
            Selected Problems ({selectedProblems.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {selectedProblems.map((problem) => (
             
              <div
                key={problem._id}
                className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
              >
                {problem.index}. {problem.title}
                <button
                  onClick={() => toggleProblem(problem)}
                  className="ml-2 -mr-1 p-0.5 rounded-full hover:bg-green-200 dark:hover:bg-green-700 focus:outline-none"
                  aria-label={`Remove ${problem.title}`}
                >
                  <XIcon className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Problems List */}
      <div className="max-h-64 overflow-y-auto space-y-2 pr-2">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading problems...</div>
        ) : filteredProblems.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No problems found</div>
        ) : (
          filteredProblems.map((problem) => {
            
            const isSelected = selectedProblems.some((p) => p._id === problem._id);
            return (
              <div
               
                key={problem._id}
                onClick={() => toggleProblem(problem)}
                className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? "bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700"
                    : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="font-mono text-sm text-gray-500 dark:text-gray-400">{problem.index}</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{problem.title}</span>

                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getDifficultyColor(problem.difficulty)}`}>
                      {problem.difficulty}
                    </span>
                  </div>
                  {isSelected && <CheckIcon className="w-5 h-5 text-green-500" />}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

// Confirmation Modal
const ConfirmationModal = ({ isOpen, onClose, onConfirm, contestData }) => {
  if (!isOpen) return null

  const modalRef = useRef(null)

  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }, [isOpen])

  return (
    <div ref={modalRef} className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white dark:bg-black border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
            <AlertCircle className="w-5 h-5 text-yellow-500" />
            Confirm Contest Creation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Are you sure you want to create this contest with the following details?
          </p>
          <div className="space-y-2 text-sm">
            <div>
              <strong>Title:</strong> {contestData.title}
            </div>
            <div>
              <strong>Problems:</strong> {contestData.selectedProblems.length} selected
            </div>
            <div>
              <strong>Start:</strong> {contestData.startTime}
            </div>
            <div>
              <strong>End:</strong> {contestData.endTime}
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={onConfirm} className="flex-1">
              Create Contest
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function CreateContest() {
  const navigate = useNavigate()
  const [darkMode, setDarkMode] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState([])
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  // Form data
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    selectedProblems: [],
    searchTerm: "",
  })
  useEffect(() => {
    if (!formData.startTime && !formData.endTime) {
      const now = new Date();
      const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
  
      setFormData((prev) => ({
        ...prev,
        startTime: getLocalDatetimeString(now),
        endTime: getLocalDatetimeString(oneHourLater),
      }));
    }
  }, []);
  
  
  const steps = [
    { title: "Basic Info", icon: FileText },
    { title: "Schedule", icon: Calendar },
    { title: "Problems", icon: Code },
    { title: "Review", icon: Check },
  ]

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode)
  }, [darkMode])

  const validateStep = (step) => {
    const newErrors = {}

    switch (step) {
      case 0:
        if (!formData.title.trim()) newErrors.title = "Contest title is required"
        if (!formData.description.trim()) newErrors.description = "Contest description is required"
        break
      case 1:
        if (!formData.startTime) newErrors.startTime = "Start time is required"
        if (!formData.endTime) newErrors.endTime = "End time is required"
        if (formData.startTime && formData.endTime && new Date(formData.startTime) >= new Date(formData.endTime)) {
          newErrors.endTime = "End time must be after start time"
        }
        break
      case 2:
        if (formData.selectedProblems.length === 0) newErrors.problems = "At least one problem must be selected"
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep])
      }
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    setCurrentStep(currentStep - 1)
  }
  const getLocalDatetimeString = (date = new Date()) => {
    const pad = (n) => n.toString().padStart(2, "0");
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };
  


// in CreateContest.js

const handleSubmit = async () => {
 
  if (!formData.startTime || !formData.endTime) {
    alert("Start time and end time are required. Please check your inputs.");
    
    setErrors({
      ...errors,
      startTime: !formData.startTime ? "Start time is required" : "",
      endTime: !formData.endTime ? "End time is required" : "",
    });
    return; 
  }

  const startDate = new Date(formData.startTime);
  const endDate = new Date(formData.endTime);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    alert("Invalid date format. Please check your start and end times.");
    setErrors({
      ...errors,
      startTime: isNaN(startDate.getTime()) ? "Invalid start time" : "",
      endTime: isNaN(endDate.getTime()) ? "Invalid end time" : "",
    });
    return; 
  }
 setIsSubmitting(true);
  try {
    const startTimeUTC = startDate.toISOString();
    const endTimeUTC = endDate.toISOString();

    const response = await axiosClient.post("/contest/createContest", {
      title: formData.title,
      description: formData.description,
      startTime: startTimeUTC,
      endTime: endTimeUTC,
      problems: formData.selectedProblems,
    });

    if (response.data.success) {
      alert("Contest created successfully!");
      navigate("/adminPanel");
    } else {
      
      const errorMessage = response.data.message || "Failed to create contest";
      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error("Error creating contest:", error);
  
    alert(`Failed to create contest: ${error.message}. Please try again.`);
  } finally {
    setIsSubmitting(false);
    setShowConfirmation(false);
  }
};

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Contest Title *</label>
              <Input
                placeholder="Enter contest title..."
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Contest Description *
              </label>
              <Textarea
                placeholder="Describe the contest objectives, rules, and any special instructions..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={6}
                className={errors.description ? "border-red-500" : ""}
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>
          </div>
        )
        case 1:
          const now = new Date();
          const currentDate = now.toISOString().split("T")[0]; // "YYYY-MM-DD"
          const currentTime = now.toTimeString().split(" ")[0].slice(0, 5); // "HH:MM"
        
          return (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Start Time *</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="datetime-local"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className={`pl-10 ${errors.startTime ? "border-red-500" : ""}`}
                  />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Current date: <span className="font-mono">{currentDate}</span> &nbsp; | &nbsp; Current time: <span className="font-mono">{currentTime}</span>
                </p>
                {errors.startTime && <p className="text-red-500 text-sm mt-1">{errors.startTime}</p>}
              </div>
        
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">End Time *</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="datetime-local"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className={`pl-10 ${errors.endTime ? "border-red-500" : ""}`}
                  />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Current date: <span className="font-mono">{currentDate}</span> &nbsp; | &nbsp; Current time: <span className="font-mono">{currentTime}</span>
                </p>
                {errors.endTime && <p className="text-red-500 text-sm mt-1">{errors.endTime}</p>}
              </div>
            </div>
          );
        
      case 2:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Problems *
              </label>
              <ProblemSelector
                selectedProblems={formData.selectedProblems}
                onProblemsChange={(problems) => setFormData({ ...formData, selectedProblems: problems })}
                searchTerm={formData.searchTerm}
                onSearchChange={(term) => setFormData({ ...formData, searchTerm: term })}
              />
              {errors.problems && <p className="text-red-500 text-sm mt-1">{errors.problems}</p>}
            </div>
          </div>
        )
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Review Contest Details</h3>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Basic Information</h4>
                <p>
                  <strong>Title:</strong> {formData.title}
                </p>
                <p>
                  <strong>Description:</strong> {formData.description}
                </p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Schedule</h4>
                <p>
                  <strong>Start:</strong> {new Date(formData.startTime).toLocaleString()}
                </p>
                <p>
                  <strong>End:</strong> {new Date(formData.endTime).toLocaleString()}
                </p>
                <p>
                  <strong>Duration:</strong>{" "}
                  {Math.round((new Date(formData.endTime) - new Date(formData.startTime)) / (1000 * 60 * 60))} hours
                </p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Problems ({formData.selectedProblems.length})
                </h4>
                <div className="space-y-1">
                  {formData.selectedProblems.map((problem) => (
                    <div key={problem.id} className="flex items-center justify-between">
                      <span>
                        {problem.index}. {problem.title}
                      </span>
                      <Badge
                        className={
                          problem.difficulty === "Easy"
                            ? "bg-green-100 text-green-800"
                            : problem.difficulty === "Medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }
                      >
                        {problem.difficulty}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="relative min-h-screen text-gray-700 dark:text-gray-300">
      <DynamicBackground darkMode={darkMode} />

      <div className="relative min-h-screen p-4">
        {/* Header */}
        <header className="absolute top-0 left-0 right-0 p-4 z-10">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/"><div className="relative top-1 left-2">
          <img
            src={logo}
            alt="Logo"
            className="h-12 w-auto max-w-[150px] object-contain"
          />
        </div>
        </Link>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/90 dark:bg-black/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 hover:scale-110 shadow-lg"
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-yellow-500 transition-transform duration-300 hover:rotate-180" />
              ) : (
                <Moon className="w-5 h-5 text-gray-700 transition-transform duration-300 hover:rotate-12" />
              )}
            </button>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex flex-col items-center justify-center min-h-screen pt-20">
          <div className="w-full max-w-4xl">
            {/* Title */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-black dark:text-white mb-2">Create Contest</h1>
              <p className="text-gray-600 dark:text-gray-400">Set up a new competitive programming contest</p>
            </div>

            {/* Step Indicator */}
            <StepIndicator steps={steps} currentStep={currentStep} completedSteps={completedSteps} />

            {/* Form Card */}
            <Card className="bg-white/95 dark:bg-black/95 backdrop-blur-xl border border-gray-200 dark:border-gray-700 shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                  {React.createElement(steps[currentStep].icon, { className: "w-5 h-5" })}
                  {steps[currentStep].title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {renderStepContent()}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6">
                  <Button variant="outline" onClick={prevStep} disabled={currentStep === 0}>
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>

                  {currentStep < steps.length - 1 ? (
                    <Button onClick={nextStep}>
                      Next
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button onClick={() => setShowConfirmation(true)} disabled={isSubmitting}>
                      {isSubmitting ? "Creating..." : "Create Contest"}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleSubmit}
        contestData={formData}
      />
    </div>
  )
}
