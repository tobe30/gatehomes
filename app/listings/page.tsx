import type { Metadata } from 'next'
import ListingsCatalog from '@/components/ListingsCatalog'

export const metadata: Metadata = {
  title: 'Properties for Sale and Rent in Lagos | Gate Homes',
  description: 'Browse homes, apartments, and investment properties for sale and rent across Lagos with Gate Homes.',
}

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<{ destination?: string }>
}) {
  const { destination = '' } = await searchParams
  return <ListingsCatalog initialQuery={destination} />
}
