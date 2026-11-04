import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useI18n } from '../i18n'
import { useMedia } from '../lib/useMedia'
import { SectionHead } from './Reveal'

const ITEMS = [1, 2, 3, 4, 5, 6]

function Item({ n, open, onToggle }) {
  const { t } = useI18n()
  const id = `faq-${n}`
  return (
    <div className="border-b border-line">
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={onToggle}
          className="group flex w-full cursor-pointer items-start justify-between gap-5 py-[22px] text-left font-display text-[22px] leading-[1.3]"
        >
          <span className="transition-colors duration-300 group-hover:text-brass">{t(`q.${n}`)}</span>
          <motion.span
            animate={{ rotate: open ? 45 : 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full border border-line font-body text-lg leading-none text-brass transition-colors group-hover:border-brass"
            aria-hidden="true"
          >
            +
          </motion.span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={id}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="max-w-[60ch] pb-[22px] text-[15.5px] text-ink-2">{t(`a.${n}`)}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function Faq() {
  const { t } = useI18n()
  const [open, setOpen] = useState(1)
  const wide = useMedia('(min-width: 821px)')
  // two columns on desktop (1-3-5 | 2-4-6), one list in order on phones
  const cols = wide ? [ITEMS.filter((_, i) => i % 2 === 0), ITEMS.filter((_, i) => i % 2 === 1)] : [ITEMS]
  return (
    <section id="faq" className="bg-paper-2 py-[104px] max-[700px]:py-[72px]">
      <div className="wrap">
        <SectionHead eyebrow={t('faq.eyebrow')} title={t('faq.title')} sub={t('faq.sub')} />
        <div className="grid gap-x-12 border-t border-ink min-[821px]:grid-cols-2">
          {cols.map((col, c) => (
            <div key={c}>
              {col.map((n) => (
                <Item key={n} n={n} open={open === n} onToggle={() => setOpen(open === n ? null : n)} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
