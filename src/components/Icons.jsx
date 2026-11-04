const paths = {
  erp: <><rect x="3" y="4" width="28" height="26" rx="1" /><path d="M3 11h28M12 11v19M16 16h11M16 21h11M16 26h7" /></>,
  web: <><rect x="3" y="6" width="28" height="22" rx="1" /><path d="M3 11h28M8 16h10M8 20h14M8 24h8" /></>,
  ai: <><path d="M17 4v4M17 26v4M4 17h4M26 17h4" /><rect x="9" y="9" width="16" height="16" rx="2" /><path d="M14 20.5 15.5 13h3l1.5 7.5M14.6 18h4.8" /></>,
  auto: <><circle cx="17" cy="17" r="5" /><path d="M17 3v5M17 26v5M3 17h5M26 17h5M7 7l3.5 3.5M23.5 23.5 27 27M7 27l3.5-3.5M23.5 10.5 27 7" /></>,
  landing: <><rect x="8" y="3" width="18" height="28" rx="1" /><path d="M12 9h10M12 13h6M12 25h10v-6H12z" /></>,
  bot: <><path d="M30 6 4 16l8 3 3 9 4.5-6 7 5L30 6Z" /><path d="m12 19 12-8" /></>,
  shop: <><path d="M4 6h4l3 15h15l3-11H10" /><circle cx="13" cy="27" r="2" /><circle cx="24" cy="27" r="2" /></>,
}

export function ServiceIcon({ name, className = 'size-9' }) {
  return (
    <svg viewBox="0 0 34 34" fill="none" stroke="currentColor" strokeWidth="1.4" className={className} aria-hidden="true">
      {paths[name]}
    </svg>
  )
}

/** 18px line icons for the header buttons */
const HeaderIcon = ({ children }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
)

export const SunIcon = () => <HeaderIcon><circle cx="9" cy="9" r="3.4" /><path d="M9 1.5v1.8M9 14.7v1.8M1.5 9h1.8M14.7 9h1.8M3.7 3.7 5 5M13 13l1.3 1.3M3.7 14.3 5 13M13 5l1.3-1.3" /></HeaderIcon>
export const MoonIcon = () => <HeaderIcon><path d="M15.5 10.6A6.8 6.8 0 0 1 7.4 2.5a6.8 6.8 0 1 0 8.1 8.1Z" /></HeaderIcon>
export const ExpandIcon = () => <HeaderIcon><path d="M2 6.5V2h4.5M11.5 2H16v4.5M16 11.5V16h-4.5M6.5 16H2v-4.5" /></HeaderIcon>
export const CompressIcon = () => <HeaderIcon><path d="M6.5 2v4.5H2M16 6.5h-4.5V2M11.5 16v-4.5H16M2 11.5h4.5V16" /></HeaderIcon>

/** Video player icons, sized by className */
const PlayerIcon = ({ className, solid = false, children }) => (
  <svg viewBox="0 0 24 24" fill={solid ? 'currentColor' : 'none'} stroke={solid ? 'none' : 'currentColor'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    {children}
  </svg>
)

export const PlayIcon = ({ className }) => <PlayerIcon solid className={className}><path d="M7 4.6v14.8a1 1 0 0 0 1.5.86l12.3-7.4a1 1 0 0 0 0-1.72L8.5 3.74A1 1 0 0 0 7 4.6Z" /></PlayerIcon>
export const PauseIcon = ({ className }) => <PlayerIcon solid className={className}><rect x="5.5" y="4" width="4.6" height="16" rx="1.2" /><rect x="13.9" y="4" width="4.6" height="16" rx="1.2" /></PlayerIcon>
export const ReplayIcon = ({ className }) => <PlayerIcon className={className}><path d="M4 12a8 8 0 1 0 2.6-5.9L4 8.5M4 4v4.5h4.5" /></PlayerIcon>
export const VolumeIcon = ({ className }) => <PlayerIcon className={className}><path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5H4ZM15.5 9a4.2 4.2 0 0 1 0 6M18 6.5a7.8 7.8 0 0 1 0 11" /></PlayerIcon>
export const VolumeOffIcon = ({ className }) => <PlayerIcon className={className}><path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5H4ZM16 9.5l5 5M21 9.5l-5 5" /></PlayerIcon>

export const Arrow = ({ className = '' }) => (
  <span aria-hidden="true" className={`inline-block transition-transform duration-300 group-hover:translate-x-1 ${className}`}>→</span>
)
