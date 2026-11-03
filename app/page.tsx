import { Suspense } from 'react'
import Hero from '@/components/Hero'
import HomePropertySections from '@/components/HomePropertySections'
import WhoWeAre from '@/components/WhoWeAre'
import PropertyVideos from '@/components/PropertyVideos'

export default function HomePage() {
  return (
    <div>
      <Hero />
      <Suspense fallback={<div className="px-6 py-16 text-center text-sm text-slate-500">Loading current listings…</div>}>
        <HomePropertySections />
      </Suspense>
      <WhoWeAre />
      <Suspense fallback={<div className="px-6 py-16 text-center text-sm text-slate-500">Loading property videos…</div>}>
        <PropertyVideos />
      </Suspense>
    </div>
  )
}
