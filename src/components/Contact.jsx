import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useI18n } from '../i18n'
import { COMPANY, SERVICES } from '../config'
import { sendRequest } from '../lib/sendRequest'
import { formatEmail, formatName, formatPhone, formatText, isValidEmail, isValidName, isValidPhone } from '../lib/format'
import { Drift } from './Background'
import { FormattedInput } from './FormattedInput'
import { Arrow } from './Icons'
import { Reveal } from './Reveal'

function CopyRow({ label, value, href, onCopied }) {
  const { t } = useI18n()
  const copy = async (e) => {
    const el = e.currentTarget.parentElement.querySelector('dd')
    try {
      await navigator.clipboard.writeText(value)
      onCopied(t('m.copied'))
    } catch {
      const r = document.createRange()
      r.selectNodeContents(el)
      const s = getSelection(); s.removeAllRanges(); s.addRange(r)
      onCopied(t('m.copyfail'))
    }
  }
  return (
    <div className="group flex min-w-0 items-center justify-between gap-4 border-b border-band-line py-[18px]">
      <div className="min-w-0">
        <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-on-band-2">{label}</dt>
        <dd className="mt-1 text-[17px] tabular-nums [overflow-wrap:anywhere]">
          <a href={href} className="transition-colors hover:text-brass-soft">{value}</a>
        </dd>
      </div>
      <button
        type="button"
        onClick={copy}
        className="shrink-0 cursor-pointer border border-band-line px-[11px] py-[7px] font-mono text-[11px] uppercase tracking-[0.08em] text-on-band transition-colors hover:border-brass-soft hover:text-brass-soft"
      >
        {t('ct.copy')}
      </button>
    </div>
  )
}

const inputBase = 'w-full rounded-none border-0 bg-transparent py-2.5 text-base text-on-band outline-none placeholder:text-on-band-2/50'
const inputCls = `${inputBase} border-b border-band-line transition-colors focus:border-brass-soft`
const MESSAGE_MAX = 1000

