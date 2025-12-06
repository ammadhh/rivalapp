'use client'

import { useState, useEffect } from 'react'
import ProfileCard from '../../components/ProfileCard'
import VoteButtons from '../../components/VoteButtons'
import Link from 'next/link'

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
      const response = await fetch('/api/matchup?rivalry_group_id=clz1rivalry1')
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-100 border-t-blue-500 mx-auto mb-6"></div>
            <div className="absolute inset-0 rounded-full animate-ping bg-blue-400 opacity-20"></div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Finding Your Next Matchup</h2>
          <p className="text-gray-600">Preparing the best professionals for comparison...</p>
        </div>
      </div>
    )
  }

  if (!matchup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl p-12 shadow-xl border border-gray-100 max-w-md">
          <div className="text-6xl mb-6">🤔</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">No Matchup Available</h2>
          <p className="text-gray-600 mb-6">We couldn't find a suitable matchup at the moment.</p>
          <button
            onClick={fetchNewMatchup}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header Bar */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">MR</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">MajorRivals</h1>
            </div>

            {/* Rivalry Badge */}
            <div className="hidden sm:flex items-center space-x-3 bg-gray-100 rounded-full px-4 py-2">
              <span className="text-sm font-medium text-gray-600">
                {matchup.leftProfile.school.name} vs {matchup.rightProfile.school.name}
              </span>
            </div>

            {/* Navigation */}
            <div className="flex items-center space-x-4">
              <Link
                href="/leaderboard"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Leaderboard
              </Link>
              <Link
                href="/admin"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Admin
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Title Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Who Would You Choose?
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Compare these two talented professionals and decide who you'd rather collaborate with on your next project.
          </p>
        </div>

        {/* Matchup Layout */}
        <div className="grid lg:grid-cols-3 gap-8 xl:gap-12 items-start mb-16">
          {/* Left Profile */}
          <div className="flex justify-center lg:justify-end">
            <ProfileCard
              profile={matchup.leftProfile}
              side="left"
              onVote={handleVote}
              disabled={voting}
            />
          </div>

          {/* Vote Buttons */}
          <div className="flex justify-center lg:col-span-1">
            <div className="lg:sticky lg:top-32">
              <VoteButtons onVote={handleVote} voting={voting} />
            </div>
          </div>

          {/* Right Profile */}
          <div className="flex justify-center lg:justify-start">
            <ProfileCard
              profile={matchup.rightProfile}
              side="right"
              onVote={handleVote}
              disabled={voting}
            />
          </div>
        </div>

        {/* Stats Footer */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-8 bg-white/60 backdrop-blur-sm rounded-2xl px-8 py-4 border border-white/20">
            <div className="text-center">
              <div className="text-sm font-medium text-gray-500">Votes Today</div>
              <div className="text-2xl font-bold text-gray-900">127</div>
            </div>
            <div className="w-px h-8 bg-gray-200"></div>
            <div className="text-center">
              <div className="text-sm font-medium text-gray-500">Active Profiles</div>
              <div className="text-2xl font-bold text-gray-900">6</div>
            </div>
            <div className="w-px h-8 bg-gray-200"></div>
            <div className="text-center">
              <div className="text-sm font-medium text-gray-500">Rivalry Heat</div>
              <div className="text-2xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">🔥</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}