import { useI18n } from '../i18n'
import { COMPANY } from '../config'
import { Logo } from './Logo'

export function Footer() {
  const { t } = useI18n()
  return (
    <footer className="border-t border-band-line bg-band py-11 text-on-band-2" style={{ paddingBottom: 'calc(44px + env(safe-area-inset-bottom, 0px))' }}>
      <div className="wrap flex flex-wrap items-center justify-between gap-6">
        <Logo onBand />
        <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-[13px] text-on-band">
          <a href={COMPANY.phoneHref} className="transition-colors hover:text-brass-soft">{COMPANY.phone}</a>
          <a href={`mailto:${COMPANY.email}`} className="transition-colors hover:text-brass-soft">{COMPANY.email}</a>
          <span>{t('ft.addr')}</span>
        </div>
        <p className="text-[13px]">© {COMPANY.founded} SoftControl. {t('ft.rights')}</p>
      </div>
    </footer>
  )
}
