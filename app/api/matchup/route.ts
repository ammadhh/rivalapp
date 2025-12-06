import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const rivalryGroupId = searchParams.get('rivalry_group_id') || 'clz1rivalry1'

  try {
    // Get all visible profiles with their schools
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select(`
        *,
        school:schools(*)
      `)
      .eq('rivalry_group_id', rivalryGroupId)
      .eq('visible', true)

    if (profileError) {
      console.error('Error fetching profiles:', profileError)
      return NextResponse.json({ error: 'Failed to fetch profiles' }, { status: 500 })
    }

    if (!profiles || profiles.length < 2) {
      return NextResponse.json({ error: 'Not enough profiles for matchup' }, { status: 404 })
    }

    // Smart matchup selection
    const crossSchoolProfiles = []
    const sameSchoolProfiles = []

    for (let i = 0; i < profiles.length; i++) {
      for (let j = i + 1; j < profiles.length; j++) {
        const pair = [profiles[i], profiles[j]]
        if (profiles[i].school_id !== profiles[j].school_id) {
          crossSchoolProfiles.push(pair)
        } else {
          sameSchoolProfiles.push(pair)
        }
      }
    }

    // Prefer cross-school matchups (70% chance if available)
    let selectedPair
    if (crossSchoolProfiles.length > 0 && Math.random() < 0.7) {
      selectedPair = crossSchoolProfiles[Math.floor(Math.random() * crossSchoolProfiles.length)]
    } else if (sameSchoolProfiles.length > 0 && crossSchoolProfiles.length === 0) {
      selectedPair = sameSchoolProfiles[Math.floor(Math.random() * sameSchoolProfiles.length)]
    } else {
      // Fallback to any available pairing
      const availablePairs = [...crossSchoolProfiles, ...sameSchoolProfiles]
      selectedPair = availablePairs[Math.floor(Math.random() * availablePairs.length)]
    }

    const [leftProfile, rightProfile] = selectedPair

    // Create and save the matchup
    const { data: matchup, error: matchupError } = await supabase
      .from('matchups')
      .insert({
        left_profile_id: leftProfile.id,
        right_profile_id: rightProfile.id,
        rivalry_group_id: rivalryGroupId
      })
      .select()
      .single()

    if (matchupError) {
      console.error('Error creating matchup:', matchupError)
      return NextResponse.json({ error: 'Failed to create matchup' }, { status: 500 })
    }

    return NextResponse.json({
      id: matchup.id,
      rivalry_group_id: rivalryGroupId,
      leftProfile: leftProfile,
      rightProfile: rightProfile,
      is_cross_school: leftProfile.school_id !== rightProfile.school_id
    })
  } catch (error) {
    console.error('Matchup API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}