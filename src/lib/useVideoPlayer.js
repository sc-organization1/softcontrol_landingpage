import { useCallback, useEffect, useRef, useState } from 'react'
import { bufferedEnd, clamp01 } from './video'

const DEFAULT_VOLUME = 0.8

/**
 * Everything the custom player needs from one <video>: spread videoProps on the element, attach videoRef,
 * frameRef (the box that goes full screen) and barRef (the seek bar).
 * The bar reads --progress and --buffered, written straight to the DOM so playback never re-renders React per frame.
 *
 * status: idle (nothing started) | playing | paused | ended
 */
export function useVideoPlayer(src) {
  const videoRef = useRef(null)
  const frameRef = useRef(null)
  const barRef = useRef(null)
  const statusRef = useRef('idle')
  const resumeAt = useRef(0) // where to continue after a failed load is retried
  const scrubbing = useRef(false)
  const firstSrc = useRef(true)

  const [status, setStatusState] = useState('idle')
  const [buffering, setBuffering] = useState(false)
  const [failed, setFailed] = useState(false)
  const [time, setTime] = useState(0) // whole seconds, so the label re-renders once a second
  const [duration, setDuration] = useState(0)
  const [muted, setMuted] = useState(false)
  const [volume, setVolumeState] = useState(1)
  const [fullscreen, setFullscreen] = useState(false)

  const setStatus = useCallback((next) => {
    statusRef.current = next
    setStatusState(next)
  }, [])

  const paintBar = useCallback(() => {
    const video = videoRef.current
    const bar = barRef.current
    if (!video || !bar || scrubbing.current) return
    bar.style.setProperty('--progress', video.duration ? video.currentTime / video.duration : 0)
  }, [])

  const paintBuffered = useCallback(() => {
    const video = videoRef.current
    const bar = barRef.current
    if (!video || !bar) return
    const end = bufferedEnd(video.buffered, video.currentTime)
    bar.style.setProperty('--buffered', video.duration ? end / video.duration : 0)
  }, [])

  const play = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    video.play()?.catch((error) => {
      if (error.name === 'AbortError') return // a newer language or play request replaced this one
      setBuffering(false)
      if (statusRef.current === 'playing') setStatus('idle') // the browser refused: show the play button again
    })
  }, [setStatus])

  const replay = useCallback(() => {
    if (videoRef.current) videoRef.current.currentTime = 0
    play()
  }, [play])

  const toggle = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    if (statusRef.current === 'ended') replay()
    else if (statusRef.current === 'playing') video.pause()
    else play()
  }, [play, replay])

  const seek = useCallback((seconds) => {
    const video = videoRef.current
    if (!video || !video.duration) return
    video.currentTime = Math.min(video.duration, Math.max(0, seconds))
    if (statusRef.current === 'ended') setStatus('paused')
    setTime(Math.floor(video.currentTime))
    paintBar()
  }, [paintBar, setStatus])

  // While the seek bar is dragged only the bar and the time label move; the video seeks on release
  const scrub = useCallback((fraction) => {
    const video = videoRef.current
    scrubbing.current = true
    barRef.current?.style.setProperty('--progress', fraction)
    if (video?.duration) setTime(Math.floor(fraction * video.duration))
  }, [])

  const endScrub = useCallback((fraction) => {
    scrubbing.current = false
    const video = videoRef.current
    if (!video) return
    if (fraction === null) { // drag cancelled by the system: go back to the real position
      setTime(Math.floor(video.currentTime))
      paintBar()
    } else seek(fraction * video.duration)
  }, [paintBar, seek])

  const setVolume = useCallback((value) => {
    const video = videoRef.current
    if (!video) return
    video.volume = clamp01(value)
    video.muted = value <= 0
  }, [])

  const toggleMute = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    if (video.muted || video.volume === 0) {
      if (video.volume === 0) video.volume = DEFAULT_VOLUME
      video.muted = false
    } else video.muted = true
  }, [])

  const toggleFullscreen = useCallback(() => {
    const frame = frameRef.current
    const video = videoRef.current
    if (!frame || !video) return
    if (document.fullscreenElement === frame || document.webkitFullscreenElement === frame) {
      Promise.resolve((document.exitFullscreen ?? document.webkitExitFullscreen).call(document)).catch(() => {})
      return
    }
    const enter = frame.requestFullscreen ?? frame.webkitRequestFullscreen
    if (enter) {
      Promise.resolve(enter.call(frame))
        .then(() => window.screen.orientation?.lock?.('landscape')) // turns phones sideways where allowed
        .catch(() => {})
    } else video.webkitEnterFullscreen?.() // iPhone can only put the video itself in full screen
  }, [])

  const retry = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    const wasPlaying = statusRef.current === 'playing'
    setFailed(false)
    video.load()
    if (wasPlaying) play()
  }, [play])

  // A new language: the browser has already started loading the new file for this same element,
  // so volume and full screen carry over. Playing stays playing, anything else returns to the start screen.
  useEffect(() => {
    if (firstSrc.current) {
      firstSrc.current = false
      return
    }
    resumeAt.current = 0
    scrubbing.current = false
    setFailed(false)
    setTime(0)
    setDuration(0)
    barRef.current?.style.setProperty('--progress', 0)
    barRef.current?.style.setProperty('--buffered', 0)
    if (statusRef.current === 'playing') {
      setBuffering(true)
      play()
    } else {
      setBuffering(false)
      setStatus('idle')
    }
  }, [src, play, setStatus])

  // Smooth bar: timeupdate only fires about 4 times a second
  useEffect(() => {
    if (status !== 'playing') return
    let frame = requestAnimationFrame(function tick() {
      paintBar()
      frame = requestAnimationFrame(tick)
    })
    return () => cancelAnimationFrame(frame)
  }, [status, paintBar])

  useEffect(() => {
    const onChange = () => {
      const active = document.fullscreenElement ?? document.webkitFullscreenElement
      setFullscreen(Boolean(active) && active === frameRef.current)
    }
    document.addEventListener('fullscreenchange', onChange)
    document.addEventListener('webkitfullscreenchange', onChange)
    return () => {
      document.removeEventListener('fullscreenchange', onChange)
      document.removeEventListener('webkitfullscreenchange', onChange)
    }
  }, [])

  const videoProps = {
    onPlay: () => setStatus('playing'),
    onPlaying: () => setBuffering(false),
    onPause: (e) => { if (!e.currentTarget.ended) setStatus('paused') },
    onEnded: () => { setBuffering(false); setStatus('ended') },
    onWaiting: () => setBuffering(true),
    onCanPlay: () => setBuffering(false),
    onLoadedMetadata: (e) => {
      setDuration(e.currentTarget.duration)
      if (resumeAt.current) {
        e.currentTarget.currentTime = resumeAt.current
        resumeAt.current = 0
      }
    },
    onDurationChange: (e) => setDuration(e.currentTarget.duration),
    onTimeUpdate: (e) => {
      if (!scrubbing.current) setTime(Math.floor(e.currentTarget.currentTime))
      paintBar()
    },
    onProgress: paintBuffered,
    onSeeked: () => { paintBar(); paintBuffered() },
    onVolumeChange: (e) => {
      setMuted(e.currentTarget.muted)
      setVolumeState(e.currentTarget.volume)
    },
    onError: (e) => {
      resumeAt.current = e.currentTarget.currentTime || resumeAt.current
      setBuffering(false)
      setFailed(true)
    },
  }

  return {
    videoRef, frameRef, barRef, videoProps,
    status, buffering, failed, time, duration, muted, volume, fullscreen,
    play, replay, toggle, seek, scrub, endScrub, setVolume, toggleMute, toggleFullscreen, retry,
  }
}
