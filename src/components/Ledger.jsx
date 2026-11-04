import { useEffect, useRef, useState } from 'react'
import { animate, useInView, useReducedMotion } from 'motion/react'
import { useI18n } from '../i18n'
import { COMPANY } from '../config'

function CountUp({ to, from = 0, duration = 1.4 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const reduce = useReducedMotion()
  const [val, setVal] = useState(to)
  useEffect(() => {
    if (!inView || reduce) return
    const c = animate(from, to, { duration, ease: [0.22, 1, 0.36, 1], onUpdate: (v) => setVal(Math.round(v)) })
    return () => c.stop()
  }, [inView, reduce, from, to, duration])
  return <span ref={ref} className="tabular-nums">{val}</span>
}

export function Ledger() {
  const { t } = useI18n()
  const cells = [
    [t('led.founded'), <CountUp from={2000} to={COMPANY.founded} />],
    [t('led.team'), <><CountUp to={COMPANY.team} duration={1} /> {t('led.teamV')}</>],
    [t('led.office'), t('led.officeV')],
    [t('led.lang'), 'UZ · RU · EN'],
  ]
  return (
    <dl className="border-y border-line">
      <div className="wrap grid grid-cols-4 max-[760px]:grid-cols-2">
        {cells.map(([k, v], i) => (
          <div
            key={i}
            className={`group flex flex-col gap-1 py-6 pr-5 ${i > 0 ? 'min-[761px]:border-l min-[761px]:border-line min-[761px]:pl-6' : ''} ${i % 2 === 1 ? 'max-[760px]:border-l max-[760px]:border-line max-[760px]:pl-5' : ''} ${i > 1 ? 'max-[760px]:border-t max-[760px]:border-line' : ''}`}
          >
            <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">{k}</dt>
            <dd className="font-display text-[22px] transition-colors duration-300 group-hover:text-brass">{v}</dd>
          </div>
        ))}
      </div>
    </dl>
  )
}
