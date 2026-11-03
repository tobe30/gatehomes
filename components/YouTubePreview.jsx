'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function YouTubePreview({ videoId, title }) {
  const [playing, setPlaying] = useState(false)

  if (playing) {
    return <iframe
      className="absolute inset-0 size-full"
      src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
      title={title}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerPolicy="strict-origin-when-cross-origin"
      allowFullScreen
    />
  }

  return <button type="button" onClick={() => setPlaying(true)} aria-label={`Play ${title}`} className="absolute inset-0 block size-full bg-slate-200 text-left">
    <Image src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`} alt={`Video thumbnail: ${title}`} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-300 hover:scale-[1.025]" />
    <span aria-hidden="true" className="absolute left-1/2 top-1/2 flex size-[54px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-md">
      <span className="ml-1 h-0 w-0 border-y-[8px] border-l-[13px] border-y-transparent border-l-emerald-800" />
    </span>
  </button>
}
