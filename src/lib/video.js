// Files live in public/videos, one video and one poster per site language, named by language code
export const videoSrc = (lang) => `/videos/${lang}.mp4`
export const posterSrc = (lang) => `/videos/${lang}.jpg`

/** 57.4 -> "0:57". Shows 0:00 until the browser knows the real value. */
export function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const whole = Math.floor(seconds)
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, '0')}`
}

export function clamp01(value) {
  return Number.isNaN(value) ? 0 : Math.min(1, Math.max(0, value))
}

/** How far the video is loaded past the playhead, from the browser's TimeRanges */
export function bufferedEnd(ranges, time) {
  for (let i = 0; i < ranges.length; i += 1) {
    if (ranges.start(i) <= time && time <= ranges.end(i)) return ranges.end(i)
  }
  return time
}
