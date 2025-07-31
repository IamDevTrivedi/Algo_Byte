"use client"

import { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import logo from "../Images/logo.png"
import {
  ArrowLeft,
  Sun,
  Moon,
  User,
  Settings,
  LogOut,
  Bell,
  Code,
  Home,
  ChevronDown,
  ChevronUp,
  Clock,
  Heart,
  MessageSquare,
  Eye,
  Trash2,
  MoreVertical,
  AlertTriangle,
  Plus,
  Send,
  X,
  ImageIcon,
  Loader,
  CheckCircle,
  Reply,
} from "lucide-react"
import axiosClient from "../utils/axiosClient"
import socket from "../utils/socket"
import { useSelector, useDispatch } from "react-redux"
import { logoutUser } from "../authSlice"


export function MyPosts() {
  const { user, userImage } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [darkMode, setDarkMode] = useState(false)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [expandedContentPosts, setExpandedContentPosts] = useState(new Set())
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [postToDelete, setPostToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [showDropdown, setShowDropdown] = useState(null)
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [newPost, setNewPost] = useState({ title: "", content: "", image: null })
  const [imageUploading, setImageUploading] = useState(false)
  const [createPostLoading, setCreatePostLoading] = useState(false)
  const [comments, setComments] = useState({})
  
  // State for replies and comment expansion
  const [replies, setReplies] = useState({})
  const [expandedComments, setExpandedComments] = useState(new Set())
  
  // State to hold all user profile images
  const [userImages, setUserImages] = useState([])

  // State to track which post's comments are expanded
  const [expandedPosts, setExpandedPosts] = useState(new Set())

  // Notification state
  const [notification, setNotification] = useState(null)

  const fileInputRef = useRef(null)

  

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode)
  }, [darkMode])

  useEffect(() => {
    fetchMyPosts()
  }, [])
  
  const fetchReplies = async (commentId) => {
    try {
      const response = await axiosClient.get(`/discussion/getAllRepliesByComment/${commentId}`)
      if (response.data) {
        setReplies((prev) => ({ ...prev, [commentId]: response.data }))
      } else {
        setReplies((prev) => ({ ...prev, [commentId]: [] }))
      }
    } catch (error) {
      console.error("Error fetching replies:", error)
      setReplies((prev) => ({ ...prev, [commentId]: [] }))
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

  useEffect(() => {
    socket.on("post-deleted", ({ postId }) => {
      setPosts((prev) => prev.filter((post) => post._id !== postId))
    })

    socket.on("new-post", (post) => {
      if (post.userId._id !== user._id) {
        setNotification({
          type: "success",
          message: `New post by ${post.userId.firstName}: "${post.title}"`,
          timestamp: Date.now(),
        })
        setTimeout(() => setNotification(null), 5000)
      }
    })

    return () => {
      socket.off("post-deleted")
      socket.off("new-post")
    }
  }, [user._id])

  const fetchMyPosts = async () => {
    setLoading(true)
    try {
      const [postsResponse, imagesResponse] = await Promise.all([
        axiosClient.get(`/discussion/getMyPosts`),
        axiosClient.get("/image/getAllImage")
      ]);

      if (imagesResponse.data && Array.isArray(imagesResponse.data.images)) {
        setUserImages(imagesResponse.data.images)
      }

      if (postsResponse.data && postsResponse.data.posts) {
        const postsData = postsResponse.data.posts
        for (const post of postsData) {
          fetchComments(post._id)
        }
        setPosts(postsData)
      }
    } catch (error) {
      console.error("Error fetching my posts:", error)
      setPosts([])
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePost = async () => {
    if (!postToDelete) return
    setDeleting(true)
    try {
      await axiosClient.delete(`/discussion/deletePost/${postToDelete._id}`)
      setPosts((prev) => prev.filter((post) => post._id !== postToDelete._id))
      setShowDeleteModal(false)
      setPostToDelete(null)
    } catch (error) {
      console.error("Error deleting post:", error)
      alert("Failed to delete post. Please try again.")
    } finally {
      setDeleting(false)
    }
  }

  const toggleContentExpansion = (postId) => {
    const newExpanded = new Set(expandedContentPosts)
    if (newExpanded.has(postId)) newExpanded.delete(postId)
    else newExpanded.add(postId)
    setExpandedContentPosts(newExpanded)
  }
  
  const toggleCommentExpansion = (commentId) => {
    const newExpanded = new Set(expandedComments);
    if (newExpanded.has(commentId)) {
      newExpanded.delete(commentId);
    } else {
      newExpanded.add(commentId);
      if (!replies[commentId]) {
        fetchReplies(commentId);
      }
    }
    setExpandedComments(newExpanded);
  }

  const toggleCommentsExpansion = (postId) => {
    const newExpanded = new Set(expandedPosts)
    if (newExpanded.has(postId)) {
      newExpanded.delete(postId)
    } else {
      newExpanded.add(postId)
    }
    setExpandedPosts(newExpanded)
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

  const openDeleteModal = (post) => {
    setPostToDelete(post)
    setShowDeleteModal(true)
    setShowDropdown(null)
  }

  

  

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
        <div className="fixed top-4 right-4 z-[60] animate-in slide-in-from-top-2 duration-300">
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

      <header className="sticky top-0 z-50 bg-white/95 dark:bg-black/95 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50 shadow-[0_2px_20px_-2px_rgba(0,0,0,0.1)] dark:shadow-[0_2px_20px_-2px_rgba(255,255,255,0.05)]">
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
              <Link to="/discussionForum" className="hover:text-black dark:hover:text-white transition-colors">
                Discuss
              </Link>
              <span>/</span>
              <span className="text-black dark:text-white font-medium">My Posts</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/discussionForum" title="Back to Discussions">
              <button className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-105 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_15px_-2px_rgba(0,0,0,0.15)]">
                <ArrowLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Back</span>
              </button>
            </Link>

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

            <button
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 hover:scale-110 hover:shadow-[0_4px_15px_-2px_rgba(0,0,0,0.1)]"
              title="Notifications"
            >
              <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 hover:shadow-[0_4px_15px_-2px_rgba(0,0,0,0.1)]"
              >
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center text-gray-800 dark:text-gray-200 text-xl font-black shadow-[0_4px_20px_-4px_rgba(0,0,0,0.15)] overflow-hidden border-2 border-gray-300/50 dark:border-gray-600/50 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.2)] transition-all duration-300">
                  {userImage?.secureUrl ? (
                    <img
                      src={userImage.secureUrl || "/placeholder.svg"}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    user?.firstName?.charAt(0)?.toUpperCase() || "U"
                  )}
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-gray-600 dark:text-gray-400 transition-transform duration-300 ${
                    showUserMenu ? "rotate-180" : ""
                  }`}
                />
              </button>
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white/95 dark:bg-black/95 backdrop-blur-md rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] dark:shadow-[0_10px_40px_-10px_rgba(255,255,255,0.1)] border border-gray-200/50 dark:border-gray-700/50 py-2 animate-in slide-in-from-top-2 duration-200">
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
                  <button onClick={() => dispatch(logoutUser())} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100/50 dark:hover:bg-gray-800/50 flex items-center gap-2 text-red-600 dark:text-red-400 transition-all duration-200">
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center text-gray-800 dark:text-gray-200 text-2xl font-black shadow-[0_8px_30px_-4px_rgba(0,0,0,0.15)] overflow-hidden border-2 border-gray-300/50 dark:border-gray-600/50 hover:shadow-[0_12px_40px_-4px_rgba(0,0,0,0.2)] transition-all duration-300">
              {userImage?.secureUrl ? (
                <img
                  src={userImage.secureUrl || "/placeholder.svg"}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                user?.firstName?.charAt(0)?.toUpperCase() || "U"
              )}
            </div>
            <div>
              <h1 className="text-3xl font-black text-black dark:text-white mb-2">My Posts</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage and view all your discussions • {posts.length} post{posts.length !== 1 ? "s" : ""}
              </p>
            </div>
            
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/80 dark:bg-black/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-4 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.15)] transition-all duration-300 hover:scale-[1.02] hover:border-gray-300/50 dark:hover:border-gray-600/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 shadow-[0_2px_10px_-2px_rgba(59,130,246,0.3)]">
                  <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-black dark:text-white">{posts.length}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Posts</div>
                </div>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-black/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-4 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.15)] transition-all duration-300 hover:scale-[1.02] hover:border-gray-300/50 dark:hover:border-gray-600/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-red-50 dark:bg-red-900/20 shadow-[0_2px_10px_-2px_rgba(239,68,68,0.3)]">
                  <Heart className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-black dark:text-white">
                    {posts.reduce((total, post) => total + (post.likes?.length || 0), 0)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Likes</div>
                </div>
              </div>
            </div>

            
          </div>
        </div>

        <div className="space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-gray-200 dark:border-gray-700 border-t-black dark:border-t-white rounded-full animate-spin"></div>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No posts yet</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Start sharing your thoughts with the community!</p>
              
            </div>
          ) : (
            posts.map((post) => (
              <div
                key={post._id}
                className="bg-white/80 dark:bg-black/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_40px_-8px_rgba(0,0,0,0.15)] transition-all duration-300 hover:border-gray-300/50 dark:hover:border-gray-600/50 group"
              >
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center shadow-[0_4px_15px_-2px_rgba(0,0,0,0.1)] overflow-hidden">
                        {userImage?.secureUrl ? (
                            <img src={userImage.secureUrl} alt="Profile" className="w-full h-full object-cover"/>
                        ) : (
                            <span className="text-sm font-bold text-black dark:text-white">
                                {user?.firstName?.charAt(0)?.toUpperCase() || "U"}
                            </span>
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-black dark:text-white">{user.firstName}</div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                          <Clock className="w-3 h-3" />
                          {formatTimeAgo(post.createdAt)}
                        </div>
                      </div>
                    </div>

                    <div className="relative">
                      <button
                        onClick={() => setShowDropdown(showDropdown === post._id ? null : post._id)}
                        className="p-2 rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-all duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100"
                      >
                        <MoreVertical className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      </button>

                      {showDropdown === post._id && (
                        <div className="absolute right-0 top-full mt-2 w-40 bg-white/95 dark:bg-black/95 backdrop-blur-md rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] border border-gray-200/50 dark:border-gray-700/50 py-2 z-20 animate-in slide-in-from-top-2 duration-200">
                          <button
                            onClick={ openDeleteModal(post)}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100/50 dark:hover:bg-gray-800/50 flex items-center gap-2 text-red-600 dark:text-red-400 transition-all duration-200"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete Post
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <h2 className="text-xl font-bold text-black dark:text-white mb-3 group-hover:text-gray-700 dark:group-hover:text-gray-300 cursor-pointer transition-colors duration-300">
                    {post.title}
                  </h2>

                  <div className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4 whitespace-pre-wrap">
                    {post.content.length > 300 && !expandedContentPosts.has(post._id) ? (
                      <>
                        {post.content.substring(0, 300)}...
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
                </div>

                <div className="px-6 py-4 border-t border-gray-100/50 dark:border-gray-800/50 bg-gray-50/30 dark:bg-gray-900/20 rounded-b-2xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Heart className="w-4 h-4 text-red-500" />
                        <span className="text-sm font-medium">{post.likes?.length || 0}</span>
                      </div>
                      <button
                        onClick={() => toggleCommentsExpansion(post._id)}
                        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors duration-200"
                      >
                        <MessageSquare className="w-4 h-4 text-blue-500" />
                        <span className="text-sm font-medium">{comments[post._id]?.length || 0}</span>
                      </button>
                      
                    </div>
                  </div>
                </div>

                {expandedPosts.has(post._id) && (
                  <div className="border-t border-gray-100/50 dark:border-gray-800/50 p-6 animate-in slide-in-from-top-2 duration-300">
                    <h4 className="text-md font-bold text-black dark:text-white mb-4">
                      Comments ({comments[post._id]?.length || 0})
                    </h4>
                    <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                      {comments[post._id] && comments[post._id].length > 0 ? (
                        comments[post._id].map((comment) => {
                          const commenterImage = userImages.find(img => img.userId === comment.userId?._id)?.secureUrl;
                          return (
                          <div key={comment._id} className="flex flex-col">
                            <div className="flex gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center shadow-[0_2px_10px_-2px_rgba(0,0,0,0.1)] flex-shrink-0 overflow-hidden">
                                {commenterImage ? (
                                    <img src={commenterImage} alt="Profile" className="w-full h-full object-cover"/>
                                ) : (
                                    <span className="text-xs font-bold text-black dark:text-white">
                                        {comment.userId?.firstName?.charAt(0)?.toUpperCase() || "U"}
                                    </span>
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium text-black dark:text-white text-sm">
                                    {comment.userId?.firstName || "Anonymous"}
                                  </span>
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {formatTimeAgo(comment.createdAt)}
                                  </span>
                                </div>
                                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                                  {comment.content}
                                </p>
                                <button
                                    onClick={() => toggleCommentExpansion(comment._id)}
                                    className="text-xs mt-2 text-blue-600 dark:text-blue-400 hover:underline transition-all duration-200"
                                >
                                    {expandedComments.has(comment._id) ? 'Hide Replies' : 'View Replies'}
                                    {expandedComments.has(comment._id) && replies[comment._id]?.length > 0 ? ` (${replies[comment._id].length})` : ''}
                                </button>
                              </div>
                            </div>

                            {expandedComments.has(comment._id) && (
                                <div className="mt-3 space-y-3 pl-11 border-l-2 border-gray-100/50 dark:border-gray-800/50 ml-4">
                                    {!replies[comment._id] ? (
                                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 pt-2">
                                            <Loader className="w-3 h-3 animate-spin" />
                                            <span>Loading replies...</span>
                                        </div>
                                    ) : replies[comment._id].length > 0 ? (
                                        replies[comment._id].map(reply => {
                                            const replierImage = userImages.find(img => img.userId === reply.userId?._id)?.secureUrl;
                                            return (
                                                <div key={reply._id} className="flex gap-3 pt-3">
                                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center shadow-[0_2px_8px_-2px_rgba(0,0,0,0.1)] flex-shrink-0 overflow-hidden">
                                                        {replierImage ? (
                                                            <img src={replierImage} alt="Profile" className="w-full h-full object-cover"/>
                                                        ) : (
                                                            <span className="text-xs font-bold text-black dark:text-white">
                                                                {reply.userId?.firstName?.charAt(0) || 'U'}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="font-medium text-black dark:text-white text-xs">{reply.userId?.firstName || "Anonymous"}</span>
                                                            <span className="text-xs text-gray-500 dark:text-gray-400">{formatTimeAgo(reply.createdAt)}</span>
                                                        </div>
                                                        <p className="text-gray-700 dark:text-gray-300 text-xs leading-relaxed whitespace-pre-wrap">{reply.content}</p>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <p className="text-xs text-gray-500 dark:text-gray-400 pt-2">No replies on this comment.</p>
                                    )}
                                </div>
                            )}

                          </div>
                        )})
                      ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                          No comments on this post yet.
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </main>

     
     

      {/* Delete Confirmation Modal */}
      {showDeleteModal && postToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md">
          <div className="w-full max-w-md bg-white/95 dark:bg-black/95 backdrop-blur-md rounded-2xl shadow-[0_20px_60px_-10px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_60px_-10px_rgba(255,255,255,0.1)] border border-gray-200/50 dark:border-gray-700/50 animate-in zoom-in-95 duration-300">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-2xl bg-red-50 dark:bg-red-900/20 shadow-[0_4px_15px_-2px_rgba(239,68,68,0.3)]">
                  <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-black dark:text-white">Delete Post</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">This action cannot be undone</p>
                </div>
              </div>

              <div className="mb-6 p-4 bg-gray-50/50 dark:bg-gray-900/50 rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.05)]">
                <h4 className="font-medium text-black dark:text-white mb-2">{postToDelete.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                  {postToDelete.content.substring(0, 150)}
                  {postToDelete.content.length > 150 && "..."}
                </p>
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false)
                    setPostToDelete(null)
                  }}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors duration-200 rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
                  disabled={deleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeletePost}
                  disabled={deleting}
                  className="flex items-center gap-2 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all duration-300 hover:scale-105 shadow-[0_4px_20px_-4px_rgba(239,68,68,0.4)] hover:shadow-[0_8px_30px_-4px_rgba(239,68,68,0.5)] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Delete Post
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDropdown && <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(null)} />}
    </div>
  )
}