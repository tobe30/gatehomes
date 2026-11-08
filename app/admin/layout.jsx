import { AdminDataProvider } from '@/components/admin/AdminDataContext'
import AdminShell from '@/components/admin/AdminShell'

export const metadata = {
  title: 'Admin | Gate Homes',
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }) {
  return <AdminDataProvider><AdminShell>{children}</AdminShell></AdminDataProvider>
}
