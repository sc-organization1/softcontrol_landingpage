import { useCallback, useState } from 'react'
import { MotionConfig } from 'motion/react'
import { I18nProvider } from './i18n'
import { DEFAULT_SELECTED, SERVICES } from './config'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Ledger } from './components/Ledger'
import { About } from './components/About'
import { Services } from './components/Services'
import { Process } from './components/Process'
import { Faq } from './components/Faq'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'
import { Cursor } from './components/Cursor'
import { Background } from './components/Background'

export default function App() {
  // Services chosen in the hero control panel, the service cards and the contact form are one shared list
  const [selected, setSelected] = useState(DEFAULT_SELECTED)
  const toggle = useCallback(
    (id) => setSelected((cur) => {
      const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]
      return SERVICES.map((s) => s.id).filter((x) => next.includes(x)) // keep display order
    }),
    [],
  )
  const order = useCallback((id) => {
    setSelected((cur) => (cur.includes(id) ? cur : SERVICES.map((s) => s.id).filter((x) => x === id || cur.includes(x))))
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  return (
    <I18nProvider>
      <MotionConfig reducedMotion="user">
        <Background />
        <Header />
        <main id="top">
          <Hero selected={selected} toggle={toggle} />
          <Ledger />
          <About />
          <Services onOrder={order} />
          <Process />
          <Faq />
          <Contact selected={selected} toggle={toggle} />
        </main>
        <Footer />
        <Cursor />
      </MotionConfig>
    </I18nProvider>
  )
}
