import { createContext, useContext, useMemo, useState } from 'react'

/**
 * The three physical finishes. Every value here maps directly to a
 * material in the 3D scene and to a swatch in the colour selector.
 */
export const COLORWAYS = {
  pearl: {
    id: 'pearl',
    name: 'Pearl White',
    short: 'Pearl',
    description: 'Warm white shell, soft-touch matte, graphite case.',
    bud: '#F1F0EB',
    tip: '#D6D1C7',
    case: '#222426',
    caseEdge: '#171819',
    swatch: '#F1F0EB',
  },
  graphite: {
    id: 'graphite',
    name: 'Graphite Black',
    short: 'Graphite',
    description: 'Low-reflection graphite, anodised case, warm metal trim.',
    bud: '#2C2E30',
    tip: '#1E1F21',
    case: '#171819',
    caseEdge: '#0F1011',
    swatch: '#2C2E30',
  },
  mint: {
    id: 'mint',
    name: 'Mint Green',
    short: 'Mint',
    description: 'Muted mint shell, forest green case, same quiet.',
    bud: '#BFD8C9',
    tip: '#A6C4B3',
    case: '#52685B',
    caseEdge: '#3E5046',
    swatch: '#BFD8C9',
  },
}

const ColorwayContext = createContext(null)

export function ColorwayProvider({ children }) {
  const [colorId, setColorId] = useState('pearl')

  const value = useMemo(
    () => ({
      colorId,
      setColorId,
      colorway: COLORWAYS[colorId],
      colorways: Object.values(COLORWAYS),
    }),
    [colorId],
  )

  return <ColorwayContext.Provider value={value}>{children}</ColorwayContext.Provider>
}

export function useColorway() {
  const context = useContext(ColorwayContext)
  if (!context) throw new Error('useColorway must be used inside ColorwayProvider')
  return context
}
