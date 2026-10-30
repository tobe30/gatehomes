'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import AdminIcon from './AdminIcon'
import { useAdminData } from './AdminDataContext'
import { PageHeading, PrimaryButton } from './AdminUI'

const propertyTypes = ['Apartment', 'House', 'Duplex', 'Terrace', 'Land', 'Commercial']
const amenityOptions = ['Swimming pool', 'BQ', 'Parking', '24/7 security', 'Generator', 'Fitted kitchen', 'Serviced', 'Garden', 'Gym', 'Elevator']
const fieldClass = 'mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-800 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/10'
const labelClass = 'block text-xs font-semibold text-slate-700'

function SectionCard({ title, description, children }) {
  return <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,.03)] sm:p-6"><div className="mb-5 border-b border-slate-100 pb-4"><h3 className="text-sm font-bold text-slate-900">{title}</h3>{description && <p className="mt-1.5 text-xs leading-5 text-slate-500">{description}</p>}</div>{children}</section>
}

function TextField({ label, value, onChange, error, ...props }) {
  return <label className={labelClass}>{label}<input {...props} value={value} onChange={(event) => onChange(event.target.value)} className={`${fieldClass} ${error ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/10' : ''}`} />{error && <span className="mt-1 block text-[11px] text-rose-600">{error}</span>}</label>
}

function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve({ src: reader.result, name: file.name })
    reader.onerror = () => reject(new Error('Image could not be read.'))
    reader.readAsDataURL(file)
  })
}

