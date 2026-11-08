import type { MetadataRoute } from 'next'
import { connection } from 'next/server'
import { getPublishedProperties } from '@/lib/publicProperties'

const siteUrl = 'https://gatehomesbooking.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Build this at request time so the sitemap can include the current MongoDB listings.
  await connection()
  const properties = await getPublishedProperties()

  return [
    {
      url: siteUrl,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${siteUrl}/listings`,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...properties.map((property) => ({
      url: `${siteUrl}/properties/${property.slug}`,
      lastModified: property.updatedAt ? new Date(property.updatedAt) : undefined,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
      images: property.images,
    })),
  ]
}
