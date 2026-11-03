'use client'

import { usePathname } from 'next/navigation'
import Script from 'next/script'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function SiteChrome({ children }) {
  const pathname = usePathname()
  const isAdmin = pathname === '/admin' || pathname.startsWith('/admin/')

  if (isAdmin) return children

  return <>
    <Navbar />
    {children}
    <Footer />
    <div className="zyff-whatsapp" data-zyff-widget="whatsapp" data-zyff-id="hGknc28dtim1ug" />
    <Script src="https://www.zyff.app/w/whatsapp.js" strategy="afterInteractive" />
  </>
}
