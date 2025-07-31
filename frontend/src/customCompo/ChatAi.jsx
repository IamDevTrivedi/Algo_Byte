"use client"

import { useState, useRef, useEffect } from "react"
import { useForm } from "react-hook-form"
import axiosClient from "../utils/axiosClient"
import { ArrowUp, Copy, Check, Bot, User, Edit3, MessageCircle, Lightbulb } from "lucide-react"

// Clean v0-style Background Component
const V0Background = () => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {/* Base clean background */}
      <div className="absolute inset-0 bg-white dark:bg-black" />

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M 32 0 L 0 0 0 32" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Minimal dot pattern */}
      <div className="absolute inset-0 opacity-[0.01] dark:opacity-[0.02]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="0.5" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>
    </div>
  )
}

const CodeBlock = ({ code, language = "javascript" }) => {
  const [copied, setCopied] = useState(false)

  // ==================================================================

  const codeToDisplay = code.replace(/^\s*\/\*\*[\s\S]*?\*\/\s*/, "").trim()
  // ==================================================================

  const handleCopy = async () => {
    try {
      // Use the CLEANED code for the copy function
      await navigator.clipboard.writeText(codeToDisplay)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy code:", err)
    }
  }

  // ==================================================================
  const highlightCode = (code, language = "javascript") => {
    // Keyword setup (no changes here)
    const commonKeywords = [
      "if",
      "else",
      "for",
      "while",
      "return",
      "switch",
      "case",
      "break",
      "continue",
      "try",
      "catch",
      "throw",
      "new",
    ]
    const jsKeywords = ["const", "let", "var", "function", "async", "await", "import", "export", "class", "extends"]
    const javaKeywords = [
      "public",
      "private",
      "protected",
      "static",
      "void",
      "int",
      "float",
      "double",
      "boolean",
      "class",
      "interface",
      "extends",
      "implements",
      "new",
      "this",
    ]
    const cppKeywords = [
      "int",
      "float",
      "double",
      "char",
      "bool",
      "void",
      "class",
      "public",
      "private",
      "protected",
      "#include",
      "namespace",
      "std",
      "cout",
      "cin",
      "endl",
    ]
    let keywords = [...commonKeywords]
    const lang = language.toLowerCase()
    if (lang.includes("java")) {
      keywords = [...keywords, ...javaKeywords]
    } else if (lang.includes("c++") || lang.includes("cpp")||lang.includes("C++")) {
      keywords = [...keywords, ...cppKeywords]
    } else {
      keywords = [...keywords, ...jsKeywords]
    }

    const placeholders = []
    let highlighted = code

    // 1. Escape basic HTML characters
    highlighted = highlighted.replace(/&/g, "&").replace(/</g, "<").replace(/>/g, ">")

    // 2. Isolate comments FIRST and replace with placeholders
    highlighted = highlighted.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, (match) => {
      const placeholder = `<span class="token comment">${match}</span>`
      placeholders.push(placeholder)
      return `__PLACEHOLDER_${placeholders.length - 1}__`
    })

    // 3. Isolate strings SECOND and replace with placeholders
    highlighted = highlighted.replace(/"([^"]*)"|'([^']*)'/g, (match) => {
      const placeholder = `<span class="token string">${match}</span>`
      placeholders.push(placeholder)
      return `__PLACEHOLDER_${placeholders.length - 1}__`
    })

    // 4. Highlight keywords, functions, numbers on the remaining code
    highlighted = highlighted.replace(
      new RegExp(`\\b(${keywords.join("|")})\\b`, "g"),
      '<span class="token keyword">$1</span>',
    )
    highlighted = highlighted.replace(
      /\b([a-zA-Z_$][a-zA-Z0-9_$]*)(?=\s*\()/g,
      '<span class="token function">$1</span>',
    )
    highlighted = highlighted.replace(/\b(\d+)\b/g, '<span class="token number">$1</span>')
    highlighted = highlighted.replace(/([a-zA-Z_$][a-zA-Z0-9_$]*)(?=\s*:)/g, '<span class="token label">$1</span>')

    // 5. Restore the original comments and strings
    highlighted = highlighted.replace(/__PLACEHOLDER_(\d+)__/g, (match, index) => {
      return placeholders[Number.parseInt(index, 10)]
    })

    return highlighted
  }
  // ==================================================================

  return (
    <div className="my-4 rounded-lg overflow-hidden bg-[#1e1e1e] border-2 border-gray-900 dark:border-white">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-[#2d2d30] border-b-2 border-gray-900 dark:border-white">
        <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{language}</span>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-all duration-200"
            title="Copy code"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
          
        </div>
      </div>
      <div className="p-4">
        <pre className="text-sm leading-relaxed text-gray-100 font-mono overflow-x-auto">
          
          <code dangerouslySetInnerHTML={{ __html: highlightCode(codeToDisplay, language) }} />
        </pre>
      </div>
    </div>
  )
}


