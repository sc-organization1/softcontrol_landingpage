/**
 * Sends a contact-form request.
 *
 * Set VITE_FORM_ENDPOINT in a .env file to a URL that accepts a JSON POST
 * (your own API route, a serverless function that forwards to a Telegram bot, etc.).
 * Never put a Telegram bot token in frontend code: anyone can read it.
 *
 * Without an endpoint the request is only logged to the console, so the form
 * can be tested locally.
 */
const ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT

export async function sendRequest(data) {
  if (!ENDPOINT) {
    console.info('[SoftControl] VITE_FORM_ENDPOINT is not set. Request data:', data)
    await new Promise((r) => setTimeout(r, 700))
    return { ok: true, demo: true }
  }
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data, sentAt: new Date().toISOString(), page: location.href }),
  })
  if (!res.ok) throw new Error(`Request failed: ${res.status}`)
  return { ok: true }
}
