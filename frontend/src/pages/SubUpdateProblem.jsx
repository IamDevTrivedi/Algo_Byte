"use client"

import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import axiosClient from "../utils/axiosClient"
import { useNavigate, useParams,Link } from "react-router-dom"
import logo from "../Images/logo.png"
import { useEffect, useState } from "react"
import {
  Sun,
  Moon,
  Code,
  Plus,
  X,
  Copy,
  Check,
  Eye,
  FileText,
  Edit,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
} from "lucide-react"

// --- Advanced Typewriter Effect Hook ---
const useTypewriter = (text, speed = 80) => {
  const [displayText, setDisplayText] = useState("")
  const [isComplete, setIsComplete] = useState(false)
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    let i = 0
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayText(text.slice(0, i + 1))
        i++
      } else {
        setIsComplete(true)
        clearInterval(timer)
        // Blink cursor for 2 seconds after completion
        setTimeout(() => setShowCursor(false), 2000)
      }
    }, speed)

    return () => clearInterval(timer)
  }, [text, speed])

  return { displayText, isComplete, showCursor }
}

// --- Success Modal Component ---
const SuccessModal = ({ isVisible, onClose }) => {
  const [showTick, setShowTick] = useState(false)

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => setShowTick(true), 200)
      return () => clearTimeout(timer)
    } else {
      setShowTick(false)
    }
  }, [isVisible])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blurred Background */}
      <div
        className="absolute inset-0 bg-black/20 dark:bg-white/10 backdrop-blur-md transition-all duration-500"
        onClick={onClose}
      />

      {/* Success Content */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* Big Green Tick */}
        <div
          className={`w-32 h-32 rounded-full bg-green-500 flex items-center justify-center mb-6 transition-all duration-700 ease-out ${
            showTick ? "scale-100 opacity-100" : "scale-0 opacity-0"
          }`}
          style={{
            boxShadow: "0 0 50px rgba(34, 197, 94, 0.5), 0 0 100px rgba(34, 197, 94, 0.3)",
          }}
        >
          <Check className="w-16 h-16 text-white" strokeWidth={3} />
        </div>

        {/* Success Message */}
        <div
          className={`text-center transition-all duration-500 delay-300 ${
            showTick ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <h2 className="text-3xl font-bold text-black dark:text-white mb-2">Problem Updated Successfully!</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Your coding challenge has been updated on the platform.
          </p>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}

// --- Confirmation Modal Component ---
const ConfirmationModal = ({ isVisible, onConfirm, onCancel, isSubmitting }) => {
  if (!isVisible) return null

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center">
      {/* Blurred Background */}
      <div
        className="absolute inset-0 bg-black/20 dark:bg-white/10 backdrop-blur-md transition-all duration-500"
        onClick={onCancel}
      />

      {/* Confirmation Content */}
      <div className="relative z-10 bg-white/95 dark:bg-black/95 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl p-6 max-w-md mx-4">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
            <Edit className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
          </div>

          <h3 className="text-xl font-bold text-black dark:text-white mb-2">Confirm Problem Update</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Are you sure you want to update this coding problem? This action will save all your changes to the platform.
          </p>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 text-sm font-bold rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isSubmitting}
              className={`flex-1 flex items-center justify-center px-4 py-2 text-sm font-bold rounded-lg border transition-all duration-300 ${
                isSubmitting
                  ? "bg-gray-400 dark:bg-gray-600 text-gray-200 dark:text-gray-400 border-gray-400 dark:border-gray-600 cursor-not-allowed"
                  : "bg-green-600 dark:bg-green-500 text-white dark:text-black hover:bg-green-700 dark:hover:bg-green-400 border-green-600 dark:border-green-500 hover:scale-105"
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin mr-2" />
                  Updating...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Confirm Update
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// --- Enhanced Circuit Board Background (Homepage Style) ---
const CircuitBoardBackground = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    let animationFrameId = null
    const handleMouseMove = (e) => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
      animationFrameId = requestAnimationFrame(() => {
        setMousePos({ x: e.clientX, y: e.clientY + window.scrollY })
        document.documentElement.style.setProperty("--mouse-x", `${e.clientX}px`)
        document.documentElement.style.setProperty("--mouse-y", `${e.clientY + window.scrollY}px`)
      })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return (
    <div className="absolute inset-0 -z-10 h-full w-full overflow-hidden bg-white dark:bg-black">
      {/* Neural Network Nodes */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.08]">
        {Array.from({ length: 25 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gray-400 dark:bg-gray-600 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Circuit Board Pattern */}
      <div className="absolute inset-0">
        <svg className="w-full h-full opacity-[0.02] dark:opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M20 20h60v60h-60z" fill="none" stroke="currentColor" strokeWidth="0.5" />
              <circle cx="20" cy="20" r="2" fill="currentColor" />
              <circle cx="80" cy="20" r="2" fill="currentColor" />
              <circle cx="20" cy="80" r="2" fill="currentColor" />
              <circle cx="80" cy="80" r="2" fill="currentColor" />
              <path d="M20 20L80 20M20 80L80 80M20 20L20 80M80 20L80 80" stroke="currentColor" strokeWidth="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit)" />
        </svg>
      </div>

      {/* Interactive Lightning/Neural Network Effect */}
      <div
        className="absolute inset-0 z-20 transition-opacity duration-300"
        style={{
          backgroundImage: `
            radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(0, 0, 0, 0.05), transparent 50%),
            radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(0, 0, 0, 0.02), transparent 70%)
          `,
        }}
      />
    </div>
  )
}

// --- Enhanced Fire Particles with Code Matrix ---
const FireParticles = () => {
  const particles = Array.from({ length: 8 }, (_, i) => i)

  return (
    <div className="fire-particles">
      {particles.map((i) => (
        <div
          key={i}
          className="fire-particle"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
          }}
        />
      ))}
      {/* Code symbols floating */}
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={`code-${i}`}
          className="absolute text-gray-400 dark:text-gray-600 text-xs font-mono opacity-10 animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 4}s`,
          }}
        >
          {["</>", "{}", "[]", "()"][i]}
        </div>
      ))}
    </div>
  )
}