const RobotAvatar = ({ size = "large", animate = false }) => {
  return (
    <div className={`relative ${animate ? "animate-bounce" : ""}`}>
      <div
        className={`${
          size === "large" ? "w-24 h-24" : "w-12 h-12"
        } rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 border-4 border-gray-900 dark:border-white shadow-2xl flex items-center justify-center relative overflow-hidden`}
      >
        {/* Robot Face */}
        <div className="relative">
          {/* Eyes */}
          <div className={`flex ${size === "large" ? "gap-2 mb-1" : "gap-1 mb-0.5"}`}>
            <div className={`${size === "large" ? "w-2 h-2" : "w-1 h-1"} bg-blue-500 rounded-full animate-pulse`}></div>
            <div
              className={`${size === "large" ? "w-2 h-2" : "w-1 h-1"} bg-blue-500 rounded-full animate-pulse`}
              style={{ animationDelay: "0.5s" }}
            ></div>
          </div>
          {/* Mouth */}
          <div
            className={`${size === "large" ? "w-4 h-0.5" : "w-2 h-0.5"} bg-gray-600 dark:bg-gray-400 rounded-full mx-auto`}
          ></div>
        </div>

        {/* Circuit Pattern */}
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <path
              d="M20,20 L80,20 L80,80 L20,80 Z M30,30 L70,30 M30,50 L70,50 M30,70 L70,70"
              stroke="currentColor"
              strokeWidth="1"
              fill="none"
            />
            <circle cx="25" cy="25" r="2" fill="currentColor" />
            <circle cx="75" cy="75" r="2" fill="currentColor" />
          </svg>
        </div>
      </div>

      {/* Glow Effect */}
      <div
        className={`absolute inset-0 ${size === "large" ? "w-24 h-24" : "w-12 h-12"} rounded-full bg-blue-500/20 blur-xl animate-pulse`}
      ></div>
    </div>
  )
}

