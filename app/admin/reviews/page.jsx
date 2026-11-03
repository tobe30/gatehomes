'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import AdminIcon from '@/components/admin/AdminIcon'
import { deleteReviewAction, getAdminReviewsAction, updateReviewStatusAction } from '@/actions/review.action'
import { EmptyState, FilterSelect, formatDate, PageHeading, SearchField, StatusPill } from '@/components/admin/AdminUI'
import { useAdminData } from '@/components/admin/AdminDataContext'

export default function AdminReviewsPage() {
  const { notify } = useAdminData()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('All reviews')
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    getAdminReviewsAction().then((result) => {
      if (!active) return
      if (result.reviews) setReviews(result.reviews)
      else setError(result.error || 'Reviews could not be loaded.')
    }).catch(() => {
      if (active) setError('Reviews could not be loaded. Please refresh the page.')
    }).finally(() => {
      if (active) setLoading(false)
    })
    return () => { active = false }
  }, [])

  const filtered = useMemo(() => reviews.filter((review) => {
    const searchable = `${review.name} ${review.propertyTitle} ${review.comment}`.toLowerCase()
    return searchable.includes(query.trim().toLowerCase()) && (status === 'All reviews' || review.status === status)
  }), [reviews, query, status])
  const pendingCount = reviews.filter((review) => review.status === 'Pending').length
  const approvedCount = reviews.filter((review) => review.status === 'Approved').length

  async function changeStatus(review, nextStatus) {
    const result = await updateReviewStatusAction(review.id, nextStatus)
    if (result.error) {
      notify(result.error, 'error')
      return
    }
    setReviews((current) => current.map((item) => item.id === review.id ? result.review : item))
    notify(nextStatus === 'Approved' ? 'Review approved and published.' : nextStatus === 'Rejected' ? 'Review rejected.' : 'Review moved to pending.')
  }

  async function removeReview(review) {
    if (!window.confirm(`Permanently delete ${review.name}’s review for “${review.propertyTitle}”?`)) return
    const result = await deleteReviewAction(review.id)
    if (result.error) {
      notify(result.error, 'error')
      return
    }
    setReviews((current) => current.filter((item) => item.id !== review.id))
    notify('Review deleted.')
  }

  return <>
    <PageHeading eyebrow="Customer feedback" title="Reviews" description="Confirm the customer had a genuine experience, then approve or reject the review before it appears on the listing page." />

    <div className="mb-5 grid gap-3 min-[520px]:grid-cols-3">
      {[['All reviews', reviews.length], ['Pending approval', pendingCount], ['Published', approvedCount]].map(([label, count]) => <article key={label} className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-[11px] font-medium text-slate-500">{label}</p><p className="mt-2 text-2xl font-bold text-slate-900">{loading ? <span className="inline-block h-7 w-10 animate-pulse rounded bg-slate-100" /> : count}</p></article>)}
    </div>

    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,.03)]">
      <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <SearchField value={query} onChange={setQuery} placeholder="Search name, listing or review" />
        <FilterSelect label="Status" value={status} onChange={setStatus} options={['All reviews', 'Pending', 'Approved', 'Rejected'].map((value) => ({ label: value, value }))} />
      </div>

      {loading ? <div role="status" className="p-10 text-center text-sm text-slate-500">Loading reviews…</div> : error ? <div role="alert" className="m-5 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : filtered.length === 0 ? <div className="p-5"><EmptyState icon="star" title={reviews.length ? 'No reviews match these filters' : 'No reviews submitted yet'} description={reviews.length ? 'Try another search or status filter.' : 'Customer reviews will appear here after they submit feedback on a listing.'} action={reviews.length ? <button type="button" onClick={() => { setQuery(''); setStatus('All reviews') }} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Clear filters</button> : null} /></div> : <div className="grid gap-4 p-4 lg:grid-cols-2 sm:p-5">
        {filtered.map((review) => <article key={review.id} className="rounded-2xl border border-slate-200 p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-900">{review.name.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase()}</span>
            <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="text-sm font-bold text-slate-900">{review.name}</h3><StatusPill status={review.status}/></div><p className="mt-1 text-[11px] text-slate-500">Submitted {formatDate(review.createdAt)}</p></div>
          </div>
          <div className="mt-4 flex items-center gap-2"><span aria-label={`${review.rating} out of 5 stars`} className="text-sm tracking-wide text-emerald-700">{'★'.repeat(review.rating)}<span className="text-slate-300">{'★'.repeat(5 - review.rating)}</span></span><span className="text-xs font-semibold text-slate-700">{review.rating}.0</span></div>
          <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-700">{review.comment}</p>
          <Link href={`/properties/${review.propertySlug}`} target="_blank" className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 hover:text-emerald-950">{review.propertyTitle}<span aria-hidden="true">↗</span></Link>
          <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
            {review.status !== 'Approved' && <button type="button" onClick={() => changeStatus(review, 'Approved')} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-emerald-800 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-900"><AdminIcon name="eye" size={14}/>Approve & publish</button>}
            {review.status !== 'Rejected' && <button type="button" onClick={() => changeStatus(review, review.status === 'Approved' ? 'Pending' : 'Rejected')} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">{review.status === 'Approved' ? 'Move to pending' : 'Reject'}</button>}
            <button type="button" onClick={() => removeReview(review)} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50"><AdminIcon name="trash" size={14}/>Delete</button>
          </div>
        </article>)}
      </div>}
    </section>
  </>
}
