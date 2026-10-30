import Image from 'next/image'

const stats = [
  { value: '8+', label: 'Years in Lagos' },
  { value: '300+', label: 'Deals closed' },
  { value: '120k', label: 'Video followers' },
]

export default function WhoWeAre() {
  return (
    <section id="about" className="bg-[#f6f6f0] px-5 py-16 sm:px-8 lg:py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
        <div className="relative mx-auto w-full max-w-[430px]">
          <div className="absolute -inset-x-3 -inset-y-2 rounded-[18px] border border-[#dddcd3]" />
          <div className="relative aspect-[430/543] overflow-hidden rounded-[14px]">
            <Image
              src="/gate-homes-about.jpg"
              alt="Gate Homes representative in an office with Nigerian and American flags"
              fill
              sizes="(max-width: 1024px) 90vw, 430px"
              className="object-cover"
            />
            <div className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-lg bg-white px-3.5 py-3 text-[9px] font-bold uppercase tracking-[0.16em] text-[#18315d] shadow-sm sm:bottom-5 sm:left-5">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-emerald-800" />
              Top Leading Real Estate Company
            </div>
          </div>
        </div>

        <div className="py-2">
          <p className="mb-4 text-[11px] font-bold tracking-[0.24em] text-[#18315d]">WHO WE ARE</p>
          <h2 className="max-w-[570px] font-serif text-4xl font-semibold leading-[1.08] tracking-[-0.025em] text-[#10213f] sm:text-[42px]">
            Turning dreams into addresses.
          </h2>
          <p className="mt-6 max-w-[590px] text-[15px] leading-[1.75] text-[#526174]">
            Gate Homes started with one conviction: booking or buying a home in Lagos shouldn&apos;t feel like a gamble. We help you find, buy, sell, and invest across the city — sharing clear details about every property and guiding you through each step.
          </p>
          <p className="mt-4 max-w-[590px] text-[15px] leading-[1.75] text-[#526174]">
            Our clients come to us looking for a place to stay or invest. They stay because we make the process straightforward and the details clear.
          </p>

          <div className="mt-7 border-t border-[#d9d9d0] pt-6">
            <dl className="flex flex-wrap gap-x-12 gap-y-5">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <dt className="font-serif text-[30px] font-semibold leading-none text-[#10213f]">{stat.value}</dt>
                  <dd className="mt-2 text-[11px] text-[#718096]">{stat.label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  )
}
