'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
import { changeAdminPasswordAction, updateAdminProfileAction } from '@/actions/user.action'
import { useAdminData } from '@/components/admin/AdminDataContext'
import { PageHeading, PrimaryButton } from '@/components/admin/AdminUI'

const fieldClass = 'mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-800 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/10 disabled:bg-slate-50 disabled:text-slate-500'
const initialState = { error: '', success: '' }

export default function AdminSettingsPage() {
  const { adminProfile, setAdminProfile, notify } = useAdminData()
  const [state, formAction, isPending] = useActionState(updateAdminProfileAction, initialState)
  const [passwordState, passwordFormAction, passwordPending] = useActionState(changeAdminPasswordAction, initialState)
  const passwordFormRef = useRef(null)
  const [draft, setDraft] = useState({ name: '', email: '', phone: '' })
  const profile = adminProfile ? draft : { name: '', email: '', phone: '' }

  useEffect(() => {
    if (adminProfile) setDraft(adminProfile)
  }, [adminProfile])

  useEffect(() => {
    if (state.profile) {
      setAdminProfile(state.profile)
      setDraft(state.profile)
      notify(state.success || 'Your profile has been updated.')
    } else if (state.error) {
      notify(state.error, 'error')
    }
  }, [state, setAdminProfile, notify])

  useEffect(() => {
    if (passwordState.success) {
      passwordFormRef.current?.reset()
      notify(passwordState.success)
    } else if (passwordState.error) {
      notify(passwordState.error, 'error')
    }
  }, [passwordState, notify])

  return <>
    <PageHeading eyebrow="Workspace preferences" title="Settings" description="Manage your administrator profile and account preferences." />
    <div className="grid items-start gap-5 xl:grid-cols-2">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,.03)] sm:p-6">
        <div className="border-b border-slate-100 pb-4"><h2 className="text-sm font-bold text-slate-900">Admin profile</h2><p className="mt-1.5 text-xs text-slate-500">These details are saved to your Gate Homes admin account.</p></div>
        <form action={formAction} className="mt-5 space-y-5">
          <div className="flex items-center gap-4"><span className="flex size-16 items-center justify-center rounded-2xl bg-emerald-100 text-lg font-bold text-emerald-900">{profile.name ? profile.name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase() : 'GH'}</span><div><p className="text-sm font-semibold text-slate-800">Profile image</p><p className="mt-1 text-xs text-slate-500">Initials are generated from your name.</p></div></div>
          <label className="block text-xs font-semibold text-slate-700">Full name<input name="name" required minLength={2} maxLength={80} autoComplete="name" value={profile.name} onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))} disabled={!adminProfile || isPending} className={fieldClass} /></label>
          <label className="block text-xs font-semibold text-slate-700">Email address<input name="email" required type="email" maxLength={254} autoComplete="email" value={profile.email} onChange={(event) => setDraft((current) => ({ ...current, email: event.target.value }))} disabled={!adminProfile || isPending} className={fieldClass} /></label>
          <label className="block text-xs font-semibold text-slate-700">Phone number <span className="font-normal text-slate-400">(optional)</span><input name="phone" type="tel" maxLength={30} autoComplete="tel" value={profile.phone} onChange={(event) => setDraft((current) => ({ ...current, phone: event.target.value }))} disabled={!adminProfile || isPending} className={fieldClass} /></label>
          {state.error && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-sm text-rose-800">{state.error}</p>}
          {state.success && <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-3 text-sm text-emerald-800">{state.success}</p>}
          <PrimaryButton type="submit" disabled={!adminProfile || isPending}>{isPending ? 'Saving…' : 'Save profile'}</PrimaryButton>
        </form>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,.03)] sm:p-6">
        <div className="border-b border-slate-100 pb-4"><h2 className="text-sm font-bold text-slate-900">Change password</h2><p className="mt-1.5 text-xs text-slate-500">Verify your current password before choosing a new one.</p></div>
        <form ref={passwordFormRef} action={passwordFormAction} className="mt-5 space-y-4">
          <label className="block text-xs font-semibold text-slate-700">Current password<input required type="password" name="currentPassword" autoComplete="current-password" className={fieldClass} placeholder="Enter your current password" disabled={passwordPending} /></label>
          <label className="block text-xs font-semibold text-slate-700">New password<input required type="password" name="newPassword" minLength={8} maxLength={128} autoComplete="new-password" className={fieldClass} placeholder="At least 8 characters" disabled={passwordPending} /></label>
          <label className="block text-xs font-semibold text-slate-700">Confirm new password<input required type="password" name="confirmPassword" minLength={8} maxLength={128} autoComplete="new-password" className={fieldClass} placeholder="Re-enter your new password" disabled={passwordPending} /></label>
          {passwordState.error && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-sm text-rose-800">{passwordState.error}</p>}
          {passwordState.success && <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-3 text-sm text-emerald-800">{passwordState.success}</p>}
          <PrimaryButton type="submit" disabled={passwordPending}>{passwordPending ? 'Updating…' : 'Save password'}</PrimaryButton>
        </form>
      </section>
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 text-xs leading-5 text-emerald-900 xl:col-span-2">Profile and password changes are saved securely to your admin account.</div>
    </div>
  </>
}
