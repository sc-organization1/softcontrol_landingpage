import { motion } from 'motion/react'
import { useI18n } from '../i18n'
import { SERVICES } from '../config'
import { LivePreview } from './LivePreview'

const START = -135, SWEEP = 270, R = 50, C = 66
const point = (deg, r) => {
  const a = ((deg - 90) * Math.PI) / 180
  return [C + r * Math.cos(a), C + r * Math.sin(a)]
}

const ARC = `M ${point(START, R).join(' ')} A ${R} ${R} 0 1 1 ${point(START + SWEEP, R).join(' ')}`

function Dial({ value, total }) {
  const end = START + (SWEEP * value) / total
  return (
    <svg viewBox="0 0 132 132" className="block size-[132px]" aria-hidden="true">
      <circle cx={C} cy={C} r="56" fill="none" stroke="var(--line)" />
      {Array.from({ length: total + 1 }, (_, i) => {
        const d = START + (SWEEP * i) / total
        const [x1, y1] = point(d, R + 2)
        const [x2, y2] = point(d, R + 8)
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={i <= value ? 'var(--brass-soft)' : 'var(--muted)'} strokeWidth="1.2" />
      })}
      <motion.path d={ARC} fill="none" stroke="var(--brass-soft)" strokeWidth="3" strokeLinecap="round" initial={false} animate={{ pathLength: value / total, opacity: value ? 1 : 0 }} />
      <motion.g
        initial={{ rotate: START }}
        animate={{ rotate: end }}
        transition={{ type: 'spring', stiffness: 140, damping: 12 }}
      >
        {/* invisible circle centres the group's box on the dial, so it rotates around the hub */}
        <circle cx={C} cy={C} r="56" fill="none" stroke="none" />
        <line x1={C} y1={C} x2={C} y2="24" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" />
      </motion.g>
      <circle cx={C} cy={C} r="6" fill="var(--ink)" />
      <circle cx={C} cy={C} r="2" fill="var(--brass-soft)" />
    </svg>
  )
}

export function ControlPanel({ selected, toggle }) {
  const { t } = useI18n()
  return (
    <div className="relative border border-line bg-card p-7 shadow-[0_30px_60px_-40px_rgba(15,26,45,.45)] max-[480px]:p-5">
      <div className="pointer-events-none absolute inset-2 border border-brass/35" />
      <div className="flex items-baseline justify-between border-b border-line pb-4 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
        <span>{t('con.title')}</span>
        <span className="flex items-center gap-1.5 text-ok">
          <span className="relative flex size-[7px]">
            <span className="absolute inset-0 animate-ping rounded-full bg-ok opacity-60" />
            <span className="relative size-[7px] rounded-full bg-ok" />
          </span>
          {t('con.live')}
        </span>
      </div>

      <div className="grid items-center gap-6 pt-4 min-[481px]:grid-cols-[1fr_auto]">
        <div className="flex flex-col">
          {SERVICES.map((s) => {
            const on = selected.includes(s.id)
            return (
              <button
                key={s.id}
                type="button"
                aria-pressed={on}
                onClick={() => toggle(s.id)}
                className={`group flex w-full cursor-pointer select-none items-center justify-between gap-4 border-b border-dashed border-line py-[9px] text-left text-sm transition-colors last:border-b-0 ${on ? 'text-ink' : 'text-ink-2 hover:text-ink'}`}
              >
                <span className="transition-transform duration-200 group-hover:translate-x-0.5">{t(`s.${s.id}`)}</span>
                <span className={`relative h-5 w-[38px] shrink-0 rounded-full border transition-colors duration-300 ${on ? 'border-ink bg-ink' : 'border-line bg-paper-2'}`}>
                  <motion.span
                    className={`absolute top-[2px] size-[14px] rounded-full ${on ? 'bg-brass-soft' : 'bg-muted'}`}
                    animate={{ left: on ? 20 : 2 }}
                    transition={{ type: 'spring', stiffness: 600, damping: 32 }}
                  />
                </span>
              </button>
            )
          })}
        </div>

        <div className="w-[132px] text-center max-[480px]:order-first max-[480px]:mx-auto">
          <Dial value={selected.length} total={SERVICES.length} />
          <div className="mt-1.5 font-display text-3xl leading-none tabular-nums">
            {selected.length} / {SERVICES.length}
          </div>
          <div className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">{t('con.cap')}</div>
        </div>
      </div>

      <LivePreview selected={selected} />

      <div className="mt-4 text-[13px] text-muted">{t('con.foot')}</div>
      <a href="#contact" className="group mt-3 inline-flex items-center gap-2 border-b border-current pb-0.5 font-mono text-xs uppercase tracking-[0.08em] text-brass">
        {t('con.go')} <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
      </a>
    </div>
  )
}
