import 'server-only'
import { connectDB } from '@/lib/db'
import Review from '@/models/Review'

export async function getPublishedReviews(propertySlug) {
  await connectDB()
  const records = await Review.find({ propertySlug, status: 'Approved' })
    .sort({ createdAt: -1 })
    .lean()
  const reviews = records.map((review) => ({
    id: String(review._id),
    name: review.name,
    rating: Number(review.rating),
    comment: review.comment,
    createdAt: review.createdAt instanceof Date
      ? review.createdAt.toISOString()
      : new Date(review.createdAt).toISOString(),
  }))
  const averageRating = reviews.length
    ? Math.round((reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length) * 10) / 10
    : null

  return { reviews, averageRating }
}
