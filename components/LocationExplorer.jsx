import Image from 'next/image'
import React from 'react'

const areas = [
  {
    name: 'Ikoyi',
    count: 0,
    image: '/location-ikoyi.jpg',
    alt: 'Aerial view of Ikoyi and Lagos Island',
    placement: 'lg:col-start-1 lg:row-start-1 lg:row-span-2',
  },
  {
    name: 'Chevron',
    count: 0,
    image: '/location-chevron.jpg',
    alt: 'Residential property in Chevron, Lekki',
    placement: 'lg:col-start-2 lg:row-start-1',
  },
  {
    name: 'Ajah',
    count: 1,
    image: '/location-ajah.jpg',
    alt: 'Residential area in Ajah, Lagos',
    placement: 'lg:col-start-2 lg:row-start-2',
  },
  {
    name: 'Ikate',
    count: 0,
    image: '/ikate-apartment-building.jpg',
    alt: 'Apartments in Ikate, Lekki',
    placement: 'lg:col-start-3 lg:row-start-1 lg:row-span-2',
  },
  {
    name: 'Ikota',
    count: 0,
    image: '/location-ikota.jpg',
    alt: 'Townhouses in Ikota, Lekki',
    placement: 'lg:col-start-4 lg:row-start-1',
  },
  {
    name: 'Osapa London',
    count: 0,
    image: '/location-osapa-london.jpg',
    alt: 'Residential property in Osapa London, Lekki',
    placement: 'lg:col-start-4 lg:row-start-2',
  },
  {
    name: 'Lekki phase 1',
    count: 0,
    image: '/location-lekki-phase-1.jpg',
    alt: 'Aerial view of a road in Lekki Phase 1',
    placement: 'lg:col-start-5 lg:row-start-1 lg:row-span-2',
  },
]

function LocationCard({ area }) {
  return (
    <article className={`group relative isolate min-h-[250px] overflow-hidden rounded-[4px] bg-slate-800 text-white lg:min-h-0 ${area.placement}`}>
      <Image
        src={area.image}
        alt={area.alt}
        fill
        sizes="(min-width: 1024px) 20vw, (min-width: 640px) 50vw, 100vw"
        className="-z-20 object-cover transition-transform duration-500 group-hover:scale-[1.04]"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-950/60 via-slate-950/15 to-slate-950/65" />
      <div className="relative flex h-full min-h-[250px] flex-col justify-between p-4 lg:min-h-0">
        <div>
          <p className="text-[12px] font-semibold leading-none">{area.count} Property</p>
          <h3 className="mt-2 text-[19px] font-bold leading-tight">{area.name}</h3>
        </div>
        <div className="flex items-center justify-between">
          <a href="#listings" className="text-[11px] font-medium uppercase tracking-wide transition-opacity hover:opacity-75">
            More details
          </a>
          <a href="#listings" aria-label={`More details about ${area.name}`} className="flex h-8 w-8 items-center justify-center text-white transition-transform hover:translate-x-1">
            <svg aria-hidden="true" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"><path d="m8 4 12 8-12 8V4Z" /></svg>
          </a>
        </div>
      </div>
    </article>
  )
}

export default function LocationExplorer() {
  return (
    <section aria-label="Explore properties by location" className="relative bg-white px-[15px] pb-11 pt-20">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-[10px] sm:grid-cols-2 lg:grid-cols-5 lg:grid-rows-[256px_256px]">
        {areas.map((area) => <LocationCard key={area.name} area={area} />)}
      </div>
      <a href="#home" aria-label="Back to top" className="absolute bottom-8 right-8 z-20 flex h-[42px] w-[42px] items-center justify-center rounded-md bg-emerald-800 text-white shadow-lg hover:bg-emerald-900">
        <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m5 14 7-7 7 7" /></svg>
      </a>
    </section>
  )
}
