import React from 'react'

const Hero = () => {
  return (
    <section
      id="home"
      aria-labelledby="hero-title"
      className="relative isolate min-h-[545px] overflow-hidden bg-cover bg-center text-white lg:min-h-[680px] 2xl:min-h-[760px]"
      style={{ backgroundImage: "linear-gradient(90deg, rgba(8, 12, 18, 0.66) 0%, rgba(8, 12, 18, 0.42) 58%, rgba(8, 12, 18, 0.30) 100%), linear-gradient(0deg, rgba(9, 16, 30, 0.82) 0%, transparent 57%), url('/hero-home.jpg')" }}
    >
      <div className="mx-auto flex min-h-[545px] w-full max-w-[1440px] flex-col justify-center px-6 pb-10 pt-14 sm:px-10 lg:min-h-[680px] 2xl:min-h-[760px] lg:px-[8.7%]">
        <p className="mb-6 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.22em] text-white sm:text-[11px]">
          <span aria-hidden="true" className="h-px w-8 bg-[#094d2f]" />
          Lagos · Sales · Rentals · Land
        </p>
        <h1 id="hero-title" className="max-w-[760px] font-serif text-[42px] font-bold leading-[0.99] tracking-[-0.045em] sm:text-[56px] lg:text-[64px]">
          Best deals on <span className="text-[#094d2f]">homes</span>,<br className="hidden sm:block" /> apartments and hotels.
        </h1>
        <p className="mt-6 flex items-center gap-2 text-[15px] font-semibold text-white sm:text-[16px]">
          <span aria-hidden="true" className="size-2 rounded-full bg-[#094d2f]" />
          24/7 customer service.
        </p>

        <form action="/listings" method="get" className="mt-7 grid w-full grid-cols-1 gap-2 rounded-xl bg-white p-2.5 shadow-xl sm:grid-cols-[1.2fr_1fr_1fr_auto] sm:gap-2">
          <label className="flex min-h-11 items-center gap-3 rounded-lg border border-stone-200 bg-stone-50 px-3 text-slate-500 focus-within:border-emerald-800">
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s7-6.1 7-12a7 7 0 1 0-14 0c0 5.9 7 12 7 12Z"/><circle cx="12" cy="9" r="2.2"/></svg>
            <input name="destination" type="search" placeholder="Destination" aria-label="Destination" className="min-w-0 flex-1 bg-transparent text-[13px] text-slate-800 outline-none placeholder:text-slate-500" />
          </label>

          <label className="sr-only" htmlFor="hero-date">Date</label>
          <input id="hero-date" name="date" type="date" aria-label="Date" className="input input-bordered h-11 min-h-11 w-full rounded-lg border-stone-200 bg-stone-50 px-4 text-[13px] text-slate-800 focus:border-emerald-800 focus:outline-none" />

          <label className="sr-only" htmlFor="hero-guests">Number of guests</label>
          <select id="hero-guests" name="guests" defaultValue="" className="select select-bordered h-11 min-h-11 w-full rounded-lg border-stone-200 bg-stone-50 px-4 text-[13px] text-slate-800 focus:border-emerald-800 focus:outline-none">
            <option value="" disabled>No. of guests</option>
            {Array.from({ length: 10 }, (_, index) => index + 1).map((count) => (
              <option key={count} value={count}>{count} {count === 1 ? 'guest' : 'guests'}</option>
            ))}
          </select>

          <button type="submit" className="btn h-11 min-h-11 rounded-lg border-0 bg-emerald-900 px-7 text-[13px] font-bold text-white shadow-none hover:bg-emerald-950">
            <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="10.8" cy="10.8" r="6.2"/><path d="m16 16 4.2 4.2"/></svg>
            Search
          </button>
        </form>
      </div>
    </section>
  )
}

export default Hero
