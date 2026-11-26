import { motion } from 'framer-motion'
import { useReveal } from '../../hooks/useReveal'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { EASE } from '../../lib/motion'

/**
 * Editorial line reveal: each line sits in its own mask and rises into place.
 * Used for the large statements, where a simple fade would feel too quiet.
 */
export function LineReveal({
  as = 'h2',
  lines = [],
  emphasis = -1,
  className = '',
  delay = 0,
}) {
  const [ref, shown] = useReveal()
  const reduced = usePrefersReducedMotion()
  const Tag = motion[as] ?? motion.h2

  return (
    <Tag
      ref={ref}
      className={`line-reveal ${className}`}
      initial="hidden"
      animate={reduced || shown ? 'shown' : 'hidden'}
    >
      {lines.map((line, index) => (
        <span className="line-reveal__mask" key={`${line}-${index}`}>
          <motion.span
            className="line-reveal__inner"
            variants={{
              hidden: reduced ? { y: 0, opacity: 1 } : { y: '112%', opacity: 0 },
              shown: { y: '0%', opacity: 1 },
            }}
            transition={{
              duration: 1.1,
              delay: delay + index * 0.09,
              ease: EASE,
            }}
          >
            {index === emphasis ? <em>{line}</em> : line}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}
