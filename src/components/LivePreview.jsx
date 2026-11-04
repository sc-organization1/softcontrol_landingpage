import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react'
import { useI18n } from '../i18n'
import { ServiceIcon } from './Icons'

const CYCLE_MS = 3800
const ease = [0.22, 1, 0.36, 1]

const pop = (i = 0) => ({
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, delay: i * 0.16, ease },
})
const growX = (i = 0) => ({
  initial: { scaleX: 0 },
  animate: { scaleX: 1 },
  transition: { duration: 0.6, delay: i * 0.12, ease },
})
const growY = (i = 0) => ({
  initial: { scaleY: 0 },
  animate: { scaleY: 1 },
  transition: { duration: 0.55, delay: i * 0.08, ease },
})

const Label = ({ children, className = '' }) => (
  <span className={`font-mono text-[10px] uppercase tracking-[0.08em] text-muted ${className}`}>{children}</span>
)
const Line = ({ width, i = 0, className = 'bg-line' }) => (
  <motion.span {...growX(i)} className={`block h-1.5 origin-left rounded-full ${className}`} style={{ width }} />
)

function Erp() {
  const { t } = useI18n()
  return (
    <div className="grid h-full grid-cols-[1fr_92px] gap-4">
      <div className="flex flex-col justify-center gap-2.5">
        {[['tag.sales', '82%'], ['tag.stock', '58%'], ['tag.fin', '70%']].map(([key, width], i) => (
          <div key={key}>
            <Label className="block leading-none">{t(key)}</Label>
            <span className="mt-1 block h-1.5 rounded-full bg-line"><Line width={width} i={i} className="bg-brass-soft" /></span>
          </div>
        ))}
      </div>
      <div className="flex items-end gap-1.5">
        {[40, 62, 48, 78, 66, 92].map((height, i) => (
          <motion.span key={i} {...growY(i)} className="flex-1 origin-bottom bg-ink" style={{ height: `${height}%` }} />
        ))}
      </div>
    </div>
  )
}

function Web() {
  return (
    <div className="flex h-full flex-col border border-line">
      <div className="flex items-center gap-1 border-b border-line px-2 py-1.5">
        {[0, 1, 2].map((i) => <span key={i} className="size-1.5 rounded-full bg-line" />)}
        <span className="ml-auto flex gap-2"><Line width={18} /><Line width={18} i={1} /><Line width={18} i={2} /></span>
      </div>
      <div className="grid flex-1 grid-cols-3 gap-2 p-2">
        <div className="col-span-3 flex flex-col justify-center gap-1.5">
          <Line width="55%" className="bg-ink" />
          <Line width="35%" i={1} className="bg-brass-soft" />
        </div>
        {[0, 1, 2].map((i) => <motion.span key={i} {...pop(i + 1)} className="block border border-line bg-card" />)}
      </div>
    </div>
  )
}

function Ai() {
  return (
    <div className="flex h-full flex-col justify-center gap-3">
      <motion.div {...pop(0)} className="flex justify-end">
        <span className="flex w-[52%] flex-col gap-1 rounded-[2px] bg-ink p-2.5"><span className="h-1.5 w-full rounded-full bg-paper/50" /></span>
      </motion.div>
      <motion.div {...pop(1)} className="flex items-start gap-2.5">
        <span className="text-brass"><ServiceIcon name="ai" className="size-7" /></span>
        <span className="flex flex-1 flex-col gap-1.5 border border-line bg-card p-2.5">
          <Line width="92%" i={3} className="bg-brass-soft" />
          <Line width="74%" i={5} className="bg-brass-soft" />
          <Line width="48%" i={7} className="bg-brass-soft" />
        </span>
      </motion.div>
    </div>
  )
}

function Auto() {
  const { t } = useI18n()
  const reduce = useReducedMotion()
  return (
    <div className="relative flex h-full items-center justify-between">
      <span className="absolute inset-x-6 top-1/2 h-px bg-line" />
      {!reduce && (
        <motion.span
          className="absolute top-1/2 -mt-[3px] size-1.5 rounded-full bg-brass-soft"
          initial={{ left: '8%' }}
          animate={{ left: '92%' }}
          transition={{ duration: 1.5, ease: 'easeInOut', repeat: Infinity }}
        />
      )}
      {['1C', 'API', t('tag.notif')].map((label, i) => (
        <motion.span key={label} {...pop(i)} className="relative border border-line bg-card px-2.5 py-2">
          <Label className="!text-ink">{label}</Label>
        </motion.span>
      ))}
    </div>
  )
}

