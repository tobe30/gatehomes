'use client'

import { useId, useMemo, useState } from 'react'
import { lagosLocations } from '@/data/locations'

const locationGroups = (() => {
  const regions = new Map()
  for (const location of lagosLocations) {
    if (!location.region || location.needsReview) continue
    const key = `${location.city}:${location.region}`
    if (!regions.has(key)) {
      const label = ['Island', 'Mainland'].includes(location.region)
        ? `${location.city} ${location.region}`
        : `${location.city} · ${location.region}`
      regions.set(key, { key, city: location.city, region: location.region, label })
    }
  }

  const groups = [...regions.values()]
  const preferredOrder = ['Lagos:Island', 'Lagos:Mainland']
  groups.sort((a, b) => {
    const aIndex = preferredOrder.indexOf(a.key)
    const bIndex = preferredOrder.indexOf(b.key)
    if (aIndex < 0 && bIndex < 0) return a.label.localeCompare(b.label)
    if (aIndex < 0) return 1
    if (bIndex < 0) return -1
    return aIndex - bIndex
  })

  if (lagosLocations.some((location) => !location.region || location.needsReview)) {
    groups.push({ key: 'needs-review', review: true, label: 'Needs region review' })
  }
  return groups
})()

const inputClass = 'mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-800 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/10'

export default function AdminLocationSelect({ value, onChange, error, wrapperClassName = '' }) {
  const id = useId().replaceAll(':', '')
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)

  const matches = useMemo(() => {
    const term = query.trim().toLocaleLowerCase()
    return lagosLocations.filter((location) => !term || location.name.toLocaleLowerCase().includes(term))
  }, [query])

  const savedLocationIsSuggested = lagosLocations.some((location) => location.name === value)
  const activeLocation = matches[activeIndex]

  function closeDropdown() {
    setOpen(false)
    setQuery('')
    setActiveIndex(0)
  }

  function selectLocation(location) {
    onChange(location.name)
    closeDropdown()
  }

  function handleKeyDown(event) {
    if (event.key === 'Escape') {
      event.preventDefault()
      closeDropdown()
      return
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      if (!open) setOpen(true)
      if (matches.length) setActiveIndex((index) => index < 0 ? 0 : Math.min(index + 1, matches.length - 1))
      return
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      if (matches.length) setActiveIndex((index) => Math.max(index - 1, 0))
      return
    }

    if (event.key === 'Enter' && open) {
      event.preventDefault()
      if (activeLocation || matches[0]) selectLocation(activeLocation || matches[0])
    }
  }

  return (
    <div className={`relative ${wrapperClassName}`}>
      <label htmlFor={`admin-location-${id}`} className="block text-xs font-semibold text-slate-700">Location *</label>
      <div className="relative">
        <input
          id={`admin-location-${id}`}
          type="text"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={`admin-location-options-${id}`}
          aria-activedescendant={open && activeLocation ? `admin-location-option-${id}-${activeIndex}` : undefined}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `admin-location-error-${id}` : undefined}
          autoComplete="off"
          value={open ? query : value}
          placeholder="Search or select a Lagos location"
          className={`${inputClass} pr-10 ${error ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/10' : ''}`}
          onFocus={() => {
            setQuery('')
            setActiveIndex(0)
            setOpen(true)
          }}
          onChange={(event) => {
            setQuery(event.target.value)
            setActiveIndex(0)
            setOpen(true)
          }}
          onBlur={() => window.setTimeout(closeDropdown, 120)}
          onKeyDown={handleKeyDown}
        />
        <svg aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" viewBox="0 0 20 20" fill="none">
          <path d="m5 7.5 5 5 5-5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <input type="hidden" name="location" value={value} />

      {open && <div id={`admin-location-options-${id}`} role="listbox" aria-label="Lagos locations" className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[min(60vh,360px)] overflow-y-auto overscroll-contain rounded-xl border border-slate-200 bg-white p-2 shadow-[0_16px_40px_rgba(15,23,42,0.16)]">
        {locationGroups.map((group) => {
          const items = matches.filter((location) => group.review
            ? !location.region || location.needsReview
            : location.city === group.city && location.region === group.region && !location.needsReview)
          if (!items.length) return null

          return <div key={group.label}>
            <p role="presentation" className="sticky top-[-8px] z-10 border-b border-slate-100 bg-white px-3 py-2.5 text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-900">{group.label}</p>
            {items.map((location) => {
              const optionIndex = matches.findIndex((item) => item.name === location.name)
              return <div
                key={location.name}
                id={`admin-location-option-${id}-${optionIndex}`}
                role="option"
                aria-selected={value === location.name}
                onPointerDown={(event) => {
                  event.preventDefault()
                  selectLocation(location)
                }}
                onMouseEnter={() => setActiveIndex(optionIndex)}
                className={`flex min-h-11 cursor-pointer items-center justify-between gap-3 rounded-lg px-3 text-sm transition-colors ${activeIndex === optionIndex ? 'bg-emerald-50 text-emerald-950' : 'text-slate-700 hover:bg-slate-50'}`}
              >
                <span>{location.name}</span>
                <span className="flex items-center gap-2">
                  {location.needsReview && <span className="rounded-full bg-amber-50 px-2 py-1 text-[9px] font-semibold text-amber-800">Review area</span>}
                  {value === location.name && <span aria-hidden="true" className="text-sm font-bold text-emerald-800">✓</span>}
                </span>
              </div>
            })}
          </div>
        })}
        {matches.length === 0 && <p role="status" className="px-3 py-6 text-center text-sm text-slate-500">No matching Lagos locations.</p>}
      </div>}

      {value && !savedLocationIsSuggested && <p className="mt-1.5 text-[11px] text-slate-500">Saved location (not in the current suggestions)</p>}
      {error && <span id={`admin-location-error-${id}`} className="mt-1 block text-[11px] text-rose-600">{error}</span>}
    </div>
  )
}
