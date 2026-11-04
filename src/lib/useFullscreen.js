import { useCallback, useEffect, useState } from 'react'

const activeElement = () => document.fullscreenElement ?? document.webkitFullscreenElement ?? null

/** Browser full screen for the whole page. supported is false where the browser has none, such as iPhone Safari. */
export function useFullscreen() {
  const [active, setActive] = useState(() => Boolean(activeElement()))
  const supported = Boolean(document.fullscreenEnabled ?? document.webkitFullscreenEnabled)

  useEffect(() => {
    const onChange = () => setActive(Boolean(activeElement()))
    document.addEventListener('fullscreenchange', onChange)
    document.addEventListener('webkitfullscreenchange', onChange)
    return () => {
      document.removeEventListener('fullscreenchange', onChange)
      document.removeEventListener('webkitfullscreenchange', onChange)
    }
  }, [])

  const toggle = useCallback(() => {
    const root = document.documentElement
    const call = activeElement()
      ? (document.exitFullscreen ?? document.webkitExitFullscreen).call(document)
      : (root.requestFullscreen ?? root.webkitRequestFullscreen).call(root)
    Promise.resolve(call).catch(() => {}) // the browser refused; the page simply stays as it is
  }, [])

  return { supported, active, toggle }
}
