/** Shared easing. Slow out, no bounce: the motion language of a heavy object. */
export const EASE = [0.16, 1, 0.3, 1]

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: EASE },
  },
}

export const fade = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8, ease: EASE } },
}

export const lineMask = {
  hidden: { y: '110%' },
  visible: {
    y: '0%',
    transition: { duration: 1.1, ease: EASE },
  },
}
