'use client'

import { useState } from 'react'
import { createReviewAction } from '@/actions/review.action'

export default function ReviewForm({ propertySlug }) {
  const [rating, setRating] = useState(0)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    if (!rating) {
      setError('Choose a star rating before submitting.')
      return
    }

    setSaving(true)
    const formElement = event.currentTarget
    const formData = new FormData(formElement)
    try {
      const result = await createReviewAction({
        propertySlug,
        name: formData.get('name'),
        rating,
        comment: formData.get('comment'),
      })
      if (!result.success) {
        setError(result.error || 'Your review could not be submitted.')
        return
      }
      formElement.reset()
      setRating(0)
      setSubmitted(true)
    } catch {
      setError('Your review could not be submitted. Check your connection and try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section aria-labelledby="leave-review-title" className="mt-8 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-900">Share your experience</p>
      <h3 id="leave-review-title" className="mt-2 font-serif text-xl font-bold text-slate-900">Leave a review</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">Please review this listing only if you have genuinely viewed, rented, bought, or stayed in it.</p>

      {submitted ? <div role="status" className="mt-5 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-4">
        <p className="text-sm font-semibold text-emerald-900">Review submitted</p>
        <p className="mt-1 text-sm leading-6 text-emerald-800">Thanks for sharing your experience. Your review will appear here after Gate Homes reviews it.</p>
      </div> : <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <fieldset>
          <legend className="mb-2 block text-xs font-semibold text-slate-700">Your rating</legend>
          <div className="flex items-center gap-1" role="radiogroup" aria-label="Choose a rating from one to five stars">
            {[1, 2, 3, 4, 5].map((value) => <label key={value} className="cursor-pointer rounded-md p-1 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-emerald-700">
              <input type="radio" name="rating-choice" value={value} checked={rating === value} onChange={() => setRating(value)} className="sr-only" aria-label={`${value} ${value === 1 ? 'star' : 'stars'}`} />
              <span aria-hidden="true" className={`text-3xl leading-none transition-colors ${value <= rating ? 'text-emerald-700' : 'text-slate-300'}`}>★</span>
            </label>)}
            <span className="ml-2 text-xs text-slate-500">{rating ? `${rating} out of 5` : 'Select a rating'}</span>
          </div>
        </fieldset>
        <label className="block text-xs font-semibold text-slate-700">Your name
          <input name="name" required minLength={2} maxLength={80} autoComplete="name" placeholder="Name shown with your review" className="input input-bordered mt-1.5 h-11 min-h-11 w-full rounded-xl border-stone-300 bg-white text-sm font-normal" />
        </label>
        <label className="block text-xs font-semibold text-slate-700">Your review
          <textarea name="comment" required minLength={10} maxLength={2000} rows={4} placeholder="Tell others about your experience with this listing" className="textarea textarea-bordered mt-1.5 w-full rounded-xl border-stone-300 bg-white text-sm font-normal leading-6" />
        </label>
        {error && <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2.5 text-sm text-rose-700">{error}</p>}
        <button type="submit" disabled={saving} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-800 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto">
          {saving ? 'Submitting review…' : 'Submit review'}
        </button>
        <p className="text-[11px] leading-5 text-slate-500">Reviews are checked by Gate Homes before they appear publicly.</p>
      </form>}
    </section>
  )
}
