import { lazy } from 'react'

/** The whole three.js bundle stays out of the initial page load. */
export const VehicleCanvas = lazy(() => import('../scenes/VehicleCanvas'))
