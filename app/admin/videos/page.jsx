'use client'

import { useEffect, useState } from 'react'
import AdminIcon from '@/components/admin/AdminIcon'
import YouTubePreview from '@/components/YouTubePreview'
import { useAdminData } from '@/components/admin/AdminDataContext'
import { createVideoAction, deleteVideoAction, getAdminVideosAction, updateVideoStatusAction } from '@/actions/video.action'
import { EmptyState, formatDate, PageHeading, StatusPill } from '@/components/admin/AdminUI'

export default function AdminVideosPage() {
  const { properties, propertiesLoading, notify } = useAdminData()
  const [videos, setVideos] = useState([])
  const [videosLoading, setVideosLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    getAdminVideosAction().then((result) => {
      if (!active) return
      if (result.videos) setVideos(result.videos)
      else setError(result.error || 'Videos could not be loaded.')
    }).catch(() => {
      if (active) setError('Videos could not be loaded. Please refresh the page.')
    }).finally(() => {
      if (active) setVideosLoading(false)
    })
    return () => { active = false }
  }, [])

  async function addVideo(event) {
    event.preventDefault()
    setSaving(true)
    setError('')
    const formElement = event.currentTarget
    const formData = new FormData(formElement)
    try {
      const result = await createVideoAction({
        title: formData.get('title'),
        youtubeUrl: formData.get('youtubeUrl'),
        description: formData.get('description'),
        propertyId: formData.get('propertyId'),
        status: formData.get('status'),
      })
      if (result.error) {
        setError(result.error)
        return
      }
      setVideos((current) => [result.video, ...current])
      formElement.reset()
      notify(result.video.status === 'Published' ? 'Video published.' : 'Video saved as a draft.')
    } catch {
      setError('Video could not be saved. Please check your connection and try again.')
    } finally {
      setSaving(false)
    }
  }

  async function changeStatus(video) {
    const nextStatus = video.status === 'Published' ? 'Draft' : 'Published'
    const result = await updateVideoStatusAction(video.id, nextStatus)
    if (result.error) {
      notify(result.error, 'error')
      return
    }
    setVideos((current) => current.map((item) => item.id === video.id ? result.video : item))
    notify(nextStatus === 'Published' ? 'Video published on the website.' : 'Video moved to drafts.')
  }

  async function removeVideo(video) {
    if (!window.confirm(`Delete “${video.title}” from Gate Homes videos?`)) return
    const result = await deleteVideoAction(video.id)
    if (result.error) {
      notify(result.error, 'error')
      return
    }
    setVideos((current) => current.filter((item) => item.id !== video.id))
    notify('Video deleted.')
  }

  return <>
    <PageHeading eyebrow="Property tours" title="Videos" description="Add YouTube walkthroughs and choose which videos appear in the public video section." />

    <section className="mb-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,.03)] sm:p-6">
      <div className="mb-5 flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800"><AdminIcon name="video" size={19}/></span>
        <div><h3 className="text-sm font-bold text-slate-900">Add a YouTube video</h3><p className="mt-1 text-xs leading-5 text-slate-500">Paste a regular YouTube, Shorts, or youtu.be link. The video must allow embedding.</p></div>
      </div>

      <form onSubmit={addVideo} className="grid gap-4 md:grid-cols-2">
        <label className="block text-xs font-semibold text-slate-700">Video title
          <input name="title" required minLength={3} maxLength={120} placeholder="e.g. A tour of our Lekki shortlet" className="input input-bordered mt-1.5 h-11 min-h-11 w-full rounded-xl border-slate-200 bg-white text-sm font-normal" />
        </label>
        <label className="block text-xs font-semibold text-slate-700">YouTube link
          <input name="youtubeUrl" type="url" required placeholder="https://www.youtube.com/watch?v=..." className="input input-bordered mt-1.5 h-11 min-h-11 w-full rounded-xl border-slate-200 bg-white text-sm font-normal" />
        </label>
        <label className="block text-xs font-semibold text-slate-700">Related listing <span className="font-normal text-slate-400">(optional)</span>
          <select name="propertyId" defaultValue="" className="select select-bordered mt-1.5 h-11 min-h-11 w-full rounded-xl border-slate-200 bg-white text-sm font-normal">
            <option value="">No specific listing</option>
            {properties.filter((property) => property.status === 'Published').map((property) => <option key={property.id} value={property.id}>{property.title} · {property.location}</option>)}
          </select>
        </label>
        <label className="block text-xs font-semibold text-slate-700">Publishing status
          <select name="status" defaultValue="Draft" className="select select-bordered mt-1.5 h-11 min-h-11 w-full rounded-xl border-slate-200 bg-white text-sm font-normal"><option value="Draft">Save as draft</option><option value="Published">Publish now</option></select>
        </label>
        <label className="block text-xs font-semibold text-slate-700 md:col-span-2">Short description <span className="font-normal text-slate-400">(optional)</span>
          <textarea name="description" rows={3} maxLength={600} placeholder="What will viewers see in this tour?" className="textarea textarea-bordered mt-1.5 w-full rounded-xl border-slate-200 bg-white text-sm font-normal" />
        </label>
        {error && <p role="alert" className="rounded-xl bg-rose-50 px-3.5 py-3 text-sm text-rose-700 md:col-span-2">{error}</p>}
        <div className="flex flex-col gap-3 md:col-span-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11px] leading-5 text-slate-500">The site embeds the YouTube video; the video file stays hosted by YouTube.</p>
          <button type="submit" disabled={saving || propertiesLoading} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-800 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-60">
            {saving ? <><span className="loading loading-spinner loading-xs"/>Saving video…</> : <><AdminIcon name="plus" size={17}/>Add video</>}
          </button>
        </div>
      </form>
    </section>

    <div className="mb-4 flex items-end justify-between gap-3"><div><h3 className="text-sm font-bold text-slate-900">Saved videos</h3><p className="mt-1 text-xs text-slate-500">Published videos appear on the public website.</p></div>{!videosLoading && <span className="text-xs text-slate-500">{videos.length} {videos.length === 1 ? 'video' : 'videos'}</span>}</div>

    {videosLoading ? <div role="status" className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">Loading saved videos…</div> : videos.length === 0 ? <EmptyState icon="video" title="No videos added yet" description="Add a YouTube walkthrough above. Publish it when you’re ready for it to appear on the website." /> : <div className="grid gap-5 lg:grid-cols-2">
      {videos.map((video) => <article key={video.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,.03)]">
        <div className="relative aspect-video bg-slate-100"><YouTubePreview videoId={video.youtubeId} title={video.title}/><span className="absolute left-3 top-3 pointer-events-none"><StatusPill status={video.status}/></span></div>
        <div className="p-4 sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-3"><div className="min-w-0"><h4 className="text-sm font-bold text-slate-900">{video.title}</h4><p className="mt-1 text-xs text-slate-500">{video.propertyTitle || 'General Gate Homes video'} · Added {formatDate(video.added)}</p></div><a href={video.youtubeUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-emerald-800 hover:text-emerald-950">Open on YouTube ↗</a></div>
          {video.description && <p className="mt-3 text-xs leading-5 text-slate-600">{video.description}</p>}
          <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
            <button type="button" onClick={() => changeStatus(video)} className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">{video.status === 'Published' ? 'Move to drafts' : 'Publish video'}</button>
            <button type="button" onClick={() => removeVideo(video)} className="inline-flex min-h-9 items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50"><AdminIcon name="trash" size={14}/>Delete</button>
          </div>
        </div>
      </article>)}
    </div>}
  </>
}
