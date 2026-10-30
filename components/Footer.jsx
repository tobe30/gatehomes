import Image from 'next/image'

const exploreLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Property listings', href: '#listings' },
  { label: 'Airbnb / shortlets', href: '#shortlets' },
  { label: 'Weekend deals', href: '#weekend-deals-title' },
]

const companyLinks = [
  { label: 'About Gate Homes', href: '#about' },
  { label: 'Property videos', href: '#videos' },
  { label: 'Contact us', href: '#contact' },
]

export default function Footer() {
  return (
    <footer id="contact" className="bg-black text-white">
      <div className="mx-auto max-w-[1200px] px-6 pb-8 pt-14 sm:px-8 lg:px-10 lg:pt-16">
        <div className="grid gap-10 border-b border-white/15 pb-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.15fr] lg:gap-12">
          <div>
            <a href="#home" className="inline-flex items-center rounded-lg bg-white px-2 py-1" aria-label="Gate Homes home">
              <Image src="/gate-homes-booking-logo.png" alt="Gate Homes Booking" width={150} height={105} className="h-[92px] w-auto object-contain" />
            </a>
            <p className="mt-4 max-w-[300px] text-sm leading-6 text-white/70">
              Turning dreams into addresses.
            </p>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-white/90">Explore</h2>
            <ul className="mt-4 space-y-3">
              {exploreLinks.map((link) => <li key={link.label}><a href={link.href} className="text-sm text-white/70 transition-colors hover:text-white">{link.label}</a></li>)}
            </ul>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-white/90">Gate Homes</h2>
            <ul className="mt-4 space-y-3">
              {companyLinks.map((link) => <li key={link.label}><a href={link.href} className="text-sm text-white/70 transition-colors hover:text-white">{link.label}</a></li>)}
            </ul>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-white/90">Contact Gate Homes</h2>
            <div className="mt-4 space-y-3">
              <a href="tel:+2349035922740" className="group flex items-center gap-3 text-sm text-white/75 transition-colors hover:text-white">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-emerald-300 transition-colors group-hover:bg-white/10">
                  <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.2 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.96.36 1.9.7 2.8a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.84.58 2.8.7a2 2 0 0 1 1.73 2.03Z"/></svg>
                </span>
                <span>+234 903 592 2740</span>
              </a>
              <a href="tel:+2348162343411" className="group flex items-center gap-3 text-sm text-white/75 transition-colors hover:text-white">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-emerald-300 transition-colors group-hover:bg-white/10">
                  <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.2 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.96.36 1.9.7 2.8a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.84.58 2.8.7a2 2 0 0 1 1.73 2.03Z"/></svg>
                </span>
                <span>+234 816 234 3411</span>
              </a>
              <a href="mailto:Gateshomes.realty@yahoo.com" className="group flex items-center gap-3 break-all text-sm text-white/75 transition-colors hover:text-white">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-emerald-300 transition-colors group-hover:bg-white/10">
                  <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>
                </span>
                <span>Gateshomes.realty@yahoo.com</span>
              </a>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <a href="https://www.instagram.com/the_gates_homes/?hl=en" target="_blank" rel="noreferrer" aria-label="Visit Gate Homes on Instagram" className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 text-xs font-semibold text-white/85 transition-colors hover:border-white/25 hover:bg-white/10 hover:text-white">
                <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/></svg>
                Instagram
              </a>
              <a href="https://wa.me/2349035922740" target="_blank" rel="noreferrer" aria-label="Chat with Gate Homes on WhatsApp" className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-emerald-700 px-3 text-xs font-semibold text-white transition-colors hover:bg-emerald-600">
                <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.52 3.48A11.82 11.82 0 0 0 12.08 0C5.5 0 .15 5.34.15 11.92c0 2.1.55 4.15 1.6 5.96L0 24l6.28-1.65a11.9 11.9 0 0 0 5.8 1.48h.01c6.58 0 11.92-5.35 11.92-11.93 0-3.18-1.24-6.17-3.49-8.42Zm-8.43 18.33a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.73.98.99-3.64-.24-.37a9.87 9.87 0 0 1-1.52-5.27c0-5.46 4.44-9.9 9.9-9.9a9.83 9.83 0 0 1 7.01 2.9 9.83 9.83 0 0 1 2.9 7.01c0 5.46-4.44 9.9-9.9 9.9Zm5.43-7.41c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.46-.89-.8-1.49-1.78-1.67-2.08-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.09 4.49.71.31 1.27.5 1.7.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35Z"/></svg>
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-6 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Gate Homes Booking. All rights reserved.</p>
          <a href="#home" className="transition-colors hover:text-white">Back to top ↑</a>
        </div>
      </div>
    </footer>
  )
}