// --- Updated Wizard Progress Component ---
const WizardProgress = ({ currentStep, completedSteps, steps }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1
          const isActive = currentStep === stepNumber
          const isCompleted = completedSteps.includes(stepNumber)
          const isAccessible = stepNumber <= Math.max(currentStep, ...completedSteps) + 1

          // Show green line if current step is completed AND there's a next step
          const shouldShowGreenLine = isCompleted && index < steps.length - 1

          return (
            <div key={stepNumber} className="flex items-center">
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                    isCompleted
                      ? "bg-green-500 border-green-500 text-white shadow-lg shadow-green-500/30"
                      : isActive
                        ? "bg-black dark:bg-white border-black dark:border-white text-white dark:text-black shadow-lg"
                        : isAccessible
                          ? "bg-white dark:bg-black border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500"
                          : "bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-600"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-bold">{stepNumber}</span>
                  )}
                </div>
                <span
                  className={`mt-2 text-xs font-medium transition-all duration-300 ${
                    isActive
                      ? "text-black dark:text-white"
                      : isCompleted
                        ? "text-green-600 dark:text-green-400"
                        : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {step.title}
                </span>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="flex-1 mx-4 relative">
                  {/* Background line */}
                  <div className="h-0.5 w-full bg-gray-200 dark:bg-gray-700 transition-all duration-300" />
                  {/* Green progress line - static, no animation */}
                  <div
                    className={`absolute top-0 h-0.5 bg-green-500 transition-all duration-500 ease-in-out ${
                      shouldShowGreenLine ? "w-full" : "w-0"
                    }`}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// --- Live Preview Panel ---
const LivePreviewPanel = ({ formData, darkMode, isVisible, setIsVisible }) => {
  const [previewMode, setPreviewMode] = useState("desktop")

  const getDifficultyStyles = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800"
      case "medium":
        return "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800"
      case "hard":
        return "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800"
      default:
        return "bg-gray-50 dark:bg-gray-900/20 text-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-800"
    }
  }

  if (!isVisible) {
    return (
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-30">
        <button
          onClick={() => setIsVisible(true)}
          className="p-3 bg-white/95 dark:bg-black/95 backdrop-blur-xl rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110"
          title="Show Preview"
        >
          <Eye className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>
    )
  }

  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 w-80 max-h-[80vh] z-30">
      <div className="bg-white/95 dark:bg-black/95 backdrop-blur-xl rounded-xl border border-gray-200 dark:border-gray-700 shadow-2xl overflow-hidden">
        {/* Preview Header */}
        <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-black dark:bg-white shadow-lg">
                <FileText className="w-3 h-3 text-white dark:text-black" />
              </div>
              <h3 className="text-sm font-bold text-black dark:text-white">Live Preview</h3>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPreviewMode(previewMode === "desktop" ? "mobile" : "desktop")}
                className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-all duration-200"
                title={`Switch to ${previewMode === "desktop" ? "mobile" : "desktop"} view`}
              >
                <div
                  className={`w-3 h-3 border border-current ${previewMode === "desktop" ? "rounded-sm" : "rounded"}`}
                />
              </button>
              <button
                onClick={() => setIsVisible(false)}
                className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-all duration-200"
                title="Close Preview"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Preview Content */}
        <div className={`p-4 overflow-y-auto max-h-[60vh] ${previewMode === "mobile" ? "text-xs" : "text-sm"}`}>
          <div className="space-y-4">
            {/* Problem Title and Meta */}
            <div>
              <h1
                className={`font-bold text-black dark:text-white mb-2 ${previewMode === "mobile" ? "text-lg" : "text-xl"}`}
              >
                {formData.title || "Problem Title"}
              </h1>
              <div className="flex items-center gap-2 mb-3">
                <span
                  className={`inline-flex items-center rounded-lg px-2 py-1 text-xs font-bold ${getDifficultyStyles(formData.difficulty)}`}
                >
                  {formData.difficulty || "easy"}
                </span>
                <span className="inline-flex items-center rounded-lg px-2 py-1 text-xs font-bold bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                  {formData.tags || "array"}
                </span>
              </div>
            </div>

            {/* Problem Description */}
            <div>
              <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {formData.description ? (
                  <div dangerouslySetInnerHTML={{ __html: formData.description.replace(/\n/g, "<br/>") }} />
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 italic">Problem description will appear here...</p>
                )}
              </div>
            </div>

            {/* Test Cases Preview */}
            {formData.visibleTestCases && formData.visibleTestCases.length > 0 && (
              <div className="space-y-3">
                {formData.visibleTestCases.map((tc, i) => (
                  <div key={i} className="space-y-2">
                    <h4 className="font-bold text-black dark:text-white">Example {i + 1}:</h4>
                    <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg border border-gray-200 dark:border-gray-700 space-y-2">
                      {tc.input && (
                        <div>
                          <div className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Input:</div>
                          <div className="bg-white dark:bg-black p-2 rounded border border-gray-200 dark:border-gray-700 font-mono text-xs">
                            {tc.input}
                          </div>
                        </div>
                      )}
                      {tc.output && (
                        <div>
                          <div className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Output:</div>
                          <div className="bg-white dark:bg-black p-2 rounded border border-gray-200 dark:border-gray-700 font-mono text-xs">
                            {tc.output}
                          </div>
                        </div>
                      )}
                      {tc.explanation && (
                        <div>
                          <div className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Explanation:</div>
                          <div className="text-gray-700 dark:text-gray-300 text-xs bg-white dark:bg-black p-2 rounded border border-gray-200 dark:border-gray-700">
                            {tc.explanation}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Code Template Preview */}
            {formData.startCode && formData.startCode.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-bold text-black dark:text-white">Code Template:</h4>
                <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">JavaScript:</div>
                  <pre className="bg-white dark:bg-black p-2 rounded border border-gray-200 dark:border-gray-700 font-mono text-xs overflow-x-auto">
                    {formData.startCode.find((c) => c.language === "JavaScript")?.initialCode ||
                      "// Code template will appear here..."}
                  </pre>
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="text-center p-2 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
                  <div className="font-bold text-black dark:text-white">{formData.visibleTestCases?.length || 0}</div>
                  <div className="text-gray-600 dark:text-gray-400">Visible Tests</div>
                </div>
                <div className="text-center p-2 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
                  <div className="font-bold text-black dark:text-white">{formData.hiddenTestCases?.length || 0}</div>
                  <div className="text-gray-600 dark:text-gray-400">Hidden Tests</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Footer */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">Live Preview Active</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// --- Enhanced Form Components ---
const FormInput = ({ label, register, name, error, ...props }) => {
  const [isFocused, setIsFocused] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      className={`form-control w-full transition-all duration-500 ease-out ${
        isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      {label && (
        <label className="label py-1">
          <span className="label-text text-sm font-medium text-black dark:text-white">{label}</span>
        </label>
      )}
      <div className="relative">
        <input
          {...register(name)}
          {...props}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full px-3 py-2 text-sm rounded-lg bg-white dark:bg-black backdrop-blur-sm border border-gray-200 dark:border-gray-700 text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 focus:border-black dark:focus:border-white transition-all duration-300 font-medium ${
            error ? "border-red-500 ring-2 ring-red-500/20" : ""
          }`}
        />
      </div>
      {error && <span className="text-red-500 text-xs mt-1 font-medium">{error.message}</span>}
    </div>
  )
}

const FormTextarea = ({ label, register, name, error, ...props }) => {
  const [isFocused, setIsFocused] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 150)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      className={`form-control w-full transition-all duration-500 ease-out ${
        isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      {label && (
        <label className="label py-1">
          <span className="label-text text-sm font-medium text-black dark:text-white">{label}</span>
        </label>
      )}
      <div className="relative">
        <textarea
          {...register(name)}
          {...props}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full px-3 py-2 text-sm rounded-lg bg-white dark:bg-black backdrop-blur-sm border border-gray-200 dark:border-gray-700 text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 focus:border-black dark:focus:border-white transition-all duration-300 font-medium h-24 resize-none ${
            error ? "border-red-500 ring-2 ring-red-500/20" : ""
          }`}
        />
      </div>
      {error && <span className="text-red-500 text-xs mt-1 font-medium">{error.message}</span>}
    </div>
  )
}

const FormSelect = ({ label, register, name, error, children, ...props }) => {
  const [isFocused, setIsFocused] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 200)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      className={`form-control w-full transition-all duration-500 ease-out ${
        isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <label className="label py-1">
        <span className="label-text text-sm font-medium text-black dark:text-white">{label}</span>
      </label>
      <div className="relative">
        <select
          {...register(name)}
          {...props}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full px-3 py-2 text-sm rounded-lg bg-white dark:bg-black backdrop-blur-sm border border-gray-200 dark:border-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 focus:border-black dark:focus:border-white transition-all duration-300 font-medium appearance-none ${
            error ? "border-red-500 ring-2 ring-red-500/20" : ""
          }`}
        >
          {children}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && <span className="text-red-500 text-xs mt-1 font-medium">{error.message}</span>}
    </div>
  )
}

const CodeEditor = ({ title, register, name, error, index }) => {
  const [copied, setCopied] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 50 * (index || 0))
    return () => clearTimeout(timer)
  }, [index])

  const handleCopy = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className={`group w-full transition-all duration-500 ease-out ${
        isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <div className="flex flex-col h-full bg-white dark:bg-black backdrop-blur-sm rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
        <div className="flex justify-between items-center px-3 py-2 bg-gray-50 dark:bg-gray-900 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
          <label className="label-text text-sm font-semibold text-black dark:text-white">{title}</label>
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center justify-center h-6 w-6 rounded-md bg-white dark:bg-black text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 hover:scale-110"
            title="Copy Code"
          >
            {copied ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
          </button>
        </div>
        <div className="relative flex-grow">
          <textarea
            {...register(name)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={`w-full h-full p-3 bg-transparent text-black dark:text-white font-mono text-xs leading-5 focus:outline-none resize-none transition-all duration-300 ${
              error ? "ring-2 ring-red-500/50" : ""
            }`}
            rows={10}
          />
        </div>
      </div>
    </div>
  )
}

// --- Enhanced Action Button ---
const ActionButton = ({ onClick, variant = "primary", children, className = "", index, ...props }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 50 * (index || 0))
    return () => clearTimeout(timer)
  }, [index])

  const getVariantStyles = () => {
    switch (variant) {
      case "add":
        return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50 border-green-300 dark:border-green-700"
      case "remove":
        return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50 border-red-300 dark:border-red-700"
      case "secondary":
        return "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600"
      default:
        return "bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 border-black dark:border-white"
    }
  }

  return (
    <div
      className={`transition-all duration-500 ease-out ${
        isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <button
        type="button"
        onClick={onClick}
        className={`flex items-center justify-center rounded-lg border transition-all duration-300 hover:scale-105 hover:shadow-lg hover:-translate-y-1 ${getVariantStyles()} ${className}`}
        {...props}
      >
        {children}
      </button>
    </div>
  )
}

const problemSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  difficulty: z.enum(["easy", "medium", "hard"]),
  tags: z.string().min(1, "Tag is required"),
  visibleTestCases: z
    .array(
      z.object({
        input: z.string().min(1, "Input is required"),
        output: z.string().min(1, "Output is required"),
        explanation: z.string().min(1, "Explanation is required"),
      }),
    )
    .min(1, "At least one visible test case is required"),
  hiddenTestCases: z
    .array(
      z.object({
        input: z.string().min(1, "Input is required"),
        output: z.string().min(1, "Output is required"),
      }),
    )
    .min(1, "At least one hidden test case is required"),
  startCode: z.array(
    z.object({
      language: z.string(),
      initialCode: z.string().min(1, "Initial code is required"),
    }),
  ),
  referenceSolution: z.array(
    z.object({
      language: z.string(),
      completeCode: z.string().min(1, "Reference solution is required"),
    }),
  ),
})

export function SubUpdateProblem() {
  const navigate = useNavigate()
  const { id } = useParams()

  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      visibleTestCases: [{ input: "", output: "", explanation: "" }],
      hiddenTestCases: [{ input: "", output: "" }],
      startCode: [
        { language: "C++", initialCode: "" },
        { language: "Java", initialCode: "" },
        { language: "JavaScript", initialCode: "" },
      ],
      referenceSolution: [
        { language: "C++", completeCode: "" },
        { language: "Java", completeCode: "" },
        { language: "JavaScript", completeCode: "" },
      ],
    },
  })

  const {
    fields: visibleFields,
    append: appendVisible,
    remove: removeVisible,
  } = useFieldArray({
    control,
    name: "visibleTestCases",
  })
  const {
    fields: hiddenFields,
    append: appendHidden,
    remove: removeHidden,
  } = useFieldArray({
    control,
    name: "hiddenTestCases",
  })

  const [darkMode, setDarkMode] = useState(false)
  const [activeLanguage, setActiveLanguage] = useState("C++")
  const [isPreviewVisible, setIsPreviewVisible] = useState(true)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  // Wizard state
  const [currentStep, setCurrentStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState([])

  // Watch form data for live preview
  const formData = watch()

  // Typewriter effect for title
  const { displayText, isComplete, showCursor } = useTypewriter("Update Problem", 80)

  // Wizard steps configuration
  const steps = [
    { title: "Basic Info", fields: ["title", "description", "difficulty", "tags"] },
    { title: "Test Cases", fields: ["visibleTestCases", "hiddenTestCases"] },
    { title: "Code & Solutions", fields: ["startCode", "referenceSolution"] },
    { title: "Review & Submit", fields: [] },
  ]

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark")
    else document.documentElement.classList.remove("dark")
  }, [darkMode])

  // Fetch existing problem data
  useEffect(() => {
    const fetchProblemData = async () => {
      try {
        setLoading(true)
        const response = await axiosClient.get(`/problem/problemById/${id}`)
        const problemData = response.data._doc
        

        // Reset form with existing data
        reset({
          title: problemData.title || "",
          description: problemData.description || "",
          difficulty: problemData.difficulty || "easy",
          tags: problemData.tags || "",
          visibleTestCases: problemData.visibleTestCases || [{ input: "", output: "", explanation: "" }],
          hiddenTestCases: problemData.hiddenTestCases || [{ input: "", output: "" }],
          startCode: problemData.startCode || [
            { language: "C++", initialCode: "" },
            { language: "Java", initialCode: "" },
            { language: "JavaScript", initialCode: "" },
          ],
          referenceSolution: problemData.referenceSolution || [
            { language: "C++", completeCode: "" },
            { language: "Java", completeCode: "" },
            { language: "JavaScript", completeCode: "" },
          ],
        })

        setError(null)
      } catch (err) {
        console.error("Error fetching problem data:", err)
        setError("Failed to load problem data. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchProblemData()
    }
  }, [id, reset])

  // Validate current step
  const validateStep = async (stepNumber) => {
    const stepFields = steps[stepNumber - 1].fields
    if (stepFields.length === 0) return true

    const result = await trigger(stepFields)
    return result
  }

  // Handle step navigation
  const handleNext = async () => {
    const isValid = await validateStep(currentStep)
    if (isValid) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep])
      }
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1)
      }
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
       setCompletedSteps(completedSteps.filter((step) => step < currentStep))
    }
  }

  const handleStepClick = (stepNumber) => {
    if (stepNumber <= Math.max(currentStep, ...completedSteps) + 1) {
      setCurrentStep(stepNumber)
      setCompletedSteps(completedSteps.filter((step) => step < stepNumber))
    }
  }

  const handleConfirmSubmit = async () => {
    setIsSubmitting(true)
    try {
      const formData = watch()
      const response = await axiosClient.put(`/problem/update/${id}`, formData)
      setShowConfirmModal(false)
      setShowSuccessModal(true)
    } catch (error) {
      console.error("Error updating problem:", error)
      setIsSubmitting(false)
      setShowConfirmModal(false)
    }
  }

  const handleSubmitClick = () => {
    setShowConfirmModal(true)
  }

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false)
    setIsSubmitting(false)
    navigate("/")
  }

  const handleCancel = () => {
    navigate("/") 
  }

  const languageTabs = ["C++", "Java", "JavaScript"]

  if (loading) {
    return (
      <div className="min-h-screen relative text-black dark:text-white transition-colors duration-300 isolate">
        <CircuitBoardBackground />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-black dark:border-t-white rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg font-medium">Loading problem data...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen relative text-black dark:text-white transition-colors duration-300 isolate">
        <CircuitBoardBackground />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-lg font-medium text-red-500 mb-4">{error}</p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative text-black dark:text-white transition-colors duration-300 isolate">
      <CircuitBoardBackground />

      {/* Success Modal */}
      <SuccessModal isVisible={showSuccessModal} onClose={handleSuccessModalClose} />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isVisible={showConfirmModal}
        onConfirm={handleConfirmSubmit}
        onCancel={() => setShowConfirmModal(false)}
        isSubmitting={isSubmitting}
      />

      {/* Live Preview Panel */}
      <LivePreviewPanel
        formData={formData}
        darkMode={darkMode}
        isVisible={isPreviewVisible}
        setIsVisible={setIsPreviewVisible}
      />

      {/* Enhanced Navigation */}
      <nav className="sticky top-0 z-40 bg-white/90 dark:bg-black/90 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        <Link to="/"><div className="relative top-1 left-2">
          <img
            src={logo}
            alt="Logo"
            className="h-12 w-auto max-w-[150px] object-contain"
          />
        </div>
        </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-110 group border border-gray-200 dark:border-gray-600"
              title="Toggle theme"
            >
              {darkMode ? (
                <Sun className="w-4 h-4 text-gray-600 group-hover:rotate-180 transition-transform duration-300" />
              ) : (
                <Moon className="w-4 h-4 text-gray-700 group-hover:rotate-12 transition-transform duration-300" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Enhanced Main Content */}
      <main
        className={`fire-container transition-all duration-700 ease-in-out ${
          isPreviewVisible ? "max-w-7xl mx-auto pl-8 pr-96" : "max-w-4xl mx-auto"
        } p-5 mt-6 mb-12 relative z-10`}
      >
        <FireParticles />
        <div className="relative z-10 bg-white/95 dark:bg-black/95 backdrop-blur-xl rounded-2xl border border-gray-300 dark:border-gray-600 shadow-2xl p-6">
          {/* Enhanced Header with Typewriter Effect */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-black dark:bg-white shadow-lg">
                <Edit className="w-5 h-5 text-white dark:text-black" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-black dark:text-white">
                {displayText}
                {showCursor && (
                  <span
                    className="inline-block w-0.5 h-8 bg-black dark:bg-white ml-1"
                    style={{ animation: "typewriter-cursor 1s infinite" }}
                  />
                )}
              </h1>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Modify and enhance your existing coding challenge.
            </p>
          </div>

          {/* Wizard Progress */}
          <WizardProgress currentStep={currentStep} completedSteps={completedSteps} steps={steps} />

          <form className="space-y-8">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-black dark:text-white mb-2">Basic Information</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Set up the fundamental details of your coding problem.
                  </p>
                </div>
                <div className="space-y-4">
                  <FormInput
                    label="Problem Title"
                    register={register}
                    name="title"
                    error={errors.title}
                    placeholder="e.g., Two Sum Algorithm"
                  />
                  <FormTextarea
                    label="Problem Description"
                    register={register}
                    name="description"
                    error={errors.description}
                    placeholder="Provide a detailed explanation of the problem..."
                  />
                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormSelect
                      label="Difficulty Level"
                      register={register}
                      name="difficulty"
                      error={errors.difficulty}
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </FormSelect>
                    <FormSelect label="Problem Category" register={register} name="tags" error={errors.tags}>
                      <option value="array">Array</option>
                      <option value="linkedList">Linked List</option>
                      <option value="graph">Graph</option>
                      <option value="dp">Dynamic Programming</option>
                    </FormSelect>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Test Cases */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-black dark:text-white mb-2">Test Cases</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Define visible examples and hidden test cases for validation.
                  </p>
                </div>
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Visible Test Cases */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-semibold text-black dark:text-white">Visible Test Cases</h3>
                      <ActionButton
                        onClick={() => appendVisible({ input: "", output: "", explanation: "" })}
                        variant="add"
                        className="h-8 w-8 text-xs"
                        title="Add Visible Test Case"
                      >
                        <Plus className="w-4 h-4" />
                      </ActionButton>
                    </div>
                    {visibleFields.map((field, index) => (
                      <div key={field.id} className="group w-full">
                        <div className="bg-white dark:bg-black backdrop-blur-sm p-4 rounded-lg border border-gray-200 dark:border-gray-700 space-y-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                          <FormInput
                            register={register}
                            name={`visibleTestCases.${index}.input`}
                            placeholder="Test input"
                            error={errors.visibleTestCases?.[index]?.input}
                          />
                          <FormInput
                            register={register}
                            name={`visibleTestCases.${index}.output`}
                            placeholder="Expected output"
                            error={errors.visibleTestCases?.[index]?.output}
                          />
                          <FormTextarea
                            register={register}
                            name={`visibleTestCases.${index}.explanation`}
                            placeholder="Explanation"
                            error={errors.visibleTestCases?.[index]?.explanation}
                          />
                          <div className="flex justify-end">
                            <ActionButton
                              onClick={() => removeVisible(index)}
                              variant="remove"
                              className="h-6 w-6 text-xs"
                              title="Remove Test Case"
                            >
                              <X className="w-3 h-3" />
                            </ActionButton>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Hidden Test Cases */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-semibold text-black dark:text-white">Hidden Test Cases</h3>
                      <ActionButton
                        onClick={() => appendHidden({ input: "", output: "" })}
                        variant="add"
                        className="h-8 w-8 text-xs"
                        title="Add Hidden Test Case"
                      >
                        <Plus className="w-4 h-4" />
                      </ActionButton>
                    </div>
                    {hiddenFields.map((field, index) => (
                      <div key={field.id} className="group w-full">
                        <div className="bg-white dark:bg-black backdrop-blur-sm p-4 rounded-lg border border-gray-200 dark:border-gray-700 space-y-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                          <FormInput
                            register={register}
                            name={`hiddenTestCases.${index}.input`}
                            placeholder="Test input"
                            error={errors.hiddenTestCases?.[index]?.input}
                          />
                          <FormInput
                            register={register}
                            name={`hiddenTestCases.${index}.output`}
                            placeholder="Expected output"
                            error={errors.hiddenTestCases?.[index]?.output}
                          />
                          <div className="flex justify-end">
                            <ActionButton
                              onClick={() => removeHidden(index)}
                              variant="remove"
                              className="h-6 w-6 text-xs"
                              title="Remove Test Case"
                            >
                              <X className="w-3 h-3" />
                            </ActionButton>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Code & Solutions */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-black dark:text-white mb-2">Code Templates & Solutions</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Provide starter code templates and reference solutions.
                  </p>
                </div>

                {/* Language Tabs */}
                <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
                  <div className="flex space-x-1 sm:space-x-4">
                    {languageTabs.map((lang) => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => setActiveLanguage(lang)}
                        className={`px-3 sm:px-4 py-2 text-xs font-semibold transition-all duration-300 border-b-2 hover:scale-105 ${
                          activeLanguage === lang
                            ? "border-black dark:border-white text-black dark:text-white bg-gray-100/50 dark:bg-gray-800/50"
                            : "border-transparent text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600"
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Code Editors */}
                <div className="min-h-[24rem]">
                  {languageTabs.map((lang, index) => (
                    <div key={lang} className={`${activeLanguage === lang ? "block" : "hidden"}`}>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <CodeEditor
                          title={`${lang} - Initial Code Template`}
                          register={register}
                          name={`startCode.${index}.initialCode`}
                          error={errors.startCode?.[index]?.initialCode}
                          index={index}
                        />
                        <CodeEditor
                          title={`${lang} - Reference Solution`}
                          register={register}
                          name={`referenceSolution.${index}.completeCode`}
                          error={errors.referenceSolution?.[index]?.completeCode}
                          index={index + 3}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Review & Submit */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-black dark:text-white mb-2">Review & Submit</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Review your problem details and submit the updates.
                  </p>
                </div>

                {/* Review Summary */}
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-black dark:text-white mb-3">Problem Details</h3>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium">Title:</span> {formData.title || "Not set"}
                        </div>
                        <div>
                          <span className="font-medium">Difficulty:</span> {formData.difficulty || "Not set"}
                        </div>
                        <div>
                          <span className="font-medium">Category:</span> {formData.tags || "Not set"}
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-black dark:text-white mb-3">Test Cases</h3>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium">Visible Tests:</span> {formData.visibleTestCases?.length || 0}
                        </div>
                        <div>
                          <span className="font-medium">Hidden Tests:</span> {formData.hiddenTestCases?.length || 0}
                        </div>
                        <div>
                          <span className="font-medium">Languages:</span> {languageTabs.length}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Completion Status */}
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <div>
                      <h3 className="font-semibold text-green-800 dark:text-green-300">Ready to Update</h3>
                      <p className="text-sm text-green-600 dark:text-green-400">
                        All required fields have been completed. You can now submit your updates.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className={`flex items-center gap-2 px-6 py-3 text-sm font-bold rounded-lg border transition-all duration-300 hover:scale-105 hover:shadow-lg hover:-translate-y-1 ${
                    currentStep === 1
                      ? "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 border-gray-200 dark:border-gray-700 cursor-not-allowed"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600"
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-6 py-3 text-sm font-bold rounded-lg border transition-all duration-300 hover:scale-105 hover:shadow-lg hover:-translate-y-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>

                  {currentStep < steps.length ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="flex items-center gap-2 px-6 py-3 text-sm font-bold rounded-lg border transition-all duration-300 hover:scale-105 hover:shadow-lg hover:-translate-y-1 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 border-black dark:border-white"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmitClick}
                      disabled={isSubmitting}
                      className={`flex items-center gap-2 px-6 py-3 text-sm font-bold rounded-lg border transition-all duration-300 hover:scale-105 hover:shadow-lg hover:-translate-y-1 ${
                        isSubmitting
                          ? "bg-gray-400 dark:bg-gray-600 text-gray-200 dark:text-gray-400 border-gray-400 dark:border-gray-600 cursor-not-allowed"
                          : "bg-green-600 dark:bg-green-500 text-white dark:text-black hover:bg-green-700 dark:hover:bg-green-400 border-green-600 dark:border-green-500"
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Edit className="w-4 h-4" />
                          Update Problem
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

export default SubUpdateProblem
