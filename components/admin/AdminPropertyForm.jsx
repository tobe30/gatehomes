'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createPropertyAction, updatePropertyAction, signPropertyImageUploadAction } from '@/actions/property.action'
import { lagosLocationSuggestions } from '@/data/locations'
import AdminIcon from './AdminIcon'
import { useAdminData } from './AdminDataContext'
import { PageHeading, PrimaryButton } from './AdminUI'

const propertyTypes = ['Fully Detached Duplex', 'Terrace', 'Apartment', 'Flat', 'Shortlet', 'Duplex', 'Bungalow']
const shortletTypes = propertyTypes
const amenityOptions = ['Swimming pool', 'BQ', 'Parking', '24/7 security', 'Generator', 'Fitted kitchen', 'Serviced', 'Garden', 'Gym', 'Elevator']
const fieldClass = 'mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-800 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/10'
const labelClass = 'block text-xs font-semibold text-slate-700'

function SectionCard({ title, description, children }) {
  return <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,.03)] sm:p-6"><div className="mb-5 border-b border-slate-100 pb-4"><h3 className="text-sm font-bold text-slate-900">{title}</h3>{description && <p className="mt-1.5 text-xs leading-5 text-slate-500">{description}</p>}</div>{children}</section>
}

function emptyPropertyForm() {
  return {
    title: '', category: 'Property', type: '', purpose: 'For Sale', price: '',
    discountPrice: '', isDeal: false, isFeatured: false, guests: '',
    checkin: '', checkout: '', location: '', address: '', beds: '', baths: '',
    toilets: '', description: '', amenities: [],
  }
}

function TextField({ label, value, onChange, error, ...props }) {
  return <label className={labelClass}>{label}<input {...props} value={value} onChange={(event) => onChange(event.target.value)} className={`${fieldClass} ${error ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/10' : ''}`} />{error && <span className="mt-1 block text-[11px] text-rose-600">{error}</span>}</label>
}

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('Image could not be compressed.')), type, quality)
  })
}

async function optimizeImage(file) {
  if (file.size > 20 * 1024 * 1024) throw new Error(`${file.name} is over 20 MB. Choose a smaller photo.`)

  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, 2000 / bitmap.width, 1600 / bitmap.height)
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(bitmap.width * scale))
  canvas.height = Math.max(1, Math.round(bitmap.height * scale))
  const context = canvas.getContext('2d')
  if (!context) {
    bitmap.close()
    throw new Error('This browser could not prepare the image for upload.')
  }
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()

  let blob
  for (const quality of [0.84, 0.76, 0.68, 0.6, 0.52]) {
    blob = await canvasToBlob(canvas, 'image/webp', quality)
    if (blob.size <= 1.5 * 1024 * 1024) break
  }
  if (!blob || blob.size > 1.5 * 1024 * 1024) {
    throw new Error(`${file.name} could not be compressed below 1.5 MB. Choose another photo.`)
  }

  const safeName = file.name.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '-')
  return new File([blob], `${safeName || 'property-photo'}.webp`, { type: blob.type || 'image/webp' })
}

async function uploadPropertyImage(file) {
  const optimizedFile = await optimizeImage(file)
  const authorization = await signPropertyImageUploadAction()
  if (authorization.error) throw new Error(authorization.error)

  const payload = new FormData()
  payload.append('file', optimizedFile)
  payload.append('api_key', authorization.apiKey)
  payload.append('timestamp', String(authorization.timestamp))
  payload.append('signature', authorization.signature)
  payload.append('public_id', authorization.publicId)
  payload.append('transformation', authorization.transformation)

  const response = await fetch(`https://api.cloudinary.com/v1_1/${authorization.cloudName}/image/upload`, {
    method: 'POST',
    body: payload,
  })
  const result = await response.json()
  if (!response.ok || !result.secure_url || !result.public_id) {
    throw new Error(result.error?.message || `Could not upload ${file.name}.`)
  }
  if (Number(result.bytes) > 2 * 1024 * 1024) {
    throw new Error(`${file.name} is still too large after optimization. Choose another photo.`)
  }

  return {
    src: result.secure_url,
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
    format: result.format || 'webp',
    bytes: result.bytes,
    name: file.name,
  }
}

