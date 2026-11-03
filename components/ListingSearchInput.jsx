'use client'

import { useId, useState } from 'react'
import { lagosLocationSuggestions } from '@/data/locations'

export default function ListingSearchInput({
  value,
  onChange,
  name = 'destination',
  placeholder = 'Search location',
  label = 'Search location',
  fieldClassName = '',
  wrapperClassName = '',
}) {
  const generatedId = useId().replaceAll(':', '')
  const inputId = `location-search-${generatedId}`
  const listId = `location-search-options-${generatedId}`
  const [active, setActive] = useState(false)
  const normalizedQuery = value.trim().toLowerCase()
  const locations = normalizedQuery
    ? lagosLocationSuggestions.filter((location) => location.toLowerCase().includes(normalizedQuery)).slice(0, 8)
    : []
  const shouldShowOptions = active && normalizedQuery.length > 0 && locations.length > 0

  function chooseLocation(location) {
    onChange(location)
    setActive(false)
  }

  function handleKeyDown(event) {
    if (event.key === 'Escape') setActive(false)
    if (event.key === 'ArrowDown' && shouldShowOptions) {
      event.preventDefault()
      document.getElementById(`${listId}-option-0`)?.focus()
    }
    if (event.key === 'Enter' && shouldShowOptions) {
      event.preventDefault()
      chooseLocation(locations[0])
    }
  }

  return (
    <div className={`relative min-w-0 ${wrapperClassName}`}>
      <label htmlFor={inputId} className={`flex min-h-[54px] items-center gap-3 rounded-lg border border-stone-200 bg-stone-50 px-3.5 text-slate-500 transition-colors focus-within:border-emerald-800 focus-within:ring-2 focus-within:ring-emerald-800/10 ${fieldClassName}`}>
        <svg aria-hidden="true" className="size-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s7-6.1 7-12a7 7 0 1 0-14 0c0 5.9 7 12 7 12Z"/><circle cx="12" cy="9" r="2"/></svg>
        <span className="sr-only">{label}</span>
        <input
          id={inputId}
          name={name}
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onFocus={() => setActive(true)}
          onBlur={() => window.setTimeout(() => setActive(false), 140)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoComplete="off"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={shouldShowOptions}
          aria-controls={listId}
          className="min-w-0 w-full flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-500"
        />
      </label>

      {shouldShowOptions && <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-[80] overflow-hidden rounded-xl border border-stone-200 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.18)]">
        <p className="border-b border-stone-100 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-900">Choose a Lagos location</p>
        <ul id={listId} role="listbox" aria-label="Matching Lagos locations" className="max-h-[min(55vh,320px)] overflow-y-auto overscroll-contain p-2">
          {locations.map((location, index) => (
            <li key={location}>
              <button
                id={`${listId}-option-${index}`}
                type="button"
                role="option"
                aria-selected={value === location}
                onPointerDown={(event) => {
                  event.preventDefault()
                  chooseLocation(location)
                }}
                onClick={() => chooseLocation(location)}
                onKeyDown={(event) => {
                  if (event.key === 'ArrowDown') {
                    event.preventDefault()
                    document.getElementById(`${listId}-option-${(index + 1) % locations.length}`)?.focus()
                  }
                  if (event.key === 'ArrowUp') {
                    event.preventDefault()
                    if (index === 0) document.getElementById(inputId)?.focus()
                    else document.getElementById(`${listId}-option-${index - 1}`)?.focus()
                  }
                }}
                className="flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-left text-sm text-slate-800 transition-colors hover:bg-emerald-50 focus-visible:bg-emerald-50 focus-visible:outline-none"
              >
                <svg aria-hidden="true" className="size-4 shrink-0 text-emerald-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s7-6.1 7-12a7 7 0 1 0-14 0c0 5.9 7 12 7 12Z"/><circle cx="12" cy="9" r="2"/></svg>
                <span>{location}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>}
    </div>
  )
}
