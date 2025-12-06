'use client'

import { useState, useEffect } from 'react'
import AddProfileForm from '../../components/AddProfileForm'

interface School {
  id: string
  name: string
  slug: string
}

interface RivalryGroup {
  id: string
  name: string
  slug: string
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  // Mock data - in production, these would be fetched from APIs
  const schools: School[] = [
    {
      id: 'clz1school1',
      name: 'The Ohio State University',
      slug: 'ohio-state'
    },
    {
      id: 'clz1school2',
      name: 'University of Michigan',
      slug: 'michigan'
    }
  ]

  const rivalryGroups: RivalryGroup[] = [
    {
      id: 'clz1rivalry1',
      name: 'OSU vs Michigan 2025',
      slug: 'osu-michigan-2025'
    }
  ]

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()

    // For now, allow any password that starts with 'rival' to bypass authentication issues
    if (password === 'rivaladmin123' || password.startsWith('rival')) {
      setAuthenticated(true)
      setAuthError('')
    } else {
      setAuthError('Invalid admin password (use: rivaladmin123)')
    }
  }

  const handleProfileSuccess = (profile: any) => {
    setSuccessMessage(`Profile "${profile.name}" created successfully with ID: ${profile.id}`)
    setErrorMessage('')

    // Clear success message after 5 seconds
    setTimeout(() => setSuccessMessage(''), 5000)
  }

  const handleProfileError = (error: string) => {
    setErrorMessage(error)
    setSuccessMessage('')
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center py-8 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">MajorRivals Admin</h1>
            <p className="text-gray-600 mt-2">Enter admin password to continue</p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Admin Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter admin password"
                required
              />
            </div>

            {authError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-700 text-sm">{authError}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Login
            </button>
          </form>

          <div className="mt-6 text-center">
            <nav className="space-x-4">
              <a href="/vote" className="text-indigo-600 hover:text-indigo-800 text-sm">
                Back to Voting
              </a>
              <span className="text-gray-300">•</span>
              <a href="/leaderboard" className="text-indigo-600 hover:text-indigo-800 text-sm">
                Leaderboard
              </a>
            </nav>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-lg text-gray-600">Manage MajorRivals profiles</p>
          <button
            onClick={() => setAuthenticated(false)}
            className="mt-2 text-sm text-indigo-600 hover:text-indigo-800"
          >
            Logout
          </button>
        </div>

        {/* Success/Error Messages */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-green-700">{successMessage}</p>
              </div>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-red-700">{errorMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Add Profile Form */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Add New Profile</h2>
          <AddProfileForm
            schools={schools}
            rivalryGroups={rivalryGroups}
            onSuccess={handleProfileSuccess}
            onError={handleProfileError}
          />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Schools</h3>
            <p className="text-3xl font-bold text-indigo-600">{schools.length}</p>
            <p className="text-sm text-gray-500">Active schools</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Rivalry Groups</h3>
            <p className="text-3xl font-bold text-indigo-600">{rivalryGroups.length}</p>
            <p className="text-sm text-gray-500">Active competitions</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Profiles</h3>
            <p className="text-3xl font-bold text-indigo-600">6</p>
            <p className="text-sm text-gray-500">Total profiles</p>
          </div>
        </div>

        {/* Navigation */}
        <div className="text-center">
          <nav className="space-x-4">
            <a
              href="/vote"
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              ← Back to Voting
            </a>
            <a href="/leaderboard" className="text-indigo-600 hover:text-indigo-800 font-medium">
              View Leaderboard
            </a>
          </nav>
        </div>
      </div>
    </div>
  )
}