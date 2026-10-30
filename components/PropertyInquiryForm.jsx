'use client'

import { useState } from 'react'
import { whatsappNumber } from '@/data/siteConfig'

const savedInquiriesKey = 'gatehomes-property-inquiries'

export default function PropertyInquiryForm({ property }) {
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSaving(true)

    const form = new FormData(event.currentTarget)
    const inquiry = {
      id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}`,
      propertySlug: property.slug,
      propertyTitle: property.title,
      fullName: String(form.get('fullName') || '').trim(),
      phone: String(form.get('phone') || '').trim(),
      email: String(form.get('email') || '').trim(),
      requestType: String(form.get('requestType') || ''),
      preferredDate: String(form.get('preferredDate') || ''),
      guests: String(form.get('guests') || ''),
      message: String(form.get('message') || '').trim(),
      savedAt: new Date().toISOString(),
    }

    try {
      const existing = JSON.parse(window.localStorage.getItem(savedInquiriesKey) || '[]')
      const inquiries = Array.isArray(existing) ? existing : []
      window.localStorage.setItem(savedInquiriesKey, JSON.stringify([...inquiries, inquiry]))

      const message = [
        'Hello Gate Homes, I would like to make a property inquiry.',
        `Property: ${inquiry.propertyTitle}`,
        `Request: ${inquiry.requestType}`,
        `Name: ${inquiry.fullName}`,
        `Phone: ${inquiry.phone}`,
        inquiry.email && `Email: ${inquiry.email}`,
        inquiry.preferredDate && `Preferred date: ${inquiry.preferredDate}`,
        inquiry.guests && `Guests: ${inquiry.guests}`,
        inquiry.message && `Message: ${inquiry.message}`,
      ].filter(Boolean).join('\n')

      window.location.assign(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`)
    } catch {
      setError('This browser could not save your inquiry. Check that browser storage is available, then try again.')
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="inquiry-name" className="mb-1.5 block text-xs font-semibold text-slate-700">Full name</label>
        <input id="inquiry-name" name="fullName" autoComplete="name" required maxLength={100} className="input input-bordered h-11 min-h-11 w-full rounded-lg border-stone-300 bg-white text-sm" placeholder="Your name" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        <div>
          <label htmlFor="inquiry-phone" className="mb-1.5 block text-xs font-semibold text-slate-700">Phone number</label>
          <input id="inquiry-phone" name="phone" type="tel" autoComplete="tel" required maxLength={30} className="input input-bordered h-11 min-h-11 w-full rounded-lg border-stone-300 bg-white text-sm" placeholder="Your phone number" />
        </div>
        <div>
          <label htmlFor="inquiry-email" className="mb-1.5 block text-xs font-semibold text-slate-700">Email <span className="font-normal text-slate-500">(optional)</span></label>
          <input id="inquiry-email" name="email" type="email" autoComplete="email" maxLength={150} className="input input-bordered h-11 min-h-11 w-full rounded-lg border-stone-300 bg-white text-sm" placeholder="you@example.com" />
        </div>
      </div>
      <div>
        <label htmlFor="request-type" className="mb-1.5 block text-xs font-semibold text-slate-700">What would you like to do?</label>
        <select id="request-type" name="requestType" defaultValue="Inspection" className="select select-bordered h-11 min-h-11 w-full rounded-lg border-stone-300 bg-white text-sm">
          <option>Book this property</option>
          <option>Arrange an inspection</option>
          <option>Book and arrange an inspection</option>
          <option>Ask a question</option>
        </select>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        <div>
          <label htmlFor="preferred-date" className="mb-1.5 block text-xs font-semibold text-slate-700">Preferred date <span className="font-normal text-slate-500">(optional)</span></label>
          <input id="preferred-date" name="preferredDate" type="date" min={new Date().toISOString().slice(0, 10)} className="input input-bordered h-11 min-h-11 w-full rounded-lg border-stone-300 bg-white text-sm" />
        </div>
        <div>
          <label htmlFor="guest-count" className="mb-1.5 block text-xs font-semibold text-slate-700">Guests / visitors</label>
          <select id="guest-count" name="guests" defaultValue="1" className="select select-bordered h-11 min-h-11 w-full rounded-lg border-stone-300 bg-white text-sm">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((count) => <option key={count} value={count}>{count} {count === 1 ? 'person' : 'people'}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="inquiry-message" className="mb-1.5 block text-xs font-semibold text-slate-700">Additional details <span className="font-normal text-slate-500">(optional)</span></label>
        <textarea id="inquiry-message" name="message" rows={3} maxLength={1000} className="textarea textarea-bordered w-full rounded-lg border-stone-300 bg-white text-sm" placeholder="Tell us what you would like to know" />
      </div>
      <label className="flex cursor-pointer items-start gap-2 text-xs leading-5 text-slate-600">
        <input name="saveCopy" type="checkbox" required className="checkbox checkbox-sm mt-0.5 rounded border-stone-300 [--chkbg:#166534] [--chkfg:white]" />
        <span>Save a copy of my inquiry in this browser and continue to WhatsApp.</span>
      </label>
      {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      <button type="submit" disabled={saving} className="btn h-12 min-h-12 w-full rounded-lg border-0 bg-emerald-800 text-sm font-semibold text-white shadow-none hover:bg-emerald-900 disabled:opacity-70">
        {saving ? 'Saving inquiry…' : 'Save inquiry & continue to WhatsApp'}
      </button>
      <p className="text-[11px] leading-5 text-slate-500">A copy is saved only in this browser on this device. WhatsApp opens with your inquiry ready to send. The WhatsApp destination is a demo number until Gate Homes configures its real number.</p>
    </form>
  )
}
