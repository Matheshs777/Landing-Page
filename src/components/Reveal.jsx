import { motion, useReducedMotion } from 'framer-motion'
import { EASE } from '../lib/motion'

/**
 * A single entrance treatment for section-level blocks. Deliberately not
 * applied to every heading on the page: the page should feel composed,
 * not like everything is floating up on scroll.
 */
export function Reveal({ children, delay = 0, y = 18, className = '', ...rest }) {
  const reduced = useReducedMotion()

  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: reduced ? 0 : 0.65, delay: reduced ? 0 : delay, ease: EASE }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}
