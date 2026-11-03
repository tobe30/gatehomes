import React from 'react'
import { lagosLocationSuggestions } from '@/data/locations'

const Hero = () => {
  return (
    <section
      id="home"
      aria-labelledby="hero-title"
      className="relative isolate min-h-[545px] overflow-hidden bg-cover bg-[center_55%] text-white sm:bg-[center_62%] lg:bg-[center_67%] lg:min-h-[680px] 2xl:min-h-[760px]"
      style={{ backgroundImage: "linear-gradient(90deg, rgba(8, 12, 18, 0.66) 0%, rgba(8, 12, 18, 0.42) 58%, rgba(8, 12, 18, 0.30) 100%), linear-gradient(0deg, rgba(9, 16, 30, 0.82) 0%, transparent 57%), url('/hero-interior.png')" }}
    >
      <div className="mx-auto flex min-h-[545px] w-full max-w-[1440px] flex-col justify-center px-6 pb-10 pt-14 sm:px-10 lg:min-h-[680px] 2xl:min-h-[760px] lg:px-[8.7%]">
        <p className="mb-6 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.22em] text-white sm:text-[11px]">
          <span aria-hidden="true" className="h-px w-8 bg-[#89bfa0]" />
          Shortlets · Properties
        </p>
        <h1 id="hero-title" className="max-w-[760px] font-serif text-[42px] font-bold leading-[0.99] tracking-[-0.045em] sm:text-[56px] lg:text-[64px]">
          Best deals on <span className="text-[#89bfa0]">shortlet</span> homes and apartments.
        </h1>
        <p className="mt-6 flex items-center gap-2 text-[15px] font-semibold text-white sm:text-[16px]">
          <span aria-hidden="true" className="size-2 rounded-full bg-[#89bfa0]" />
          24/7 customer service.
        </p>

        <form action="/listings" method="get" className="mt-7 grid w-full grid-cols-1 gap-2 rounded-xl bg-white p-2.5 shadow-xl sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_auto] lg:gap-2.5">
          <label className="flex min-h-[58px] items-center gap-3 rounded-lg border border-stone-200 bg-stone-50 px-3 text-slate-500 transition-colors focus-within:border-emerald-800 sm:col-span-2 lg:col-span-1 lg:min-w-0">
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s7-6.1 7-12a7 7 0 1 0-14 0c0 5.9 7 12 7 12Z"/><circle cx="12" cy="9" r="2.2"/></svg>
            <input name="destination" type="search" list="hero-location-suggestions" placeholder="Search location" aria-label="Search location" autoComplete="off" className="min-w-0 flex-1 bg-transparent text-[13px] text-slate-800 outline-none placeholder:text-slate-500" />
          </label>
          <datalist id="hero-location-suggestions">
            {lagosLocationSuggestions.map((location) => <option key={location} value={location} />)}
          </datalist>

          <label htmlFor="hero-checkin" className="flex min-h-[58px] min-w-0 flex-col justify-center rounded-lg border border-stone-200 bg-stone-50 px-3 transition-colors focus-within:border-emerald-800">
            <span className="mb-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-500">Check-in</span>
            <input id="hero-checkin" name="checkin" type="date" aria-label="Check-in date" className="h-5 w-full min-w-0 bg-transparent text-[12px] text-slate-800 outline-none" />
          </label>

          <label htmlFor="hero-checkout" className="flex min-h-[58px] min-w-0 flex-col justify-center rounded-lg border border-stone-200 bg-stone-50 px-3 transition-colors focus-within:border-emerald-800">
            <span className="mb-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-500">Check-out</span>
            <input id="hero-checkout" name="checkout" type="date" aria-label="Check-out date" className="h-5 w-full min-w-0 bg-transparent text-[12px] text-slate-800 outline-none" />
          </label>

          <label htmlFor="hero-guests" className="flex min-h-[58px] min-w-0 flex-col justify-center rounded-lg border border-stone-200 bg-stone-50 px-3 transition-colors focus-within:border-emerald-800">
            <span className="mb-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-500">Guests</span>
            <select id="hero-guests" name="guests" defaultValue="" className="h-5 w-full min-w-0 bg-transparent text-[12px] text-slate-800 outline-none">
              <option value="" disabled>Select guests</option>
              {Array.from({ length: 50 }, (_, index) => index + 1).map((count) => (
              <option key={count} value={count}>{count} {count === 1 ? 'guest' : 'guests'}</option>
            ))}
            </select>
          </label>

          <button type="submit" className="btn h-[58px] min-h-[58px] rounded-lg border-0 bg-emerald-900 px-7 text-[13px] font-bold text-white shadow-none hover:bg-emerald-950">
            <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="10.8" cy="10.8" r="6.2"/><path d="m16 16 4.2 4.2"/></svg>
            Search
          </button>
        </form>
      </div>
    </section>
  )
}

export default Hero
