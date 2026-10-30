import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import PropertyInquiryForm from '@/components/PropertyInquiryForm'
import PropertyGallery from '@/components/PropertyGallery'
import ReviewAvatar from '@/components/ReviewAvatar'
import { properties } from '@/data/properties'

const demoReviews = [
  {
    name: 'Demo guest',
    date: 'Sample review',
    text: 'The listing details were clear, and arranging a property inspection was straightforward.',
  },
  {
    name: 'Demo buyer',
    date: 'Sample review',
    text: 'The Gate Homes team answered my questions and helped me understand the next steps.',
  },
]

type PropertyPageProps = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return properties.map((property) => ({ slug: property.slug }))
}

export async function generateMetadata({ params }: PropertyPageProps): Promise<Metadata> {
  const { slug } = await params
  const property = properties.find((item) => item.slug === slug)
  if (!property) return { title: 'Property not found | Gate Homes' }

  return {
    title: `${property.title} in ${property.location} | Gate Homes`,
    description: property.description,
  }
}

export default async function PropertyDetailsPage({ params }: PropertyPageProps) {
  const { slug } = await params
  const property = properties.find((item) => item.slug === slug)
  if (!property) notFound()

  return (
    <main className="flex-1 bg-[#fffefa]">
      <div className="mx-auto max-w-[1200px] px-5 py-6 sm:px-8 sm:py-8 lg:px-10">
        <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-emerald-800">Home</Link><span aria-hidden="true">/</span>
          <Link href="/listings" className="hover:text-emerald-800">Listings</Link><span aria-hidden="true">/</span>
          <span aria-current="page" className="text-slate-700">{property.title}</span>
        </nav>

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(340px,0.85fr)] lg:gap-10">
          <div>
            <div className="relative">
              <PropertyGallery images={property.images} title={property.title} representativeImages={Boolean(property.galleryNote)} />
              <span className="badge absolute left-4 top-4 h-8 rounded-md border-0 bg-white px-3 text-[10px] font-bold uppercase tracking-[0.1em] text-slate-900 shadow-sm">{property.status}</span>
            </div>
            {property.galleryNote && <p className="mt-2 text-xs leading-5 text-slate-500">{property.galleryNote}</p>}

            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="font-serif text-3xl font-bold leading-tight tracking-[-0.025em] text-slate-900 sm:text-[38px]">{property.title}</h1>
                <p className="mt-3 flex items-center gap-2 text-sm text-slate-600">
                  <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s7-6.1 7-12a7 7 0 1 0-14 0c0 5.9 7 12 7 12Z"/><circle cx="12" cy="9" r="2"/></svg>
                  {property.location}
                </p>
              </div>
              <p className="shrink-0 text-xl font-extrabold text-slate-900">{property.price}<span className="ml-1 text-sm font-normal text-slate-500">{property.period}</span></p>
            </div>

            <div className="mt-7 flex flex-wrap gap-2 border-y border-stone-200 py-5">
              {property.features.map((feature) => <span key={feature} className="badge h-9 rounded-lg border-stone-200 bg-white px-3 text-xs font-medium text-slate-700">{feature}</span>)}
            </div>

            <section aria-labelledby="description-heading" className="py-8">
              <h2 id="description-heading" className="font-serif text-2xl font-bold text-slate-900">About this property</h2>
              <p className="mt-4 max-w-3xl text-[15px] leading-7 text-slate-600">{property.description}</p>
              <p className="mt-3 max-w-3xl text-[15px] leading-7 text-slate-600">Property availability, price, and specifications can change. Send an inquiry to confirm the latest details with Gate Homes.</p>
            </section>

            <section aria-labelledby="reviews-heading" className="border-t border-stone-200 py-8">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-900">Guest and buyer feedback</p>
                  <h2 id="reviews-heading" className="font-serif text-2xl font-bold text-slate-900">Reviews</h2>
                </div>
                <span className="rounded-full bg-amber-50 px-3 py-1.5 text-[11px] font-semibold text-amber-800">Sample reviews</span>
              </div>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                {demoReviews.map((review, index) => (
                    <article key={review.name} className="group rounded-2xl border border-stone-200 bg-white p-5 shadow-[0_8px_24px_rgba(16,48,31,0.06)] transition duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-[0_14px_30px_rgba(16,48,31,0.1)] sm:p-6">
                      <div className="flex items-center gap-3.5">
                      <ReviewAvatar variant={index} />
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-bold text-slate-900">{review.name}</h3>
                          <p className="mt-1 text-xs text-slate-500">{review.date}</p>
                      </div>
                        <span className="ml-auto rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-900">Sample</span>
                    </div>
                      <div className="mt-5 flex items-center gap-2 border-t border-stone-100 pt-4">
                        <span aria-label="Sample rating: 5 out of 5" className="text-sm tracking-[0.12em] text-emerald-700">★★★★★</span>
                        <span className="rounded-md bg-emerald-800 px-2 py-1 text-xs font-bold leading-none text-white">5.0</span>
                        <span className="text-[11px] font-medium text-slate-500">Excellent</span>
                    </div>
                      <p className="mt-3 text-sm leading-6 text-slate-700">“{review.text}”</p>
                  </article>
                ))}
              </div>
                <p className="mt-4 text-xs leading-5 text-slate-500">Sample reviews and stock profile photos shown for layout preview. Replace them with verified customer feedback before publishing.</p>
            </section>
          </div>

          <aside className="lg:sticky lg:top-24">
            <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-900">Book or inspect</p>
              <h2 className="mt-2 font-serif text-2xl font-bold text-slate-900">Ask about this property</h2>
              <p className="mb-5 mt-2 text-sm leading-6 text-slate-600">Share your details and preferred option. We’ll save a copy in this browser and prepare your WhatsApp message.</p>
              <PropertyInquiryForm property={property} />
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
