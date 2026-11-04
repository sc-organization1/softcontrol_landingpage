import { useCallback, useEffect, useRef, useState } from 'react'
import { useI18n } from '../i18n'
import { clamp01, formatTime, posterSrc, videoSrc } from '../lib/video'
import { useVideoPlayer } from '../lib/useVideoPlayer'
import { CompressIcon, ExpandIcon, PauseIcon, PlayIcon, ReplayIcon, VolumeIcon, VolumeOffIcon } from './Icons'

const HIDE_CONTROLS_MS = 2600
const SEEK_STEP = 5
const VOLUME_STEP = 0.1

const iconButton = 'grid size-9 shrink-0 place-items-center rounded-full text-[#eeebe3] transition-colors hover:bg-white/15 hover:text-white cursor-pointer @min-[560px]:size-10'

/** A draggable bar for mouse, touch and keyboard. A plain range input would pick up the site's text-cursor rule. */
function Slider({ label, now, max, valueText, onDrag, onDrop, onCancel, onStep, step, trackRef, className, children }) {
  const dragging = useRef(false)
  const fraction = (e) => {
    const box = e.currentTarget.getBoundingClientRect()
    return clamp01((e.clientX - box.left) / box.width)
  }
  const onKeyDown = (e) => {
    const direction = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 }[e.key]
    if (!direction) return
    e.preventDefault()
    e.stopPropagation()
    onStep(direction * step)
  }

  return (
    <div
      ref={trackRef}
      role="slider"
      tabIndex={0}
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={now}
      aria-valuetext={valueText}
      className={`group/slider relative flex cursor-pointer touch-none items-center ${className}`}
      onKeyDown={onKeyDown}
      onPointerDown={(e) => {
        dragging.current = true
        e.currentTarget.setPointerCapture(e.pointerId)
        onDrag(fraction(e))
      }}
      onPointerMove={(e) => { if (dragging.current) onDrag(fraction(e)) }}
      onPointerUp={(e) => {
        if (!dragging.current) return
        dragging.current = false
        onDrop?.(fraction(e))
      }}
      onPointerCancel={() => {
        dragging.current = false
        onCancel?.()
      }}
    >
      {children}
    </div>
  )
}

