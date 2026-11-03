function Block({ className = '' }) {
  return <span aria-hidden="true" className={`block animate-pulse rounded-lg bg-stone-200/80 ${className}`} />
}

function ListingCardSkeleton() {
  return (
    <article aria-hidden="true" className="overflow-hidden rounded-xl border border-stone-200 bg-white">
      <Block className="h-[220px] rounded-none" />
      <div className="p-[18px] pt-4">
        <Block className="h-6 w-4/5" />
        <Block className="mt-3 h-4 w-2/5" />
        <Block className="mt-6 h-5 w-1/2" />
        <div className="mt-4 flex gap-2 border-t border-stone-200 pt-3">
          <Block className="h-3 w-16" />
          <Block className="h-3 w-16" />
          <Block className="h-3 w-16" />
        </div>
        <Block className="mt-5 h-12 rounded-lg bg-emerald-100/80" />
      </div>
    </article>
  )
}

export default function ListingsSkeleton() {
  return (
    <main aria-label="Loading listings" className="flex-1 bg-[#fffefa]">
      <section className="border-b border-stone-200 bg-[#f6f6f0] px-5 py-12 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-[1116px]">
          <Block className="h-3 w-32" />
          <Block className="mt-4 h-10 w-3/4 max-w-[520px] sm:h-12" />
          <Block className="mt-4 h-4 w-full max-w-2xl" />
          <Block className="mt-2 h-4 w-4/5 max-w-xl" />
          <div className="mt-8 grid gap-3 rounded-xl border border-stone-200 bg-white p-3 shadow-sm sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr_auto]">
            {[0, 1, 2, 3, 4].map((item) => <Block key={item} className="h-12 rounded-lg" />)}
          </div>
        </div>
      </section>
      <section className="px-5 py-10 sm:px-8 sm:py-12">
        <div className="mx-auto max-w-[1116px]">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div className="flex-1">
              <Block className="h-7 w-48" />
              <Block className="mt-2 h-4 w-24" />
            </div>
            <Block className="h-10 w-40" />
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((item) => <ListingCardSkeleton key={item} />)}
          </div>
        </div>
      </section>
    </main>
  )
}
