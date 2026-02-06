'use client'

import { createContext, useContext, useState, useCallback, type ReactNode, createElement } from 'react'

export type CursorVariant = 'default' | 'hover' | 'click'

interface CursorContextValue {
  variant: CursorVariant
  setDefault: () => void
  setHover: () => void
  setClick: () => void
}

const CursorContext = createContext<CursorContextValue>({
  variant: 'default',
  setDefault: () => {},
  setHover: () => {},
  setClick: () => {},
})

const Provider = CursorContext.Provider

export function CursorProvider({ children }: { children: ReactNode }) {
  const [variant, setVariant] = useState<CursorVariant>('default')
  const setDefault = useCallback(() => setVariant('default'), [])
  const setHover = useCallback(() => setVariant('hover'), [])
  const setClick = useCallback(() => setVariant('click'), [])

  const value = {
    variant,
    setDefault,
    setHover,
    setClick,
  }

  return createElement(Provider, { value }, children)
}

export function useCursorState() {
  return useContext(CursorContext)
}
