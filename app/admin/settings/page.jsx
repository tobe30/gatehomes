'use client'

import { useState } from 'react'
import { useAdminData } from '@/components/admin/AdminDataContext'
import { PageHeading, PrimaryButton } from '@/components/admin/AdminUI'

const fieldClass = 'mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-800 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/10'

export default function AdminSettingsPage() {
  const { notify } = useAdminData()
  const [profile, setProfile] = useState({ name: 'Gate Homes Admin', email: 'admin@gatehomesbooking.com' })

  function saveProfile(event) {
    event.preventDefault()
    notify('Profile form saved in this demo session.')
  }

  function changePassword(event) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const newPassword = String(form.get('newPassword') || '')
    const confirmPassword = String(form.get('confirmPassword') || '')
    if (newPassword.length < 8) {
      notify('Use at least 8 characters for the new password.', 'error')
      return
    }
    if (newPassword !== confirmPassword) {
      notify('The new passwords do not match.', 'error')
      return
    }
    event.currentTarget.reset()
    notify('Password form validated. No account changes are made in this UI demo.')
  }

  return <>
    <PageHeading eyebrow="Workspace preferences" title="Settings" description="Manage the profile details shown in this admin preview." />
    <div className="grid items-start gap-5 xl:grid-cols-2">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,.03)] sm:p-6">
        <div className="border-b border-slate-100 pb-4"><h2 className="text-sm font-bold text-slate-900">Admin profile</h2><p className="mt-1.5 text-xs text-slate-500">Basic account information for this workspace.</p></div>
        <form onSubmit={saveProfile} className="mt-5 space-y-5">
          <div className="flex items-center gap-4"><span className="flex size-16 items-center justify-center rounded-2xl bg-emerald-100 text-lg font-bold text-emerald-900">GH</span><div><p className="text-sm font-semibold text-slate-800">Profile image</p><p className="mt-1 text-xs text-slate-500">Initials placeholder for the UI preview</p></div></div>
          <label className="block text-xs font-semibold text-slate-700">Full name<input required value={profile.name} onChange={(event) => setProfile((current) => ({ ...current, name: event.target.value }))} className={fieldClass}/></label>
          <label className="block text-xs font-semibold text-slate-700">Email address<input required type="email" value={profile.email} onChange={(event) => setProfile((current) => ({ ...current, email: event.target.value }))} className={fieldClass}/></label>
          <PrimaryButton type="submit">Save profile</PrimaryButton>
        </form>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,.03)] sm:p-6">
        <div className="border-b border-slate-100 pb-4"><h2 className="text-sm font-bold text-slate-900">Change password</h2><p className="mt-1.5 text-xs text-slate-500">Password form UI only. It does not update an account.</p></div>
        <form onSubmit={changePassword} className="mt-5 space-y-4">
          <label className="block text-xs font-semibold text-slate-700">Current password<input required type="password" autoComplete="current-password" className={fieldClass} placeholder="Enter current password"/></label>
          <label className="block text-xs font-semibold text-slate-700">New password<input required type="password" name="newPassword" minLength={8} autoComplete="new-password" className={fieldClass} placeholder="At least 8 characters"/></label>
          <label className="block text-xs font-semibold text-slate-700">Confirm new password<input required type="password" name="confirmPassword" minLength={8} autoComplete="new-password" className={fieldClass} placeholder="Re-enter new password"/></label>
          <PrimaryButton type="submit">Save password</PrimaryButton>
        </form>
      </section>
      <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 text-xs leading-5 text-amber-900 xl:col-span-2">This admin workspace is a frontend-only preview. Profile edits and password changes are not connected to an account system.</div>
    </div>
  </>
}