export function AboutVideo() {
  const { lang, t } = useI18n()
  const src = videoSrc(lang)
  const player = useVideoPlayer(src)
  const { videoRef, frameRef, barRef, status, buffering, failed, time, duration, muted, volume, fullscreen, toggle, seek, scrub, endScrub, setVolume, toggleMute, toggleFullscreen, retry, replay, play } = player

  const [awake, setAwake] = useState(true)
  const [dragging, setDragging] = useState(false)
  const timer = useRef(0)
  const tappedHidden = useRef(false) // a touch that landed while the controls were hidden

  const wake = useCallback(() => {
    setAwake(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setAwake(false), HIDE_CONTROLS_MS)
  }, [])
  useEffect(() => () => clearTimeout(timer.current), [])
  useEffect(() => { if (status !== 'playing') setAwake(true); else wake() }, [status, wake])

  const started = status === 'playing' || status === 'paused'
  const startScreen = !failed && !started
  const showControls = !failed && started && (awake || dragging || status === 'paused')
  const idle = status === 'playing' && !showControls

  const onFrameClick = () => {
    if (failed) return
    if (tappedHidden.current) return wake() // the first tap only brings the controls back
    wake()
    toggle()
  }

  const onKeyDown = (e) => {
    if (e.target instanceof HTMLButtonElement && (e.key === ' ' || e.key === 'Enter')) return
    const actions = {
      ' ': toggle,
      k: toggle,
      m: toggleMute,
      f: toggleFullscreen,
      ArrowLeft: () => seek(videoRef.current.currentTime - SEEK_STEP),
      ArrowRight: () => seek(videoRef.current.currentTime + SEEK_STEP),
    }
    const action = actions[e.key.length === 1 ? e.key.toLowerCase() : e.key]
    if (!action || e.ctrlKey || e.metaKey || e.altKey) return
    e.preventDefault()
    wake()
    action()
  }

  return (
    <figure
      ref={frameRef}
      tabIndex={-1}
      role="group"
      aria-label={t('video.label')}
      data-idle={idle || undefined}
      className="vp @container relative isolate m-0 aspect-video w-full overflow-hidden rounded-md bg-[#0a101c] shadow-[0_24px_60px_-28px_rgba(10,16,28,0.65)] outline-none ring-1 ring-line"
      onPointerDown={(e) => { tappedHidden.current = e.pointerType === 'touch' && idle }} // read here: focus wakes the controls before click
      onPointerMove={(e) => { if (e.pointerType === 'mouse') wake() }}
      onPointerLeave={(e) => { if (e.pointerType === 'mouse' && status === 'playing') setAwake(false) }}
      onFocus={wake}
      onKeyDown={onKeyDown}
    >
      <video
        ref={videoRef}
        src={src}
        poster={posterSrc(lang)}
        preload="metadata"
        playsInline
        aria-label={t('video.title')}
        className="absolute inset-0 size-full object-contain"
        onClick={onFrameClick}
        onDoubleClick={toggleFullscreen}
        {...player.videoProps}
      />

      {/* A short fade from dark each time the language changes the picture */}
      <span key={src} aria-hidden="true" className="vp-veil pointer-events-none absolute inset-0 bg-[#0a101c]" />

      {/* Start and finish screen */}
      <div className={`vp-layer absolute inset-0 flex items-end bg-gradient-to-t from-[#0a101c] via-[#0a101c]/70 via-30% to-transparent to-60% ${startScreen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}>
        <button
          type="button"
          tabIndex={startScreen ? 0 : -1}
          aria-label={status === 'ended' ? t('video.replay') : t('video.play')}
          className="vp-start group flex size-full cursor-pointer items-end gap-3 p-3 text-left text-[#eeebe3] @min-[560px]:gap-5 @min-[560px]:p-7"
          onClick={() => (status === 'ended' ? replay() : play())}
        >
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-brass-soft text-[#14203a] shadow-[0_8px_24px_rgba(0,0,0,0.35)] transition-transform duration-300 group-hover:scale-110 @min-[560px]:size-[68px]">
            {status === 'ended' ? <ReplayIcon className="size-5 @min-[560px]:size-7" /> : <PlayIcon className="size-5 @min-[560px]:size-7" />}
          </span>
          <span className="min-w-0">
            <span className="block truncate font-display text-base leading-tight @min-[560px]:text-[28px]">
              {status === 'ended' ? t('video.replay') : t('video.title')}
            </span>
            {duration > 0 && (
              <span className="mt-1 block font-mono text-[11px] tracking-[0.12em] text-[#c8c4b8] @min-[560px]:text-xs">
                {lang.toUpperCase()} · {formatTime(duration)}
              </span>
            )}
          </span>
        </button>
      </div>

      {buffering && !failed && (
        <span aria-hidden="true" className="vp-spinner pointer-events-none absolute left-1/2 top-1/2 -ml-6 -mt-6 size-12 rounded-full border-2 border-white/20 border-t-brass-soft" />
      )}

      {failed && (
        <div role="alert" className="absolute inset-0 grid place-content-center justify-items-center gap-3 bg-[#0a101c]/85 p-4 text-center text-[#eeebe3]">
          <p className="text-sm @min-[560px]:text-base">{t('video.error')}</p>
          <button type="button" onClick={retry} className="btn-brass">{t('video.retry')}</button>
        </div>
      )}

      {/* Playback controls */}
      <div
        className={`vp-layer absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0a101c] via-[#0a101c]/80 to-transparent px-2 pb-0.5 pt-5 @min-[560px]:px-4 @min-[560px]:pb-2.5 @min-[560px]:pt-10 ${showControls ? 'opacity-100' : 'pointer-events-none opacity-0'} ${started ? '' : 'invisible'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <Slider
          label={t('video.seek')}
          now={Math.min(time, Math.floor(duration))}
          max={Math.floor(duration)}
          valueText={`${formatTime(time)} / ${formatTime(duration)}`}
          step={SEEK_STEP}
          trackRef={barRef}
          className="vp-seek h-4 @min-[560px]:h-5"
          onDrag={(f) => { setDragging(true); scrub(f) }}
          onDrop={(f) => { setDragging(false); endScrub(f); wake() }}
          onCancel={() => { setDragging(false); endScrub(null) }}
          onStep={(s) => { seek(videoRef.current.currentTime + s); wake() }}
        >
          <span className="relative block h-1 w-full overflow-hidden rounded-full bg-white/25 transition-[height] duration-150 group-hover/slider:h-1.5">
            <span className="vp-fill absolute inset-0 origin-left bg-white/30" style={{ '--fill': 'var(--buffered, 0)' }} />
            <span className="vp-fill absolute inset-0 origin-left bg-brass-soft" style={{ '--fill': 'var(--progress, 0)' }} />
          </span>
          <span className="vp-thumb pointer-events-none absolute top-1/2 -ml-1.5 -mt-1.5 size-3 rounded-full bg-[#eeebe3] shadow transition-transform duration-150 group-hover/slider:scale-125" />
        </Slider>

        <div className="flex items-center gap-0.5 @min-[560px]:gap-1.5">
          <button type="button" onClick={toggle} aria-label={status === 'playing' ? t('video.pause') : t('video.play')} className={iconButton}>
            {status === 'playing' ? <PauseIcon className="size-[18px]" /> : <PlayIcon className="size-[18px]" />}
          </button>

          <div className="group/volume flex items-center">
            <button type="button" onClick={toggleMute} aria-label={muted ? t('video.unmute') : t('video.mute')} className={iconButton}>
              {muted || volume === 0 ? <VolumeOffIcon className="size-[18px]" /> : <VolumeIcon className="size-[18px]" />}
            </button>
            {/* Phones set volume with their own buttons, so the bar only exists where a mouse can reach it */}
            <div className="w-0 overflow-hidden opacity-0 transition-[width,opacity] duration-200 group-focus-within/volume:w-[84px] group-focus-within/volume:opacity-100 group-hover/volume:w-[84px] group-hover/volume:opacity-100 [@media(hover:none)]:hidden">
              <Slider
                label={t('video.volume')}
                now={Math.round((muted ? 0 : volume) * 100)}
                max={100}
                valueText={`${Math.round((muted ? 0 : volume) * 100)}%`}
                step={VOLUME_STEP}
                className="mx-2 h-10 w-[68px]"
                onDrag={setVolume}
                onStep={(s) => setVolume(volume + s)}
              >
                <span className="relative block h-1 w-full overflow-hidden rounded-full bg-white/25">
                  <span className="absolute inset-0 origin-left bg-[#eeebe3]" style={{ transform: `scaleX(${muted ? 0 : volume})` }} />
                </span>
              </Slider>
            </div>
          </div>

          <span className="ml-1.5 font-mono text-xs tabular-nums text-[#eeebe3]">
            {formatTime(time)}<span className="text-[#eeebe3]/55"> / {formatTime(duration)}</span>
          </span>

          <span className="flex-1" />
          <span className="mr-1 hidden rounded-sm border border-white/25 px-1.5 py-0.5 font-mono text-[11px] tracking-[0.1em] text-[#eeebe3] @min-[420px]:block">
            {lang.toUpperCase()}
          </span>
          <button
            type="button"
            onClick={toggleFullscreen}
            aria-label={fullscreen ? t('nav.fullscreenExit') : t('nav.fullscreen')}
            className={iconButton}
          >
            {fullscreen ? <CompressIcon /> : <ExpandIcon />}
          </button>
        </div>
      </div>
    </figure>
  )
}
