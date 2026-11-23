import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * A short, quiet two-note chime for the ANC demo.
 *
 * This is intentionally a demo sound, not a noise-cancellation test. A fresh
 * AudioContext is created per play and closed on stop so nothing is left
 * running in the background.
 */
export function useTestTone() {
  const [playing, setPlaying] = useState(false)
  const contextRef = useRef(null)
  const timerRef = useRef(0)

  const stop = useCallback(() => {
    window.clearTimeout(timerRef.current)
    setPlaying(false)
    const context = contextRef.current
    contextRef.current = null
    if (context) context.close().catch(() => {})
  }, [])

  const toggle = useCallback(() => {
    if (playing) {
      stop()
      return
    }

    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    if (!AudioContextClass) return

    const context = new AudioContextClass()
    contextRef.current = context
    if (context.state === 'suspended') context.resume().catch(() => {})

    const now = context.currentTime
    const master = context.createGain()
    master.gain.setValueAtTime(0.0001, now)
    master.gain.exponentialRampToValueAtTime(0.05, now + 0.08)
    master.gain.setValueAtTime(0.05, now + 1.1)
    master.gain.exponentialRampToValueAtTime(0.0001, now + 2.0)
    master.connect(context.destination)

    ;[220, 329.63].forEach((frequency, index) => {
      const oscillator = context.createOscillator()
      oscillator.type = 'sine'
      oscillator.frequency.value = frequency

      const gain = context.createGain()
      gain.gain.value = index === 0 ? 1 : 0.42

      oscillator.connect(gain)
      gain.connect(master)
      oscillator.start(now + index * 0.18)
      oscillator.stop(now + 2.05)
    })

    setPlaying(true)
    timerRef.current = window.setTimeout(() => {
      setPlaying(false)
      contextRef.current = null
      context.close().catch(() => {})
    }, 2100)
  }, [playing, stop])

  useEffect(
    () => () => {
      window.clearTimeout(timerRef.current)
      contextRef.current?.close().catch(() => {})
      contextRef.current = null
    },
    [],
  )

  return { playing, toggle }
}
