import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useScroll, useSpring } from 'motion/react'
import { useI18n, LANGS } from '../i18n'
import { useTheme } from '../lib/useTheme'
import { useFullscreen } from '../lib/useFullscreen'
import { Logo } from './Logo'
import { Arrow, CompressIcon, ExpandIcon, MoonIcon, SunIcon } from './Icons'

const NAV = [
  ['about', 'nav.about'],
  ['services', 'nav.services'],
  ['process', 'nav.process'],
  ['faq', 'nav.faq'],
  ['contact', 'nav.contact'],
]

function useActiveSection(ids) {
  const [active, setActive] = useState(null)
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    ids.forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el) })
    return () => io.disconnect()
  }, [ids])
  return active
}

export function LangSwitch() {
  const { lang, setLang } = useI18n()
  return (
    <div className="flex rounded-full border border-line p-[3px]" role="group" aria-label="Language">
      {LANGS.map((l) => (
        <button
          key={l.code}
          type="button"
          onClick={() => setLang(l.code)}
          aria-pressed={lang === l.code}
          className={`relative cursor-pointer rounded-full px-2.5 py-[5px] font-mono max-[420px]:px-1.5 text-xs tracking-[0.06em] transition-colors ${lang === l.code ? 'text-paper' : 'text-muted hover:text-ink'}`}
        >
          {lang === l.code && (
            <motion.span layoutId="lang-pill" className="absolute inset-0 rounded-full bg-ink" transition={{ type: 'spring', stiffness: 500, damping: 38 }} />
          )}
          <span className="relative">{l.label}</span>
        </button>
      ))}
    </div>
  )
}

function ToolButton({ label, iconKey, children, ...props }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className="grid size-[38px] shrink-0 cursor-pointer place-items-center overflow-hidden rounded-[2px] border border-line text-ink-2 transition-colors hover:border-ink hover:text-ink"
      {...props}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={iconKey}
          className="block size-[18px]"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          transition={{ duration: 0.16 }}
        >
          {children}
        </motion.span>
      </AnimatePresence>
    </button>
  )
}

/** Theme and full screen buttons: in the bar on wider screens, in the menu on phones */
function HeaderTools({ theme, fullscreen }) {
  const { t } = useI18n()
  const dark = theme.theme === 'dark'
  return (
    <div className="flex items-center gap-2">
      <ToolButton label={t(dark ? 'nav.light' : 'nav.dark')} iconKey={theme.theme} onClick={theme.toggle}>
        {dark ? <SunIcon /> : <MoonIcon />}
      </ToolButton>
      {fullscreen.supported && (
        <ToolButton
          label={t(fullscreen.active ? 'nav.fullscreenExit' : 'nav.fullscreen')}
          iconKey={fullscreen.active ? 'exit' : 'enter'}
          aria-pressed={fullscreen.active}
          onClick={fullscreen.toggle}
        >
          {fullscreen.active ? <CompressIcon /> : <ExpandIcon />}
        </ToolButton>
      )}
    </div>
  )
}

export function Header() {
  const { t } = useI18n()
  const theme = useTheme()
  const fullscreen = useFullscreen()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const active = useActiveSection(NAV.map(([id]) => id))
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-30 border-b backdrop-blur-md transition-[background-color,box-shadow,border-color] duration-300 ${
        scrolled ? 'border-line bg-paper/90 shadow-[0_10px_30px_-24px_rgba(15,26,45,.5)]' : 'border-transparent bg-paper/70'
      }`}
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      <div className={`wrap flex items-center gap-7 transition-[height] duration-300 max-[420px]:gap-2 ${scrolled ? 'h-16' : 'h-[76px]'}`}>
        <Logo />

        <nav className="ml-auto flex gap-7 max-[1180px]:hidden" aria-label="Main">
          {NAV.map(([id, key]) => (
            <a
              key={id}
              href={`#${id}`}
              className={`group relative py-1.5 text-sm font-medium transition-colors ${active === id ? 'text-ink' : 'text-ink-2 hover:text-ink'}`}
            >
              {t(key)}
              <span
                className={`absolute inset-x-0 -bottom-px h-px origin-left bg-brass transition-transform duration-300 ${active === id ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}
              />
            </a>
          ))}
        </nav>

        <div className="max-[1180px]:ml-auto"><LangSwitch /></div>

        <div className="max-[560px]:hidden"><HeaderTools theme={theme} fullscreen={fullscreen} /></div>

        <a href="#contact" className="btn-primary group max-[1180px]:hidden">
          {t('cta.start')} <Arrow />
        </a>

        <button
          type="button"
          className="hidden size-[42px] cursor-pointer place-items-center rounded-[2px] border border-line text-ink max-[1180px]:grid"
          aria-label={t('nav.menu')}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
            <motion.path d="M2 5h14" initial={false} animate={open ? { d: 'M3 3l12 12' } : { d: 'M2 5h14' }} />
            <motion.path animate={{ opacity: open ? 0 : 1 }} d="M2 9h14" />
            <motion.path d="M2 13h14" initial={false} animate={open ? { d: 'M3 15 15 3' } : { d: 'M2 13h14' }} />
          </svg>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            className="wrap overflow-hidden min-[1180px]:hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex flex-col pb-4">
              {NAV.map(([id, key], i) => (
                <motion.a
                  key={id}
                  href={`#${id}`}
                  onClick={() => setOpen(false)}
                  className="border-b border-line py-3 text-base"
                  initial={{ x: -12, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.04 * i }}
                >
                  {t(key)}
                </motion.a>
              ))}
              <div className="mt-4 flex items-center justify-between gap-3">
                <a href="#contact" onClick={() => setOpen(false)} className="btn-primary group">
                  {t('cta.start')} <Arrow />
                </a>
                <div className="min-[561px]:hidden"><HeaderTools theme={theme} fullscreen={fullscreen} /></div>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Reading progress */}
      <motion.div className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-brass-soft" style={{ scaleX: progress }} />
    </header>
  )
}
