import type { Metadata } from 'next'
import { Suspense } from 'react'
import ListingsCatalog from '@/components/ListingsCatalog'
import ListingsSkeleton from '@/components/ListingsSkeleton'
import { getPublishedProperties } from '@/lib/publicProperties'

export const metadata: Metadata = {
  title: 'Properties for Sale and Rent in Lagos | Gate Homes',
  description: 'Browse homes, apartments, and investment properties for sale and rent across Lagos with Gate Homes.',
  alternates: { canonical: '/listings' },
  openGraph: {
    title: 'Properties for Sale and Rent in Lagos | Gate Homes',
    description: 'Browse homes, apartments, and investment properties for sale and rent across Lagos with Gate Homes.',
    url: 'https://gatehomesbooking.com/listings',
    type: 'website',
  },
}

type ListingsPageProps = {
  searchParams: Promise<{ destination?: string; checkin?: string; checkout?: string; guests?: string }>
}

async function ListingsContent({ searchParams }: ListingsPageProps) {
  const [{ destination = '', checkin = '', checkout = '', guests = '' }, properties] = await Promise.all([
    searchParams,
    getPublishedProperties(),
  ])

  return (
    <ListingsCatalog
      properties={properties}
      initialQuery={destination}
      initialCheckin={checkin}
      initialCheckout={checkout}
      initialGuests={guests}
    />
  )
}

export default function ListingsPage(props: ListingsPageProps) {
  return (
    <Suspense fallback={<ListingsSkeleton />}>
      <ListingsContent {...props} />
    </Suspense>
  )
}
