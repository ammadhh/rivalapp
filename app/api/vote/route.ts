import { NextRequest, NextResponse } from 'next/server'
import { calculateEloFromVote } from '@/lib/elo'
import crypto from 'crypto'

// Since we can't use Prisma directly, we'll use Supabase MCP for database operations
// This would normally import { prisma } from '@/lib/prisma'

interface VoteRequest {
  matchup: {
    id: string
    leftProfile: {
      id: string
      elo_rating: number
      school: { id: string }
    }
    rightProfile: {
      id: string
      elo_rating: number
      school: { id: string }
    }
  }
  result: 'LEFT' | 'RIGHT' | 'EQUAL' | 'SKIP'
}

export async function POST(request: NextRequest) {
  try {
    const body: VoteRequest = await request.json()
    const { matchup, result } = body

    // Generate voter fingerprint from IP
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown'
    const voterFingerprint = crypto.createHash('sha256').update(ip).digest('hex')

    // Calculate Elo updates
    const eloUpdate = calculateEloFromVote(
      matchup.leftProfile.elo_rating,
      matchup.rightProfile.elo_rating,
      result
    )

    // Determine winner and loser for rivalry points
    let winnerProfileId: string | null = null
    let loserProfileId: string | null = null
    let shouldUpdateRivalryPoints = false

    if (result === 'LEFT') {
      winnerProfileId = matchup.leftProfile.id
      loserProfileId = matchup.rightProfile.id
      // Update rivalry points if different schools
      shouldUpdateRivalryPoints = matchup.leftProfile.school.id !== matchup.rightProfile.school.id
    } else if (result === 'RIGHT') {
      winnerProfileId = matchup.rightProfile.id
      loserProfileId = matchup.leftProfile.id
      // Update rivalry points if different schools
      shouldUpdateRivalryPoints = matchup.leftProfile.school.id !== matchup.rightProfile.school.id
    }

    // For now, return the calculated updates
    // In a full implementation, this would save to database via Supabase MCP
    const response = {
      success: true,
      eloUpdate,
      voteProcessed: {
        result,
        matchupId: matchup.id,
        voterFingerprint: voterFingerprint.substring(0, 8) + '...', // Partial for privacy
        winnerProfileId,
        loserProfileId,
        rivalryPointsAwarded: shouldUpdateRivalryPoints ? 1 : 0,
        timestamp: new Date().toISOString()
      },
      debug: {
        leftProfile: {
          id: matchup.leftProfile.id,
          oldRating: eloUpdate.playerA.oldRating,
          newRating: eloUpdate.playerA.newRating,
          change: eloUpdate.playerA.change
        },
        rightProfile: {
          id: matchup.rightProfile.id,
          oldRating: eloUpdate.playerB.oldRating,
          newRating: eloUpdate.playerB.newRating,
          change: eloUpdate.playerB.change
        }
      }
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Vote processing error:', error)
    return NextResponse.json(
      { error: 'Failed to process vote', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  // Health check endpoint
  return NextResponse.json({
    status: 'healthy',
    endpoint: 'vote',
    timestamp: new Date().toISOString()
  })
}