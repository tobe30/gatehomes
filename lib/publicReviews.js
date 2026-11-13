import 'server-only'
import { io } from 'next/cache'
import { connectDB } from '@/lib/db'
import Review from '@/models/Review'

export async function getPublishedReviews(propertySlug) {
  await io()
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

export async function getLatestPublishedReviews(limit = 6) {
  await connectDB()
  const safeLimit = Math.max(1, Math.min(Number(limit) || 6, 12))
  const records = await Review.find({ status: 'Approved' })
    .sort({ createdAt: -1 })
    .limit(safeLimit)
    .lean()

  return records.map((review) => ({
    id: String(review._id),
    propertySlug: review.propertySlug,
    propertyTitle: review.propertyTitle,
    name: review.name,
    rating: Number(review.rating),
    comment: review.comment,
  }))
}
