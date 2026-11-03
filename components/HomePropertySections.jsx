import { getPublishedProperties } from '@/lib/publicProperties'
import ExploreShortlets from '@/components/ExploreShortlets'
import WeekendDeals from '@/components/WeekendDeals'
import FeaturedProperties from '@/components/FeaturedProperties'
import LocationExplorer from '@/components/LocationExplorer'

export default async function HomePropertySections() {
  const properties = await getPublishedProperties()
  const shortlets = properties.filter((property) => property.category === 'Shortlet')
  const deals = properties.filter((property) => property.isDeal)
  const featured = properties.filter((property) => property.category === 'Property' && property.isFeatured)

  return <>
    <ExploreShortlets properties={shortlets} />
    <WeekendDeals deals={deals} />
    <FeaturedProperties properties={featured} />
    <LocationExplorer properties={properties} />
  </>
}
