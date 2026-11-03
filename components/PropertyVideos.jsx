import Link from 'next/link'
import YouTubePreview from '@/components/YouTubePreview'
import { getPublishedVideos } from '@/lib/publicVideos'

export default async function PropertyVideos() {
  const videos = await getPublishedVideos()

  return (
    <section id="videos" className="bg-[#fffefa] px-5 py-14 sm:px-8 lg:py-16">
      <div className="mx-auto max-w-[1116px]">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.24em] text-[#18315d]">On video</p>
        <h2 className="mb-6 max-w-[700px] font-serif text-[34px] font-semibold leading-[1.1] tracking-[-0.03em] text-[#10213f] sm:text-[40px]">
          Walk the property before you leave your house.
        </h2>

        {videos.length === 0 ? <div className="rounded-2xl border border-dashed border-stone-300 bg-white px-5 py-10 text-center">
          <p className="font-serif text-lg font-semibold text-slate-900">Property tours are coming soon</p>
          <p className="mt-2 text-sm text-slate-600">Gate Homes walkthrough videos will appear here when they’re published.</p>
        </div> : <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {videos.map((video) => <article key={video.id} className="overflow-hidden rounded-xl border border-stone-200 bg-white">
            <div className="relative aspect-[355/225] overflow-hidden bg-stone-100">
              <YouTubePreview videoId={video.youtubeId} title={video.title}/>
            </div>
            <div className="min-h-[103px] px-4 py-4">
              <h3 className="font-serif text-[19px] font-semibold leading-tight text-[#10213f]">{video.title}</h3>
              {video.description && <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-600">{video.description}</p>}
              {video.propertyTitle && video.propertySlug && <Link href={`/properties/${video.propertySlug}`} className="mt-3 inline-flex text-xs font-semibold text-emerald-800 hover:text-emerald-950">View {video.propertyTitle} →</Link>}
            </div>
          </article>)}
        </div>}
      </div>
    </section>
  )
}
