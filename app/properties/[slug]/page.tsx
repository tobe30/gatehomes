import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import PropertyInquiryForm from '@/components/PropertyInquiryForm'
import PropertyGallery from '@/components/PropertyGallery'
import ReviewForm from '@/components/ReviewForm'
import { getPublishedPropertyBySlug } from '@/lib/publicProperties'
import { getPublishedReviews } from '@/lib/publicReviews'

type PropertyPageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PropertyPageProps): Promise<Metadata> {
  const { slug } = await params
  const property = await getPublishedPropertyBySlug(slug)
  if (!property) {
    return {
      title: 'Listing not found | Gate Homes',
      robots: { index: false, follow: false },
    }
  }

  return {
    title: `${property.title} in ${property.location} | Gate Homes`,
    description: property.description.slice(0, 160),
    alternates: { canonical: `/properties/${property.slug}` },
    openGraph: {
      title: `${property.title} in ${property.location} | Gate Homes`,
      description: property.description.slice(0, 160),
      images: property.image ? [{ url: property.image, alt: property.alt }] : [],
    },
  }
}

async function PropertyDetails({ params }: PropertyPageProps) {
  const { slug } = await params
  const property = await getPublishedPropertyBySlug(slug)
  if (!property) notFound()
  const { reviews, averageRating } = await getPublishedReviews(property.slug)

  return (
    <main className="flex-1 bg-[#fffefa]">
      <div className="mx-auto max-w-[1200px] px-5 py-6 sm:px-8 sm:py-8 lg:px-10">
        <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-emerald-800">Home</Link><span aria-hidden="true">/</span>
          <Link href="/listings" className="hover:text-emerald-800">Listings</Link><span aria-hidden="true">/</span>
          <span aria-current="page" className="text-slate-700">{property.title}</span>
        </nav>

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(340px,0.85fr)] lg:grid-rows-[auto_1fr] lg:gap-x-10 lg:gap-y-8">
          <div className="lg:col-start-1 lg:row-start-1">
            <div className="relative">
              <PropertyGallery images={property.images} title={property.title} representativeImages={false} />
              <span className="badge absolute left-4 top-4 h-8 rounded-md border-0 bg-white px-3 text-[10px] font-bold uppercase tracking-[0.1em] text-slate-900 shadow-sm">{property.status}</span>
            </div>

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
              {property.amenities.map((amenity: string) => <span key={amenity} className="badge h-9 rounded-lg border-stone-200 bg-white px-3 text-xs font-medium text-slate-700">{amenity}</span>)}
            </div>

            <section aria-labelledby="description-heading" className="py-8">
              <h2 id="description-heading" className="font-serif text-2xl font-bold text-slate-900">About this {property.category === 'Shortlet' ? 'shortlet' : 'property'}</h2>
              <p className="mt-4 max-w-3xl whitespace-pre-line text-[15px] leading-7 text-slate-600">{property.description}</p>
              {property.address && <p className="mt-4 text-sm text-slate-600"><span className="font-semibold text-slate-800">Address:</span> {property.address}</p>}
              <p className="mt-3 max-w-3xl text-[15px] leading-7 text-slate-600">Availability, price, and specifications can change. Send an inquiry to confirm the latest details with Gate Homes.</p>
            </section>
          </div>

          <aside className="lg:sticky lg:top-24 lg:col-start-2 lg:row-span-2 lg:row-start-1">
            <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-900">Book or inspect</p>
              <h2 className="mt-2 font-serif text-2xl font-bold text-slate-900">Ask about this listing</h2>
              <p className="mb-5 mt-2 text-sm leading-6 text-slate-600">Share your details and preferred option. We’ll save your inquiry and prepare your WhatsApp message.</p>
              <PropertyInquiryForm property={property} />
            </div>
          </aside>

          <section aria-labelledby="reviews-heading" className="border-t border-stone-200 py-8 lg:col-start-1 lg:row-start-2">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-900">Guest and buyer feedback</p>
                <h2 id="reviews-heading" className="font-serif text-2xl font-bold text-slate-900">Reviews</h2>
              </div>
              {averageRating !== null && <p className="text-sm font-semibold text-slate-700"><span className="text-emerald-700">★</span> {averageRating} <span className="font-normal text-slate-500">· {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}</span></p>}
            </div>
            {reviews.length === 0 ? <div className="mt-5 rounded-2xl border border-dashed border-stone-300 bg-white px-5 py-8 text-center sm:px-8">
              <p className="font-serif text-lg font-semibold text-slate-900">No reviews yet</p>
              <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-600">Be the first to share feedback about this listing after a genuine experience.</p>
            </div> : <div className="mt-5 grid gap-4 md:grid-cols-2">
              {reviews.map((review) => <article key={review.id} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-[0_8px_24px_rgba(16,48,31,0.05)]">
                <div className="flex items-start gap-3">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-900">{review.name.split(/\s+/).slice(0, 2).map((part: string) => part[0]).join('').toUpperCase()}</span>
                  <div className="min-w-0 flex-1"><h3 className="truncate text-sm font-bold text-slate-900">{review.name}</h3><p className="mt-1 text-xs text-slate-500">{new Intl.DateTimeFormat('en-NG', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(review.createdAt))}</p></div>
                  <span aria-label={`${review.rating} out of 5 stars`} className="shrink-0 text-sm tracking-wide text-emerald-700">{'★'.repeat(review.rating)}<span className="text-slate-300">{'★'.repeat(5 - review.rating)}</span></span>
                </div>
                <p className="mt-4 whitespace-pre-line text-sm leading-6 text-slate-700">{review.comment}</p>
              </article>)}
            </div>}
            <ReviewForm propertySlug={property.slug} />
          </section>
        </div>
      </div>
    </main>
  )
}

export default function PropertyDetailsPage(props: PropertyPageProps) {
  return (
    <Suspense fallback={<main className="flex-1 px-5 py-20 text-center text-sm text-slate-500">Loading listing details…</main>}>
      <PropertyDetails {...props} />
    </Suspense>
  )
}
