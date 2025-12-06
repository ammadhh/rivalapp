'use client'

import { useState, useEffect } from 'react'
import SchoolLeaderboard from '../../components/SchoolLeaderboard'
import ProfileLeaderboard from '../../components/ProfileLeaderboard'

interface School {
  id: string
  name: string
  slug: string
  logo_url: string
  rivalry_points: number
  profile_count: number
  average_elo: number
  top_profiles: Array<{
    name: string
    elo_rating: number
    headline: string
  }>
}

interface Profile {
  id: string
  name: string
  elo_rating: number
  headline: string
  grad_year?: number
  major?: string
  avatar_url?: string
  school: {
    id: string
    name: string
    slug: string
    logo_url: string
  }
  experiences?: Array<{
    company: string
    title: string
    logoUrl: string
  }>
}

type ActiveTab = 'schools' | 'profiles'

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('schools')
  const [schools, setSchools] = useState<School[]>([])
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [schoolsLoading, setSchoolsLoading] = useState(true)
  const [profilesLoading, setProfilesLoading] = useState(true)
  const [schoolFilter, setSchoolFilter] = useState<string | null>(null)
  const [availableSchools, setAvailableSchools] = useState<string[]>([])

  const fetchSchools = async () => {
    try {
      setSchoolsLoading(true)
      const response = await fetch('/api/leaderboard/schools?groupSlug=osu-michigan-2025')
      if (response.ok) {
        const result = await response.json()
        setSchools(result.data || [])
      } else {
        console.error('Failed to fetch schools leaderboard')
      }
    } catch (error) {
      console.error('Error fetching schools:', error)
    } finally {
      setSchoolsLoading(false)
    }
  }

  const fetchProfiles = async (schoolSlug?: string | null) => {
    try {
      setProfilesLoading(true)
      const url = schoolSlug
        ? `/api/leaderboard/profiles?groupSlug=osu-michigan-2025&school=${schoolSlug}`
        : '/api/leaderboard/profiles?groupSlug=osu-michigan-2025'

      const response = await fetch(url)
      if (response.ok) {
        const result = await response.json()
        setProfiles(result.data || [])
        if (result.metadata?.available_schools) {
          setAvailableSchools(result.metadata.available_schools)
        }
      } else {
        console.error('Failed to fetch profiles leaderboard')
      }
    } catch (error) {
      console.error('Error fetching profiles:', error)
    } finally {
      setProfilesLoading(false)
    }
  }

  const handleSchoolFilterChange = (school: string | null) => {
    setSchoolFilter(school)
    fetchProfiles(school)
  }

  useEffect(() => {
    fetchSchools()
    fetchProfiles()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Leaderboard</h1>
          <p className="text-lg text-gray-600">OSU vs Michigan 2025</p>
        </div>

        {/* Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-4 justify-center">
            <button
              onClick={() => setActiveTab('schools')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'schools'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Schools
            </button>
            <button
              onClick={() => setActiveTab('profiles')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'profiles'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Profiles
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="mb-8">
          {activeTab === 'schools' ? (
            <SchoolLeaderboard schools={schools} loading={schoolsLoading} />
          ) : (
            <ProfileLeaderboard
              profiles={profiles}
              loading={profilesLoading}
              schoolFilter={schoolFilter}
              onSchoolFilterChange={handleSchoolFilterChange}
              availableSchools={availableSchools}
            />
          )}
        </div>

        {/* Back to Vote */}
        <div className="text-center">
          <nav className="space-x-4">
            <a
              href="/vote"
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              ← Back to Voting
            </a>
            <a href="/admin" className="text-indigo-600 hover:text-indigo-800 font-medium">
              Admin
            </a>
          </nav>
        </div>
      </div>
    </div>
  )
}