import { useI18n } from '../i18n'
import { AboutVideo } from './AboutVideo'
import { Reveal, SectionHead } from './Reveal'

export function About() {
  const { t } = useI18n()
  return (
    <section id="about" className="py-[104px] max-[700px]:py-[72px]">
      <div className="wrap">
        <SectionHead eyebrow={t('about.eyebrow')} title={t('about.title')} sub={t('about.sub')} />

        <div className="grid items-start gap-[72px] max-[820px]:grid-cols-1 max-[820px]:gap-10 min-[821px]:grid-cols-[.9fr_1.1fr]">
          <Reveal>
            <blockquote className="relative border-l border-brass pl-7 font-display text-[clamp(26px,3vw,36px)] italic leading-[1.25]">
              {t('about.quote')}
              <cite className="mt-5 block font-mono text-xs not-italic uppercase tracking-[0.12em] text-muted">{t('about.cite')}</cite>
            </blockquote>
          </Reveal>
          <div className="flex max-w-[62ch] flex-col gap-[18px] text-[17px] text-ink-2">
            {['about.p1', 'about.p2', 'about.p3'].map((k, i) => (
              <Reveal key={k} delay={i * 0.08}><p>{t(k)}</p></Reveal>
            ))}
          </div>
        </div>

        <Reveal className="mt-[72px] max-[820px]:mt-12">
          <AboutVideo />
        </Reveal>

        <div className="mt-[72px] grid border-t border-ink min-[821px]:grid-cols-3">
          {[1, 2, 3].map((n, i) => (
            <Reveal
              key={n}
              delay={i * 0.1}
              className={`group relative pt-7 min-[821px]:pr-7 ${i > 0 ? 'min-[821px]:border-l min-[821px]:border-line min-[821px]:pl-7' : ''} max-[820px]:pb-6 ${i > 0 ? 'max-[820px]:border-t max-[820px]:border-line' : ''}`}
            >
              <span className="absolute left-0 top-[-1px] h-[2px] w-full origin-left scale-x-0 bg-brass transition-transform duration-500 group-hover:scale-x-100" />
              <h3 className="mb-2.5 text-2xl transition-colors group-hover:text-brass">{t(`val.${n}t`)}</h3>
              <p className="text-[15px] text-ink-2">{t(`val.${n}p`)}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