export default function AdminPropertyForm({ mode = 'create', property }) {
  const router = useRouter()
  const { saveProperty, notify } = useAdminData()
  const [form, setForm] = useState(() => ({
    title: property?.title || '', category: property?.category || 'Property', type: property?.type || '', purpose: property?.purpose || 'For Sale', price: property?.price ? String(property.price) : '', discountPrice: property?.discountPrice ? String(property.discountPrice) : '', isDeal: property?.isDeal || false, isFeatured: property?.isFeatured || false, guests: property?.guests ? String(property.guests) : '', checkin: property?.checkin || '', checkout: property?.checkout || '', location: property?.location || '', address: property?.address || '', beds: property?.beds || '', baths: property?.baths || '', toilets: property?.toilets || '', description: property?.description || '', amenities: property?.amenities || [],
  }))
  const [images, setImages] = useState(() => property?.images?.length ? property.images.map((image) => typeof image === 'string' ? { src: image, url: image, name: 'Current image' } : { ...image, src: image.src || image.url, name: image.name || 'Property photo' }) : property?.image ? [{ src: property.image, url: property.image, name: 'Current cover image' }] : [])
  const [coverIndex, setCoverIndex] = useState(() => Math.max(0, property?.images?.findIndex((image) => typeof image === 'object' && image.isCover) ?? 0))
  const [errors, setErrors] = useState({})
  const [imageError, setImageError] = useState('')
  const [saving, setSaving] = useState(false)
  const [uploadingImages, setUploadingImages] = useState(false)
  const isEdit = mode === 'edit'

  function setField(name, value) {
    setForm((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: '' }))
  }

  async function addImages(event) {
    const files = Array.from(event.target.files || [])
    event.target.value = ''
    if (!files.length) return
    if (files.some((file) => !['image/jpeg', 'image/png', 'image/webp'].includes(file.type))) {
      setImageError('Choose JPG, PNG or WebP images.')
      return
    }
    if (images.length + files.length > 30) {
      setImageError('You can add up to 30 images.')
      return
    }
    try {
      setImageError('')
      setUploadingImages(true)
      for (const file of files) {
        const uploaded = await uploadPropertyImage(file)
        setImages((current) => [...current, uploaded])
      }
    } catch (error) {
      setImageError(error instanceof Error ? error.message : 'One or more images could not be uploaded.')
    } finally {
      setUploadingImages(false)
    }
  }

  function removeImage(index) {
    setImages((current) => current.filter((_, itemIndex) => itemIndex !== index))
    if (coverIndex === index) setCoverIndex(0)
    else if (coverIndex > index) setCoverIndex((current) => current - 1)
  }

  function toggleAmenity(value) {
    setForm((current) => ({ ...current, amenities: current.amenities.includes(value) ? current.amenities.filter((item) => item !== value) : [...current.amenities, value] }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (uploadingImages) {
      setImageError('Wait for your photos to finish uploading before saving.')
      return
    }
    const submitMode = event.nativeEvent.submitter?.value || 'Published'
    const nextErrors = {}
    if (!form.title.trim()) nextErrors.title = 'Enter a property title.'
    if (submitMode === 'Published') {
      if (!form.type) nextErrors.type = 'Choose a property type.'
      if (!form.category) nextErrors.category = 'Choose Property or Shortlet.'
      if (form.category === 'Property' && !form.purpose) nextErrors.purpose = 'Choose sale or rent.'
      if (!form.price || Number(form.price) <= 0) nextErrors.price = 'Enter a price greater than zero.'
      if (form.category === 'Shortlet' && (!form.guests || Number(form.guests) < 1)) nextErrors.guests = 'Enter the maximum number of guests.'
      if (form.category === 'Shortlet' && form.checkin && form.checkout && form.checkout <= form.checkin) nextErrors.checkout = 'Check-out must be after check-in.'
      if (form.discountPrice && Number(form.discountPrice) <= 0) nextErrors.discountPrice = 'Enter a discounted price greater than zero.'
      if (form.discountPrice && Number(form.price) && Number(form.discountPrice) >= Number(form.price)) nextErrors.discountPrice = 'Discounted price must be less than the regular price.'
      if (form.isDeal && !form.discountPrice) nextErrors.discountPrice = 'Add a discounted price to feature this as a deal.'
      if (!form.location.trim()) nextErrors.location = 'Enter the property location.'
      if (!form.address.trim()) nextErrors.address = 'Enter the full address.'
      if (!form.description.trim()) nextErrors.description = 'Add a property description.'
      if (images.length < 5) setImageError('Add at least 5 property images before publishing.')
    }
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length || (submitMode === 'Published' && images.length < 5)) return

    setSaving(true)
    try {
      const input = {
        ...form,
        title: form.title.trim(),
        location: form.location.trim(),
        address: form.address.trim(),
        price: Number(form.price) || 0,
        discountPrice: Number(form.discountPrice) || null,
        guests: form.category === 'Shortlet' ? Number(form.guests) || 0 : null,
        checkin: form.category === 'Shortlet' ? form.checkin || '' : '',
        checkout: form.category === 'Shortlet' ? form.checkout || '' : '',
        beds: Number(form.beds) || 0,
        baths: Number(form.baths) || 0,
        toilets: Number(form.toilets) || 0,
        amenities: form.amenities,
        images: images.map((image, index) => ({
          url: image.url || image.src,
          publicId: image.publicId,
          width: image.width,
          height: image.height,
          format: image.format,
          bytes: image.bytes,
          isCover: index === coverIndex,
        })),
        status: submitMode,
      }
      const result = isEdit
        ? await updatePropertyAction(property.id, input)
        : await createPropertyAction(input)

      if (result.error) {
        notify(result.error, 'error')
        return
      }

      saveProperty(result.property)
      notify(isEdit ? 'Property changes saved.' : `Property saved as ${submitMode.toLowerCase()}.`)
      if (!isEdit) {
        setForm(emptyPropertyForm())
        setImages([])
        setCoverIndex(0)
        setErrors({})
        setImageError('')
      }
      router.push('/admin/properties')
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Property could not be saved. Try again.', 'error')
    } finally {
      setSaving(false)
    }
  }

  return <>
    <PageHeading eyebrow={isEdit ? 'Inventory / Edit' : 'Inventory / New listing'} title={isEdit ? 'Edit listing' : 'Add listing'} description={isEdit ? 'Update the listing details and publication status.' : 'Enter the listing information, add photos and choose whether to publish it now.'} action={<Link href="/admin/properties" className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">← <span className="hidden sm:inline">Back to listings</span><span className="sm:hidden">Back</span></Link>} />
    <form onSubmit={handleSubmit} noValidate className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
      <div className="space-y-5">
        <SectionCard title="Basic information" description="Choose whether this is a property listing or a shortlet, then add its key details.">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2"><TextField label="Property title *" value={form.title} onChange={(value) => setField('title', value)} error={errors.title} placeholder="e.g. 3 Bedroom Serviced Apartment" /></div>
            <label className={labelClass}>Listing category *<select value={form.category} onChange={(event) => setField('category', event.target.value)} className={`${fieldClass} ${errors.category ? 'border-rose-400' : ''}`}><option>Property</option><option>Shortlet</option></select>{errors.category && <span className="mt-1 block text-[11px] text-rose-600">{errors.category}</span>}</label>
            <label className={labelClass}>{form.category === 'Shortlet' ? 'Accommodation type *' : 'Property type *'}<select value={form.type} onChange={(event) => setField('type', event.target.value)} className={`${fieldClass} ${errors.type ? 'border-rose-400' : ''}`}><option value="">Select type</option>{(form.category === 'Shortlet' ? shortletTypes : propertyTypes).map((type) => <option key={type}>{type}</option>)}</select>{errors.type && <span className="mt-1 block text-[11px] text-rose-600">{errors.type}</span>}</label>
            {form.category === 'Property' && <label className={labelClass}>Listing purpose *<select value={form.purpose} onChange={(event) => setField('purpose', event.target.value)} className={`${fieldClass} ${errors.purpose ? 'border-rose-400' : ''}`}><option>For Sale</option><option>For Rent</option></select>{errors.purpose && <span className="mt-1 block text-[11px] text-rose-600">{errors.purpose}</span>}</label>}
            <TextField label={form.category === 'Shortlet' ? 'Nightly rate (₦) *' : 'Regular price (₦) *'} type="number" min="1" value={form.price} onChange={(value) => setField('price', value)} error={errors.price} placeholder={form.category === 'Shortlet' ? 'e.g. 150000' : 'e.g. 185000000'} />
            <TextField label="Discounted price (₦)" type="number" min="1" value={form.discountPrice} onChange={(value) => setField('discountPrice', value)} error={errors.discountPrice} placeholder="Optional" />
            {form.discountPrice && Number(form.price) > Number(form.discountPrice) && <p className="-mt-2 text-xs text-emerald-800 sm:col-span-2">Discount: {Math.round((1 - Number(form.discountPrice) / Number(form.price)) * 100)}% off the regular price.</p>}
            {form.category === 'Shortlet' && <TextField label="Maximum guests *" type="number" min="1" max="50" value={form.guests} onChange={(value) => setField('guests', value)} error={errors.guests} placeholder="e.g. 4" />}
            {form.category === 'Shortlet' && <>
              <TextField label="Available check-in date" type="date" value={form.checkin} onChange={(value) => setField('checkin', value)} placeholder="" />
              <TextField label="Available check-out date" type="date" min={form.checkin || undefined} value={form.checkout} onChange={(value) => setField('checkout', value)} error={errors.checkout} placeholder="" />
              <p className="-mt-2 text-xs leading-5 text-slate-500 sm:col-span-2">Optional availability dates for this shortlet. These don’t confirm a booking; Gate Homes still needs to confirm availability.</p>
            </>}
            <TextField label="Location *" list="property-location-suggestions" autoComplete="off" value={form.location} onChange={(value) => setField('location', value)} error={errors.location} placeholder="Type or choose a Lagos location" />
            <datalist id="property-location-suggestions">{lagosLocationSuggestions.map((location) => <option key={location} value={location} />)}</datalist>
            <div className="sm:col-span-2"><TextField label="Full address *" value={form.address} onChange={(value) => setField('address', value)} error={errors.address} placeholder="Street, estate or landmark, city" /></div>
          </div>
        </SectionCard>

        <SectionCard title={form.category === 'Shortlet' ? 'Shortlet details' : 'Property details'} description={form.category === 'Shortlet' ? 'Add the accommodation specifications and stay amenities.' : 'Add the main specifications and features of this listing.'}>
          <div className="grid gap-4 sm:grid-cols-3"><TextField label="Bedrooms" type="number" min="0" value={form.beds} onChange={(value) => setField('beds', value)} placeholder="0"/><TextField label="Bathrooms" type="number" min="0" value={form.baths} onChange={(value) => setField('baths', value)} placeholder="0"/><TextField label="Toilets" type="number" min="0" value={form.toilets} onChange={(value) => setField('toilets', value)} placeholder="0"/></div>
          <label className={`${labelClass} mt-5`}>Description *<textarea rows={5} value={form.description} onChange={(event) => setField('description', event.target.value)} placeholder="Describe the property, its layout and what makes it a good fit…" className={`mt-1.5 w-full rounded-xl border bg-white px-3.5 py-3 text-sm leading-6 text-slate-800 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/10 ${errors.description ? 'border-rose-400' : 'border-slate-200'}`}/>{errors.description && <span className="mt-1 block text-[11px] text-rose-600">{errors.description}</span>}</label>
          <div className="mt-5"><p className={labelClass}>Amenities and features</p><div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">{amenityOptions.map((amenity) => <label key={amenity} className="flex min-h-10 cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-3 text-xs text-slate-600 transition-colors hover:border-emerald-300 hover:bg-emerald-50/40"><input type="checkbox" checked={form.amenities.includes(amenity)} onChange={() => toggleAmenity(amenity)} className="checkbox checkbox-sm rounded border-slate-300 [--chkbg:#166534] [--chkfg:white]"/>{amenity}</label>)}</div></div>
        </SectionCard>

        <SectionCard title="Property photos" description="Add at least 5 and up to 30 JPG, PNG or WebP images. Photos are resized and compressed before upload. Choose which image appears first in the listing.">
          <label className={`flex min-h-36 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 text-center transition-colors ${images.length >= 30 || uploadingImages ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/40'}`}><span className="flex size-11 items-center justify-center rounded-xl bg-white text-emerald-800 shadow-sm"><AdminIcon name="plus" size={20}/></span><span className="mt-3 text-sm font-semibold text-slate-800">{uploadingImages ? 'Optimizing and uploading…' : 'Choose photos to upload'}</span><span className="mt-1 text-xs text-slate-500">{images.length} of 30 photos · minimum 5 to publish · each compressed to 1.5 MB or less</span><input type="file" accept="image/jpeg,image/png,image/webp" multiple disabled={images.length >= 30 || uploadingImages || saving} onChange={addImages} className="sr-only"/></label>
          {imageError && <p role="alert" className="mt-3 text-xs text-rose-600">{imageError}</p>}
          {images.length > 0 && <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">{images.map((image, index) => <div key={`${image.name}-${index}`} className={`relative overflow-hidden rounded-xl border bg-slate-100 ${coverIndex === index ? 'border-emerald-600 ring-2 ring-emerald-600/15' : 'border-slate-200'}`}><div className="relative aspect-[4/3]"><Image src={image.src} alt={image.name || `Property image ${index + 1}`} fill sizes="180px" className="object-cover"/></div><div className="flex items-center justify-between gap-2 p-2"><button type="button" onClick={() => setCoverIndex(index)} className={`truncate text-[10px] font-semibold ${coverIndex === index ? 'text-emerald-800' : 'text-slate-600 hover:text-emerald-800'}`}>{coverIndex === index ? 'Cover image' : 'Set as cover'}</button><button type="button" onClick={() => removeImage(index)} aria-label={`Remove image ${index + 1}`} className="flex size-7 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-700"><AdminIcon name="trash" size={14}/></button></div></div>)}</div>}
        </SectionCard>
      </div>

      <aside className="space-y-5 xl:sticky xl:top-24">
        <SectionCard title="Publishing" description="Save this listing as a draft or publish it in the Gate Homes inventory.">
          <div className="space-y-3"><button type="submit" value="Draft" disabled={saving || uploadingImages} className="flex min-h-12 w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-60">{saving ? 'Saving…' : 'Save as draft'}</button><PrimaryButton type="submit" value="Published" disabled={saving || uploadingImages} className="w-full">{saving ? 'Saving…' : isEdit ? 'Update & publish' : 'Publish property'}</PrimaryButton></div>
          <p className="mt-4 text-[11px] leading-5 text-slate-500">Listings are saved in MongoDB. The public homepage still uses its current sample listings until its data source is connected.</p>
        </SectionCard>
        <SectionCard title="Homepage placement" description="Choose which homepage groups this listing belongs to.">
          <div className="space-y-3">
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-3.5 transition-colors hover:border-emerald-300 hover:bg-emerald-50/30">
              <input type="checkbox" checked={form.isFeatured} onChange={(event) => setField('isFeatured', event.target.checked)} className="checkbox checkbox-sm mt-0.5 rounded border-slate-300 [--chkbg:#166534] [--chkfg:white]" />
              <span><span className="block text-xs font-semibold text-slate-800">Feature this listing</span><span className="mt-1 block text-[11px] leading-5 text-slate-500">Mark it for the featured properties section.</span></span>
            </label>
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-3.5 transition-colors hover:border-emerald-300 hover:bg-emerald-50/30">
              <input type="checkbox" checked={form.isDeal} onChange={(event) => setField('isDeal', event.target.checked)} className="checkbox checkbox-sm mt-0.5 rounded border-slate-300 [--chkbg:#166534] [--chkfg:white]" />
              <span><span className="block text-xs font-semibold text-slate-800">Include in Deals of the week</span><span className="mt-1 block text-[11px] leading-5 text-slate-500">Requires a discounted price below the regular price.</span></span>
            </label>
          </div>
          {errors.discountPrice && form.isDeal && <p className="mt-2 text-[11px] text-rose-600">{errors.discountPrice}</p>}
          <p className="mt-3 text-[10px] leading-4 text-slate-400">These flags are saved with the dashboard listing. The public homepage still uses separate sample listings.</p>
        </SectionCard>
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4"><p className="text-xs font-bold text-emerald-950">Helpful tip</p><p className="mt-1.5 text-xs leading-5 text-emerald-900/75">Use a specific title, clear photos and accurate property details to help clients make a confident decision.</p></div>
      </aside>
    </form>
  </>
}