// Initial Welcome Screen Component
const WelcomeScreen = ({ onOptionSelect, onStartTyping }) => {
  const quickOptions = [
    {
      id: "explain",
      text: "Explain this problem to me",
      icon: MessageCircle,
      description: "Get a detailed explanation of the problem",
    },
    {
      id: "hint",
      text: "Give me a hint",
      icon: Lightbulb,
      description: "Get a subtle hint to guide your thinking",
    },
  ]

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center animate-in fade-in-0 duration-500">
      {/* Robot Avatar - Smaller */}
      <div className="mb-6">
        <RobotAvatar size="large" animate={true} />
      </div>

      {/* Welcome Message - Compact */}
      <div className="mb-6 max-w-sm">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Hi! I'm your DSA Tutor 🤖</h2>
        <p className="text-gray-600 dark:text-gray-400 text-xs leading-relaxed">
          I'm here to help you understand this problem. How would you like to start?
        </p>
      </div>

      {/* Quick Options - Only 2 options in single column */}
      <div className="grid grid-cols-1 gap-3 w-full max-w-sm mb-6">
        {quickOptions.map((option) => {
          const IconComponent = option.icon
          return (
            <button
              key={option.id}
              onClick={() => onOptionSelect(option.text)}
              className="group p-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-gray-900 dark:hover:border-white hover:shadow-lg transition-all duration-300 text-left hover:scale-105"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg group-hover:bg-gray-900 dark:group-hover:bg-white transition-colors duration-300">
                  <IconComponent className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-white dark:group-hover:text-black" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm">{option.text}</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{option.description}</p>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Manual Input Option - Compact */}
      <div className="w-full max-w-sm">
        <div className="relative mb-3">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-3 bg-white dark:bg-black text-gray-500 dark:text-gray-400 font-medium">
              or ask your own question
            </span>
          </div>
        </div>

        <button
          onClick={onStartTyping}
          className="w-full px-4 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-xl font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-300 hover:scale-105 shadow-lg text-sm"
        >
          Start typing your question
        </button>
      </div>
    </div>
  )
}

// Enhanced Message Component with Premium Styling
const MessageBubble = ({ message, isUser }) => {
  return (
    <div className={`flex gap-3 max-w-full ${isUser ? "flex-row-reverse ml-auto" : "mr-auto"}`}>
      {/* Clean Avatar */}
      <div className="flex-shrink-0">
        <div
          className={`w-7 h-7 rounded-full flex items-center justify-center ${
            isUser
              ? "bg-black dark:bg-white"
              : "bg-gray-100 dark:bg-gray-800 border-2 border-gray-900 dark:border-white"
          }`}
        >
          {isUser ? (
            <User className="w-3.5 h-3.5 text-white dark:text-black" />
          ) : (
            <Bot className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
          )}
        </div>
      </div>

      {/* Message Content */}
      <div className="flex-1 max-w-3xl">
        <div
          className={`rounded-2xl px-3 py-2.5 ${
            isUser
              ? "bg-black dark:bg-white text-white dark:text-black rounded-br-md border-2 border-gray-900 dark:border-white"
              : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-2 border-gray-900 dark:border-white rounded-bl-md"
          }`}
        >
          {Array.isArray(message.parts) ? (
            message.parts.map((part, index) => (
              <div key={index}>
                {part.text && (
                  <div className="whitespace-pre-wrap text-sm leading-relaxed font-medium">{part.text}</div>
                )}
                {part.aiCode && <CodeBlock code={part.aiCode} language={part.language || "javascript"} />}
              </div>
            ))
          ) : (
            <div className="whitespace-pre-wrap text-sm leading-relaxed font-medium">
              {message.parts[0]?.text || "No message content"}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function ChatAI({ problem }) {
  const [messages, setMessages] = useState([
    {
      role: "model",
      parts: [
        {
          text: "Hi! I'm your DSA tutor. I can help you understand this problem, provide hints, review your code, or explain different solution approaches. What would you like to know about this problem?",
        },
      ],
    },
  ])
  const [Displaymessages, setDisplayMessages] = useState([
    {
      role: "model",
      parts: [
        {
          text: "Hi! I'm your DSA tutor. I can help you understand this problem, provide hints, review your code, or explain different solution approaches. What would you like to know about this problem?",
        },
      ],
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [showWelcome, setShowWelcome] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm()
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [Displaymessages, messages])

  const handleWelcomeTransition = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      setShowWelcome(false)
      setIsTransitioning(false)
    }, 300)
  }

  const handleOptionSelect = (optionText) => {
    setValue("message", optionText)
    handleWelcomeTransition()
    // Automatically submit the selected option
    setTimeout(() => {
      handleSubmit(onSubmit)({ message: optionText })
    }, 350)
  }

  const handleStartTyping = () => {
    handleWelcomeTransition()
  }

  const onSubmit = async (data) => {
    if (!data.message.trim()) return

    // Hide welcome screen if it's still showing
    if (showWelcome) {
      handleWelcomeTransition()
    }

    const newMessage = { role: "user", parts: [{ text: data.message }] }
    const updatedMessages = [...messages, newMessage]
    const updatedDisplayMessages = [...Displaymessages, newMessage]

    setMessages(updatedMessages)
    setDisplayMessages(updatedDisplayMessages)
    reset()
    setIsLoading(true)

    try {
      const response = await axiosClient.post("/ai/chat", {
        messages: updatedMessages,
        title: problem._doc.title,
        description: problem._doc.description,
        testCases: problem._doc.visibleTestCases,
        startCode: problem._doc.startCode,
        displayMsg: Displaymessages,
      })

      // Handle the structured response
      const aiResponse = response.data.message
      const actualText = []
      let temp = ""
      for (let i = 0; Array.isArray(aiResponse) && i < aiResponse.length; ++i) {
        const value = aiResponse[i]
        temp = temp + (value.text ? value.text : value.aiCode)
      }
      const tempObj = {}
      tempObj.text = temp
      actualText.push(tempObj)
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          parts: Array.isArray(aiResponse) ? actualText : [{ text: aiResponse }],
        },
      ])
      setDisplayMessages((prev) => [
        ...prev,
        {
          role: "model",
          parts: Array.isArray(aiResponse) ? aiResponse : [{ text: aiResponse }],
        },
      ])
    } catch (error) {
      console.error("API Error:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          parts: [{ text: "Sorry, I'm having trouble responding right now. Please try again." }],
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex flex-col h-screen max-h-[80vh] min-h-[500px] bg-white dark:bg-black border-2 border-gray-900 dark:border-gray-600 rounded-xl overflow-hidden">
      {/* Clean v0-style Background */}
      <V0Background />

      {showWelcome ? (
        // Welcome Screen
        <div
          className={`relative z-10 h-full transition-all duration-300 ${isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}
        >
          <WelcomeScreen onOptionSelect={handleOptionSelect} onStartTyping={handleStartTyping} />
        </div>
      ) : (
        // Chat Interface
        <div
          className={`relative z-10 h-full flex flex-col transition-all duration-300 ${isTransitioning ? "opacity-0 scale-105" : "opacity-100 scale-100"}`}
        >
          {/* Clean Header */}
          <div className="flex-shrink-0 p-4 border-b-2 bg-white/80 dark:bg-black/80 backdrop-blur-sm border-gray-900 dark:border-white">
            <div className="flex items-center gap-3">
              <RobotAvatar size="small" />
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">DSA Tutor</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                  Ask me anything about this problem
                </p>
              </div>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {Displaymessages.slice(1).map((msg, index) => (
              <MessageBubble key={index} message={msg} isUser={msg.role === "user"} />
            ))}

            {/* Clean Loading Indicator */}
            {isLoading && (
              <div className="flex gap-3 max-w-full">
                <div className="flex-shrink-0">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 border-2 border-gray-900 dark:border-white">
                    <Bot className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
                  </div>
                </div>
                <div className="px-3 py-2.5 rounded-2xl rounded-bl-md bg-white dark:bg-gray-800 border-2 border-gray-900 dark:border-white">
                  <div className="flex items-center gap-2">
                    <div className="flex space-x-1">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Clean Input Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex-shrink-0 p-4 bg-white/80 dark:bg-black/80 backdrop-blur-sm border-t-2 border-gray-900 dark:border-white"
          >
            <div className="flex items-center gap-2">
              <input
                placeholder="Ask me anything about this problem..."
                className="flex-1 px-3 py-2.5 text-sm font-medium bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 focus:border-gray-900 dark:focus:border-white transition-all duration-200"
                {...register("message", {
                  required: "Message is required",
                  minLength: { value: 1, message: "Message too short" },
                })}
                disabled={isLoading}
              />
              <button
                type="submit"
                className="flex-shrink-0 w-10 h-10 bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg flex items-center justify-center transition-all duration-200 border-2 border-gray-900 dark:border-white hover:scale-105"
                disabled={errors.message || isLoading}
              >
                {isLoading ? (
                  <div className="w-3.5 h-3.5 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <ArrowUp className="w-4 h-4 text-white dark:text-black" />
                )}
              </button>
            </div>
            {errors.message && <p className="text-red-500 text-xs mt-1 font-medium">{errors.message.message}</p>}
          </form>
        </div>
      )}
    </div>
  )
}
