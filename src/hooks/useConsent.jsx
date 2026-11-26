import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

const STORAGE_KEY = 'novaris.consent.v1'

const DEFAULT_CHOICE = {
  essential: true,
  analytics: false,
  preferences: false,
}

const ConsentContext = createContext(null)

function readStored() {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return { ...DEFAULT_CHOICE, ...parsed }
  } catch {
    return null
  }
}

/** Placeholder analytics bootstrap: only runs after explicit consent. */
function loadAnalytics() {
  if (typeof window === 'undefined') return
  window.__novarisAnalytics = true
  if (import.meta.env.DEV) {
    console.info('[consent] analytics enabled by visitor choice')
  }
}

export function ConsentProvider({ children }) {
  const [choice, setChoice] = useState(readStored)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (choice?.analytics) loadAnalytics()
  }, [choice])

  useEffect(() => {
    if (!choice) setOpen(true)
  }, [choice])

  const save = useCallback((next) => {
    const value = { ...DEFAULT_CHOICE, ...next, essential: true }
    setChoice(value)
    setOpen(false)
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
    } catch {
      /* storage can be blocked; the choice still applies for this visit */
    }
  }, [])

  const value = useMemo(
    () => ({
      choice,
      open,
      save,
      openSettings: () => setOpen(true),
      closeSettings: () => setOpen(false),
      hasConsent: (key) => Boolean(choice?.[key]),
    }),
    [choice, open, save],
  )

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>
}

export function useConsent() {
  const context = useContext(ConsentContext)
  if (!context) throw new Error('useConsent must be used inside ConsentProvider')
  return context
}
