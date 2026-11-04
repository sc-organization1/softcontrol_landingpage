import { motion, useReducedMotion } from 'motion/react'

/**
 * Fades and lifts its children into place when they scroll into view.
 * Content starts partly visible, so nothing is hidden if animations don't run.
 */
export function Reveal({ children, delay = 0, y = 28, className, as = 'div' }) {
  const reduce = useReducedMotion()
  const Tag = motion[as]
  if (reduce) return <Tag className={className}>{children}</Tag>
  return (
    <Tag
      className={className}
      initial={{ opacity: 0.25, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Tag>
  )
}

export function SectionHead({ eyebrow, title, sub, onBand = false }) {
  return (
    <div className="mb-14 grid items-end gap-12 max-[820px]:mb-10 max-[820px]:grid-cols-1 max-[820px]:gap-5 min-[821px]:grid-cols-2">
      <Reveal>
        <div className={`eyebrow ${onBand ? '!text-brass-soft' : ''}`}>{eyebrow}</div>
        <h2 className="mt-[18px] text-[clamp(34px,4.4vw,54px)] leading-[1.08]">{title}</h2>
      </Reveal>
      <Reveal delay={0.1}>
        <p className={`max-w-[54ch] ${onBand ? 'text-on-band-2' : 'text-ink-2'}`}>{sub}</p>
      </Reveal>
    </div>
  )
}
