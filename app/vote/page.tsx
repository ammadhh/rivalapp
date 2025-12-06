'use client'

import { useState, useEffect } from 'react'
import ProfileCard from '../../components/ProfileCard'

interface Experience {
  company: string
  title: string
  logoUrl: string
}

interface School {
  name: string
  slug: string
  logo_url: string
}

interface Profile {
  id: string
  name: string
  school: School
  grad_year?: number
  major?: string
  avatar_url?: string
  headline?: string
  experiences?: Experience[]
  elo_rating: number
}

interface Matchup {
  id: string
  leftProfile: Profile
  rightProfile: Profile
}

export default function VotePage() {
  const [matchup, setMatchup] = useState<Matchup | null>(null)
  const [loading, setLoading] = useState(true)
  const [voting, setVoting] = useState(false)

  const fetchNewMatchup = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/matchup?groupSlug=osu-michigan-2025')
      if (response.ok) {
        const newMatchup = await response.json()
        setMatchup(newMatchup)
      } else {
        console.error('Failed to fetch matchup')
      }
    } catch (error) {
      console.error('Error fetching matchup:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleVote = async (result: 'LEFT' | 'RIGHT' | 'EQUAL' | 'SKIP') => {
    if (!matchup || voting) return

    try {
      setVoting(true)

      // Process the vote
      const voteResponse = await fetch('/api/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          matchup: {
            id: matchup.id,
            leftProfile: {
              id: matchup.leftProfile.id,
              elo_rating: matchup.leftProfile.elo_rating,
              school: { id: 'school_' + matchup.leftProfile.school.slug }
            },
            rightProfile: {
              id: matchup.rightProfile.id,
              elo_rating: matchup.rightProfile.elo_rating,
              school: { id: 'school_' + matchup.rightProfile.school.slug }
            }
          },
          result
        })
      })

      if (voteResponse.ok) {
        const voteResult = await voteResponse.json()
        console.log('Vote processed:', voteResult)

        // Show Elo changes briefly
        if (voteResult.eloUpdate && result !== 'SKIP') {
          console.log('Elo changes:', {
            left: `${voteResult.debug.leftProfile.oldRating} → ${voteResult.debug.leftProfile.newRating} (${voteResult.debug.leftProfile.change > 0 ? '+' : ''}${voteResult.debug.leftProfile.change})`,
            right: `${voteResult.debug.rightProfile.oldRating} → ${voteResult.debug.rightProfile.newRating} (${voteResult.debug.rightProfile.change > 0 ? '+' : ''}${voteResult.debug.rightProfile.change})`
          })
        }
      } else {
        console.error('Vote processing failed:', await voteResponse.text())
      }

      // Fetch new matchup regardless of vote processing result
      await fetchNewMatchup()

    } catch (error) {
      console.error('Error processing vote:', error)
      // Still try to fetch new matchup
      await fetchNewMatchup()
    } finally {
      setVoting(false)
    }
  }

  useEffect(() => {
    fetchNewMatchup()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading matchup...</p>
        </div>
      </div>
    )
  }

  if (!matchup) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No matchup available</p>
          <button
            onClick={fetchNewMatchup}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">MajorRivals</h1>
          <p className="text-lg text-gray-600">Who would you rather work with?</p>
          <p className="text-sm text-gray-500 mt-2">
            {matchup.leftProfile.school.name} vs {matchup.rightProfile.school.name}
          </p>
        </div>

        {/* Matchup Display */}
        <div className="grid lg:grid-cols-3 gap-8 items-center">
          {/* Left Profile */}
          <div className="lg:justify-self-end">
            <ProfileCard profile={matchup.leftProfile} side="left" />
          </div>

          {/* Voting Buttons */}
          <div className="space-y-4 text-center">
            <button
              onClick={() => handleVote('LEFT')}
              disabled={voting}
              className="w-full py-3 px-6 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {voting ? 'Voting...' : 'Choose Left'}
            </button>

            <button
              onClick={() => handleVote('EQUAL')}
              disabled={voting}
              className="w-full py-3 px-6 bg-purple-500 text-white font-medium rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {voting ? 'Voting...' : 'Equal'}
            </button>

            <button
              onClick={() => handleVote('RIGHT')}
              disabled={voting}
              className="w-full py-3 px-6 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {voting ? 'Voting...' : 'Choose Right'}
            </button>

            <button
              onClick={() => handleVote('SKIP')}
              disabled={voting}
              className="w-full py-2 px-6 bg-gray-400 text-white font-medium rounded-lg hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {voting ? 'Skipping...' : 'Skip'}
            </button>
          </div>

          {/* Right Profile */}
          <div className="lg:justify-self-start">
            <ProfileCard profile={matchup.rightProfile} side="right" />
          </div>
        </div>

        {/* Navigation */}
        <div className="text-center mt-8">
          <nav className="space-x-4">
            <a href="/leaderboard" className="text-indigo-600 hover:text-indigo-800 font-medium">
              View Leaderboard
            </a>
            <span className="text-gray-300">•</span>
            <a href="/admin" className="text-indigo-600 hover:text-indigo-800 font-medium">
              Admin
            </a>
          </nav>
        </div>
      </div>
    </div>
  )
}