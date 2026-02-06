'use client'

import { useEffect, useRef, useState } from 'react'

const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']

export function useKonamiCode() {
  const [activated, setActivated] = useState(false)
  const seqRef = useRef<string[]>([])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      seqRef.current = [...seqRef.current, e.key].slice(-KONAMI.length)
      if (seqRef.current.length === KONAMI.length && seqRef.current.every((k, i) => k === KONAMI[i])) {
        setActivated(true)
        seqRef.current = []
        setTimeout(() => setActivated(false), 3000)
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return activated
}
