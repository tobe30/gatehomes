'use client'

import { createContext, useCallback, useContext, useState } from 'react'
import { getAdminPropertiesAction } from '@/actions/property.action'
import { getAdminProfileAction } from '@/actions/user.action'
import { getAdminInquiriesAction, toggleAdminInquiryReadAction } from '@/actions/inquiry.action'

const AdminDataContext = createContext(null)

export function AdminDataProvider({ children }) {
  const [properties, setProperties] = useState([])
  const [propertiesLoading, setPropertiesLoading] = useState(true)
  const [inquiries, setInquiries] = useState([])
  const [inquiriesLoading, setInquiriesLoading] = useState(true)
  const [adminProfile, setAdminProfile] = useState(null)
  const [toast, setToast] = useState(null)

  const notify = useCallback((message, tone = 'success') => {
    setToast({ message, tone, key: Date.now() })
    window.setTimeout(() => setToast(null), 3200)
  }, [])

  const loadAdminData = useCallback(async () => {
    setPropertiesLoading(true)
    setInquiriesLoading(true)
    try {
      const [profile, propertyResult, inquiryResult] = await Promise.all([
        getAdminProfileAction(),
        getAdminPropertiesAction(),
        getAdminInquiriesAction(),
      ])
      if (profile) setAdminProfile(profile)
      if (inquiryResult.inquiries) setInquiries(inquiryResult.inquiries)
      else notify(inquiryResult.error || 'Inquiries could not be loaded.', 'error')
      if (propertyResult.properties) {
        setProperties(propertyResult.properties)
        return true
      }
      notify(propertyResult.error || 'Properties could not be loaded.', 'error')
      return false
    } catch {
      notify('Admin data could not be loaded. Please refresh the page.', 'error')
      return false
    } finally {
      setPropertiesLoading(false)
      setInquiriesLoading(false)
    }
  }, [notify])

  function saveProperty(property) {
    setProperties((current) => current.some((item) => item.id === property.id)
      ? current.map((item) => item.id === property.id ? property : item)
      : [property, ...current])
  }

  function deleteProperty(id) {
    setProperties((current) => current.filter((item) => item.id !== id))
  }

  async function toggleInquiryRead(id) {
    const result = await toggleAdminInquiryReadAction(id)
    if (!result.success) return result
    setInquiries((current) => current.map((item) => item.id === id ? { ...item, read: result.read } : item))
    return result
  }

  const value = { properties, propertiesLoading, inquiries, inquiriesLoading, toast, notify, saveProperty, deleteProperty, toggleInquiryRead, adminProfile, setAdminProfile, loadAdminData }

  return <AdminDataContext.Provider value={value}>{children}</AdminDataContext.Provider>
}

export function useAdminData() {
  const context = useContext(AdminDataContext)
  if (!context) throw new Error('useAdminData must be used inside AdminDataProvider')
  return context
}
