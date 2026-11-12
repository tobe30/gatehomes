import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const areas = [
  {
    name: 'Ikoyi',
    image: '/location-ikoyi-upload.jpeg',
    alt: 'Modern multi-unit residential property',
  },
  {
    name: 'Victoria Island',
    image: '/location-victoria-island-upload.jpeg',
    alt: 'Contemporary detached home with a paved courtyard',
  },
  {
    name: 'Lekki phase 1',
    image: '/location-lekki-phase-1-upload.jpeg',
    alt: 'Modern multi-storey apartment building',
  },
  {
    name: 'Ikate',
    image: '/location-ikate-upload.jpeg',
    alt: 'Contemporary white home with glass balconies',
  },
  {
    name: 'Osapa London',
    image: '/location-osapa-london-upload.jpeg',
    alt: 'Modern white residence with curved balconies',
  },
  {
    name: 'Chevron',
    image: '/location-chevron-upload.jpeg',
    alt: 'Modern white home with a dark exterior feature wall',
  },
  {
    name: 'Ajah',
    image: '/location-ajah-upload.jpeg',
    alt: 'Modern home with full-height glass windows',
  },
  {
    name: 'Ikota',
    image: '/location-ikota-upload.jpeg',
    alt: 'Modern residence with a paved front courtyard',
  },
]

function LocationCard({ area, properties }) {
  const count = properties.filter((property) => property.location.toLowerCase().includes(area.name.toLowerCase())).length

  return (
    <article className="group relative isolate min-h-[250px] overflow-hidden rounded-[4px] bg-slate-800 text-white">
      <Image
        src={area.image}
        alt={area.alt}
        fill
        sizes="(min-width: 1024px) 20vw, (min-width: 640px) 50vw, 100vw"
        className="-z-20 object-cover transition-transform duration-500 group-hover:scale-[1.04]"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-950/60 via-slate-950/15 to-slate-950/65" />
      <div className="relative flex h-full min-h-[250px] flex-col justify-between p-4">
        <div>
          <p className="text-[12px] font-semibold leading-none">{count} {count === 1 ? 'Property' : 'Properties'}</p>
          <h3 className="mt-2 text-[19px] font-bold leading-tight">{area.name}</h3>
        </div>
        <div className="flex items-center justify-between">
          <Link href={`/listings?destination=${encodeURIComponent(area.name)}`} className="text-[11px] font-medium uppercase tracking-wide transition-opacity hover:opacity-75">
            More details
          </Link>
          <Link href={`/listings?destination=${encodeURIComponent(area.name)}`} aria-label={`More details about ${area.name}`} className="flex h-8 w-8 items-center justify-center text-white transition-transform hover:translate-x-1">
            <svg aria-hidden="true" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"><path d="m8 4 12 8-12 8V4Z" /></svg>
          </Link>
        </div>
      </div>
    </article>
  )
}

export default function LocationExplorer({ properties = [] }) {
  return (
    <section aria-label="Explore properties by location" className="relative bg-white px-[15px] pb-11 pt-20">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-[10px] sm:grid-cols-2 lg:grid-cols-4">
        {areas.map((area) => <LocationCard key={area.name} area={area} properties={properties} />)}
      </div>
      <a href="#home" aria-label="Back to top" className="absolute bottom-8 right-8 z-20 flex h-[42px] w-[42px] items-center justify-center rounded-md bg-emerald-800 text-white shadow-lg hover:bg-emerald-900">
        <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m5 14 7-7 7 7" /></svg>
      </a>
    </section>
  )
}