function Field({ id, label, error, full, children }) {
  return (
    <div className={`flex min-w-0 flex-col gap-[7px] ${full ? 'col-span-full' : ''}`}>
      <label htmlFor={id} className="font-mono text-[11px] uppercase tracking-[0.12em] text-on-band-2">{label}</label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.span initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-[12.5px] text-[#E4A08F]">
            {error}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  )
}

/** Field errors for the current form values */
function validate(form, t) {
  const errs = {}
  if (!isValidName(form.name)) errs.name = t('m.req')
  if (!isValidPhone(form.phone)) errs.phone = t('m.phone')
  if (form.email && !isValidEmail(form.email)) errs.email = t('m.email')
  return errs
}

export function Contact({ selected, toggle }) {
  const { t } = useI18n()
  const [form, setForm] = useState({ name: '', company: '', phone: '', email: '', message: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [toast, setToast] = useState(null)

  const set = (k) => (value) => {
    setForm((f) => ({ ...f, [k]: value }))
    setErrors((cur) => (cur[k] ? { ...cur, [k]: undefined } : cur))
  }
  // Delete just before a space would only remove the space, which formatting puts back: step over it
  const skipSpace = (e) => {
    const { selectionStart: start, selectionEnd: end, value } = e.target
    if (e.key === 'Delete' && start === end && value[start] === ' ') e.target.setSelectionRange(start + 1, start + 1)
  }
  const showToast = (m) => { setToast(m); clearTimeout(window.__scToast); window.__scToast = setTimeout(() => setToast(null), 1800) }

  const submit = async (e) => {
    e.preventDefault()
    const errs = validate(form, t)
    setErrors(errs)
    if (Object.keys(errs).length) {
      document.getElementById(`f-${Object.keys(errs)[0]}`)?.focus()
      return
    }
    setStatus('sending')
    try {
      await sendRequest({
        ...form,
        name: form.name.trim(),
        company: form.company.trim(),
        phone: `+998 ${form.phone}`,
        message: form.message.trim(),
        services: selected.map((id) => t(`s.${id}`)),
      })
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contact" className="relative isolate overflow-hidden bg-band py-[104px] text-on-band max-[700px]:py-[72px]">
      <Drift band />
      <div className="wrap grid gap-[72px] max-[900px]:grid-cols-1 max-[900px]:gap-12 min-[901px]:grid-cols-[.85fr_1.15fr]">
        <Reveal>
          <div className="eyebrow !text-brass-soft">{t('ct.eyebrow')}</div>
          <h2 className="mb-[22px] mt-[18px] text-[clamp(34px,4.4vw,54px)] leading-[1.08]">{t('ct.title')}</h2>
          <p className="max-w-[44ch] text-on-band-2">{t('ct.intro')}</p>
          <dl className="mt-10 flex flex-col border-t border-band-line">
            <CopyRow label={t('ct.phone')} value={COMPANY.phone} href={COMPANY.phoneHref} onCopied={showToast} />
            <CopyRow label={t('ct.email')} value={COMPANY.email} href={`mailto:${COMPANY.email}`} onCopied={showToast} />
            <div className="border-b border-band-line py-[18px]">
              <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-on-band-2">{t('ct.addr')}</dt>
              <dd className="mt-1 text-[17px]">{t('ct.addrV')}</dd>
            </div>
            <div className="border-b border-band-line py-[18px]">
              <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-on-band-2">{t('ct.team')}</dt>
              <dd className="mt-1 text-[17px]">{t('ct.teamV')}</dd>
            </div>
          </dl>
        </Reveal>

        <Reveal delay={0.1}>
          <form
            onSubmit={submit}
            noValidate
            className="grid min-w-0 grid-cols-2 gap-x-5 gap-y-[18px] border border-band-line bg-band-2 p-9 max-[560px]:grid-cols-1 max-[560px]:px-5 max-[560px]:py-6"
          >
            <AnimatePresence mode="wait">
              {status === 'sent' ? (
                <motion.div
                  key="sent"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="col-span-full border border-brass-soft p-7"
                >
                  <motion.svg viewBox="0 0 40 40" className="mb-4 size-10 text-brass-soft" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="20" cy="20" r="18" strokeOpacity=".4" />
                    <motion.path d="m12 20.5 5.5 5.5L29 14" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 0.2 }} />
                  </motion.svg>
                  <h3 className="mb-2 text-[28px]">{form.name.trim().split(' ')[0]}, {t('m.sentT')}</h3>
                  <p className="text-on-band-2">{t('m.sentP')}</p>
                </motion.div>
              ) : (
                <motion.div key="form" className="contents" exit={{ opacity: 0 }}>
                  <Field id="f-name" label={t('f.name')} error={errors.name}>
                    <FormattedInput
                      id="f-name" className={inputCls} value={form.name} format={formatName} onValueChange={set('name')}
                      autoComplete="name" autoCapitalize="words" maxLength={60} aria-invalid={Boolean(errors.name)}
                    />
                  </Field>
                  <Field id="f-company" label={t('f.company')}>
                    <FormattedInput
                      id="f-company" className={inputCls} value={form.company} format={formatText} onValueChange={set('company')}
                      autoComplete="organization" maxLength={80}
                    />
                  </Field>
                  <Field id="f-phone" label={t('f.phone')} error={errors.phone}>
                    <div className="flex items-baseline gap-2 border-b border-band-line transition-colors focus-within:border-brass-soft">
                      <label htmlFor="f-phone" className="text-base tabular-nums text-on-band-2">+998</label>
                      <FormattedInput
                        id="f-phone" type="tel" className={`${inputBase} tabular-nums`} value={form.phone} format={formatPhone} onValueChange={set('phone')}
                        onKeyDown={skipSpace} autoComplete="tel" inputMode="tel" placeholder="90 123 45 67" aria-invalid={Boolean(errors.phone)}
                      />
                    </div>
                  </Field>
                  <Field id="f-email" label={t('f.email')} error={errors.email}>
                    <FormattedInput
                      id="f-email" className={inputCls} value={form.email} format={formatEmail} onValueChange={set('email')}
                      autoComplete="email" inputMode="email" autoCapitalize="none" spellCheck={false} maxLength={100}
                      placeholder="name@company.uz" aria-invalid={Boolean(errors.email)}
                    />
                  </Field>

                  <div className="col-span-full flex flex-col gap-[7px]">
                    <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-on-band-2">{t('f.interest')}</span>
                    <div className="flex flex-wrap gap-2">
                      {SERVICES.map((s) => {
                        const on = selected.includes(s.id)
                        return (
                          <motion.button
                            key={s.id}
                            type="button"
                            whileTap={{ scale: 0.95 }}
                            aria-pressed={on}
                            onClick={() => toggle(s.id)}
                            className={`cursor-pointer rounded-full border px-[13px] py-2 text-[13px] transition-colors duration-200 ${
                              on ? 'border-on-band bg-on-band text-band' : 'border-band-line text-on-band-2 hover:border-brass-soft hover:text-on-band'
                            }`}
                          >
                            {t(`s.${s.id}`)}
                          </motion.button>
                        )
                      })}
                    </div>
                  </div>

                  <Field id="f-msg" label={t('f.msg')} full>
                    <FormattedInput
                      as="textarea" id="f-msg" className={`${inputCls} min-h-[110px] resize-y`} value={form.message} format={formatText} onValueChange={set('message')}
                      maxLength={MESSAGE_MAX}
                    />
                    <span className="self-end font-mono text-[11px] tabular-nums text-on-band-2">{form.message.length} / {MESSAGE_MAX}</span>
                  </Field>

                  <div className="col-span-full mt-2 flex flex-wrap items-center justify-between gap-4">
                    <small className="max-w-[36ch] text-[13px] text-on-band-2">
                      {status === 'error' ? <span className="text-[#E4A08F]">{t('m.fail')}</span> : t('f.note')}
                    </small>
                    <button type="submit" disabled={status === 'sending'} className="btn-brass group">
                      {status === 'sending' ? t('f.sending') : t('f.send')} <Arrow />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </Reveal>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            role="status"
            initial={{ opacity: 0, y: 12, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 12, x: '-50%' }}
            className="fixed left-1/2 z-40 bg-ink px-[18px] py-2.5 text-sm text-paper"
            style={{ bottom: 'calc(24px + env(safe-area-inset-bottom, 0px))' }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