export default function AdminPropertyForm({ mode = 'create', property }) {
  const router = useRouter()
  const { saveProperty, notify } = useAdminData()
  const [form, setForm] = useState(() => ({
    title: property?.title || '', type: property?.type || '', purpose: property?.purpose || 'For Sale', price: property?.price ? String(property.price) : '', discountPrice: property?.discountPrice ? String(property.discountPrice) : '', location: property?.location || '', address: property?.address || '', beds: property?.beds || '', baths: property?.baths || '', toilets: property?.toilets || '', description: property?.description || '', amenities: property?.amenities || [],
  }))
  const [images, setImages] = useState(() => property?.images?.length ? property.images : property?.image ? [{ src: property.image, name: 'Current cover image' }] : [])
  const [coverIndex, setCoverIndex] = useState(0)
  const [errors, setErrors] = useState({})
  const [imageError, setImageError] = useState('')
  const [saving, setSaving] = useState(false)
  const isEdit = mode === 'edit'

  function setField(name, value) {
    setForm((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: '' }))
  }

  async function addImages(event) {
    const files = Array.from(event.target.files || [])
    event.target.value = ''
    if (!files.length) return
    if (files.some((file) => !file.type.startsWith('image/'))) {
      setImageError('Choose image files only.')
      return
    }
    if (images.length + files.length > 10) {
      setImageError('You can add up to 10 images.')
      return
    }
    try {
      setImageError('')
      const loaded = await Promise.all(files.map(readFile))
      setImages((current) => [...current, ...loaded])
    } catch {
      setImageError('One or more images could not be loaded. Try again.')
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

  function handleSubmit(event) {
    event.preventDefault()
    const submitMode = event.nativeEvent.submitter?.value || 'Published'
    const nextErrors = {}
    if (!form.title.trim()) nextErrors.title = 'Enter a property title.'
    if (submitMode === 'Published') {
      if (!form.type) nextErrors.type = 'Choose a property type.'
      if (!form.purpose) nextErrors.purpose = 'Choose sale or rent.'
      if (!form.price || Number(form.price) <= 0) nextErrors.price = 'Enter a price greater than zero.'
      if (form.discountPrice && Number(form.discountPrice) <= 0) nextErrors.discountPrice = 'Enter a discounted price greater than zero.'
      if (form.discountPrice && Number(form.price) && Number(form.discountPrice) >= Number(form.price)) nextErrors.discountPrice = 'Discounted price must be less than the regular price.'
      if (!form.location.trim()) nextErrors.location = 'Enter the property location.'
      if (!form.address.trim()) nextErrors.address = 'Enter the full address.'
      if (!form.description.trim()) nextErrors.description = 'Add a property description.'
      if (!images.length) setImageError('Add at least one property image before publishing.')
    }
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length || (submitMode === 'Published' && !images.length)) return

    setSaving(true)
    const id = property?.id || `GH-${String(Date.now()).slice(-6)}`
    const saved = {
      ...property,
      ...form,
      id,
      title: form.title.trim(),
      location: form.location.trim(),
      address: form.address.trim(),
      price: Number(form.price) || 0,
      discountPrice: Number(form.discountPrice) || null,
      beds: Number(form.beds) || 0,
      baths: Number(form.baths) || 0,
      toilets: Number(form.toilets) || 0,
      amenities: form.amenities,
      image: images[coverIndex]?.src || images[0]?.src || '/lagos-apartment-building.jpg',
      images,
      status: submitMode,
      added: property?.added || new Date().toISOString().slice(0, 10),
    }
    window.setTimeout(() => {
      saveProperty(saved)
      notify(isEdit ? `${saved.title} updated in this demo.` : `${saved.title} saved as ${submitMode.toLowerCase()} in this demo.`)
      router.push(`/admin/properties/${id}/edit`)
      setSaving(false)
    }, 300)
  }

  return <>
    <PageHeading eyebrow={isEdit ? 'Inventory / Edit' : 'Inventory / New listing'} title={isEdit ? 'Edit property' : 'Add a property'} description={isEdit ? 'Update the property details and publication status.' : 'Enter the property information, add photos and choose whether to publish it now.'} action={<Link href="/admin/properties" className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">← <span className="hidden sm:inline">Back to properties</span><span className="sm:hidden">Back</span></Link>} />
    <form onSubmit={handleSubmit} noValidate className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
      <div className="space-y-5">
        <SectionCard title="Basic information" description="Start with a clear title and the essentials buyers or renters need.">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2"><TextField label="Property title *" value={form.title} onChange={(value) => setField('title', value)} error={errors.title} placeholder="e.g. 3 Bedroom Serviced Apartment" /></div>
            <label className={labelClass}>Property type *<select value={form.type} onChange={(event) => setField('type', event.target.value)} className={`${fieldClass} ${errors.type ? 'border-rose-400' : ''}`}><option value="">Select type</option>{propertyTypes.map((type) => <option key={type}>{type}</option>)}</select>{errors.type && <span className="mt-1 block text-[11px] text-rose-600">{errors.type}</span>}</label>
            <label className={labelClass}>Listing purpose *<select value={form.purpose} onChange={(event) => setField('purpose', event.target.value)} className={`${fieldClass} ${errors.purpose ? 'border-rose-400' : ''}`}><option>For Sale</option><option>For Rent</option></select>{errors.purpose && <span className="mt-1 block text-[11px] text-rose-600">{errors.purpose}</span>}</label>
            <TextField label="Regular price (₦) *" type="number" min="1" value={form.price} onChange={(value) => setField('price', value)} error={errors.price} placeholder="e.g. 185000000" />
            <TextField label="Discounted price (₦)" type="number" min="1" value={form.discountPrice} onChange={(value) => setField('discountPrice', value)} error={errors.discountPrice} placeholder="Optional" />
            {form.discountPrice && Number(form.price) > Number(form.discountPrice) && <p className="-mt-2 text-xs text-emerald-800 sm:col-span-2">Discount: {Math.round((1 - Number(form.discountPrice) / Number(form.price)) * 100)}% off the regular price.</p>}
            <TextField label="Location *" value={form.location} onChange={(value) => setField('location', value)} error={errors.location} placeholder="e.g. Lekki Phase 1, Lagos" />
            <div className="sm:col-span-2"><TextField label="Full address *" value={form.address} onChange={(value) => setField('address', value)} error={errors.address} placeholder="Street, estate or landmark, city" /></div>
          </div>
        </SectionCard>

        <SectionCard title="Property details" description="Add the main specifications and features of this listing.">
          <div className="grid gap-4 sm:grid-cols-3"><TextField label="Bedrooms" type="number" min="0" value={form.beds} onChange={(value) => setField('beds', value)} placeholder="0"/><TextField label="Bathrooms" type="number" min="0" value={form.baths} onChange={(value) => setField('baths', value)} placeholder="0"/><TextField label="Toilets" type="number" min="0" value={form.toilets} onChange={(value) => setField('toilets', value)} placeholder="0"/></div>
          <label className={`${labelClass} mt-5`}>Description *<textarea rows={5} value={form.description} onChange={(event) => setField('description', event.target.value)} placeholder="Describe the property, its layout and what makes it a good fit…" className={`mt-1.5 w-full rounded-xl border bg-white px-3.5 py-3 text-sm leading-6 text-slate-800 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/10 ${errors.description ? 'border-rose-400' : 'border-slate-200'}`}/>{errors.description && <span className="mt-1 block text-[11px] text-rose-600">{errors.description}</span>}</label>
          <div className="mt-5"><p className={labelClass}>Amenities and features</p><div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">{amenityOptions.map((amenity) => <label key={amenity} className="flex min-h-10 cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-3 text-xs text-slate-600 transition-colors hover:border-emerald-300 hover:bg-emerald-50/40"><input type="checkbox" checked={form.amenities.includes(amenity)} onChange={() => toggleAmenity(amenity)} className="checkbox checkbox-sm rounded border-slate-300 [--chkbg:#166534] [--chkfg:white]"/>{amenity}</label>)}</div></div>
        </SectionCard>

        <SectionCard title="Property photos" description="Add up to 10 JPG, PNG or WebP images. Choose which image appears first in the listing.">
          <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 text-center transition-colors hover:border-emerald-500 hover:bg-emerald-50/40"><span className="flex size-11 items-center justify-center rounded-xl bg-white text-emerald-800 shadow-sm"><AdminIcon name="plus" size={20}/></span><span className="mt-3 text-sm font-semibold text-slate-800">Choose photos to upload</span><span className="mt-1 text-xs text-slate-500">Select multiple files from your device</span><input type="file" accept="image/*" multiple onChange={addImages} className="sr-only"/></label>
          {imageError && <p role="alert" className="mt-3 text-xs text-rose-600">{imageError}</p>}
          {images.length > 0 && <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">{images.map((image, index) => <div key={`${image.name}-${index}`} className={`relative overflow-hidden rounded-xl border bg-slate-100 ${coverIndex === index ? 'border-emerald-600 ring-2 ring-emerald-600/15' : 'border-slate-200'}`}><div className="relative aspect-[4/3]"><Image src={image.src} alt={image.name || `Property image ${index + 1}`} fill sizes="180px" className="object-cover"/></div><div className="flex items-center justify-between gap-2 p-2"><button type="button" onClick={() => setCoverIndex(index)} className={`truncate text-[10px] font-semibold ${coverIndex === index ? 'text-emerald-800' : 'text-slate-600 hover:text-emerald-800'}`}>{coverIndex === index ? 'Cover image' : 'Set as cover'}</button><button type="button" onClick={() => removeImage(index)} aria-label={`Remove image ${index + 1}`} className="flex size-7 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-700"><AdminIcon name="trash" size={14}/></button></div></div>)}</div>}
        </SectionCard>
      </div>

      <aside className="space-y-5 xl:sticky xl:top-24">
        <SectionCard title="Publishing" description="Choose how this property appears in your mock inventory.">
          <div className="space-y-3"><button type="submit" value="Draft" disabled={saving} className="flex min-h-12 w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-60">{saving ? 'Saving…' : 'Save as draft'}</button><PrimaryButton type="submit" value="Published" disabled={saving} className="w-full">{saving ? 'Saving…' : isEdit ? 'Update & publish' : 'Publish property'}</PrimaryButton></div>
          <p className="mt-4 text-[11px] leading-5 text-slate-500">Drafts stay in this demo dashboard only. Publishing does not send this property to the public site.</p>
        </SectionCard>
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4"><p className="text-xs font-bold text-emerald-950">Helpful tip</p><p className="mt-1.5 text-xs leading-5 text-emerald-900/75">Use a specific title, clear photos and accurate property details to help clients make a confident decision.</p></div>
      </aside>
    </form>
  </>
}
