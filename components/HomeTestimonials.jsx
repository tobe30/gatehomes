import { getLatestPublishedReviews } from '@/lib/publicReviews'
import TestimonialsCarousel from '@/components/TestimonialsCarousel'

export default async function HomeTestimonials() {
  const reviews = await getLatestPublishedReviews(6)
  return <TestimonialsCarousel reviews={reviews} />
}
