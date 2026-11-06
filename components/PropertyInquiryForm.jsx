'use client'

import { useEffect, useState } from 'react'
import { createInquiryAction } from '@/actions/inquiry.action'
import { whatsappNumber } from '@/data/siteConfig'

export default function PropertyInquiryForm({ property }) {
  const isShortlet = property.category === 'Shortlet'
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [minimumDate, setMinimumDate] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [whatsappUrl, setWhatsappUrl] = useState('')

  useEffect(() => {
    setMinimumDate(new Date().toISOString().slice(0, 10))
  }, [])

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSaving(true)

    const form = new FormData(event.currentTarget)
    const inquiry = {
      propertySlug: property.slug,
      propertyTitle: property.title,
      name: String(form.get('fullName') || '').trim(),
      phone: String(form.get('phone') || '').trim(),
      email: String(form.get('email') || '').trim(),
      requestType: String(form.get('requestType') || ''),
      startDate: String(form.get('startDate') || ''),
      endDate: String(form.get('endDate') || ''),
      guests: String(form.get('guests') || ''),
      message: String(form.get('message') || '').trim(),
    }

    try {
      const result = await createInquiryAction(inquiry)
      if (!result?.success) {
        setError(result?.error || 'Your enquiry could not be saved. Please try again.')
        setSaving(false)
        return
      }

      const message = [
        isShortlet
          ? 'Hello Gate Homes, I would like to book this apartment'
          : 'Hello Gate Homes, I would like to make a property enquiry.',
        `Property: ${result.propertyTitle}`,
        `Listing: ${window.location.origin}/properties/${property.slug}`,
        result.propertyImage && `Listing photo: ${result.propertyImage}`,
        isShortlet && `Request: ${inquiry.requestType}`,
        `Name: ${inquiry.name}`,
        `Phone: ${inquiry.phone}`,
        inquiry.email && `Email: ${inquiry.email}`,
        isShortlet && `Start date: ${inquiry.startDate}`,
        isShortlet && `End date: ${inquiry.endDate}`,
        isShortlet && inquiry.guests && `Guests: ${inquiry.guests}`,
        inquiry.message && `Message: ${inquiry.message}`,
      ].filter(Boolean).join('\n')

      setWhatsappUrl(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`)
      setSubmitted(true)
      setSaving(false)
    } catch {
      setError('Your enquiry could not be saved. Please check your connection and try again.')
      setSaving(false)
    }
  }

  return (
    <>
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="inquiry-name" className="mb-1.5 block text-xs font-semibold text-slate-700">Full name</label>
        <input id="inquiry-name" name="fullName" autoComplete="name" required maxLength={100} className="input input-bordered h-11 min-h-11 w-full rounded-lg border-stone-300 bg-white text-sm !text-slate-950 placeholder:!text-slate-700 placeholder:!opacity-100" placeholder="Your name" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        <div>
          <label htmlFor="inquiry-phone" className="mb-1.5 block text-xs font-semibold text-slate-700">Phone number</label>
          <input id="inquiry-phone" name="phone" type="tel" autoComplete="tel" required maxLength={30} className="input input-bordered h-11 min-h-11 w-full rounded-lg border-stone-300 bg-white text-sm !text-slate-950 placeholder:!text-slate-700 placeholder:!opacity-100" placeholder="Your phone number" />
        </div>
        <div>
          <label htmlFor="inquiry-email" className="mb-1.5 flex items-center justify-between gap-1 text-xs font-semibold text-slate-700">Email {isShortlet && <span className="whitespace-nowrap text-[8px] font-medium text-emerald-800 sm:text-[9px]">(Discount on returning guest)</span>}</label>
          <input id="inquiry-email" name="email" type="email" autoComplete="email" maxLength={150} className="input input-bordered h-11 min-h-11 w-full rounded-lg border-stone-300 bg-white text-sm !text-slate-950 placeholder:!text-slate-700 placeholder:!opacity-100" placeholder="you@example.com" />
        </div>
      </div>
      {isShortlet && <>
        <div>
          <label htmlFor="booking-purpose" className="mb-1.5 block text-xs font-semibold text-slate-700">Purpose of booking</label>
          <select id="booking-purpose" name="requestType" defaultValue="Normal stay" className="select select-bordered h-11 min-h-11 w-full rounded-lg border-stone-300 bg-white text-sm !text-slate-950 [&>option]:text-slate-950">
            <option>Normal stay</option>
            <option>Get together</option>
            <option>Party</option>
          </select>
        </div>
        <fieldset className="space-y-3">
          <legend className="mb-2 text-xs font-semibold text-slate-900">Date of booking</legend>
          <div>
            <label htmlFor="booking-start-date" className="mb-1.5 block text-xs font-medium text-slate-800">Start date</label>
            <div className="relative">
              <input id="booking-start-date" name="startDate" type="date" required min={minimumDate || undefined} value={startDate} onChange={(event) => setStartDate(event.target.value)} className="inquiry-date-field input input-bordered h-11 min-h-11 w-full rounded-lg border-stone-300 bg-white text-sm !text-slate-950" style={{ color: '#020617', WebkitTextFillColor: '#020617', colorScheme: 'light' }} />
              {!startDate && <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-3 flex items-center pr-10 text-sm text-slate-500">Select start date</span>}
            </div>
          </div>
          <div>
            <label htmlFor="booking-end-date" className="mb-1.5 block text-xs font-medium text-slate-800">End date</label>
            <div className="relative">
              <input id="booking-end-date" name="endDate" type="date" required min={startDate || minimumDate || undefined} value={endDate} onChange={(event) => setEndDate(event.target.value)} className="inquiry-date-field input input-bordered h-11 min-h-11 w-full rounded-lg border-stone-300 bg-white text-sm !text-slate-950" style={{ color: '#020617', WebkitTextFillColor: '#020617', colorScheme: 'light' }} />
              {!endDate && <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-3 flex items-center pr-10 text-sm text-slate-500">Select end date</span>}
            </div>
          </div>
        </fieldset>
        <div>
          <label htmlFor="guest-count" className="mb-1.5 block text-xs font-semibold text-slate-700">Guests / visitors</label>
          <select id="guest-count" name="guests" defaultValue="1" className="select select-bordered h-11 min-h-11 w-full rounded-lg border-stone-300 bg-white text-sm !text-slate-950 [&>option]:text-slate-950">
            {Array.from({ length: 50 }, (_, index) => index + 1).map((count) => <option key={count} value={count}>{count} {count === 1 ? 'person' : 'people'}</option>)}
          </select>
        </div>
      </>}
      <div>
        <label htmlFor="inquiry-message" className="mb-1.5 block text-xs font-semibold text-slate-700">Additional details <span className="font-normal text-slate-500">(optional)</span></label>
        <textarea id="inquiry-message" name="message" rows={3} maxLength={1000} className="textarea textarea-bordered w-full rounded-lg border-stone-300 bg-white text-sm !text-slate-950 placeholder:!text-slate-700 placeholder:!opacity-100" placeholder="Tell us what you would like to know" />
      </div>
      {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      <button type="submit" disabled={saving} className="btn h-12 min-h-12 w-full rounded-lg border-0 bg-emerald-800 text-sm font-semibold text-white shadow-none hover:bg-emerald-900 disabled:opacity-70">
        {saving ? 'Saving inquiry…' : 'Send enquiry & proceed'}
      </button>
      <p className="flex items-center gap-2 rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2.5 text-xs font-semibold leading-5 text-emerald-950">
        <svg aria-hidden="true" className="size-4 shrink-0 text-emerald-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
        <span>Your information is securely protected.</span>
      </p>
    </form>
    {submitted && <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/55 p-4" role="presentation">
      <section role="dialog" aria-modal="true" aria-labelledby="inquiry-submitted-title" className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-6 shadow-2xl sm:p-7">
        <div className="flex size-12 items-center justify-center rounded-full bg-emerald-100 text-xl font-bold text-emerald-800" aria-hidden="true">✓</div>
        <h2 id="inquiry-submitted-title" className="mt-4 font-serif text-2xl font-bold text-slate-900">Enquiry submitted</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">Your details have been saved. Proceed to WhatsApp to confirm your enquiry.</p>
        <button type="button" onClick={() => window.location.assign(whatsappUrl)} className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-800 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-900">
          Continue to WhatsApp <span aria-hidden="true">→</span>
        </button>
        <p className="mt-3 text-center text-[11px] leading-5 text-slate-500">A response to your enquiry is ready on WhatsApp.</p>
      </section>
    </div>}
    </>
  )
}
