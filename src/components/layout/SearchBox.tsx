'use client'

import { useRef, useEffect, useState } from 'react'
import { Star } from 'lucide-react'
import { useSearchStore } from '@/stores/Search'
import { useDebouncedValue } from '@/hooks/use-mobile'

export const SearchBox = () => {
  const searchRef = useRef<HTMLInputElement>(null)
  const [localQuery, setLocalQuery] = useState('')
  const debounced = useDebouncedValue(localQuery, 500)

  const setGlobalQuery = useSearchStore(s => s.setQuery)
  useEffect(() => setGlobalQuery(debounced), [debounced, setGlobalQuery])

  /* Ctrl + / focus */
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault()
        searchRef.current?.focus()
      }
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [])

  return (
    <form
      onSubmit={e => e.preventDefault()}
      className="flex max-w-1/2 flex-1 items-center gap-2 px-1 py-0.5 text-sm"
    >
      <Star className="h-4 w-4 shrink-0 text-muted-foreground" />
      <input
        ref={searchRef}
        type="text"
        placeholder="Search (Ctrl+/)"
        value={localQuery}
        onChange={e => setLocalQuery(e.target.value)}
        aria-label="Search Project"
        className="w-full bg-transparent outline-none placeholder:text-muted-foreground"
      />
    </form>
  )
}
