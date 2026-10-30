'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { label: 'Home', href: '/' },
  { label: 'Listings', href: '/listings' },
  { label: 'Videos', href: '/#videos' },
  { label: 'About', href: '/#about' },
  { label: 'Contact', href: '/#contact' },
]

const Navbar = () => {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!mobileOpen) return
    const previousOverflow = document.body.style.overflow
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setMobileOpen(false)
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [mobileOpen])

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-white">
      <nav aria-label="Main navigation" className="mx-auto flex min-h-[76px] w-full items-center justify-between gap-6 px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-4" aria-label="Gate Homes home">
          <img src="/gate-homes-booking-logo.png" alt="Gate Homes Booking" className="h-16 w-auto shrink-0 object-contain" />
        </Link>

        <div className="hidden items-center gap-7 md:flex lg:gap-8">
          {links.map(({ label, href }) => (
            <Link key={label} href={href} className="rounded-sm py-2 text-[15px] font-semibold text-slate-700 transition-colors hover:text-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-800">
              {label}
            </Link>
          ))}
          <Link href="/#contact" className="rounded-xl bg-emerald-800 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800">
            Chat on WhatsApp
          </Link>
          <details className="group relative">
            <summary aria-label="Open more navigation" className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-lg border border-stone-200 text-slate-700 hover:bg-stone-50 [&::-webkit-details-marker]:hidden">
              <span className="sr-only">More options</span>
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
            </summary>
            <div className="absolute right-0 top-12 w-48 rounded-lg border border-stone-200 bg-white p-2 shadow-lg">
              <Link href="/#contact" className="block rounded-md px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-stone-50">Contact Gate Homes</Link>
              <Link href="/#listings" className="block rounded-md px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-stone-50">Browse properties</Link>
            </div>
          </details>
        </div>

        <button
          type="button"
          aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMobileOpen((open) => !open)}
          className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-stone-200 bg-white text-slate-800 transition-colors hover:bg-stone-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800 md:hidden"
        >
          {mobileOpen ? (
            <svg aria-hidden="true" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="m6 6 12 12M18 6 6 18" /></svg>
          ) : (
            <svg aria-hidden="true" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
          )}
        </button>
      </nav>

      <button type="button" aria-label="Close navigation menu" tabIndex={mobileOpen ? 0 : -1} onClick={() => setMobileOpen(false)} className={`fixed inset-0 top-[76px] z-[49] bg-slate-950/35 transition-opacity duration-300 ease-out md:hidden ${mobileOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`} />
      <div id="mobile-navigation" aria-hidden={!mobileOpen} className={`fixed inset-x-0 bottom-0 top-[76px] z-[50] overflow-y-auto border-t border-stone-200 bg-white px-6 pb-8 pt-7 shadow-2xl transition-[transform,opacity,visibility] duration-300 ease-out md:hidden ${mobileOpen ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-3 opacity-0'}`}>
            <div className="mx-auto flex min-h-full w-full max-w-lg flex-col">
              <div className="mb-5 border-b border-stone-200 pb-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-800">Gate Homes</p>
                <p className="mt-1 text-sm text-slate-500">Turning dreams into addresses.</p>
              </div>
              <nav aria-label="Mobile navigation" className="flex-1">
                {links.map(({ label, href }, index) => (
                  <Link key={label} href={href} onClick={() => setMobileOpen(false)} className="group flex min-h-14 items-center justify-between border-b border-stone-100 py-3 text-lg font-semibold text-slate-800 transition-colors hover:text-emerald-800 focus-visible:outline-2 focus-visible:outline-emerald-800">
                    <span className="flex items-center gap-4"><span className="w-6 text-xs font-medium tabular-nums text-slate-400">0{index + 1}</span>{label}</span>
                    <svg aria-hidden="true" className="text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-emerald-800" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
                  </Link>
                ))}
              </nav>
              <div className="mt-6 rounded-2xl bg-[#f5f7f3] p-5">
                <p className="text-sm font-medium text-slate-600">Need help finding a place?</p>
                <Link href="/#contact" onClick={() => setMobileOpen(false)} className="mt-4 flex min-h-12 items-center justify-center rounded-xl bg-emerald-800 px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800">Chat on WhatsApp</Link>
              </div>
            </div>
      </div>
    </header>
  )
}

export default Navbar
