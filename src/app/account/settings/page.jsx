'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SettingsPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('account')
  
  // Password Change State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    orderUpdates: true,
    promotionalEmails: false,
    smsNotifications: false,
    newsletterSubscription: true
  })
  const [notificationLoading, setNotificationLoading] = useState(false)
  const [notificationSuccess, setNotificationSuccess] = useState('')

  // Privacy Settings
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
    allowDataCollection: true
  })
  const [privacyLoading, setPrivacyLoading] = useState(false)
  const [privacySuccess, setPrivacySuccess] = useState('')

  // Delete Account State
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  useEffect(() => {
    fetchUserData()
    fetchNotificationSettings()
    fetchPrivacySettings()
  }, [])

  const fetchUserData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/v1/users/profile', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        const userData = data.data?.user || data.user || data.data
        if (userData) {
          setUser(userData)
        }
      }
    } catch (error) {
      console.error('Error fetching user:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchNotificationSettings = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/v1/users/settings/notifications', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        if (data.data) {
          setNotificationSettings(data.data)
        }
      }
    } catch (error) {
      console.error('Error fetching notification settings:', error)
    }
  }

  const fetchPrivacySettings = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/v1/users/settings/privacy', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        if (data.data) {
          setPrivacySettings(data.data)
        }
      }
    } catch (error) {
      console.error('Error fetching privacy settings:', error)
    }
  }

  // Handle Password Change
  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setPasswordError('')
    setPasswordSuccess('')

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match')
      return
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters')
      return
    }

    setPasswordLoading(true)

    try {
      const response = await fetch('http://localhost:5000/api/v1/auth/update-password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update password')
      }

      setPasswordSuccess('Password updated successfully!')
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      
      setTimeout(() => setPasswordSuccess(''), 3000)
    } catch (err) {
      setPasswordError(err.message || 'Failed to update password')
    } finally {
      setPasswordLoading(false)
    }
  }

  // Handle Notification Settings
  const handleNotificationChange = (key) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const saveNotificationSettings = async () => {
    setNotificationLoading(true)
    setNotificationSuccess('')

    try {
      const response = await fetch('http://localhost:5000/api/v1/users/settings/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(notificationSettings)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save settings')
      }

      setNotificationSuccess('Notification settings saved!')
      setTimeout(() => setNotificationSuccess(''), 3000)
    } catch (err) {
      console.error('Error saving notification settings:', err)
    } finally {
      setNotificationLoading(false)
    }
  }

  // Handle Privacy Settings
  const handlePrivacyChange = (key, value) => {
    setPrivacySettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const savePrivacySettings = async () => {
    setPrivacyLoading(true)
    setPrivacySuccess('')

    try {
      const response = await fetch('http://localhost:5000/api/v1/users/settings/privacy', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(privacySettings)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save settings')
      }

      setPrivacySuccess('Privacy settings saved!')
      setTimeout(() => setPrivacySuccess(''), 3000)
    } catch (err) {
      console.error('Error saving privacy settings:', err)
    } finally {
      setPrivacyLoading(false)
    }
  }

  // Handle Delete Account
  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== user?.email) {
      setDeleteError('Please type your email correctly to confirm')
      return
    }

    setDeleteLoading(true)
    setDeleteError('')

    try {
      const response = await fetch('http://localhost:5000/api/v1/users/profile', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete account')
      }

      // Clear local storage
      localStorage.removeItem('userData')
      localStorage.removeItem('isAuthenticated')
      localStorage.removeItem('authToken')
      localStorage.removeItem('rememberMe')

      // Redirect to home
      router.push('/')
    } catch (err) {
      setDeleteError(err.message || 'Failed to delete account')
    } finally {
      setDeleteLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-6">
          <Link 
            href="/account/profile" 
            className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-4"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Profile
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Account Settings</h1>
          <p className="text-gray-500 mt-1">Manage your account preferences and security</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex flex-wrap -mb-px">
              <button
                onClick={() => setActiveTab('account')}
                className={`px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === 'account'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Account Security
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === 'notifications'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Notifications
              </button>
              <button
                onClick={() => setActiveTab('privacy')}
                className={`px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === 'privacy'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Privacy
              </button>
              <button
                onClick={() => setActiveTab('danger')}
                className={`px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === 'danger'
                    ? 'text-red-600 border-b-2 border-red-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Danger Zone
              </button>
            </nav>
          </div>

          <div className="p-6">
            
            {/* Account Security Tab */}
            {activeTab === 'account' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Change Password</h3>
                
                {passwordSuccess && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-lg text-sm">
                    {passwordSuccess}
                  </div>
                )}
                
                {passwordError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                    {passwordError}
                  </div>
                )}

                <form onSubmit={handlePasswordChange} className="max-w-md space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                        required
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                      >
                        {showCurrentPassword ? '👁️' : '👁️‍🗨️'}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                        required
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                      >
                        {showNewPassword ? '👁️' : '👁️‍🗨️'}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                        required
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                      >
                        {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    {passwordLoading ? 'Updating...' : 'Update Password'}
                  </button>
                </form>

                {/* Two-Factor Authentication */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Two-Factor Authentication</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Add an extra layer of security to your account by enabling two-factor authentication.
                  </p>
                  <button
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                  >
                    Set up 2FA
                  </button>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Notification Preferences</h3>
                
                {notificationSuccess && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-lg text-sm">
                    {notificationSuccess}
                  </div>
                )}

                <div className="space-y-4 max-w-md">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <span className="font-medium text-gray-800">Email Notifications</span>
                      <p className="text-sm text-gray-500">Receive notifications via email</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.emailNotifications}
                      onChange={() => handleNotificationChange('emailNotifications')}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <span className="font-medium text-gray-800">Order Updates</span>
                      <p className="text-sm text-gray-500">Get notified about your order status</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.orderUpdates}
                      onChange={() => handleNotificationChange('orderUpdates')}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <span className="font-medium text-gray-800">Promotional Emails</span>
                      <p className="text-sm text-gray-500">Receive offers and promotions</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.promotionalEmails}
                      onChange={() => handleNotificationChange('promotionalEmails')}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <span className="font-medium text-gray-800">SMS Notifications</span>
                      <p className="text-sm text-gray-500">Get important updates via text message</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.smsNotifications}
                      onChange={() => handleNotificationChange('smsNotifications')}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <span className="font-medium text-gray-800">Newsletter</span>
                      <p className="text-sm text-gray-500">Subscribe to our weekly newsletter</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.newsletterSubscription}
                      onChange={() => handleNotificationChange('newsletterSubscription')}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </label>

                  <button
                    onClick={saveNotificationSettings}
                    disabled={notificationLoading}
                    className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    {notificationLoading ? 'Saving...' : 'Save Preferences'}
                  </button>
                </div>
              </div>
            )}

            {/* Privacy Tab */}
            {activeTab === 'privacy' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Privacy Settings</h3>
                
                {privacySuccess && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-lg text-sm">
                    {privacySuccess}
                  </div>
                )}

                <div className="space-y-6 max-w-md">
                  <div>
                    <label className="block font-medium text-gray-800 mb-2">Profile Visibility</label>
                    <select
                      value={privacySettings.profileVisibility}
                      onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    >
                      <option value="public">Public - Everyone can see</option>
                      <option value="private">Private - Only you can see</option>
                      <option value="friends">Friends Only</option>
                    </select>
                  </div>

                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <span className="font-medium text-gray-800">Show Email Address</span>
                      <p className="text-sm text-gray-500">Display your email on your profile</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={privacySettings.showEmail}
                      onChange={(e) => handlePrivacyChange('showEmail', e.target.checked)}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <span className="font-medium text-gray-800">Show Phone Number</span>
                      <p className="text-sm text-gray-500">Display your phone number on your profile</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={privacySettings.showPhone}
                      onChange={(e) => handlePrivacyChange('showPhone', e.target.checked)}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <span className="font-medium text-gray-800">Data Collection</span>
                      <p className="text-sm text-gray-500">Allow us to collect usage data to improve services</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={privacySettings.allowDataCollection}
                      onChange={(e) => handlePrivacyChange('allowDataCollection', e.target.checked)}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </label>

                  <button
                    onClick={savePrivacySettings}
                    disabled={privacyLoading}
                    className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    {privacyLoading ? 'Saving...' : 'Save Privacy Settings'}
                  </button>
                </div>
              </div>
            )}

            {/* Danger Zone Tab */}
            {activeTab === 'danger' && (
              <div>
                <h3 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h3>
                
                <div className="border border-red-200 rounded-xl p-6 bg-red-50">
                  <h4 className="font-semibold text-gray-800 mb-2">Delete Account</h4>
                  <p className="text-gray-600 text-sm mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>

                  {!showDeleteConfirm ? (
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                      Delete Account
                    </button>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-sm text-gray-700">
                        Please type <strong>{user?.email}</strong> to confirm:
                      </p>
                      
                      {deleteError && (
                        <div className="p-3 bg-red-100 border border-red-300 text-red-600 rounded-lg text-sm">
                          {deleteError}
                        </div>
                      )}

                      <input
                        type="email"
                        value={deleteConfirmText}
                        onChange={(e) => setDeleteConfirmText(e.target.value)}
                        placeholder="Enter your email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                      />

                      <div className="flex gap-3">
                        <button
                          onClick={handleDeleteAccount}
                          disabled={deleteLoading}
                          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                        >
                          {deleteLoading ? 'Deleting...' : 'Confirm Delete'}
                        </button>
                        <button
                          onClick={() => {
                            setShowDeleteConfirm(false)
                            setDeleteConfirmText('')
                            setDeleteError('')
                          }}
                          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}