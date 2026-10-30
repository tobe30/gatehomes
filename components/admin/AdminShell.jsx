'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import AdminIcon from './AdminIcon'
import { useAdminData } from './AdminDataContext'

const navigation = [
  { label: 'Dashboard', href: '/admin', icon: 'dashboard' },
  { label: 'Properties', href: '/admin/properties', icon: 'properties' },
  { label: 'Add Property', href: '/admin/properties/new', icon: 'plus' },
  { label: 'Inquiries', href: '/admin/inquiries', icon: 'inquiries' },
  { label: 'Settings', href: '/admin/settings', icon: 'settings' },
]

function Sidebar({ pathname, onNavigate, onLogout, unreadCount }) {
  return (
    <>
      <div className="flex h-[76px] items-center gap-3 border-b border-white/10 px-6">
        <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-white p-1.5">
          <img src="/gate-homes-booking-logo.png" alt="Gate Homes Booking" className="size-full object-contain" />
        </div>
        <div><p className="font-serif text-lg font-semibold text-white">Gate Homes</p><p className="mt-0.5 text-[10px] uppercase tracking-[0.18em] text-white/45">Admin workspace</p></div>
      </div>
      <div className="px-4 pt-7">
        <p className="px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-white/35">Workspace</p>
        <nav aria-label="Admin navigation" className="mt-3 space-y-1">
          {navigation.map((item) => {
            const active = item.href === '/admin' ? pathname === item.href : pathname === item.href || (item.href === '/admin/properties' && pathname.startsWith('/admin/properties/') && !pathname.endsWith('/new'))
            return (
              <Link key={item.href} href={item.href} onClick={onNavigate} aria-current={active ? 'page' : undefined} className={`flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors ${active ? 'bg-white/12 text-white shadow-sm' : 'text-white/65 hover:bg-white/7 hover:text-white'}`}>
                <AdminIcon name={item.icon} size={18} />{item.label}
                {item.label === 'Inquiries' && unreadCount > 0 && <span className="ml-auto rounded-full bg-emerald-400/20 px-2 py-0.5 text-[10px] font-bold text-emerald-200">{unreadCount}</span>}
              </Link>
            )
          })}
        </nav>
      </div>
      <div className="mt-auto border-t border-white/10 p-4">
        <div className="mb-3 flex items-center gap-3 rounded-xl bg-white/5 p-3">
          <span className="flex size-9 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-900">GH</span>
          <div className="min-w-0"><p className="truncate text-xs font-semibold text-white">Gate Homes Admin</p><p className="mt-0.5 truncate text-[10px] text-white/45">admin@gatehomesbooking.com</p></div>
        </div>
        <button type="button" onClick={onLogout} className="flex h-10 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium text-white/60 transition-colors hover:bg-white/7 hover:text-white"><AdminIcon name="logout" size={18} />Logout</button>
      </div>
    </>
  )
}

const pageTitles = [
  ['/admin/properties/new', 'Add Property'],
  ['/admin/properties/', 'Edit Property'],
  ['/admin/properties', 'Properties'],
  ['/admin/inquiries', 'Inquiries'],
  ['/admin/settings', 'Settings'],
  ['/admin', 'Dashboard'],
]

export default function AdminShell({ children }) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { toast, notify, inquiries } = useAdminData()
  const unreadCount = inquiries.filter((inquiry) => !inquiry.read).length
  const pageTitle = pageTitles.find(([path]) => path === '/admin/properties/' ? pathname.includes('/edit') : path === '/admin' ? pathname === path : pathname === path || pathname.startsWith(path))?.[1] || 'Dashboard'

  function logOut() {
    notify('This is a frontend demo. Logout is not connected to an account.')
    setMobileOpen(false)
  }

  return (
    <div className="min-h-screen bg-[#f5f7f5] text-slate-900">
      {mobileOpen && <button aria-label="Close navigation" className="fixed inset-0 z-40 bg-slate-950/45 lg:hidden" onClick={() => setMobileOpen(false)} />}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col bg-[#102b20] transition-transform duration-200 lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar pathname={pathname} onNavigate={() => setMobileOpen(false)} onLogout={logOut} unreadCount={unreadCount} />
      </aside>

      <div className="min-h-screen lg:ml-[260px]">
        <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-7 lg:px-9">
          <div className="flex items-center gap-3">
            <button type="button" aria-label="Open navigation" onClick={() => setMobileOpen(true)} className="flex size-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 lg:hidden"><AdminIcon name="menu" /></button>
            <div><p className="text-[11px] font-medium text-slate-500">Gate Homes / <span className="text-slate-700">{pageTitle}</span></p><h1 className="mt-0.5 text-lg font-bold tracking-tight text-slate-900">{pageTitle}</h1></div>
          </div>
          <div className="flex items-center gap-3 sm:gap-5">
            <span className="hidden rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-semibold text-amber-800 sm:block">Frontend demo</span>
            <button type="button" onClick={() => notify('You are all caught up.')} aria-label="Notifications" className="relative flex size-10 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"><AdminIcon name="bell" /><span className="absolute right-2 top-2 size-2 rounded-full bg-emerald-600 ring-2 ring-white" /></button>
            <span className="flex size-9 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-900">GH</span>
          </div>
        </header>
        <div className="mx-auto w-full max-w-[1440px] p-4 sm:p-7 lg:p-9">{children}</div>
      </div>
      {toast && <div role="status" className={`fixed bottom-5 right-5 z-[70] flex max-w-sm items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white shadow-xl ${toast.tone === 'error' ? 'bg-rose-700' : 'bg-[#102b20]'}`}><span className="flex size-6 items-center justify-center rounded-full bg-white/15">✓</span>{toast.message}</div>}
    </div>
  )
}
