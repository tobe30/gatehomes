'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

export default function PropertyGallery({ images, title, representativeImages = false }) {
  const [activeIndex, setActiveIndex] = useState(null)
  const [zoom, setZoom] = useState(1)
  const hasMultiple = images.length > 1
  const shownImages = images.slice(0, 5)

  useEffect(() => {
    if (activeIndex === null) return undefined

    const previousOverflow = document.body.style.overflow
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setActiveIndex(null)
      if (event.key === 'ArrowRight') {
        setActiveIndex((index) => (index + 1) % images.length)
        setZoom(1)
      }
      if (event.key === 'ArrowLeft') {
        setActiveIndex((index) => (index - 1 + images.length) % images.length)
        setZoom(1)
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [activeIndex, images.length])

  function movePhoto(direction) {
    setActiveIndex((index) => (index + direction + images.length) % images.length)
    setZoom(1)
  }

  return (
    <>
      <div className={`grid gap-2 overflow-hidden rounded-2xl ${hasMultiple ? 'grid-cols-2 auto-rows-[minmax(120px,220px)] sm:grid-cols-4' : 'grid-cols-1'}`}>
        {shownImages.map((src, index) => (
          <button
            key={`${src}-${index}`}
            type="button"
            onClick={() => { setZoom(1); setActiveIndex(index) }}
            aria-label={index === shownImages.length - 1 && hasMultiple
              ? `Show all ${images.length} photos for ${title}`
              : `Open photo ${index + 1} of ${images.length} for ${title}`}
            className={`group relative min-h-[220px] overflow-hidden bg-stone-100 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800 focus-visible:ring-offset-2 ${hasMultiple && index === 0 ? 'sm:col-span-2 sm:row-span-2 sm:min-h-[448px]' : hasMultiple ? 'sm:min-h-[220px]' : 'aspect-[16/10]'}`}
          >
            <Image src={src} alt={`${title} — photo ${index + 1}`} fill priority={index === 0} sizes={hasMultiple && index > 0 ? '(min-width: 640px) 25vw, 50vw' : '(min-width: 1024px) 60vw, 100vw'} className="object-cover transition-transform duration-300 group-hover:scale-[1.025]" />
            {representativeImages && index > 0 && <span className="absolute left-2 top-2 rounded bg-black/75 px-2 py-1 text-[10px] font-medium text-white">Portfolio example</span>}
            {hasMultiple && index === shownImages.length - 1 && (
              <span className="absolute bottom-3 right-3 rounded-md bg-white px-3 py-2 text-xs font-semibold text-slate-900 shadow-sm">Show all {images.length} photos</span>
            )}
            {!hasMultiple && (
              <span className="absolute bottom-3 right-3 rounded-md bg-white px-3 py-2 text-xs font-semibold text-slate-900 shadow-sm">View photo</span>
            )}
          </button>
        ))}
      </div>

      {activeIndex !== null && <div
        role="dialog"
        aria-modal="true"
        aria-label={`${title} photo ${activeIndex + 1} of ${images.length}`}
        className="fixed inset-0 z-[100] flex flex-col bg-slate-950"
        onClick={(event) => { if (event.target === event.currentTarget) setActiveIndex(null) }}
      >
        <header className="z-10 flex min-h-16 shrink-0 items-center justify-between gap-2 border-b border-white/10 bg-slate-950 px-3 text-white sm:px-6">
          <p className="min-w-0 truncate text-xs font-semibold sm:text-sm">{title}</p>
          <p className="shrink-0 text-xs tabular-nums text-white/75">{activeIndex + 1} / {images.length}</p>
          <div className="flex shrink-0 items-center gap-1">
            <button type="button" onClick={() => setZoom((scale) => Math.max(1, Math.round((scale - 0.5) * 10) / 10))} disabled={zoom <= 1} aria-label="Zoom out" className="flex size-9 items-center justify-center rounded-full bg-white/10 text-xl hover:bg-white/20 disabled:opacity-40">−</button>
            <span className="min-w-10 text-center text-[11px] tabular-nums text-white/80">{Math.round(zoom * 100)}%</span>
            <button type="button" onClick={() => setZoom((scale) => Math.min(3, Math.round((scale + 0.5) * 10) / 10))} disabled={zoom >= 3} aria-label="Zoom in" className="flex size-9 items-center justify-center rounded-full bg-white/10 text-xl hover:bg-white/20 disabled:opacity-40">+</button>
            <button type="button" onClick={() => setZoom(1)} disabled={zoom === 1} aria-label="Reset zoom" className="ml-1 hidden min-h-9 rounded-full px-2 text-xs font-semibold text-white/80 hover:bg-white/10 disabled:opacity-40 sm:block">Reset</button>
            <button type="button" onClick={() => setActiveIndex(null)} aria-label="Close photo gallery" className="ml-1 flex size-9 items-center justify-center rounded-full bg-white text-xl leading-none text-slate-900">×</button>
          </div>
        </header>

        <div className="relative min-h-0 flex-1 overflow-auto overscroll-contain">
          <div className="relative mx-auto h-full min-h-[min(75vh,900px)] w-full max-w-6xl">
            <Image src={images[activeIndex]} alt={`${title} — photo ${activeIndex + 1}`} fill sizes="100vw" className="object-contain transition-transform duration-150" style={{ transform: `scale(${zoom})` }} />
          </div>
          {images.length > 1 && <>
            <button type="button" onClick={() => movePhoto(-1)} aria-label="Previous photo" className="absolute left-3 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-2xl text-slate-900 shadow-lg sm:left-6">‹</button>
            <button type="button" onClick={() => movePhoto(1)} aria-label="Next photo" className="absolute right-3 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-2xl text-slate-900 shadow-lg sm:right-6">›</button>
          </>}
        </div>
      </div>}
    </>
  )
}
