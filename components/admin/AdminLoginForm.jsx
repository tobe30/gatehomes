'use client'

import { useActionState, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { adminLoginAction } from '@/actions/auth.action'

export default function AdminLoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [state, formAction, isPending] = useActionState(adminLoginAction, { error: '' })

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f7f5] px-4 py-8 sm:px-6">
      <div className="grid w-full max-w-[960px] overflow-hidden rounded-[28px] border border-stone-200 bg-white shadow-[0_24px_80px_rgba(16,43,32,0.12)] lg:min-h-[600px] lg:grid-cols-[0.9fr_1.1fr]">
        <section className="relative flex min-h-[220px] flex-col justify-between overflow-hidden bg-[#102b20] p-7 text-white sm:p-10 lg:min-h-full lg:p-12">
          <div aria-hidden="true" className="absolute -right-20 -top-20 size-72 rounded-full border-[50px] border-white/[0.045]" />
          <div aria-hidden="true" className="absolute -bottom-36 -left-24 size-80 rounded-full border-[54px] border-white/[0.04]" />
          <Link href="/" aria-label="Gate Homes home" className="relative inline-flex w-fit rounded-xl bg-white p-2.5">
            <Image src="/gate-homes-booking-logo.png" alt="Gate Homes Booking" width={150} height={110} className="h-[74px] w-auto object-contain" priority />
          </Link>
          <div className="relative mt-10 lg:mt-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-200">Administrator access</p>
            <h1 className="mt-3 max-w-sm font-serif text-3xl font-semibold leading-tight sm:text-[38px]">Welcome to your property workspace.</h1>
            <p className="mt-4 max-w-sm text-sm leading-6 text-white/65">Manage listings and keep customer inquiries organized in one place.</p>
          </div>
          <p className="relative mt-8 hidden text-xs text-white/45 lg:block">Turning dreams into addresses.</p>
        </section>

        <section className="flex items-center justify-center px-6 py-9 sm:px-10 lg:px-14">
          <div className="w-full max-w-[380px]">
            <Link href="/" className="text-xs font-semibold text-slate-500 transition-colors hover:text-[#094d2f]">← Back to website</Link>
            <p className="mt-8 text-[10px] font-bold uppercase tracking-[0.2em] text-[#094d2f]">Gate Homes Admin</p>
            <h2 className="mt-2 font-serif text-3xl font-bold tracking-tight text-slate-900">Sign in</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">Enter your administrator details to continue.</p>

            <form action={formAction} className="mt-8 space-y-5">
              <div>
                <label htmlFor="admin-email" className="mb-2 block text-xs font-semibold text-slate-700">Email address</label>
                <input id="admin-email" name="email" type="email" autoComplete="username" required placeholder="admin@gatehomesbooking.com" className="h-12 w-full rounded-xl border border-stone-300 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#094d2f] focus:ring-4 focus:ring-[#094d2f]/10" />
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label htmlFor="admin-password" className="block text-xs font-semibold text-slate-700">Password</label>
                  <a href="mailto:Gateshomes.realty@yahoo.com?subject=Admin%20password%20help" className="text-xs font-semibold text-[#094d2f] hover:underline">Forgot password?</a>
                </div>
                <div className="relative">
                  <input id="admin-password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" required minLength={8} placeholder="Enter your password" className="h-12 w-full rounded-xl border border-stone-300 bg-white px-4 pr-14 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#094d2f] focus:ring-4 focus:ring-[#094d2f]/10" />
                  <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'} aria-pressed={showPassword} className="absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-r-xl text-slate-500 transition-colors hover:text-[#094d2f] focus-visible:outline-2 focus-visible:outline-[#094d2f]">
                    {showPassword ? (
                      <svg aria-hidden="true" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c5.2 0 8.7 4.8 9.5 6-.4.6-1.4 2.1-3 3.4M6.2 6.2C3.9 7.7 2.6 10 2.5 11c.3.5 1.4 2.4 3.5 3.9A10 10 0 0 0 12 17c.8 0 1.6-.1 2.3-.3"/></svg>
                    ) : (
                      <svg aria-hidden="true" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 12s3.3-7 9.5-7 9.5 7 9.5 7-3.3 7-9.5 7-9.5-7-9.5-7Z"/><circle cx="12" cy="12" r="2.5"/></svg>
                    )}
                  </button>
                </div>
              </div>
              <label className="flex cursor-pointer items-center gap-2.5 text-xs text-slate-600">
                <input name="remember" type="checkbox" className="size-4 rounded border-stone-300 accent-[#094d2f]" />
                Remember me on this device
              </label>
              {state?.error && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-xs leading-5 text-rose-800">{state.error}</p>}
              <button type="submit" disabled={isPending} className="flex h-12 w-full items-center justify-center rounded-xl bg-[#094d2f] px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#073e26] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#094d2f] disabled:cursor-wait disabled:opacity-70">{isPending ? 'Signing in…' : 'Sign in to dashboard'}</button>
            </form>

            <p className="mt-6 text-center text-[11px] leading-5 text-slate-400">Administrator accounts are created securely by Gate Homes.</p>
          </div>
        </section>
      </div>
    </main>
  )
}
