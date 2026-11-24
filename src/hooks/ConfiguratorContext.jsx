import { createContext, useContext, useMemo, useState } from 'react'
import { BIKE, CAR } from '../config/vehicles'

const ConfiguratorContext = createContext(null)

export function ConfiguratorProvider({ children }) {
  const [carPaintId, setCarPaintId] = useState(CAR.defaultPaint)
  const [bikePaintId, setBikePaintId] = useState(BIKE.defaultPaint)

  const value = useMemo(() => {
    const carPaint = CAR.paints.find((paint) => paint.id === carPaintId) ?? CAR.paints[0]
    const bikePaint = BIKE.paints.find((paint) => paint.id === bikePaintId) ?? BIKE.paints[0]
    return {
      carPaint,
      bikePaint,
      carPaintId,
      bikePaintId,
      setCarPaintId,
      setBikePaintId,
    }
  }, [carPaintId, bikePaintId])

  return (
    <ConfiguratorContext.Provider value={value}>{children}</ConfiguratorContext.Provider>
  )
}

export function useConfigurator() {
  const context = useContext(ConfiguratorContext)
  if (!context) throw new Error('useConfigurator must be used inside ConfiguratorProvider')
  return context
}
