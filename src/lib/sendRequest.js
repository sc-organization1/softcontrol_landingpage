/**
 * Sends a contact-form request to api/contact.js, which forwards it to Telegram.
 * The bot token lives on the server: never put it in frontend code, anyone can read it.
 */
export async function sendRequest(data) {
  const res = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data, page: location.href }),
  })
  if (!res.ok) throw new Error(`Request failed: ${res.status}`)
  return { ok: true }
}
