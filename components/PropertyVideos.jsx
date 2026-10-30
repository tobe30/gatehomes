import Image from 'next/image'

const videos = [
  {
    image: '/featured-property-1.jpg',
    alt: 'Modern duplex in Lekki, Lagos',
    title: 'Inside a ₦185m Lekki duplex',
    kind: 'Full walkthrough',
    duration: '8 min',
  },
  {
    image: '/location-ajah.jpg',
    alt: 'Land and property development in Lagos',
    title: 'Is Epe land still worth it?',
    kind: 'Market breakdown',
    duration: '6 min',
  },
  {
    image: '/featured-property-2.jpg',
    alt: 'Serviced apartment building in Lagos',
    title: 'Renting in Ikoyi: what ₦12m gets you',
    kind: 'Tour + costs',
    duration: '5 min',
  },
]

export default function PropertyVideos() {
  return (
    <section id="videos" className="bg-[#fffefa] px-5 py-14 sm:px-8 lg:py-16">
      <div className="mx-auto max-w-[1116px]">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.24em] text-[#18315d]">On video</p>
        <h2 className="mb-6 max-w-[700px] font-serif text-[34px] font-semibold leading-[1.1] tracking-[-0.03em] text-[#10213f] sm:text-[40px]">
          Walk the property before you leave your house.
        </h2>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {videos.map((video) => (
            <article key={video.title} className="overflow-hidden rounded-xl border border-stone-200 bg-white">
              <div className="relative aspect-[355/225] overflow-hidden">
                <Image src={video.image} alt={video.alt} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                <span aria-hidden="true" className="absolute left-1/2 top-1/2 flex size-[54px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90">
                  <span className="ml-1 h-0 w-0 border-y-[8px] border-l-[13px] border-y-transparent border-l-emerald-800" />
                </span>
              </div>
              <div className="min-h-[103px] px-4 py-4">
                <h3 className="font-serif text-[19px] font-semibold leading-tight text-[#10213f]">{video.title}</h3>
                <p className="mt-2 text-[11px] text-[#718096]">{video.kind} · {video.duration}</p>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-6 text-[11px] text-[#718096]">
          Video previews are placeholders — add Gate Homes YouTube or TikTok links to embed the full tours.
        </p>
      </div>
    </section>
  )
}
