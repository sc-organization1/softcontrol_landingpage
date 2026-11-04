// Input formatters for the contact form. Each one takes raw text and returns the clean, formatted text.

const PHONE_LENGTH = 9 // digits after +998

/** The national digits of a phone number. A full +998 number (typed, pasted or autofilled) loses its prefix. */
export function phoneDigits(value) {
  let digits = value.replace(/\D/g, '')
  if (digits.length >= 12 && digits.startsWith('998')) digits = digits.slice(3)
  return digits.slice(0, PHONE_LENGTH)
}

/** "901234567" -> "90 123 45 67" */
export function formatPhone(value) {
  const d = phoneDigits(value)
  return [d.slice(0, 2), d.slice(2, 5), d.slice(5, 7), d.slice(7, 9)].filter(Boolean).join(' ')
}

/** Letters in any alphabet, spaces, hyphens and the apostrophes used in Uzbek names; each word capitalised */
export function formatName(value) {
  return value
    .replace(/[^\p{L}\p{M}\s'’‘ʼʻ-]/gu, '')
    .replace(/\s+/g, ' ')
    .replace(/^[\s'’‘ʼʻ-]+/, '')
    .replace(/(^|[\s-])(\p{L})/gu, (_, before, letter) => before + letter.toUpperCase())
}

/** Lowercase, characters valid in an address only, one @ */
export function formatEmail(value) {
  const clean = value.toLowerCase().replace(/[^a-z0-9._%+@-]/g, '')
  const at = clean.indexOf('@')
  return at < 0 ? clean : clean.slice(0, at + 1) + clean.slice(at + 1).replace(/@/g, '')
}

/** No leading whitespace, no repeated spaces; line breaks are kept */
export function formatText(value) {
  return value.replace(/^\s+/, '').replace(/[ \t]{2,}/g, ' ')
}

export const isValidName = (value) => (value.match(/\p{L}/gu) ?? []).length >= 2
export const isValidPhone = (value) => phoneDigits(value).length === PHONE_LENGTH
export const isValidEmail = (value) => /^[a-z0-9._%+-]+@[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,}$/.test(value)
