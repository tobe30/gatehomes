import 'server-only'
import { connectDB } from '@/lib/db'
import Property from '@/models/Property'

function formatNaira(value) {
  const amount = Number(value)
  return amount > 0 ? `₦${new Intl.NumberFormat('en-NG').format(amount)}` : 'Contact for price'
}

function toPublicProperty(record) {
  const storedImages = (record.images || []).filter((image) => image?.url)
  const cover = storedImages.find((image) => image.isCover)?.url
  const image = cover || record.image || storedImages[0]?.url || ''
  const images = [image, ...storedImages.map((item) => item.url).filter((url) => url !== image)].filter(Boolean).slice(0, 5)
  const displayedPrice = record.discountPrice || record.price
  const features = []

  if (record.beds > 0) features.push(`${record.beds} beds`)
  if (record.baths > 0) features.push(`${record.baths} baths`)
  if (record.toilets > 0) features.push(`${record.toilets} toilets`)
  if (record.category === 'Shortlet' && record.guests > 0) features.push(`Up to ${record.guests} guests`)

  return {
    id: String(record._id),
    slug: record.slug,
    title: record.title,
    category: record.category,
    type: record.type,
    purpose: record.purpose,
    status: record.category === 'Shortlet' ? 'Shortlet' : record.purpose,
    price: formatNaira(displayedPrice),
    priceValue: Number(displayedPrice) || null,
    originalPrice: record.discountPrice ? formatNaira(record.price) : null,
    originalPriceValue: Number(record.price) || null,
    discountPrice: Number(record.discountPrice) || null,
    period: record.category === 'Shortlet' ? '/ night' : record.purpose === 'For Rent' ? '/ yr' : '',
    location: record.location,
    address: record.address,
    description: record.description,
    image,
    images,
    alt: `${record.title} in ${record.location}, Lagos`,
    beds: Number(record.beds) || 0,
    baths: Number(record.baths) || 0,
    toilets: Number(record.toilets) || 0,
    guests: Number(record.guests) || 0,
    checkin: record.checkin || '',
    checkout: record.checkout || '',
    amenities: record.amenities || [],
    features,
    isDeal: Boolean(record.isDeal),
    isFeatured: Boolean(record.isFeatured),
    added: record.added instanceof Date ? record.added.toISOString() : String(record.added || ''),
  }
}

export async function getPublishedProperties() {
  await connectDB()
  const records = await Property.find({ status: 'Published' })
    .sort({ createdAt: -1 })
    .lean()
  return records.map(toPublicProperty)
}

export async function getPublishedPropertyBySlug(slug) {
  await connectDB()
  const record = await Property.findOne({ slug, status: 'Published' }).lean()
  return record ? toPublicProperty(record) : null
}
