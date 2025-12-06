import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

interface AddProfileRequest {
  adminSecret: string
  profile: {
    name: string
    school_id: string
    rivalry_group_id: string
    grad_year?: number
    major?: string
    avatar_url?: string
    headline?: string
    experiences?: Array<{
      company: string
      title: string
      logoUrl: string
    }>
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: AddProfileRequest = await request.json()
    const { adminSecret, profile } = body

    // Check admin authentication
    if (adminSecret !== process.env.ADMIN_SECRET) {
      return NextResponse.json(
        { error: 'Invalid admin credentials' },
        { status: 401 }
      )
    }

    // Validate required fields
    if (!profile.name || !profile.school_id || !profile.rivalry_group_id) {
      return NextResponse.json(
        { error: 'Missing required fields: name, school_id, rivalry_group_id' },
        { status: 400 }
      )
    }

    // Insert profile into Supabase
    const { data: newProfile, error: insertError } = await supabase
      .from('profiles')
      .insert({
        name: profile.name,
        school_id: profile.school_id,
        rivalry_group_id: profile.rivalry_group_id,
        grad_year: profile.grad_year,
        major: profile.major,
        avatar_url: profile.avatar_url,
        headline: profile.headline,
        experiences: profile.experiences || [],
        elo_rating: 1500, // Default starting Elo
        visible: true
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error inserting profile:', insertError)
      return NextResponse.json(
        { error: 'Failed to create profile in database', details: insertError.message },
        { status: 500 }
      )
    }

    console.log('Profile created successfully:', newProfile)

    return NextResponse.json({
      success: true,
      message: 'Profile created successfully',
      profile: newProfile,
      debug: {
        profileId: newProfile.id,
        startingElo: 1500,
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Add profile API error:', error)
    return NextResponse.json(
      {
        error: 'Failed to create profile',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  // Health check endpoint
  return NextResponse.json({
    status: 'healthy',
    endpoint: 'admin/add-profile',
    requiredFields: ['adminSecret', 'profile.name', 'profile.school_id', 'profile.rivalry_group_id'],
    optionalFields: ['profile.grad_year', 'profile.major', 'profile.avatar_url', 'profile.headline', 'profile.experiences'],
    timestamp: new Date().toISOString()
  })
}