import assert from 'node:assert/strict'
import { afterEach, beforeEach, test } from 'node:test'
import handler from '../api/contact.js'

const VALID = {
  name: 'Aziz Karimov',
  company: 'Acme',
  phone: '+998 90 123 45 67',
  email: 'aziz@acme.uz',
  message: 'We need a CRM',
  services: ['ERP', 'CRM'],
  page: 'https://softcontrol.uz/',
}

const realFetch = globalThis.fetch
let calls
let telegramResponse

function fakeRes() {
  return {
    statusCode: 200,
    body: undefined,
    setHeader() {},
    end(text) { this.body = JSON.parse(text) },
  }
}

async function post(body, method = 'POST') {
  const res = fakeRes()
  await handler({ method, body }, res)
  return res
}

beforeEach(() => {
  calls = []
  telegramResponse = new Response('{"ok":true}', { status: 200 })
  process.env.TELEGRAM_BOT_TOKEN = 'test-token'
  process.env.TELEGRAM_CHAT_ID = '42'
  globalThis.fetch = async (url, init) => {
    calls.push({ url: String(url), payload: JSON.parse(init.body) })
    return telegramResponse
  }
})

afterEach(() => {
  globalThis.fetch = realFetch
})

test('sends a valid request to the configured Telegram chat', async () => {
  const res = await post(VALID)
  assert.equal(res.statusCode, 200)
  assert.equal(calls.length, 1)
  assert.equal(calls[0].url, 'https://api.telegram.org/bottest-token/sendMessage')
  assert.equal(calls[0].payload.chat_id, '42')
})

test('the message holds every field the visitor filled in', async () => {
  await post(VALID)
  const { text } = calls[0].payload
  for (const value of ['Aziz Karimov', 'Acme', '+998 90 123 45 67', 'aziz@acme.uz', 'We need a CRM', 'ERP, CRM', 'https://softcontrol.uz/']) {
    assert.ok(text.includes(value), `missing ${value}`)
  }
})

test('the message is plain text, so visitor input cannot be read as markup', async () => {
  await post({ ...VALID, message: '<b>hi</b> *x*' })
  assert.equal(calls[0].payload.parse_mode, undefined)
  assert.ok(calls[0].payload.text.includes('<b>hi</b> *x*'))
})

test('optional fields may be left out', async () => {
  const res = await post({ name: 'Aziz', phone: VALID.phone })
  assert.equal(res.statusCode, 200)
  assert.equal(calls.length, 1)
})

test('accepts a JSON string body', async () => {
  const res = await post(JSON.stringify(VALID))
  assert.equal(res.statusCode, 200)
})

test('rejects anything but POST', async () => {
  const res = await post(VALID, 'GET')
  assert.equal(res.statusCode, 405)
  assert.equal(calls.length, 0)
})

for (const [name, body] of Object.entries({
  'an invalid name': { ...VALID, name: 'A' },
  'an invalid phone': { ...VALID, phone: '123' },
  'an invalid email': { ...VALID, email: 'nope' },
  'a too long message': { ...VALID, message: 'x'.repeat(1001) },
  'too many services': { ...VALID, services: Array(21).fill('ERP') },
  'a non-text field': { ...VALID, name: { evil: true } },
  'a body that is not JSON': 'not json',
})) {
  test(`rejects ${name} without calling Telegram`, async () => {
    const res = await post(body)
    assert.equal(res.statusCode, 400)
    assert.equal(calls.length, 0)
  })
}

test('quietly drops a request that filled the hidden spam-trap field', async () => {
  const res = await post({ ...VALID, company_site: 'http://spam.example' })
  assert.equal(res.statusCode, 200)
  assert.equal(calls.length, 0)
})

test('reports failure when Telegram refuses the message', async () => {
  telegramResponse = new Response('{"ok":false}', { status: 403 })
  const res = await post(VALID)
  assert.equal(res.statusCode, 502)
})

test('reports failure when Telegram cannot be reached', async () => {
  globalThis.fetch = async () => { throw new Error('network down') }
  const res = await post(VALID)
  assert.equal(res.statusCode, 502)
})

test('reports failure when credentials are missing', async () => {
  delete process.env.TELEGRAM_BOT_TOKEN
  const res = await post(VALID)
  assert.equal(res.statusCode, 500)
  assert.equal(calls.length, 0)
})

test('never exposes the token in a response', async () => {
  globalThis.fetch = async () => { throw new Error('failed https://api.telegram.org/bottest-token/sendMessage') }
  const res = await post(VALID)
  assert.ok(!JSON.stringify(res.body).includes('test-token'))
})
