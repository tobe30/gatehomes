import 'server-only'
import { connectDB } from '@/lib/db'
import Video from '@/models/Video'

export async function getPublishedVideos() {
  await connectDB()
  const videos = await Video.find({ status: 'Published' })
    .sort({ createdAt: -1 })
    .populate({ path: 'property', match: { status: 'Published' }, select: 'title slug' })
    .lean()
  return videos.map((video) => ({
    id: String(video._id),
    title: video.title,
    description: video.description || '',
    youtubeId: video.youtubeId,
    propertyTitle: video.property?.title || video.propertyTitle || '',
    propertySlug: video.property?.slug || '',
  }))
}
