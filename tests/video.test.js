import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { test } from 'node:test'
import en from '../src/i18n/en.js'
import ru from '../src/i18n/ru.js'
import uz from '../src/i18n/uz.js'
import { bufferedEnd, clamp01, formatTime, posterSrc, videoSrc } from '../src/lib/video.js'

const DICTS = { uz, ru, en }
const VIDEO_KEYS = [
  'video.label', 'video.title', 'video.play', 'video.pause', 'video.replay', 'video.mute', 'video.unmute',
  'video.volume', 'video.seek', 'video.error', 'video.retry',
]
const ranges = (...pairs) => ({
  length: pairs.length,
  start: (i) => pairs[i][0],
  end: (i) => pairs[i][1],
})

test('every language has its own video and poster on disk', () => {
  for (const lang of Object.keys(DICTS)) {
    assert.equal(videoSrc(lang), `/videos/${lang}.mp4`)
    assert.equal(posterSrc(lang), `/videos/${lang}.jpg`)
    assert.ok(existsSync(`public${videoSrc(lang)}`), `missing video for ${lang}`)
    assert.ok(existsSync(`public${posterSrc(lang)}`), `missing poster for ${lang}`)
  }
})

test('every language has all the player texts', () => {
  for (const [lang, dict] of Object.entries(DICTS)) {
    for (const key of VIDEO_KEYS) assert.ok(dict[key], `${lang} is missing ${key}`)
  }
})

test('formatTime shows minutes and padded seconds', () => {
  assert.equal(formatTime(0), '0:00')
  assert.equal(formatTime(7.9), '0:07')
  assert.equal(formatTime(57.4), '0:57')
  assert.equal(formatTime(125), '2:05')
})

test('formatTime survives a duration the browser does not know yet', () => {
  assert.equal(formatTime(NaN), '0:00')
  assert.equal(formatTime(Infinity), '0:00')
  assert.equal(formatTime(-3), '0:00')
})

test('clamp01 keeps a fraction between 0 and 1', () => {
  assert.equal(clamp01(-0.2), 0)
  assert.equal(clamp01(0.4), 0.4)
  assert.equal(clamp01(1.3), 1)
  assert.equal(clamp01(NaN), 0)
})

test('bufferedEnd finds the range around the playhead', () => {
  assert.equal(bufferedEnd(ranges([0, 10], [20, 30]), 25), 30)
  assert.equal(bufferedEnd(ranges([0, 10], [20, 30]), 3), 10)
})

test('bufferedEnd falls back to the playhead when nothing around it is loaded', () => {
  assert.equal(bufferedEnd(ranges([0, 10]), 15), 15)
  assert.equal(bufferedEnd(ranges(), 4), 4)
})
