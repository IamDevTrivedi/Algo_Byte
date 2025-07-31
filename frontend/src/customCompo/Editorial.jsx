"use client"

import { useState, useRef, useEffect } from "react"
import { Pause, Play, Volume2, VolumeX, Maximize, RotateCcw } from "lucide-react"

const Editorial = ({ secureUrl, thumbnailUrl, duration }) => {
  const videoRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Format seconds to MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleVolumeChange = (e) => {
    const newVolume = Number.parseFloat(e.target.value)
    setVolume(newVolume)
    if (videoRef.current) {
      videoRef.current.volume = newVolume
      setIsMuted(newVolume === 0)
    }
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const handleSeek = (e) => {
    const newTime = Number(e.target.value)
    if (videoRef.current) {
      videoRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
  }

  const resetVideo = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0
      setCurrentTime(0)
      if (isPlaying) {
        videoRef.current.pause()
        setIsPlaying(false)
      }
    }
  }

  // Update current time during playback
  useEffect(() => {
    const video = videoRef.current

    const handleTimeUpdate = () => {
      if (video) setCurrentTime(video.currentTime)
    }

    const handleLoadedMetadata = () => {
      if (video) {
        video.volume = volume
      }
    }

    if (video) {
      video.addEventListener("timeupdate", handleTimeUpdate)
      video.addEventListener("loadedmetadata", handleLoadedMetadata)
      return () => {
        video.removeEventListener("timeupdate", handleTimeUpdate)
        video.removeEventListener("loadedmetadata", handleLoadedMetadata)
      }
    }
  }, [volume])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Editorial Video</h2>
        <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Duration: {formatTime(duration)}</div>
      </div>

      <div
        className="relative w-full rounded-2xl overflow-hidden bg-black shadow-2xl border-2 border-gray-900 dark:border-white group"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Video Element */}
        <video
          ref={videoRef}
          src={secureUrl}
          poster={thumbnailUrl}
          onClick={togglePlayPause}
          className="w-full aspect-video bg-black cursor-pointer"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />

        {/* Premium Controls Overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/20 transition-all duration-500 ${
            isHovering || !isPlaying ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Top Controls */}
          <div className="absolute top-0 left-0 right-0 p-6">
            <div className="flex items-center justify-between">
              <div className="text-white">
                <h3 className="text-lg font-bold mb-1">Problem Editorial</h3>
                <p className="text-sm text-white/80">Detailed solution explanation</p>
              </div>
              <button
                onClick={resetVideo}
                className="p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
                title="Reset video"
              >
                <RotateCcw size={18} />
              </button>
            </div>
          </div>

          {/* Center Play Button */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={togglePlayPause}
                className="p-6 rounded-full bg-white/20 backdrop-blur-md border-2 border-white/30 text-white hover:bg-white/30 hover:border-white/50 transition-all duration-300 hover:scale-110 shadow-2xl"
              >
                <Play size={32} className="ml-1" />
              </button>
            </div>
          )}

          {/* Bottom Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max={duration}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-2 bg-white/20 rounded-full appearance-none cursor-pointer slider-thumb"
                  style={{
                    background: `linear-gradient(to right, white 0%, white ${(currentTime / duration) * 100}%, rgba(255,255,255,0.2) ${(currentTime / duration) * 100}%, rgba(255,255,255,0.2) 100%)`,
                  }}
                />
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Play/Pause */}
                <button
                  onClick={togglePlayPause}
                  className="p-3 rounded-full bg-white text-black hover:bg-gray-200 transition-all duration-300 hover:scale-110 shadow-lg"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
                </button>

                {/* Volume Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleMute}
                    className="p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
                  >
                    {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-20 h-1 bg-white/20 rounded-full appearance-none cursor-pointer volume-slider"
                  />
                </div>

                {/* Time Display */}
                <div className="text-white text-sm font-mono bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm border border-white/20">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
              </div>

              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
                title="Fullscreen"
              >
                <Maximize size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Video Description */}
      <div className="bg-white dark:bg-black rounded-xl border-2 border-gray-900 dark:border-white p-6 shadow-lg">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">About This Editorial</h3>
        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
          This editorial video provides a comprehensive walkthrough of the problem solution, including algorithm
          explanation, implementation details, and optimization techniques. Watch to understand the thought process
          behind solving this problem efficiently.
        </p>
      </div>

      <style jsx>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: 2px solid #000;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        }

        .slider-thumb::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: 2px solid #000;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        }

        .volume-slider::-webkit-slider-thumb {
          appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: 1px solid rgba(255,255,255,0.5);
        }

        .volume-slider::-moz-range-thumb {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: 1px solid rgba(255,255,255,0.5);
        }
      `}</style>
    </div>
  )
}

export default Editorial
