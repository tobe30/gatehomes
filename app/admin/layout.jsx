'use client'

import { AdminDataProvider } from '@/components/admin/AdminDataContext'
import AdminShell from '@/components/admin/AdminShell'

export default function AdminLayout({ children }) {
  return <AdminDataProvider><AdminShell>{children}</AdminShell></AdminDataProvider>
}
