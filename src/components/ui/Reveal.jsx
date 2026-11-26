import { motion } from 'framer-motion'
import { useReveal } from '../../hooks/useReveal'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { EASE } from '../../lib/motion'

/** Quiet scroll reveal. IntersectionObserver-driven, never leaves content hidden. */
export function Reveal({
  as = 'div',
  children,
  className = '',
  delay = 0,
  distance = 26,
  ...rest
}) {
  const [ref, shown] = useReveal()
  const reduced = usePrefersReducedMotion()
  const Tag = motion[as] ?? motion.div

  return (
    <Tag
      ref={ref}
      className={className}
      initial={reduced ? false : { opacity: 0, y: distance }}
      animate={reduced || shown ? { opacity: 1, y: 0 } : { opacity: 0, y: distance }}
      transition={{ duration: 0.9, delay, ease: EASE }}
      {...rest}
    >
      {children}
    </Tag>
  )
}
