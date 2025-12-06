import { NextRequest, NextResponse } from 'next/server'

// For now, return mock data based on our seeded schools
// In production, this would query the database via Supabase MCP

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const groupSlug = searchParams.get('groupSlug') || 'osu-michigan-2025'

    // Mock data that matches our seeded data
    const schoolLeaderboard = [
      {
        id: 'clz1school1',
        name: 'The Ohio State University',
        slug: 'ohio-state',
        logo_url: 'https://logos-world.net/wp-content/uploads/2022/04/Ohio-State-Logo.png',
        rivalry_points: 0, // Would be calculated from wins
        profile_count: 3,
        average_elo: 1500, // Would be calculated from top 10 profiles
        top_profiles: [
          { name: 'Alex Chen', elo_rating: 1500, headline: 'Software Engineer at Google' },
          { name: 'Sarah Johnson', elo_rating: 1500, headline: 'ML Engineer at Meta' },
          { name: 'David Park', elo_rating: 1500, headline: 'Robotics Engineer at Boston Dynamics' }
        ]
      },
      {
        id: 'clz1school2',
        name: 'University of Michigan',
        slug: 'michigan',
        logo_url: 'https://logos-world.net/wp-content/uploads/2021/12/Michigan-Wolverines-Logo.png',
        rivalry_points: 0, // Would be calculated from wins
        profile_count: 3,
        average_elo: 1500, // Would be calculated from top 10 profiles
        top_profiles: [
          { name: 'Marcus Williams', elo_rating: 1500, headline: 'Product Manager at Apple' },
          { name: 'Emily Rodriguez', elo_rating: 1500, headline: 'Hardware Engineer at NVIDIA' },
          { name: 'Jessica Liu', elo_rating: 1500, headline: 'Investment Banker at Goldman Sachs' }
        ]
      }
    ]

    // Sort by rivalry points, then by average Elo
    schoolLeaderboard.sort((a, b) => {
      if (a.rivalry_points !== b.rivalry_points) {
        return b.rivalry_points - a.rivalry_points
      }
      return b.average_elo - a.average_elo
    })

    return NextResponse.json({
      success: true,
      data: schoolLeaderboard,
      metadata: {
        groupSlug,
        timestamp: new Date().toISOString(),
        total_schools: schoolLeaderboard.length
      }
    })

  } catch (error) {
    console.error('Schools leaderboard API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch schools leaderboard' },
      { status: 500 }
    )
  }
}