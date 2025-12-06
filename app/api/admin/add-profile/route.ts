import { NextRequest, NextResponse } from 'next/server'

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

    // Generate a new ID for the profile
    const profileId = `profile_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // In a full implementation, this would use Supabase MCP to insert the profile
    // For now, return a success response with the profile data
    const newProfile = {
      id: profileId,
      name: profile.name,
      school_id: profile.school_id,
      rivalry_group_id: profile.rivalry_group_id,
      grad_year: profile.grad_year,
      major: profile.major,
      avatar_url: profile.avatar_url,
      headline: profile.headline,
      experiences: profile.experiences || [],
      elo_rating: 1500, // Default starting Elo
      visible: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    console.log('Profile created (mock):', newProfile)

    return NextResponse.json({
      success: true,
      message: 'Profile created successfully',
      profile: newProfile,
      debug: {
        profileId,
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