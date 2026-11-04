/**
 * Receives a contact-form request and forwards it to Telegram.
 *
 * Runs on the server, so the bot token stays out of the browser. Reads
 * TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID from the environment (.env locally,
 * the host's environment variables in production).
 *
 * Deployed as a Vercel function; vite.config.js serves it during `npm run dev`.
 */
import { isValidEmail, isValidName, isValidPhone } from '../src/lib/format.js'

const LIMITS = { name: 60, company: 80, phone: 30, email: 100, message: 1000, page: 500 }
const MAX_SERVICES = 20
const MAX_SERVICE_LENGTH = 60
const TELEGRAM_TIMEOUT_MS = 8000

function reply(res, status, body) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(body))
}

function readBody(req) {
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    return body && typeof body === 'object' ? body : null
  } catch {
    return null // the body was not valid JSON
  }
}

/** Trimmed text fields and services, or null if anything is malformed or too long */
function clean(body) {
  const data = {}
  for (const [key, limit] of Object.entries(LIMITS)) {
    const value = body[key] ?? ''
    if (typeof value !== 'string' || value.length > limit) return null
    data[key] = value.trim()
  }
  const services = body.services ?? []
  const validServices = Array.isArray(services)
    && services.length <= MAX_SERVICES
    && services.every((s) => typeof s === 'string' && s.length <= MAX_SERVICE_LENGTH)
  if (!validServices) return null

  if (!isValidName(data.name) || !isValidPhone(data.phone)) return null
  if (data.email && !isValidEmail(data.email)) return null
  return { ...data, services }
}

function buildMessage({ name, company, phone, email, services, message, page }) {
  const time = new Date().toLocaleString('en-GB', { timeZone: 'Asia/Tashkent' })
  const details = [
    `Name: ${name}`,
    company && `Company: ${company}`,
    `Phone: ${phone}`,
    email && `Email: ${email}`,
    services.length > 0 && `Services: ${services.join(', ')}`,
  ]
  const footer = [page && `Page: ${page}`, `Time: ${time} (Tashkent)`]
  return [
    '📩 New website request',
    details.filter(Boolean).join('\n'),
    message && `Message:\n${message}`,
    footer.filter(Boolean).join('\n'),
  ].filter(Boolean).join('\n\n')
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return reply(res, 405, { ok: false })

  const body = readBody(req)
  if (!body) return reply(res, 400, { ok: false })

  // Hidden field real visitors never see: pretend it worked so bots don't adapt
  if (body.company_site) return reply(res, 200, { ok: true })

  const data = clean(body)
  if (!data) return reply(res, 400, { ok: false })

  const { TELEGRAM_BOT_TOKEN: token, TELEGRAM_CHAT_ID: chatId } = process.env
  if (!token || !chatId) {
    console.error('[contact] TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is not set')
    return reply(res, 500, { ok: false })
  }

  try {
    const telegram = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: buildMessage(data) }),
      signal: AbortSignal.timeout(TELEGRAM_TIMEOUT_MS),
    })
    if (!telegram.ok) {
      console.error(`[contact] Telegram refused the message: HTTP ${telegram.status}`)
      return reply(res, 502, { ok: false })
    }
  } catch (err) {
    // Log only the error type: the message can contain the URL, and so the token
    console.error(`[contact] Could not reach Telegram: ${err.name}`)
    return reply(res, 502, { ok: false })
  }

  return reply(res, 200, { ok: true })
}
