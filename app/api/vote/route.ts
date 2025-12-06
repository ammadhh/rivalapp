import { NextRequest, NextResponse } from 'next/server'
import { calculateEloFromVote } from '@/lib/elo'
import { supabase } from '@/lib/supabase'
import crypto from 'crypto'

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

    // Save vote to database
    const { data: voteData, error: voteError } = await supabase
      .from('votes')
      .insert({
        matchup_id: matchup.id,
        voter_fingerprint: voterFingerprint,
        result,
        left_elo_before: eloUpdate.playerA.oldRating,
        right_elo_before: eloUpdate.playerB.oldRating,
        left_elo_change: eloUpdate.playerA.change,
        right_elo_change: eloUpdate.playerB.change
      })
      .select()
      .single()

    if (voteError) {
      console.error('Error saving vote:', voteError)
      return NextResponse.json({ error: 'Failed to save vote' }, { status: 500 })
    }

    // Update profile Elo ratings
    const { error: leftUpdateError } = await supabase
      .from('profiles')
      .update({ elo_rating: eloUpdate.playerA.newRating })
      .eq('id', matchup.leftProfile.id)

    if (leftUpdateError) {
      console.error('Error updating left profile:', leftUpdateError)
    }

    const { error: rightUpdateError } = await supabase
      .from('profiles')
      .update({ elo_rating: eloUpdate.playerB.newRating })
      .eq('id', matchup.rightProfile.id)

    if (rightUpdateError) {
      console.error('Error updating right profile:', rightUpdateError)
    }

    // Update rivalry points if cross-school matchup
    if (matchup.leftProfile.school.id !== matchup.rightProfile.school.id) {
      let winnerSchoolId: string | null = null

      if (result === 'LEFT') {
        winnerSchoolId = matchup.leftProfile.school.id
      } else if (result === 'RIGHT') {
        winnerSchoolId = matchup.rightProfile.school.id
      }

      if (winnerSchoolId) {
        // Update rivalry points using read-then-write pattern
        const { data: school, error: schoolError } = await supabase
          .from('schools')
          .select('rivalry_points')
          .eq('id', winnerSchoolId)
          .single()

        if (school && !schoolError) {
          const { error: pointsError } = await supabase
            .from('schools')
            .update({ rivalry_points: school.rivalry_points + 1 })
            .eq('id', winnerSchoolId)

          if (pointsError) {
            console.error('Error updating rivalry points:', pointsError)
          }
        }
      }
    }

    const response = {
      success: true,
      eloUpdate,
      voteProcessed: {
        result,
        matchupId: matchup.id,
        voterFingerprint: voterFingerprint.substring(0, 8) + '...',
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