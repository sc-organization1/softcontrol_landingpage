import { useEffect, useState } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'

const FINE_POINTER = '(hover: hover) and (pointer: fine)'
const CLICKABLE = 'a, button, label, [role="button"], [role="slider"]'
const TEXT_FIELD = 'input, textarea, select'

// The S stays close to the pointer so clicks feel exact; the brackets glide behind it
const S_SPRING = { stiffness: 1400, damping: 70, mass: 0.35 }
const BRACKET_SPRING = { stiffness: 320, damping: 28, mass: 0.6 }
const OPEN_SPRING = { type: 'spring', stiffness: 420, damping: 24 }
const BRACKET_OPEN = 9
const LAYER = 'pointer-events-none fixed left-0 top-0 z-[9999] -ml-[22px] -mt-[22px] size-11'

/**
 * The SoftControl mark as a mouse cursor. Brackets open over anything clickable, like the header logo.
 * Text fields keep the normal text cursor. Touch screens and "reduce motion" keep the system cursor.
 */
export function Cursor() {
  const reduce = useReducedMotion()
  const [enabled, setEnabled] = useState(() => window.matchMedia(FINE_POINTER).matches)
  const [visible, setVisible] = useState(false)
  const [hover, setHover] = useState(false)
  const [pressed, setPressed] = useState(false)

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, S_SPRING)
  const sy = useSpring(y, S_SPRING)
  const bx = useSpring(x, BRACKET_SPRING)
  const by = useSpring(y, BRACKET_SPRING)

  useEffect(() => {
    const query = window.matchMedia(FINE_POINTER)
    const onChange = () => setEnabled(query.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (!enabled || reduce) return
    const root = document.documentElement
    let seen = false

    const onMove = (e) => {
      if (e.pointerType !== 'mouse') return setVisible(false)
      x.set(e.clientX)
      y.set(e.clientY)
      if (!seen) { // start at the pointer instead of flying in from the corner
        seen = true
        sx.jump(e.clientX); sy.jump(e.clientY); bx.jump(e.clientX); by.jump(e.clientY)
        root.classList.add('has-cursor')
      }
      const target = e.target instanceof Element ? e.target : null
      setVisible(!target?.closest(TEXT_FIELD))
      setHover(Boolean(target?.closest(CLICKABLE)))
    }
    const onDown = () => setPressed(true)
    const onUp = () => setPressed(false)
    const onLeave = () => setVisible(false)

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    root.addEventListener('mouseleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      root.removeEventListener('mouseleave', onLeave)
      root.classList.remove('has-cursor')
    }
  }, [enabled, reduce, x, y, sx, sy, bx, by])

  if (!enabled || reduce) return null

  const opacity = visible ? 1 : 0
  const open = hover ? BRACKET_OPEN : 0
  return (
    <>
      <motion.div
        aria-hidden="true"
        className={LAYER}
        style={{ x: bx, y: by }}
        initial={false}
        animate={{ opacity, scale: pressed ? 0.86 : 1 }}
        transition={{ duration: 0.15 }}
      >
        <svg viewBox="0 0 100 100" className="size-full overflow-visible" fill="none" stroke="var(--brass-soft)" strokeWidth="6.4" strokeLinecap="round" strokeLinejoin="round">
          <motion.path d="M25 30 9 50l16 20" initial={false} animate={{ x: -open }} transition={OPEN_SPRING} />
          <motion.path d="M75 30 91 50 75 70" initial={false} animate={{ x: open }} transition={OPEN_SPRING} />
        </svg>
      </motion.div>

      {/* Difference blending keeps the S readable on every light and dark background */}
      <motion.div
        aria-hidden="true"
        className={`${LAYER} mix-blend-difference`}
        style={{ x: sx, y: sy }}
        initial={false}
        animate={{ opacity, scale: pressed ? 0.8 : hover ? 1.15 : 1 }}
        transition={{ duration: 0.15 }}
      >
        <svg viewBox="0 0 100 100" className="size-full" fill="none" stroke="#fff" strokeWidth="8.6" strokeLinecap="round">
          <path d="M61 39a11 11 0 1 0-11 11 11 11 0 1 1-11 11" />
        </svg>
      </motion.div>
    </>
  )
}
