'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

interface School {
  id: string
  name: string
  slug: string
}

export default function AddProfilePage() {
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    school_id: '',
    grad_year: new Date().getFullYear(),
    major: '',
    headline: '',
    avatar_url: ''
  })

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.school_id) {
      setErrorMessage('Name and school are required')
      return
    }

    try {
      setLoading(true)
      setErrorMessage('')
      setSuccessMessage('')

      // Insert profile directly into Supabase
      const { data: newProfile, error: insertError } = await supabase
        .from('profiles')
        .insert({
          name: formData.name,
          school_id: formData.school_id,
          rivalry_group_id: 'clz1rivalry1',
          grad_year: formData.grad_year,
          major: formData.major || undefined,
          headline: formData.headline || undefined,
          avatar_url: formData.avatar_url || undefined,
          elo_rating: 1500,
          visible: true,
          experiences: []
        })
        .select()
        .single()

      if (insertError) {
        console.error('Error inserting profile:', insertError)
        setErrorMessage('Failed to create profile. Please try again.')
        return
      }

      setSuccessMessage(`Profile "${newProfile.name}" created successfully! They'll appear in voting shortly.`)

      // Reset form
      setFormData({
        name: '',
        school_id: '',
        grad_year: new Date().getFullYear(),
        major: '',
        headline: '',
        avatar_url: ''
      })

    } catch (error) {
      console.error('Error creating profile:', error)
      setErrorMessage('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">MR</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Add New Profile</h1>
          </div>
          <p className="text-lg text-gray-600">Join the rivalry! Add your profile to the voting competition.</p>
        </div>

        {/* Success/Error Messages */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4">
            <p className="text-green-700 font-medium">{successMessage}</p>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-700 font-medium">{errorMessage}</p>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="John Doe"
              />
            </div>

            {/* School */}
            <div>
              <label htmlFor="school_id" className="block text-sm font-semibold text-gray-900 mb-2">
                School *
              </label>
              <select
                id="school_id"
                required
                value={formData.school_id}
                onChange={(e) => setFormData(prev => ({ ...prev, school_id: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">Select your school</option>
                {schools.map(school => (
                  <option key={school.id} value={school.id}>
                    {school.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Graduation Year */}
              <div>
                <label htmlFor="grad_year" className="block text-sm font-semibold text-gray-900 mb-2">
                  Graduation Year
                </label>
                <input
                  type="number"
                  id="grad_year"
                  value={formData.grad_year}
                  onChange={(e) => setFormData(prev => ({ ...prev, grad_year: parseInt(e.target.value) || new Date().getFullYear() }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  min="2020"
                  max="2030"
                />
              </div>

              {/* Major */}
              <div>
                <label htmlFor="major" className="block text-sm font-semibold text-gray-900 mb-2">
                  Major
                </label>
                <input
                  type="text"
                  id="major"
                  value={formData.major}
                  onChange={(e) => setFormData(prev => ({ ...prev, major: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Computer Science"
                />
              </div>
            </div>

            {/* Headline */}
            <div>
              <label htmlFor="headline" className="block text-sm font-semibold text-gray-900 mb-2">
                Professional Headline
              </label>
              <input
                type="text"
                id="headline"
                value={formData.headline}
                onChange={(e) => setFormData(prev => ({ ...prev, headline: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Software Engineer at Google"
              />
            </div>

            {/* Avatar URL */}
            <div>
              <label htmlFor="avatar_url" className="block text-sm font-semibold text-gray-900 mb-2">
                Profile Picture URL (Optional)
              </label>
              <input
                type="url"
                id="avatar_url"
                value={formData.avatar_url}
                onChange={(e) => setFormData(prev => ({ ...prev, avatar_url: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400"
              />
              <p className="text-xs text-gray-500 mt-1">
                Add a URL to your profile picture. Try <a href="https://unsplash.com" target="_blank" className="text-blue-500 hover:underline">Unsplash</a> or <a href="https://images.google.com" target="_blank" className="text-blue-500 hover:underline">Google Images</a> for professional photos.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 active:scale-95"
            >
              {loading ? 'Creating Profile...' : 'Join MajorRivals! 🚀'}
            </button>
          </form>

          {/* Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <p className="text-blue-700 text-sm">
              <strong>Note:</strong> Your profile will start with a 1500 Elo rating and immediately appear in the voting system. Users will compare you against other professionals in head-to-head matchups.
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="text-center mt-8">
          <nav className="space-x-4">
            <a
              href="/vote"
              className="inline-flex items-center px-6 py-3 bg-white text-gray-700 font-medium rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              ← Start Voting
            </a>
            <a
              href="/leaderboard"
              className="inline-flex items-center px-6 py-3 bg-white text-gray-700 font-medium rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              View Leaderboard
            </a>
          </nav>
        </div>
      </div>
    </div>
  )
}