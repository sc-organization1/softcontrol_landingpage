// Company details used across the site. Edit here, not in components.
export const COMPANY = {
  name: 'SoftControl',
  founded: 2026,
  team: 5,
  phone: '+998 93 331 55 57',
  phoneHref: 'tel:+998933315557',
  email: 'shokhuk006@gmail.com',
}

// Service ids in display order. Texts live in src/i18n/*.js under s.<id>, svc.<id>.t, svc.<id>.p
export const SERVICES = [
  { id: 'erp', icon: 'erp', tags: ['tag.sales', 'tag.stock', 'tag.fin', 'tag.hr', 'tag.rep'], wide: true },
  { id: 'web', icon: 'web', tags: ['UZ · RU · EN', 'tag.admin', 'SEO'] },
  { id: 'ai', icon: 'ai', tags: ['tag.assist', 'tag.docs', 'tag.anal'] },
  { id: 'auto', icon: 'auto', tags: ['1C', 'API', 'tag.notif'] },
  { id: 'landing', icon: 'landing', tags: ['tag.ads', 'tag.forms', 'tag.anim'] },
  { id: 'bot', icon: 'bot', tags: ['tag.orders', 'Click · Payme', 'tag.book'] },
  { id: 'shop', icon: 'shop', tags: ['tag.cat', 'tag.pay', 'tag.del'] },
]

// Services switched on in the hero control panel by default
export const DEFAULT_SELECTED = ['erp', 'web', 'ai', 'bot']

// Words for the ticker under the hero
export const TICKER = ['ERP', 'CRM', 'React', 'Next.js', 'Node.js', 'Python', 'AI', 'Telegram Bot API', 'PostgreSQL', 'Click', 'Payme', '1C', 'Tailwind CSS', 'Docker']
