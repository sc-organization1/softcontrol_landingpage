/** The SoftControl mark: a geometric S between code brackets  < S >  */
export function LogoMark({ className = 'size-10', sColor = 'var(--ink)', bracketColor = 'var(--brass-soft)', animated = false }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <g
        className={animated ? 'transition-transform duration-300 group-hover:-translate-x-1' : ''}
        fill="none" stroke={bracketColor} strokeWidth="6.4" strokeLinecap="round" strokeLinejoin="round"
      >
        <path d="M25 30 9 50l16 20" />
      </g>
      <g
        className={animated ? 'transition-transform duration-300 group-hover:translate-x-1' : ''}
        fill="none" stroke={bracketColor} strokeWidth="6.4" strokeLinecap="round" strokeLinejoin="round"
      >
        <path d="M75 30 91 50 75 70" />
      </g>
      <path d="M61 39a11 11 0 1 0-11 11 11 11 0 1 1-11 11" fill="none" stroke={sColor} strokeWidth="8.6" strokeLinecap="round" />
    </svg>
  )
}

export function Logo({ onBand = false }) {
  return (
    <a href="#top" className="group flex items-center gap-3 no-underline" aria-label="SoftControl">
      <LogoMark className="size-10 shrink-0" sColor={onBand ? 'var(--on-band)' : 'var(--ink)'} animated />
      <span className="leading-none max-[340px]:hidden">
        <b className={`block font-display text-2xl font-semibold ${onBand ? 'text-on-band' : 'text-ink'}`}>SoftControl</b>
        <small className={`mt-1 block text-[9.5px] font-semibold tracking-[0.26em] max-[420px]:hidden ${onBand ? 'text-on-band-2' : 'text-muted'}`}>
          IT SOLUTIONS
        </small>
      </span>
    </a>
  )
}
