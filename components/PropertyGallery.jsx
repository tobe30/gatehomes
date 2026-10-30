'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

export default function PropertyGallery({ images, title, representativeImages = false }) {
  const [activeIndex, setActiveIndex] = useState(null)
  const hasMultiple = images.length > 1
  const shownImages = images.slice(0, 5)

  useEffect(() => {
    if (activeIndex === null) return undefined
    function onKeyDown(event) {
      if (event.key === 'Escape') setActiveIndex(null)
      if (event.key === 'ArrowRight') setActiveIndex((index) => (index + 1) % images.length)
      if (event.key === 'ArrowLeft') setActiveIndex((index) => (index - 1 + images.length) % images.length)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [activeIndex, images.length])

  return (
    <>
      <div className={`grid gap-2 overflow-hidden rounded-2xl ${hasMultiple ? 'grid-cols-2 auto-rows-[minmax(120px,220px)] sm:grid-cols-4' : 'grid-cols-1'}`}>
        {shownImages.map((src, index) => (
          <button
            key={`${src}-${index}`}
            type="button"
            onClick={() => setActiveIndex(index)}
            aria-label={`View photo ${index + 1} of ${images.length} for ${title}`}
            className={`group relative min-h-[220px] overflow-hidden bg-stone-100 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800 focus-visible:ring-offset-2 ${hasMultiple && index === 0 ? 'sm:col-span-2 sm:row-span-2 sm:min-h-[448px]' : hasMultiple ? 'sm:min-h-[220px]' : 'aspect-[16/10]'}`}
          >
            <Image src={src} alt={`${title} — photo ${index + 1}`} fill priority={index === 0} sizes={hasMultiple && index > 0 ? '(min-width: 640px) 25vw, 50vw' : '(min-width: 1024px) 60vw, 100vw'} className="object-cover transition-transform duration-300 group-hover:scale-[1.025]" />
            {representativeImages && index > 0 && <span className="absolute left-2 top-2 rounded bg-black/75 px-2 py-1 text-[10px] font-medium text-white">Portfolio example</span>}
            {hasMultiple && index === shownImages.length - 1 && (
              <span className="absolute bottom-3 right-3 rounded-md bg-white px-3 py-2 text-xs font-semibold text-slate-900 shadow-sm">Show all photos</span>
            )}
            {!hasMultiple && (
              <span className="absolute bottom-3 right-3 rounded-md bg-white px-3 py-2 text-xs font-semibold text-slate-900 shadow-sm">View photo</span>
            )}
          </button>
        ))}
      </div>

      {activeIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${title} photo gallery`}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 sm:p-8"
          onClick={(event) => { if (event.target === event.currentTarget) setActiveIndex(null) }}
        >
          <button type="button" onClick={() => setActiveIndex(null)} aria-label="Close photo gallery" className="absolute right-4 top-4 z-10 flex size-11 items-center justify-center rounded-full bg-white text-2xl text-slate-900 shadow-lg">×</button>
          <div className="relative h-[75vh] w-full max-w-6xl">
            <Image src={images[activeIndex]} alt={`${title} — photo ${activeIndex + 1}`} fill sizes="100vw" className="object-contain" />
          </div>
          <p className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-4 py-2 text-sm text-white">{activeIndex + 1} / {images.length}</p>
          {images.length > 1 && <>
            <button type="button" onClick={() => setActiveIndex((activeIndex - 1 + images.length) % images.length)} aria-label="Previous photo" className="absolute left-4 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-2xl text-slate-900 shadow-lg">‹</button>
            <button type="button" onClick={() => setActiveIndex((activeIndex + 1) % images.length)} aria-label="Next photo" className="absolute right-4 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-2xl text-slate-900 shadow-lg">›</button>
          </>}
        </div>
      )}
    </>
  )
}