function Landing() {
  return (
    <div className="flex h-full items-center justify-center gap-6">
      <div className="flex w-[46%] flex-col gap-2">
        <Line width="100%" className="bg-ink" />
        <Line width="72%" i={1} className="bg-ink" />
        <Line width="84%" i={2} />
        <motion.span {...pop(3)} className="mt-1 block h-5 w-20 bg-brass-soft" />
      </div>
      <motion.div {...pop(1)} className="flex h-full w-[68px] flex-col gap-1.5 rounded-[6px] border border-ink p-2">
        <span className="h-9 bg-paper" />
        <span className="h-1 w-4/5 rounded-full bg-line" />
        <span className="h-1 w-3/5 rounded-full bg-line" />
        <span className="mt-auto h-3 bg-brass-soft" />
      </motion.div>
    </div>
  )
}

function Bot() {
  const { t } = useI18n()
  return (
    <div className="flex h-full flex-col justify-center gap-2 text-xs">
      <motion.span {...pop(0)} className="self-end rounded-[10px] rounded-br-none bg-ink px-3 py-1.5 text-paper">{t('tag.orders')}</motion.span>
      <motion.span {...pop(1)} className="self-start rounded-[10px] rounded-bl-none border border-line bg-card px-3 py-1.5">{t('tag.book')}</motion.span>
      <motion.span {...pop(2)} className="self-start border border-brass-soft px-3 py-1.5 font-mono text-[10px] text-brass">Click · Payme</motion.span>
    </div>
  )
}

function Shop() {
  return (
    <div className="flex h-full items-center gap-2.5">
      {[0, 1, 2].map((i) => (
        <motion.div key={i} {...pop(i)} className="flex h-full flex-1 flex-col gap-1.5 border border-line bg-card p-2">
          <span className="flex-1 bg-paper-2" />
          <span className="h-1 w-4/5 rounded-full bg-line" />
          <span className="h-1 w-2/5 rounded-full bg-brass-soft" />
        </motion.div>
      ))}
      <motion.div {...pop(3)} className="relative ml-1 text-ink">
        <ServiceIcon name="shop" className="size-8" />
        <span className="absolute -right-1.5 -top-1.5 grid size-4 place-items-center rounded-full bg-brass-soft font-mono text-[9px] text-[#14203a]">3</span>
      </motion.div>
    </div>
  )
}

const SCENES = { erp: Erp, web: Web, ai: Ai, auto: Auto, landing: Landing, bot: Bot, shop: Shop }

/** Small animated example of each selected service. Turns through the selection and jumps to a service when it is switched on. */
export function LivePreview({ selected }) {
  const { t } = useI18n()
  const reduce = useReducedMotion()
  const ref = useRef(null)
  const inView = useInView(ref)
  const [active, setActive] = useState(selected[0] ?? null)
  const previous = useRef(selected)

  useEffect(() => {
    const added = selected.find((id) => !previous.current.includes(id))
    previous.current = selected
    setActive((cur) => added ?? (selected.includes(cur) ? cur : selected[0] ?? null))
  }, [selected])

  useEffect(() => {
    if (reduce || !inView || selected.length < 2) return
    const timer = setInterval(() => {
      setActive((cur) => selected[(selected.indexOf(cur) + 1) % selected.length])
    }, CYCLE_MS)
    return () => clearInterval(timer)
  }, [reduce, inView, selected])

  const Scene = SCENES[active]
  return (
    <div ref={ref} aria-hidden="true" className="relative mt-4 border border-line bg-paper-2/70">
      <div className="flex items-center justify-between border-b border-line px-3 py-2">
        <Label>{t('pv.title')}</Label>
        <Label className="normal-case !text-brass">{active ? `<${active}/>` : ''}</Label>
      </div>
      <div className="relative h-[124px] overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active ?? 'empty'}
            className="absolute inset-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            {Scene ? <Scene /> : <div className="grid h-full place-items-center text-center text-[13px] text-muted">{t('pv.empty')}</div>}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
