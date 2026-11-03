function SkeletonBlock({ className = '' }) {
  return <span aria-hidden="true" className={`block animate-pulse rounded-lg bg-stone-200/80 ${className}`} />
}

export default function PropertyDetailsSkeleton() {
  return (
    <main aria-label="Loading property details" className="flex-1 bg-[#fffefa]">
      <div className="mx-auto max-w-[1200px] px-5 py-6 sm:px-8 sm:py-8 lg:px-10">
        <div className="mb-6 flex items-center gap-2" aria-hidden="true">
          <SkeletonBlock className="h-3 w-12" />
          <span className="text-stone-300">/</span>
          <SkeletonBlock className="h-3 w-14" />
          <span className="text-stone-300">/</span>
          <SkeletonBlock className="h-3 w-28" />
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(340px,0.85fr)] lg:gap-x-10">
          <div>
            <SkeletonBlock className="aspect-[1.5] w-full rounded-2xl sm:aspect-[1.8] lg:aspect-[1.65]" />
            <div className="mt-6 flex flex-col justify-between gap-4 sm:flex-row">
              <div className="flex-1 space-y-3">
                <SkeletonBlock className="h-9 w-3/4 max-w-lg" />
                <SkeletonBlock className="h-4 w-40" />
              </div>
              <SkeletonBlock className="h-7 w-36" />
            </div>
            <div className="mt-7 flex flex-wrap gap-2 border-y border-stone-200 py-5">
              {[0, 1, 2, 3].map((item) => <SkeletonBlock key={item} className="h-9 w-24 rounded-lg" />)}
            </div>
            <div className="space-y-4 py-8">
              <SkeletonBlock className="h-7 w-56" />
              <SkeletonBlock className="h-4 w-full" />
              <SkeletonBlock className="h-4 w-11/12" />
              <SkeletonBlock className="h-4 w-2/3" />
            </div>
            <div className="border-t border-stone-200 py-7">
              <SkeletonBlock className="h-3 w-36" />
              <SkeletonBlock className="mt-3 h-7 w-32" />
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {[0, 1, 2, 3].map((item) => <SkeletonBlock key={item} className="h-12 rounded-xl" />)}
              </div>
            </div>
            <div className="border-t border-stone-200 py-8">
              <SkeletonBlock className="h-7 w-28" />
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {[0, 1].map((item) => <SkeletonBlock key={item} className="h-36 rounded-2xl" />)}
              </div>
            </div>
          </div>

          <aside className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6 lg:sticky lg:top-24">
            <SkeletonBlock className="h-3 w-24" />
            <SkeletonBlock className="mt-3 h-7 w-56" />
            <SkeletonBlock className="mt-3 h-4 w-full" />
            <SkeletonBlock className="mt-2 h-4 w-4/5" />
            <div className="mt-6 space-y-4">
              {[0, 1, 2, 3].map((item) => <SkeletonBlock key={item} className="h-12 rounded-xl" />)}
              <SkeletonBlock className="h-12 rounded-xl bg-emerald-100/80" />
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
