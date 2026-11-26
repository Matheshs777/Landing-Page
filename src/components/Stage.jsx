import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useScrollStage } from '../hooks/useScrollStage'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { useDragControls } from '../hooks/useDragControls'
import { useViewControls } from '../hooks/useViewControls'
import { ModelViewer } from './three/ModelViewer'
import { EASE } from '../lib/motion'

const viewerId = (vehicle) => (vehicle.id === 'car' ? 'vx01' : 'r01')

/**
 * The scroll-linked studio. A tall section with a sticky viewport: scroll
 * drives the camera through the chapter keyframes, drag turns the vehicle,
 * and the preset row cuts straight to a view.
 */
export function Stage({ vehicle }) {
  const stageRef = useRef(null)
  const controls = useRef({ yaw: 0, zoom: 1 })
  const [presetId, setPresetId] = useState(null)
  const [loaded, setLoaded] = useState(false)

  const { progress, index } = useScrollStage(
    stageRef,
    vehicle.chapters.length,
    () => setPresetId(null),
  )

  const reduced = usePrefersReducedMotion()
  const compact = useMediaQuery('(max-width: 820px)')
  const quality = compact ? 'low' : 'high'

  const { handlers, dragging } = useDragControls(controls)
  const view = useViewControls(controls)

  const chapter = vehicle.chapters[index]
  const preset = vehicle.presets.find((item) => item.id === presetId)?.camera ?? null

  useEffect(() => {
    if (loaded) return undefined
    const timer = window.setTimeout(() => setLoaded(true), 12000)
    return () => window.clearTimeout(timer)
  }, [loaded])

  const goToChapter = (chapterIndex) => {
    const element = stageRef.current
    if (!element) return
    const top = element.getBoundingClientRect().top + window.scrollY
    const distance = element.offsetHeight - window.innerHeight
    window.scrollTo({
      top: top + ((chapterIndex + 0.5) / vehicle.chapters.length) * distance,
      behavior: reduced ? 'auto' : 'smooth',
    })
  }

  const choosePreset = (id) => {
    controls.current.yaw = 0
    setPresetId((current) => (current === id ? null : id))
  }

  const resetView = () => {
    view.reset()
    setPresetId(null)
  }

  if (reduced) {
    return (
      <div className="stage stage--static" ref={stageRef}>
        <div className="container stage__static-inner">
          <div className="stage__static-image">
            <ModelViewer
              id={viewerId(vehicle)}
              view="three-quarter"
              className="model-viewer--static"
              label={`${vehicle.fullName}, three-quarter studio view.`}
            />
          </div>
          <ol className="stage__static-list">
            {vehicle.chapters.map((item) => (
              <li key={item.id} className="stage__static-item">
                <p className="stage__copy-index">
                  {item.index} / {String(vehicle.chapters.length).padStart(2, '0')}
                </p>
                <h3 className="stage__copy-title">{item.title}</h3>
                <p className="stage__copy-text">{item.text}</p>
                <p className="stage__copy-note">{item.note}</p>
              </li>
            ))}
          </ol>
          <p className="stage__static-note">
            Reduced motion is on, so the studio is presented as a still camera rather
            than a moving one.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      className="stage"
      ref={stageRef}
      style={{ '--chapters': vehicle.chapters.length }}
    >
      <div
        className={`stage__sticky ${dragging ? 'is-dragging' : ''}`}
        tabIndex={0}
        data-loaded={loaded}
        onKeyDown={view.onKeyDown}
        {...handlers}
        aria-label={`${vehicle.fullName} interactive 3D model. Drag horizontally to rotate, use arrow keys to rotate, plus and minus to zoom.`}
      >
        <div className="stage__canvas">
          <ModelViewer
            id={viewerId(vehicle)}
            view={preset ?? chapter.camera}
            scroll={!preset}
            progress={progress}
            controls={controls}
            interactive
            quality={quality}
            onReady={() => setLoaded(true)}
            label={`${vehicle.fullName}, scroll-driven studio view.`}
          />
        </div>

        <div className="stage__shade" aria-hidden="true" />

        <div className="stage__hud">
          <div className="stage__id">
            <span className="stage__id-name">{vehicle.name}</span>
            <span className="stage__id-sep" aria-hidden="true" />
            <span className="stage__id-chapter">
              {chapter.index} — {chapter.label}
            </span>
          </div>

          <div className="stage__presets" role="group" aria-label="Camera views">
            {vehicle.presets.map((item) => (
              <button
                key={item.id}
                type="button"
                className="stage__preset"
                aria-pressed={presetId === item.id}
                onClick={() => choosePreset(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="stage__copy">
          <AnimatePresence initial={false}>
            <motion.div
              key={chapter.id}
              className="stage__copy-inner"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.55, ease: EASE }}
            >
              <p className="stage__copy-index">
                {chapter.index} / {String(vehicle.chapters.length).padStart(2, '0')}
              </p>
              <h3 className="stage__copy-title">{chapter.title}</h3>
              <p className="stage__copy-text">{chapter.text}</p>
              <p className="stage__copy-note">{chapter.note}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="stage__tools">
          <p className="stage__hint">
            <span aria-hidden="true">↔</span> Drag to rotate
          </p>
          <div className="stage__zoom" role="group" aria-label="Zoom controls">
            <button type="button" onClick={view.zoomOut} aria-label="Zoom out">
              −
            </button>
            <button type="button" onClick={view.zoomIn} aria-label="Zoom in">
              +
            </button>
            <button type="button" className="stage__reset" onClick={resetView}>
              Reset
            </button>
          </div>
        </div>

        <div className="stage__rail" aria-label="Chapters">
          {vehicle.chapters.map((item, itemIndex) => (
            <button
              key={item.id}
              type="button"
              className={`stage__rail-item ${itemIndex === index ? 'is-active' : ''}`}
              onClick={() => goToChapter(itemIndex)}
              aria-label={`Go to chapter ${item.index}: ${item.label}`}
              aria-current={itemIndex === index ? 'true' : undefined}
            >
              <span>{item.index}</span>
            </button>
          ))}
        </div>

        <div className="stage__bar" aria-hidden="true">
          <span style={{ transform: `scaleX(${(index + 1) / vehicle.chapters.length})` }} />
        </div>
      </div>
    </div>
  )
}
