'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import AdminPropertyForm from '@/components/admin/AdminPropertyForm'
import { useAdminData } from '@/components/admin/AdminDataContext'
import { EmptyState } from '@/components/admin/AdminUI'

export default function EditAdminPropertyPage() {
  const params = useParams()
  const { properties, propertiesLoading } = useAdminData()
  const property = properties.find((item) => item.id === params.id)

  if (propertiesLoading) return <div role="status" className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-500">Loading property…</div>

  if (!property) return <EmptyState icon="search" title="Property not found" description="This listing may have been removed or its link may be out of date." action={<Link href="/admin/properties" className="rounded-xl bg-emerald-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-900">Back to properties</Link>} />

  return <AdminPropertyForm mode="edit" property={property} />
}
