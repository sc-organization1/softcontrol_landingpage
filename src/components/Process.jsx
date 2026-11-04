import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useI18n } from '../i18n'
import { useMedia } from '../lib/useMedia'
import { SectionHead } from './Reveal'

const NUMS = ['I.', 'II.', 'III.', 'IV.']
const ease = [0.22, 1, 0.36, 1]
const PIN_QUERY = '(min-width: 901px) and (min-height: 640px)'
const STAGE_STEP = 0.21 // share of the pinned scroll between one stage and the next
const STAGE_FADE = 0.12

const stageClass = (i) =>
  `group relative pt-8 min-[901px]:pr-7 ${i > 0 ? 'min-[901px]:border-l min-[901px]:border-line min-[901px]:pl-7' : ''} ${i % 2 === 1 ? 'min-[561px]:max-[900px]:border-l min-[561px]:max-[900px]:border-line min-[561px]:max-[900px]:pl-7' : ''} ${i > 0 ? 'max-[560px]:mt-8 max-[560px]:border-t max-[560px]:border-line' : ''}`

const GRID = 'grid max-[560px]:grid-cols-1 min-[561px]:grid-cols-2 min-[561px]:gap-y-11 min-[901px]:grid-cols-4 min-[901px]:gap-y-0'
const RULE = 'absolute left-0 right-0 top-0 h-px origin-left bg-brass max-[900px]:hidden'

function StageText({ i, num, dot }) {
  const { t } = useI18n()
  return (
    <>
      <span className="absolute -top-[5px] left-0 hidden size-[9px] overflow-hidden rounded-full border border-brass bg-paper transition-colors duration-300 group-hover:bg-brass min-[901px]:block" style={i > 0 ? { left: '-5px' } : undefined}>
        {dot}
      </span>
      <div className="font-display text-[56px] italic leading-none text-brass transition-transform duration-500 group-hover:-translate-y-1">{num}</div>
      <h3 className="mb-2.5 mt-[18px] text-2xl">{t(`st.${i + 1}t`)}</h3>
      <p className="text-[15px] text-ink-2">{t(`st.${i + 1}p`)}</p>
    </>
  )
}

function PinnedStage({ i, num, progress }) {
  // A function here keeps the values in JS: Motion's browser-driven scroll animation fades short opacity ranges back out
  const shown = useTransform(progress, (p) => Math.min(Math.max((p - (0.03 + i * STAGE_STEP)) / STAGE_FADE, 0), 1))
  const opacity = useTransform(shown, [0, 1], [0.25, 1])
  const y = useTransform(shown, [0, 1], [28, 0])
  return (
    <motion.div className={stageClass(i)} style={{ opacity, y }}>
      <StageText i={i} num={num} dot={<motion.span className="block size-full rounded-full bg-brass" style={{ scale: shown }} />} />
    </motion.div>
  )
}

/** Holds the section on screen while scrolling walks through the stages and draws the timeline */
function PinnedProcess() {
  const { t } = useI18n()
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const rule = useTransform(scrollYProgress, [0.02, 0.9], [0, 1])
  return (
    <section id="process" ref={ref} className="relative h-[320vh]">
      <div className="sticky top-16 flex h-[calc(100svh-64px)] flex-col justify-center">
        <div className="wrap w-full">
          <SectionHead eyebrow={t('proc.eyebrow')} title={t('proc.title')} sub={t('proc.sub')} />
          <div className="relative">
            <motion.div className={RULE} style={{ scaleX: rule }} />
            <div className={GRID}>
              {NUMS.map((num, i) => <PinnedStage key={num} i={i} num={num} progress={scrollYProgress} />)}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function FlowingProcess() {
  const { t } = useI18n()
  return (
    <section id="process" className="py-[104px] max-[700px]:py-[72px]">
      <div className="wrap">
        <SectionHead eyebrow={t('proc.eyebrow')} title={t('proc.title')} sub={t('proc.sub')} />
        <div className="relative">
          {/* timeline rule that draws itself across the four stages */}
          <motion.div
            className={RULE}
            initial={{ scaleX: 0.15 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1.4, ease }}
          />
          <div className={GRID}>
            {NUMS.map((num, i) => (
              <motion.div
                key={num}
                initial={{ opacity: 0.25, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, delay: 0.15 * i, ease }}
                className={stageClass(i)}
              >
                <StageText i={i} num={num} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function Process() {
  const reduce = useReducedMotion()
  const wide = useMedia(PIN_QUERY)
  return wide && !reduce ? <PinnedProcess /> : <FlowingProcess />
}
