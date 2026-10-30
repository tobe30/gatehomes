import Hero from '@/components/Hero'
import FeaturedProperties from '@/components/FeaturedProperties'
import LocationExplorer from '@/components/LocationExplorer'
import ExploreShortlets from '@/components/ExploreShortlets'
import WeekendDeals from '@/components/WeekendDeals'
import WhoWeAre from '@/components/WhoWeAre'
import PropertyVideos from '@/components/PropertyVideos'
import React from 'react'

const page = () => {
  return (
    <div>
      <Hero/>
      <FeaturedProperties />
      <LocationExplorer />
      <ExploreShortlets />
      <WeekendDeals />
      <WhoWeAre />
      <PropertyVideos />
    </div>
  )
}

export default page
