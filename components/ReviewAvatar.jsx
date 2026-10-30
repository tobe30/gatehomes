import Image from 'next/image'

const portraits = [
  '/review-avatar-black-1.jpg',
  '/review-avatar-black-2.jpg',
]

export default function ReviewAvatar({ variant = 0 }) {
  return (
    <span className="relative size-12 shrink-0 overflow-hidden rounded-full bg-emerald-50 ring-2 ring-white shadow-sm">
      <Image
        src={portraits[variant % portraits.length]}
        alt=""
        fill
        sizes="48px"
        className="object-cover"
      />
    </span>
  )
}
