"use client"

import { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import logo from "../Images/logo.png"
import {
  MessageSquare,
  Heart,
  Plus,
  Home,
  Sun,
  Moon,
  User,
  Search,
  ChevronDown,
  ChevronUp,
  Reply,
  Send,
  X,
  Clock,
  TrendingUp,
  Code,
  LogOut,
  Bell,
  ImageIcon,
  Loader,
  FileText,
  CheckCircle,
} from "lucide-react"
import axiosClient from "../utils/axiosClient"
import socket from "../utils/socket"
import { useDispatch, useSelector } from "react-redux"
import { logoutUser } from "../authSlice"

export function DiscussionForum() {
  const { user, userImage } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [darkMode, setDarkMode] = useState(false)
  const [posts, setPosts] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPosts, setTotalPosts] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [comments, setComments] = useState({})
  const [replies, setReplies] = useState({})
  const [expandedPosts, setExpandedPosts] = useState(new Set())
  const [expandedComments, setExpandedComments] = useState(new Set())
  const [expandedContentPosts, setExpandedContentPosts] = useState(new Set())
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [showFilters, setShowFilters] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)

  // Form states
  const [newPost, setNewPost] = useState({ title: "", content: "", image: null })
  const [newComments, setNewComments] = useState({})
  const [newReplies, setNewReplies] = useState({})
  const [activeReplyInput, setActiveReplyInput] = useState(null)
  const [imageUploading, setImageUploading] = useState(false)
  const [createPostLoading, setCreatePostLoading] = useState(false)

  // State to hold all user profile images
  const [userImages, setUserImages] = useState([])

  // Notification state
  const [notification, setNotification] = useState(null)

  // Refs
  const fileInputRef = useRef(null)
  const searchTimeoutRef = useRef(null)

  const [count, setCount] = useState(0)

  // State for the community pledge popup
  const [showPledge, setShowPledge] = useState(true)

  useEffect(() => {
    socket.on("onlineUsers", setCount)

    return () => {
      socket.off("onlineUsers")
    }
  }, [])

  

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode)
  }, [darkMode])

  useEffect(() => {
    fetchPosts()
  }, [currentPage, sortBy])

  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)
    if (searchQuery.trim()) {
      searchTimeoutRef.current = setTimeout(() => handleSearch(), 500)
    } else {
      setSearchResults([])
      setIsSearching(false)
    }
    return () => clearTimeout(searchTimeoutRef.current)
  }, [searchQuery])

  useEffect(() => {
    socket.on("new-post", (post) => {
      setPosts((prev) => [post, ...prev.slice(0, 9)])
      if (post.userId._id !== user?._id) {
        setNotification({
          type: "success",
          message: `New post by ${post.userId.firstName}: "${post.title}"`,
          timestamp: Date.now(),
        })
        setTimeout(() => setNotification(null), 5000)
      }
    })
    socket.on("post-deleted", ({ postId }) => setPosts((prev) => prev.filter((post) => post._id !== postId)))
    socket.on("like-updated", ({ postId, likes }) =>
      setPosts((prev) => prev.map((post) => (post._id === postId ? { ...post, likes } : post))),
    )
    socket.on("new-comment", (comment) =>
      setComments((prev) => ({ ...prev, [comment.postId]: [...(prev[comment.postId] || []), comment] })),
    )
    socket.on("comment-deleted", ({ commentId, postId }) =>
      setComments((prev) => ({ ...prev, [postId]: (prev[postId] || []).filter((c) => c._id !== commentId) })),
    )
    socket.on("comment-like-updated", ({ commentId, likes }) => {
      setComments((prev) => {
        const updated = { ...prev }
        Object.keys(updated).forEach((postId) => {
          updated[postId] = updated[postId].map((comment) =>
            comment._id === commentId ? { ...comment, likes } : comment,
          )
        })
        return updated
      })
    })
    socket.on("new-reply", (reply) =>
      setReplies((prev) => ({ ...prev, [reply.commentId]: [...(prev[reply.commentId] || []), reply] })),
    )
    socket.on("reply-deleted", ({ replyId, commentId }) =>
      setReplies((prev) => ({ ...prev, [commentId]: (prev[commentId] || []).filter((r) => r._id !== replyId) })),
    )

    return () => {
      socket.off("new-post")
      socket.off("post-deleted")
      socket.off("like-updated")
      socket.off("new-comment")
      socket.off("comment-deleted")
      socket.off("comment-like-updated")
      socket.off("new-reply")
      socket.off("reply-deleted")
    }
  }, [user._id])

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const response = await axiosClient.get(`/discussion/getAllPosts?page=${currentPage}&sort=${sortBy}`)
      const response2 = await axiosClient.get("/image/getAllImage")
      
      const allImages = response2.data.images || []
      setUserImages(allImages)
      
      if (response.data && response.data.posts) {
        const actualPosts = response.data.posts.map(post => {
          fetchComments(post._id)
          const authorImage = allImages.find(img => img.userId === post.userId._id)?.secureUrl
          return {
            ...post,
            secureUrl: authorImage || null,
          }
        })
        setPosts(actualPosts)
        setTotalPosts(response.data.totalPosts)
        setTotalPages(Math.ceil(response.data.totalPosts / 10))
      }
    } catch (error) {
      console.error("Error fetching posts:", error)
      setPosts([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    setIsSearching(true)
    try {
      const response = await axiosClient.get(`/discussion/getAllPosts?page=1&search=${encodeURIComponent(searchQuery)}`)

      if (response.data && response.data.posts) setSearchResults(response.data.posts)
    } catch (error) {
      console.error("Error searching posts:", error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const fetchComments = async (postId) => {
    try {
      const response = await axiosClient.get(`/discussion/getAllComments/${postId}`)
      if (Array.isArray(response.data)) {
        setComments((prev) => ({
          ...prev,
          [postId]: response.data,
        }))
      }
    } catch (error) {
      console.error("Error fetching comments:", error)
    }
  }

  const fetchReplies = async (commentId) => {
    try {
      const response = await axiosClient.get(`/discussion/getAllRepliesByComment/${commentId}`)
      if (response.data ) {
        setReplies((prev) => ({ ...prev, [commentId]: response.data }))
      } else {
        setReplies((prev) => ({ ...prev, [commentId]: [] })) // Ensure it's an array even if empty
      }
    } catch (error) {
      console.error("Error fetching replies:", error)
      setReplies((prev) => ({ ...prev, [commentId]: [] })) // Set to empty array on error
    }
  }

  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", "your_upload_preset") // Replace with your upload preset
    try {
      const response = await fetch("https://api.cloudinary.com/v1_1/your_cloud_name/image/upload", { // Replace with your cloud name
        method: "POST",
        body: formData,
      })
      const data = await response.json()
      return data.secure_url
    } catch (error) {
      console.error("Error uploading image:", error)
      throw error
    }
  }

  const handleImageUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return
    if (!file.type.startsWith("image/")) return alert("Please select an image file")
    if (file.size > 5 * 1024 * 1024) return alert("Image size should be less than 5MB")

    setImageUploading(true)
    try {
      const imageUrl = await uploadImageToCloudinary(file)
      setNewPost((prev) => ({ ...prev, image: imageUrl }))
    } catch (error) {
      alert("Failed to upload image. Please try again.")
    } finally {
      setImageUploading(false)
    }
  }

  const handleNewPostChange = (e) => {
    const { name, value } = e.target
    setNewPost((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const createPost = async () => {
    if (!newPost.title.trim() || !newPost.content.trim()) return alert("Please fill in both title and content")
    setCreatePostLoading(true)
    try {
      const postData = {
        title: newPost.title.trim(),
        content: newPost.content.trim(),
        userId: user._id,
        image: newPost.image,
      }
      const response = await axiosClient.post("/discussion/createPost", postData)
      if (response.data) {
        setNewPost({ title: "", content: "", image: null })
        setShowCreatePost(false)
        setNotification({
          type: "success",
          message: "Post created successfully!",
          timestamp: Date.now(),
        })
        setTimeout(() => setNotification(null), 3000)
      }
    } catch (error) {
      alert("Failed to create post. Please try again.")
    } finally {
      setCreatePostLoading(false)
    }
  }

  const togglePostLike = async (postId) => {
    try {
      setPosts((prev) =>
        prev.map((post) => {
          if (post._id === postId) {
            const isLiked = post.likes?.includes(user._id)
            const newLikes = isLiked ? post.likes.filter((id) => id !== user._id) : [...(post.likes || []), user._id]
            return { ...post, likes: newLikes }
          }
          return post
        }),
      )
      await axiosClient.post(`/discussion/postOperation/${postId}`)
    } catch (error) {
      console.error("Error toggling post like:", error)
    }
  }

  const createComment = async (postId) => {
    const content = newComments[postId]?.trim()
    if (!content) return
    try {
      await axiosClient.post("/discussion/createComment", { postId, content, userId: user._id })
      setNewComments((prev) => ({ ...prev, [postId]: "" }))
    } catch (error) {
      alert("Failed to create comment. Please try again.")
    }
  }

  const toggleCommentLike = async (commentId) => {
    try {
      await axiosClient.post(`/discussion/commentOperation/${commentId}`)
    } catch (error) {
      console.error("Error toggling comment like:", error)
    }
  }

  const deleteComment = async (commentId, postId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return
    try {
      await axiosClient.delete(`/discussion/deleteComment/${commentId}`)
    } catch (error) {
      alert("Failed to delete comment. Please try again.")
    }
  }

  const createReply = async (commentId) => {
    const content = newReplies[commentId]?.trim()
    if (!content) return
    try {
      await axiosClient.post("/discussion/createReply", { commentId, content, userId: user._id })
      setNewReplies((prev) => ({ ...prev, [commentId]: "" }))
      setActiveReplyInput(null)
    } catch (error) {
      alert("Failed to create reply. Please try again.")
    }
  }

  const deleteReply = async (replyId, commentId) => {
    if (!window.confirm("Are you sure you want to delete this reply?")) return
    try {
      await axiosClient.delete(`/discussion/deleteReply/${replyId}`)
    } catch (error) {
      alert("Failed to delete reply. Please try again.")
    }
  }

  const togglePostExpansion = (postId) => {
    const newExpanded = new Set(expandedPosts)
    if (newExpanded.has(postId)) newExpanded.delete(postId)
    else {
      newExpanded.add(postId)
      if (!comments[postId]) fetchComments(postId)
    }
    setExpandedPosts(newExpanded)
  }

  const toggleCommentExpansion = (commentId) => {
    const newExpanded = new Set(expandedComments)
    if (newExpanded.has(commentId)) newExpanded.delete(commentId)
    else {
      newExpanded.add(commentId)
      if (!replies[commentId]) {
        fetchReplies(commentId)
      }
    }
    setExpandedComments(newExpanded)
  }

  const toggleContentExpansion = (postId) => {
    const newExpanded = new Set(expandedContentPosts)
    if (newExpanded.has(postId)) newExpanded.delete(postId)
    else newExpanded.add(postId)
    setExpandedContentPosts(newExpanded)
  }

  const formatTimeAgo = (timestamp) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInSeconds = Math.floor((now - time) / 1000)
    if (diffInSeconds < 60) return "just now"
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    return `${Math.floor(diffInSeconds / 86400)}d ago`
  }

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy)
    setCurrentPage(1)
  }

  const displayPosts = searchQuery.trim() ? searchResults : posts

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-black dark:via-gray-900 dark:to-black">
      {darkMode && (
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-gray-300/3 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-white/4 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>
      )}

      {notification && (
        <div className="fixed top-4 right-4 z-[110] animate-in slide-in-from-top-2 duration-300">
          <div className="bg-white/95 dark:bg-black/95 backdrop-blur-md rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] border border-gray-200/50 dark:border-gray-700/50 p-4 max-w-sm">
            <div className="flex items-start gap-3">
              <div className="p-1 rounded-full bg-green-50 dark:bg-green-900/20">
                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-black dark:text-white">{notification.message}</p>
              </div>
              <button
                onClick={() => setNotification(null)}
                className="p-1 rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <X className="w-3 h-3 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="sticky top-0 z-40 bg-white/95 dark:bg-black/95 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50 shadow-[0_2px_20px_-2px_rgba(0,0,0,0.1)] dark:shadow-[0_2px_20px_-2px_rgba(255,255,255,0.05)]">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
          <Link to="/"><div className="relative top-1 right-4">
          <img
            src={logo}
            alt="Logo"
            className="h-12 w-auto max-w-[150px] object-contain"
          />
        </div>
        </Link>
            <div className="hidden md:flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
              <Home className="w-4 h-4" />
              <span>/</span>
              <span className="text-black dark:text-white font-medium">Discuss</span>
            </div>
          </div>

          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-black dark:text-white" />
              <input
                type="text"
                placeholder="Search discussions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 text-black dark:text-white font-bold dark:bg-gray-800 border border-gray-200/50 dark:border-gray-700/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 focus:border-black dark:focus:border-white transition-all duration-300 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.1)] focus:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.15)]"
              />
              {isSearching && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Loader className="w-4 h-4 animate-spin text-gray-400" />
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/" title="Home">
              <button className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 hover:scale-110 hover:shadow-[0_4px_15px_-2px_rgba(0,0,0,0.1)]">
                <Home className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </Link>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 hover:scale-110 hover:shadow-[0_4px_15px_-2px_rgba(0,0,0,0.1)]"
              title="Toggle theme"
            >
              {darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-600" />}
            </button>
            
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 hover:shadow-[0_4px_15px_-2px_rgba(0,0,0,0.1)]"
              >
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center text-gray-800 dark:text-gray-200 text-xl font-black shadow-[0_4px_20px_-4px_rgba(0,0,0,0.15)] overflow-hidden border-2 border-gray-300/50 dark:border-gray-600/50 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.2)] transition-all duration-300">
                  {userImage?.secureUrl ? (
                    <img
                      src={userImage?.secureUrl || "/placeholder.svg"}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    user?.firstName?.charAt(0)?.toUpperCase() || "U"
                  )}
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-gray-600 dark:text-gray-400 transition-transform duration-300 ${showUserMenu ? "rotate-180" : ""}`}
                />
              </button>
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-55 bg-white/95 dark:bg-black/95 backdrop-blur-md rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] dark:shadow-[0_10px_40px_-10px_rgba(255,255,255,0.1)] border border-gray-200/50 dark:border-gray-700/50 py-2 animate-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-2 border-b border-gray-200/50 dark:border-gray-700/50">
                    <div className="font-medium text-black dark:text-white">{user.firstName}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{user.emailId}</div>
                  </div>
                  <Link
                    to="/userDashboard"
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100/50 dark:hover:bg-gray-800/50 flex items-center gap-2 transition-all duration-200"
                  >
                    <User className="w-4 h-4" />
                    Dashboard
                  </Link>

                  <hr className="my-2 border-gray-200/50 dark:border-gray-700/50" />
                  <button
                    onClick={() => dispatch(logoutUser())}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100/50 dark:hover:bg-gray-800/50 flex items-center gap-2 text-red-600 dark:text-red-400 transition-all duration-200"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-black text-black dark:text-white mb-2">
                  {searchQuery.trim() ? `Search Results for "${searchQuery}"` : "Discussions"}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {searchQuery.trim()
                    ? `Found ${searchResults.length} result${searchResults.length !== 1 ? "s" : ""}`
                    : "Share knowledge and connect with the community"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate("/myposts")}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-105 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.15)] font-medium border border-gray-200/50 dark:border-gray-700/50 hover:border-gray-300 dark:hover:border-gray-600"
                >
                  <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  My Posts
                </button>
                <button
                  onClick={() => setShowCreatePost(true)}
                  className="flex items-center gap-2 px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-300 hover:scale-105 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.3)] font-medium"
                >
                  <Plus className="w-4 h-4" />
                  New Post
                </button>
              </div>
            </div>

            {showFilters && (
              <div className="mb-6 p-4 bg-white/80 dark:bg-black/80 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] animate-in slide-in-from-top-2 duration-300">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort by:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => handleSortChange(e.target.value)}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-800 border border-gray-200/50 dark:border-gray-700/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 transition-all duration-200"
                    >
                      <option value="newest">Newest</option>
                      <option value="oldest">Oldest</option>
                      <option value="most-liked">Most Liked</option>
                      <option value="most-commented">Most Commented</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-2 border-gray-200 dark:border-gray-700 border-t-black dark:border-t-white rounded-full animate-spin"></div>
                </div>
              ) : displayPosts.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    {searchQuery.trim() ? "No results found" : "No discussions yet"}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {searchQuery.trim() ? "Try adjusting your search terms" : "Be the first to start a discussion!"}
                  </p>
                  {!searchQuery.trim() && (
                    <button
                      onClick={() => setShowCreatePost(true)}
                      className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-300 hover:scale-105 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.2)]"
                    >
                      Create Post
                    </button>
                  )}
                </div>
              ) : (
                displayPosts.map((post) => (
                  <div
                    key={post._id}
                    className="bg-white/80 dark:bg-black/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_40px_-8px_rgba(0,0,0,0.15)] transition-all duration-300 hover:scale-[1.01] group"
                  >
                    <div className="p-6 pb-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center text-gray-800 dark:text-gray-200 text-xl font-black shadow-[0_4px_20px_-4px_rgba(0,0,0,0.15)] overflow-hidden border-2 border-gray-300/50 dark:border-gray-600/50">
                            {post?.secureUrl ? (
                              <img
                                src={post.secureUrl || "/placeholder.svg"}
                                alt="Profile"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              post.userId?.firstName?.charAt(0)?.toUpperCase() || "U"
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-black dark:text-white">
                              {post.userId?.firstName || "Anonymous"}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                              <Clock className="w-3 h-3" />
                              {formatTimeAgo(post.createdAt)}
                            </div>
                          </div>
                        </div>
                      </div>
                      <h2 className="text-xl font-bold text-black dark:text-white mb-3 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                        {post.title}
                      </h2>
                      <div className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4 whitespace-pre-wrap">
                        {post.content.length > 300 && !expandedContentPosts.has(post._id) ? (
                          <>
                            {post.content.substring(0, 300)}...{" "}
                            <button
                              onClick={() => toggleContentExpansion(post._id)}
                              className="text-blue-600 dark:text-blue-400 hover:underline ml-1 transition-all duration-200"
                            >
                              Read more
                            </button>
                          </>
                        ) : (
                          <>
                            {post.content}
                            {post.content.length > 300 && (
                              <button
                                onClick={() => toggleContentExpansion(post._id)}
                                className="text-blue-600 dark:text-blue-400 hover:underline ml-2 transition-all duration-200"
                              >
                                Show less
                              </button>
                            )}
                          </>
                        )}
                      </div>
                      {post.image && (
                        <div className="mb-4">
                          <img
                            src={post.image || "/placeholder.svg"}
                            alt="Post attachment"
                            className="max-w-full h-auto rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-[0_4px_15px_-2px_rgba(0,0,0,0.1)]"
                            style={{ maxHeight: "400px" }}
                          />
                        </div>
                      )}
                    </div>
                    <div className="px-6 py-4 border-t border-gray-100/50 dark:border-gray-800/50 flex items-center justify-between bg-gray-50/30 dark:bg-gray-900/20 rounded-b-2xl">
                      <div className="flex items-center gap-6">
                        <button
                          onClick={() => togglePostLike(post._id)}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all duration-300 hover:scale-105 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_15px_-2px_rgba(0,0,0,0.15)] ${post.likes?.includes(user._id) ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400" : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"}`}
                        >
                          <Heart className={`w-4 h-4 ${post.likes?.includes(user._id) ? "fill-current" : ""}`} />
                          <span className="text-sm font-medium">{post.likes?.length || 0}</span>
                        </button>
                        <button
                          onClick={() => togglePostExpansion(post._id)}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-all duration-300 hover:scale-105 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_15px_-2px_rgba(0,0,0,0.15)]"
                        >
                          <MessageSquare className="w-4 h-4 text-blue-500" />
                          <span className="text-sm font-medium">{comments[post._id]?.length || 0}</span>
                        </button>
                      </div>
                      <button
                        onClick={() => togglePostExpansion(post._id)}
                        className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors duration-200 px-2 py-1 rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
                      >
                        {expandedPosts.has(post._id) ? (
                          <>
                            <ChevronUp className="w-4 h-4" />
                            Hide
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-4 h-4" />
                            Show
                          </>
                        )}
                      </button>
                    </div>
                    {expandedPosts.has(post._id) && (
                      <div className="border-t border-gray-100/50 dark:border-gray-800/50 animate-in slide-in-from-top-2 duration-300">
                        <div className="p-6 border-b border-gray-100/50 dark:border-gray-800/50">
                          <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center shadow-[0_2px_10px_-2px_rgba(0,0,0,0.1)] flex-shrink-0 overflow-hidden">
                              {userImage?.secureUrl ? (
                                <img src={userImage.secureUrl} alt="Your profile" className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-xs font-bold text-black dark:text-white">
                                  {user?.firstName?.charAt(0)?.toUpperCase() || "U"}
                                </span>
                              )}
                            </div>
                            <div className="flex-1">
                              <textarea
                                value={newComments[post._id] || ""}
                                onChange={(e) => setNewComments((p) => ({ ...p, [post._id]: e.target.value }))}
                                placeholder="Add a comment..."
                                className="w-full p-3 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200/50 dark:border-gray-700/50 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 focus:border-black dark:focus:border-white transition-all duration-300 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.05)] focus:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)]"
                                rows={3}
                              />
                              {newComments[post._id]?.trim() && (
                                <div className="flex items-center justify-end gap-2 mt-2">
                                  <button
                                    onClick={() => setNewComments((p) => ({ ...p, [post._id]: "" }))}
                                    className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors duration-200 rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={() => createComment(post._id)}
                                    className="flex items-center gap-2 px-4 py-1.5 bg-black dark:bg-white text-white dark:text-black rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-300 hover:scale-105 text-sm font-medium shadow-[0_2px_10px_-2px_rgba(0,0,0,0.2)]"
                                  >
                                    <Send className="w-3 h-3" />
                                    Comment
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="divide-y divide-gray-100/50 dark:divide-gray-800/50">
                          {comments[post._id]?.map((comment) => {
                            const commenterImage = userImages.find(img => img.userId === comment.userId?._id)?.secureUrl;
                            return (
                              <div key={comment._id} className="p-6">
                                <div className="flex gap-3">
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center shadow-[0_2px_10px_-2px_rgba(0,0,0,0.1)] flex-shrink-0 overflow-hidden">
                                    {commenterImage ? (
                                      <img src={commenterImage} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                      <span className="text-xs font-bold text-black dark:text-white">
                                        {comment.userId?.firstName?.charAt(0) || "U"}
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <span className="font-medium text-black dark:text-white text-sm">
                                        {comment.userId?.firstName || "Anonymous"}
                                      </span>
                                      <span className="text-xs text-gray-500 dark:text-gray-400">
                                        {formatTimeAgo(comment.createdAt)}
                                      </span>
                                      {comment.userId?._id === user._id && (
                                        <button
                                          onClick={() => deleteComment(comment._id, post._id)}
                                          className="text-xs text-red-500 hover:text-red-600 ml-auto transition-colors duration-200 px-2 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                                          title="Delete comment"
                                        >
                                          Delete
                                        </button>
                                      )}
                                    </div>
                                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-3 whitespace-pre-wrap">
                                      {comment.content}
                                    </p>
                                    <div className="flex items-center gap-4">
                                      <button
                                        onClick={() => toggleCommentLike(comment._id)}
                                        className={`flex items-center gap-1 text-xs transition-all duration-200 px-2 py-1 rounded-lg hover:scale-105 ${comment.likes?.includes(user._id) ? "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20" : "text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100/50 dark:hover:bg-gray-800/50"}`}
                                      >
                                        <Heart
                                          className={`w-3 h-3 ${comment.likes?.includes(user._id) ? "fill-current" : ""}`}
                                        />
                                        {comment.likes?.length || 0}
                                      </button>
                                      <button
                                        onClick={() =>
                                          setActiveReplyInput(activeReplyInput === comment._id ? null : comment._id)
                                        }
                                        className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-all duration-200 px-2 py-1 rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
                                      >
                                        <Reply className="w-3 h-3" />
                                        Reply
                                      </button>
                                      
                                      <button
                                        onClick={() => toggleCommentExpansion(comment._id)}
                                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline transition-all duration-200"
                                      >
                                        {expandedComments.has(comment._id) ? 'Hide Replies' : 'View Replies'}
                                        {expandedComments.has(comment._id) && replies[comment._id]?.length > 0 ? ` (${replies[comment._id].length})` : ''}
                                      </button>
                                    </div>
                                    {activeReplyInput === comment._id && (
                                      <div className="mt-3 flex gap-2 animate-in slide-in-from-top-2 duration-200">
                                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center shadow-[0_2px_8px_-2px_rgba(0,0,0,0.1)] flex-shrink-0 overflow-hidden">
                                          {userImage?.secureUrl ? (
                                            <img src={userImage.secureUrl} alt="Your profile" className="w-full h-full object-cover" />
                                          ) : (
                                            <span className="text-xs font-bold text-black dark:text-white">
                                              {user?.firstName?.charAt(0)?.toUpperCase() || "U"}
                                            </span>
                                          )}
                                        </div>
                                        <div className="flex-1">
                                          <textarea
                                            value={newReplies[comment._id] || ""}
                                            onChange={(e) =>
                                              setNewReplies((p) => ({ ...p, [comment._id]: e.target.value }))
                                            }
                                            placeholder="Write a reply..."
                                            className="w-full p-2 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200/50 dark:border-gray-700/50 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 transition-all duration-200"
                                            rows={2}
                                          />
                                          <div className="flex items-center justify-end gap-2 mt-2">
                                            <button
                                              onClick={() => {
                                                setActiveReplyInput(null)
                                                setNewReplies((p) => ({ ...p, [comment._id]: "" }))
                                              }}
                                              className="px-2 py-1 text-xs text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors duration-200 rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
                                            >
                                              Cancel
                                            </button>
                                            <button
                                              onClick={() => createReply(comment._id)}
                                              className="px-3 py-1 bg-black dark:bg-white text-white dark:text-black rounded-xl text-xs font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-300 hover:scale-105 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.2)]"
                                            >
                                              Reply
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {expandedComments.has(comment._id) && (
                                      <div className="mt-4 space-y-3 pl-4 border-l-2 border-gray-100/50 dark:border-gray-800/50 animate-in slide-in-from-top-2 duration-300">
                                        {!replies[comment._id] ? (
                                          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                            <Loader className="w-3 h-3 animate-spin" />
                                            <span>Loading replies...</span>
                                          </div>
                                        ) : replies[comment._id].length > 0 ? (
                                          replies[comment._id].map((reply) => {
                                            const replierImage = userImages.find(img => img.userId === reply.userId?._id)?.secureUrl;
                                            return (
                                              <div key={reply._id} className="flex gap-2">
                                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center shadow-[0_2px_8px_-2px_rgba(0,0,0,0.1)] flex-shrink-0 overflow-hidden">
                                                  {replierImage ? (
                                                    <img src={replierImage} alt="Profile" className="w-full h-full object-cover" />
                                                  ) : (
                                                    <span className="text-xs font-bold text-black dark:text-white">
                                                      {reply.userId?.firstName?.charAt(0) || "U"}
                                                    </span>
                                                  )}
                                                </div>
                                                <div className="flex-1">
                                                  <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-medium text-black dark:text-white text-xs">
                                                      {reply.userId?.firstName || "Anonymous"}
                                                    </span>
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                                      {formatTimeAgo(reply.createdAt)}
                                                    </span>
                                                    {reply.userId?._id === user._id && (
                                                      <button
                                                        onClick={() => deleteReply(reply._id, comment._id)}
                                                        className="text-xs text-red-500 hover:text-red-600 ml-auto transition-colors duration-200 px-1 py-0.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                                                        title="Delete reply"
                                                      >
                                                        Delete
                                                      </button>
                                                    )}
                                                  </div>
                                                  <p className="text-gray-700 dark:text-gray-300 text-xs leading-relaxed whitespace-pre-wrap">
                                                    {reply.content}
                                                  </p>
                                                </div>
                                              </div>
                                            )
                                          })
                                        ) : (
                                          <p className="text-xs text-gray-500 dark:text-gray-400">No replies on this comment.</p>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {!searchQuery.trim() && totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-white/80 dark:bg-black/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-900 transition-all duration-300 hover:scale-105 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_15px_-2px_rgba(0,0,0,0.15)]"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_15px_-2px_rgba(0,0,0,0.15)] ${currentPage === page ? "bg-black dark:bg-white text-white dark:text-black shadow-[0_4px_20px_-4px_rgba(0,0,0,0.2)]" : "bg-white/80 dark:bg-black/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-900"}`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-white/80 dark:bg-black/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-900 transition-all duration-300 hover:scale-105 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_15px_-2px_rgba(0,0,0,0.15)]"
                >
                  Next
                </button>
              </div>
            )}
          </div>

          <aside className="w-full lg:w-80 space-y-6 lg:sticky lg:top-24 self-start">
            <div className="bg-white/80 dark:bg-black/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.15)] transition-all duration-300">
              <h3 className="font-bold text-black dark:text-white mb-4">Community Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Total Posts</span>
                  <span className="font-bold text-black dark:text-white">{totalPosts.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Active Users</span>
                  <span className="font-bold text-green-400">{count}</span>
                </div>
                
              </div>
            </div>
            
            <div className="bg-white/80 dark:bg-black/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.15)] transition-all duration-300">
              <h3 className="font-bold text-black dark:text-white mb-4">Community Guidelines</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  Be respectful and constructive
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  Search before posting
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1">•</span>
                  Use clear, descriptive titles
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">•</span>
                  Include relevant code examples
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  Help others when you can
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </main>

      {showPledge && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-md">
          <div className="w-full max-w-lg bg-white/95 dark:bg-black/95 backdrop-blur-md rounded-2xl shadow-[0_20px_60px_-10px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_60px_-10px_rgba(255,255,255,0.1)] border border-gray-200/50 dark:border-gray-700/50 flex flex-col animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
              <h2 className="text-xl font-bold text-black dark:text-white">🫡 Community Pledge</h2>
            </div>
            <div className="p-6 space-y-4 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
              <p>As a member of this community, I pledge to:</p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="mt-1">🤝</span>
                  <div>
                    <strong>Be respectful and constructive</strong> in all my interactions. I will value every voice and
                    foster a welcoming environment.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1">🔍</span>
                  <div>
                    <strong>Search before posting</strong>, to avoid duplicates and build on existing knowledge.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1">📝</span>
                  <div>
                    <strong>Use clear and descriptive titles</strong> so others can understand my questions or
                    contributions quickly.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1">💻</span>
                  <div>
                    <strong>Include relevant code examples</strong> or details to make my posts easy to follow and
                    answer.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1">💡</span>
                  <div>
                    <strong>Help others when I can</strong>, knowing that shared learning strengthens us all.
                  </div>
                </li>
              </ul>
              <p className="font-medium text-center pt-2 text-base text-black dark:text-white">
                Together, we grow better.
              </p>
            </div>
            <div className="flex items-center justify-end p-4 bg-gray-50/30 dark:bg-gray-900/20 rounded-b-2xl">
              <button
                onClick={() => setShowPledge(false)}
                className="w-full px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-300 hover:scale-105 font-medium shadow-[0_4px_20px_-4px_rgba(0,0,0,0.2)]"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {showCreatePost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md">
          <div className="w-full max-w-6xl bg-white/95 dark:bg-black/95 backdrop-blur-md rounded-2xl shadow-[0_20px_60px_-10px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_60px_-10px_rgba(255,255,255,0.1)] border border-gray-200/50 dark:border-gray-700/50 max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between p-6 border-b border-gray-200/50 dark:border-gray-700/50">
              <h2 className="text-xl font-bold text-black dark:text-white">Create New Post</h2>
              <button
                onClick={() => {
                  setShowCreatePost(false)
                  setNewPost({ title: "", content: "", image: null })
                }}
                className="p-2 rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-all duration-300 hover:scale-110"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <div className="flex-1 flex overflow-hidden">
              <div className="w-1/2 p-6 space-y-4 overflow-y-auto border-r border-gray-200/50 dark:border-gray-700/50">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={newPost.title}
                    onChange={handleNewPostChange}
                    placeholder="Enter a descriptive title..."
                    className="w-full dark:text-white text-black font-bold p-3 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 focus:border-black dark:focus:border-white transition-all duration-300 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.05)] focus:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Content</label>
                  <textarea
                    name="content"
                    value={newPost.content}
                    onChange={handleNewPostChange}
                    placeholder="Share your thoughts, ask questions, or start a discussion..."
                    className="w-full dark:text-white text-black font-bold p-3 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200/50 dark:border-gray-700/50 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 focus:border-black dark:focus:border-white transition-all duration-300 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.05)] focus:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)]"
                    rows={12}
                  />
                </div>
                
              </div>

              <div className="w-1/2 p-6 overflow-y-auto">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-black dark:text-white mb-2">Preview</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">See how your post will appear</p>
                </div>

                <div className="bg-white/80 dark:bg-black/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)]">
                  <div className="p-6 pb-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center shadow-[0_4px_15px_-2px_rgba(0,0,0,0.1)]">
                          <span className="text-sm font-bold text-black dark:text-white">
                            {user?.firstName?.charAt(0)?.toUpperCase() || "U"}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-black dark:text-white">{user.firstName}</div>
                          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <Clock className="w-3 h-3" />
                            just now
                          </div>
                        </div>
                      </div>
                    </div>

                    <h2 className="text-xl font-bold text-black dark:text-white mb-3">
                      {newPost.title || "Your post title will appear here..."}
                    </h2>

                    <div className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4 whitespace-pre-wrap">
                      {newPost.content || "Your post content will appear here..."}
                    </div>

                    {newPost.image && (
                      <div className="mb-4">
                        <img
                          src={newPost.image || "/placeholder.svg"}
                          alt="Post attachment"
                          className="max-w-full h-auto rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-[0_4px_15px_-2px_rgba(0,0,0,0.1)]"
                          style={{ maxHeight: "300px" }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="px-6 py-4 border-t border-gray-100/50 dark:border-gray-800/50 bg-gray-50/30 dark:bg-gray-900/20 rounded-b-2xl">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-50/50 dark:bg-red-900/10 text-gray-600 dark:text-gray-400">
                        <Heart className="w-4 h-4 text-red-500" />
                        <span className="text-sm font-medium">0</span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50/50 dark:bg-blue-900/10 text-gray-600 dark:text-gray-400">
                        <MessageSquare className="w-4 h-4 text-blue-500" />
                        <span className="text-sm font-medium">0</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200/50 dark:border-gray-700/50 bg-gray-50/30 dark:bg-gray-900/20 rounded-b-2xl">
              <button
                onClick={() => {
                  setShowCreatePost(false)
                  setNewPost({ title: "", content: "", image: null })
                }}
                className="px-4 py-2 text-black font-bold text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors duration-200 rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
              >
                Cancel
              </button>
              <button
                onClick={createPost}
                disabled={!newPost.title.trim() || !newPost.content.trim() || createPostLoading}
                className="flex items-center gap-2 px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 font-medium shadow-[0_4px_20px_-4px_rgba(0,0,0,0.2)]"
              >
                {createPostLoading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Create Post
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
