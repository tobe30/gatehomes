'use client'

import { createContext, useContext, useState } from 'react'
import { initialAdminInquiries, initialAdminProperties } from '@/data/adminMockData'

const AdminDataContext = createContext(null)

export function AdminDataProvider({ children }) {
  const [properties, setProperties] = useState(initialAdminProperties)
  const [inquiries, setInquiries] = useState(initialAdminInquiries)
  const [toast, setToast] = useState(null)

  function notify(message, tone = 'success') {
    setToast({ message, tone, key: Date.now() })
    window.setTimeout(() => setToast(null), 3200)
  }

  function saveProperty(property) {
    setProperties((current) => current.some((item) => item.id === property.id)
      ? current.map((item) => item.id === property.id ? property : item)
      : [property, ...current])
  }

  function deleteProperty(id) {
    setProperties((current) => current.filter((item) => item.id !== id))
  }

  function toggleInquiryRead(id) {
    setInquiries((current) => current.map((item) => item.id === id ? { ...item, read: !item.read } : item))
  }

  const value = { properties, inquiries, toast, notify, saveProperty, deleteProperty, toggleInquiryRead }

  return <AdminDataContext.Provider value={value}>{children}</AdminDataContext.Provider>
}

export function useAdminData() {
  const context = useContext(AdminDataContext)
  if (!context) throw new Error('useAdminData must be used inside AdminDataProvider')
  return context
}
