import { lazy } from 'react'

/**
 * Three.js is heavy. Keeping it in a lazy chunk lets the page paint
 * its typography and layout before the 3D engine arrives.
 */
export const LazyProductScene = lazy(() =>
  import('../scenes/ProductScene').then((module) => ({ default: module.ProductScene })),
)
