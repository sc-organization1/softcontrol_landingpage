import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import { useI18n } from '../i18n'
import { SERVICES } from '../config'
import { Drift } from './Background'
import { ServiceIcon } from './Icons'
import { SectionHead } from './Reveal'

const TILT_DEG = 4
const TILT_SPRING = { stiffness: 220, damping: 20 }

function ServiceCard({ s, index, onOrder }) {
  const { t } = useI18n()
  const reduce = useReducedMotion()
  const tiltX = useMotionValue(0)
  const tiltY = useMotionValue(0)
  const rotateX = useSpring(tiltX, TILT_SPRING)
  const rotateY = useSpring(tiltY, TILT_SPRING)

  const onMove = (e) => {
    if (e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - r.left
    const y = e.clientY - r.top
    e.currentTarget.style.setProperty('--mx', `${x}px`)
    e.currentTarget.style.setProperty('--my', `${y}px`)
    if (reduce) return
    tiltY.set((x / r.width - 0.5) * 2 * TILT_DEG)
    tiltX.set((0.5 - y / r.height) * 2 * TILT_DEG)
  }
  const onLeave = () => { tiltX.set(0); tiltY.set(0) }

  return (
    <motion.article
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      initial={{ opacity: 0.25, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, delay: (index % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative flex min-w-0 flex-col hover:z-10 gap-3.5 overflow-hidden border-b border-r border-band-line px-8 pb-9 pt-9 max-[640px]:px-[22px] max-[640px]:pt-7 ${s.wide ? 'min-[641px]:col-span-2' : ''}`}
    >
      {/* cursor spotlight + brass top rule on hover */}
      <span className="spotlight pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <span className="card-glow pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <span className="absolute left-0 top-0 h-[2px] w-full origin-left scale-x-0 bg-brass-soft transition-transform duration-500 group-hover:scale-x-100" />

      <div className="relative flex items-start justify-between">
        <span className="text-brass-soft transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110">
          <ServiceIcon name={s.icon} />
        </span>
        <span className="font-mono text-[11px] tracking-[0.1em] text-on-band-2/70">&lt;{s.id}/&gt;</span>
      </div>
      <h3 className={`relative leading-[1.15] ${s.wide ? 'text-[32px]' : 'text-[26px]'}`}>{t(`s.${s.id}`)}</h3>
      <p className={`relative text-on-band-2 ${s.wide ? 'max-w-[52ch] text-base' : 'text-[15px]'}`}>{t(`svc.${s.id}.p`)}</p>
      <ul className="relative mt-1.5 flex flex-wrap gap-1.5">
        {s.tags.map((tag) => (
          <li key={tag} className="border border-band-line px-[9px] py-1 font-mono text-xs text-on-band transition-colors duration-300 group-hover:border-brass-soft/40">
            {t(tag)}
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => onOrder(s.id)}
        className="relative mt-auto inline-flex cursor-pointer items-center gap-2 self-start pt-3 font-mono text-xs uppercase tracking-[0.08em] text-brass-soft opacity-80 transition-[opacity,gap] duration-300 hover:gap-3 group-hover:opacity-100"
      >
        {t('svc.order')} <span aria-hidden="true">→</span>
      </button>
    </motion.article>
  )
}

export function Services({ onOrder }) {
  const { t } = useI18n()
  return (
    <section id="services" className="relative isolate overflow-hidden bg-band py-[104px] text-on-band max-[700px]:py-[72px]">
      <Drift band />
      <div className="wrap">
        <SectionHead onBand eyebrow={t('svc.eyebrow')} title={t('svc.title')} sub={t('svc.sub')} />
        <div className="grid border-l border-t border-band-line max-[640px]:grid-cols-1 min-[641px]:grid-cols-2 min-[1081px]:grid-cols-4">
          {SERVICES.map((s, i) => <ServiceCard key={s.id} s={s} index={i} onOrder={onOrder} />)}
        </div>
      </div>
    </section>
  )
}
