import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'

/** Dim shapes that drift forever (styles in index.css). Also placed inside the dark bands, whose color would hide the page background. */
export function Drift({ band = false }) {
  return (
    <div className={`drift ${band ? 'drift-band' : ''}`} aria-hidden="true">
      <i /><i /><i /><i /><i />
    </div>
  )
}

const SCROLL_SPRING = { stiffness: 60, damping: 24 }
const LAYER = 'absolute inset-0 will-change-transform'

function Mark({ d, stroke, width, opacity }) {
  return (
    <svg viewBox="0 0 100 100" className="size-full overflow-visible" fill="none" stroke={stroke} strokeWidth={width} strokeOpacity={opacity} strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  )
}

/** Giant, faint logo. Its brackets open and the S makes a half turn over the length of the page. */
function ScrollLogo() {
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, SCROLL_SPRING)
  const left = useTransform(progress, [0, 1], ['0%', '-16%'])
  const right = useTransform(progress, [0, 1], ['0%', '16%'])
  const rotate = useTransform(progress, [0, 1], [0, 180]) // an S looks the same after half a turn
  return (
    <div className="absolute left-1/2 top-1/2 size-[min(115vh,110vw)] -translate-x-1/2 -translate-y-1/2">
      <motion.div className={LAYER} style={reduce ? undefined : { x: left }}>
        <Mark d="M25 30 9 50l16 20" stroke="var(--brass-soft)" width=".9" opacity=".13" />
      </motion.div>
      <motion.div className={LAYER} style={reduce ? undefined : { x: right }}>
        <Mark d="M75 30 91 50 75 70" stroke="var(--brass-soft)" width=".9" opacity=".13" />
      </motion.div>
      <motion.div className={LAYER} style={reduce ? undefined : { rotate }}>
        <Mark d="M61 39a11 11 0 1 0-11 11 11 11 0 1 1-11 11" stroke="var(--ink)" width="1.1" opacity=".06" />
      </motion.div>
    </div>
  )
}

/** Sits behind all page content, fixed to the screen */
export function Background() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <Drift />
      <ScrollLogo />
    </div>
  )
}
