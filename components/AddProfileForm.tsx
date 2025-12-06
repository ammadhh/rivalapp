'use client'

import { useState } from 'react'

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

interface Experience {
  company: string
  title: string
  logoUrl: string
}

interface AddProfileFormProps {
  schools: School[]
  rivalryGroups: RivalryGroup[]
  onSuccess: (profile: any) => void
  onError: (error: string) => void
}

export default function AddProfileForm({
  schools,
  rivalryGroups,
  onSuccess,
  onError
}: AddProfileFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    school_id: '',
    rivalry_group_id: rivalryGroups[0]?.id || '',
    grad_year: new Date().getFullYear(),
    major: '',
    avatar_url: '',
    headline: '',
    experiences_json: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setLoading(true)

      // Parse experiences JSON
      let experiences: Experience[] = []
      if (formData.experiences_json.trim()) {
        try {
          experiences = JSON.parse(formData.experiences_json)
          if (!Array.isArray(experiences)) {
            throw new Error('Experiences must be an array')
          }
        } catch (parseError) {
          onError('Invalid JSON format for experiences')
          return
        }
      }

      const response = await fetch('/api/public-add-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profile: {
            name: formData.name,
            school_id: formData.school_id,
            rivalry_group_id: formData.rivalry_group_id,
            grad_year: formData.grad_year || undefined,
            major: formData.major || undefined,
            avatar_url: formData.avatar_url || undefined,
            headline: formData.headline || undefined,
            experiences: experiences.length > 0 ? experiences : undefined
          }
        })
      })

      const result = await response.json()

      if (response.ok) {
        onSuccess(result.profile)
        // Reset form
        setFormData({
          name: '',
          school_id: '',
          rivalry_group_id: rivalryGroups[0]?.id || '',
          grad_year: new Date().getFullYear(),
          major: '',
          avatar_url: '',
          headline: '',
          experiences_json: ''
        })
      } else {
        onError(result.error || 'Failed to create profile')
      }

    } catch (error) {
      console.error('Error creating profile:', error)
      onError('Network error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white p-6 rounded-lg shadow"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Info Message */}
        <div className="md:col-span-2 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-700 text-sm">
            <strong>Add New Profile:</strong> Fill out the form below to add a new profile to the voting system. All profiles start with a 1500 Elo rating.
          </p>
        </div>

        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            required
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="John Doe"
          />
        </div>

        {/* School */}
        <div>
          <label htmlFor="school_id" className="block text-sm font-medium text-gray-700 mb-1">
            School *
          </label>
          <select
            id="school_id"
            required
            value={formData.school_id}
            onChange={(e) => setFormData(prev => ({ ...prev, school_id: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select a school</option>
            {schools.map(school => (
              <option key={school.id} value={school.id}>
                {school.name}
              </option>
            ))}
          </select>
        </div>

        {/* Graduation Year */}
        <div>
          <label htmlFor="grad_year" className="block text-sm font-medium text-gray-700 mb-1">
            Graduation Year
          </label>
          <input
            type="number"
            id="grad_year"
            value={formData.grad_year}
            onChange={(e) => setFormData(prev => ({ ...prev, grad_year: parseInt(e.target.value) || new Date().getFullYear() }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            min="2020"
            max="2030"
          />
        </div>

        {/* Major */}
        <div>
          <label htmlFor="major" className="block text-sm font-medium text-gray-700 mb-1">
            Major
          </label>
          <input
            type="text"
            id="major"
            value={formData.major}
            onChange={(e) => setFormData(prev => ({ ...prev, major: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Computer Science"
          />
        </div>

        {/* Headline */}
        <div className="md:col-span-2">
          <label htmlFor="headline" className="block text-sm font-medium text-gray-700 mb-1">
            Professional Headline
          </label>
          <input
            type="text"
            id="headline"
            value={formData.headline}
            onChange={(e) => setFormData(prev => ({ ...prev, headline: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Software Engineer at Google"
          />
        </div>

        {/* Avatar URL */}
        <div className="md:col-span-2">
          <label htmlFor="avatar_url" className="block text-sm font-medium text-gray-700 mb-1">
            Avatar URL
          </label>
          <input
            type="url"
            id="avatar_url"
            value={formData.avatar_url}
            onChange={(e) => setFormData(prev => ({ ...prev, avatar_url: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="https://images.unsplash.com/photo-..."
          />
        </div>

        {/* Experiences JSON */}
        <div className="md:col-span-2">
          <label htmlFor="experiences_json" className="block text-sm font-medium text-gray-700 mb-1">
            Experiences (JSON Format)
          </label>
          <textarea
            id="experiences_json"
            value={formData.experiences_json}
            onChange={(e) => setFormData(prev => ({ ...prev, experiences_json: e.target.value }))}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder={`[{"company": "Google", "title": "Software Engineer", "logoUrl": "https://www.google.com/favicon.ico"}]`}
          />
          <p className="text-xs text-gray-500 mt-1">
            Optional: JSON array of experience objects with company, title, and logoUrl fields
          </p>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Creating...' : 'Create Profile'}
        </button>
      </div>
    </form>
  )
}