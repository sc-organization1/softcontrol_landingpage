import { motion, useReducedMotion } from 'motion/react'
import { useI18n } from '../i18n'
import { ControlPanel } from './ControlPanel'
import { Arrow } from './Icons'
import { TICKER } from '../config'

const ease = [0.22, 1, 0.36, 1]

/** Splits a string into words that rise into place one after another */
function Words({ text, className = '', startIndex = 0 }) {
  const reduce = useReducedMotion()
  return text.split(/(\s+)/).map((w, i) =>
    /^\s+$/.test(w) || !w ? (
      w
    ) : (
      <span key={`${w}-${i}`} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
        <motion.span
          className={`inline-block ${className}`}
          initial={reduce ? false : { y: '105%' }}
          animate={{ y: 0 }}
          transition={{ duration: 0.9, delay: 0.15 + (startIndex + i / 2) * 0.06, ease }}
        >
          {w}
        </motion.span>
      </span>
    ),
  )
}

export function Hero({ selected, toggle }) {
  const { t, lang } = useI18n()
  const a = t('hero.titleA'), em = t('hero.titleEm'), b = t('hero.titleB')
  const aCount = a.split(/\s+/).filter(Boolean).length

  return (
    <>
      <div className="wrap grid items-center gap-16 py-[84px] pb-[72px] max-[900px]:grid-cols-1 max-[900px]:gap-12 max-[900px]:py-14 min-[901px]:grid-cols-[1.1fr_.9fr]">
        <div key={lang}>
          <motion.div className="eyebrow" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease }}>
            {t('hero.eyebrow')}
          </motion.div>

          <h1 className="mb-[26px] mt-[22px] text-[clamp(40px,6vw,78px)] leading-[1.04]">
            <Words text={a} />
            <Words text={em} className="italic text-brass" startIndex={aCount} />
            {b && <Words text={b} startIndex={aCount + 2} />}
            <span className="caret ml-1 inline-block h-[0.8em] w-[3px] translate-y-[0.06em] bg-brass-soft align-baseline" aria-hidden="true" />
          </h1>

          <motion.p
            className="max-w-[52ch] text-lg text-ink-2"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55, ease }}
          >
            {t('hero.lede')}
          </motion.p>

          <motion.div
            className="mt-9 flex flex-wrap gap-3.5"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease }}
          >
            <a href="#contact" className="btn-primary group">{t('cta.discuss')} <Arrow /></a>
            <a href="#services" className="btn-ghost">{t('cta.services')}</a>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 30, rotate: 0.6 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ duration: 1, delay: 0.3, ease }}>
          <ControlPanel selected={selected} toggle={toggle} />
        </motion.div>
      </div>

      {/* Ticker of technologies and services */}
      <div className="marquee overflow-hidden border-t border-line bg-paper-2 py-3.5" aria-hidden="true">
        <div className="marquee-track flex w-max gap-10 whitespace-nowrap font-mono text-xs uppercase tracking-[0.14em] text-muted">
          {[...TICKER, ...TICKER].map((w, i) => (
            <span key={i} className="flex items-center gap-10">
              <span className="transition-colors hover:text-ink">{w}</span>
              <span className="text-brass-soft">&lt;/&gt;</span>
            </span>
          ))}
        </div>
      </div>
    </>
  )
}
