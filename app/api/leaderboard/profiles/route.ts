import { NextRequest, NextResponse } from 'next/server'

// For now, return mock data based on our seeded profiles
// In production, this would query the database via Supabase MCP

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const groupSlug = searchParams.get('groupSlug') || 'osu-michigan-2025'
    const schoolFilter = searchParams.get('school') // Optional filter by school

    // Mock data that matches our seeded data
    const allProfiles = [
      {
        id: 'clz1profile1',
        name: 'Alex Chen',
        elo_rating: 1500,
        headline: 'Software Engineer at Google',
        grad_year: 2023,
        major: 'Computer Science',
        avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        school: {
          id: 'clz1school1',
          name: 'The Ohio State University',
          slug: 'ohio-state',
          logo_url: 'https://logos-world.net/wp-content/uploads/2022/04/Ohio-State-Logo.png'
        },
        experiences: [
          { company: 'Google', title: 'Software Engineer', logoUrl: 'https://www.google.com/favicon.ico' }
        ]
      },
      {
        id: 'clz1profile2',
        name: 'Sarah Johnson',
        elo_rating: 1500,
        headline: 'ML Engineer at Meta',
        grad_year: 2024,
        major: 'Data Science',
        avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b6232d8a?w=150&h=150&fit=crop&crop=face',
        school: {
          id: 'clz1school1',
          name: 'The Ohio State University',
          slug: 'ohio-state',
          logo_url: 'https://logos-world.net/wp-content/uploads/2022/04/Ohio-State-Logo.png'
        },
        experiences: [
          { company: 'Meta', title: 'ML Engineer', logoUrl: 'https://www.facebook.com/favicon.ico' }
        ]
      },
      {
        id: 'clz1profile5',
        name: 'David Park',
        elo_rating: 1500,
        headline: 'Robotics Engineer at Boston Dynamics',
        grad_year: 2025,
        major: 'Mechanical Engineering',
        avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        school: {
          id: 'clz1school1',
          name: 'The Ohio State University',
          slug: 'ohio-state',
          logo_url: 'https://logos-world.net/wp-content/uploads/2022/04/Ohio-State-Logo.png'
        },
        experiences: [
          { company: 'Boston Dynamics', title: 'Robotics Engineer', logoUrl: 'https://www.bostondynamics.com/favicon.ico' }
        ]
      },
      {
        id: 'clz1profile3',
        name: 'Marcus Williams',
        elo_rating: 1500,
        headline: 'Product Manager at Apple',
        grad_year: 2023,
        major: 'Business Administration',
        avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
        school: {
          id: 'clz1school2',
          name: 'University of Michigan',
          slug: 'michigan',
          logo_url: 'https://logos-world.net/wp-content/uploads/2021/12/Michigan-Wolverines-Logo.png'
        },
        experiences: [
          { company: 'Apple', title: 'Product Manager', logoUrl: 'https://www.apple.com/favicon.ico' }
        ]
      },
      {
        id: 'clz1profile4',
        name: 'Emily Rodriguez',
        elo_rating: 1500,
        headline: 'Hardware Engineer at NVIDIA',
        grad_year: 2024,
        major: 'Electrical Engineering',
        avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        school: {
          id: 'clz1school2',
          name: 'University of Michigan',
          slug: 'michigan',
          logo_url: 'https://logos-world.net/wp-content/uploads/2021/12/Michigan-Wolverines-Logo.png'
        },
        experiences: [
          { company: 'NVIDIA', title: 'Hardware Engineer', logoUrl: 'https://www.nvidia.com/favicon.ico' }
        ]
      },
      {
        id: 'clz1profile6',
        name: 'Jessica Liu',
        elo_rating: 1500,
        headline: 'Investment Banker at Goldman Sachs',
        grad_year: 2025,
        major: 'Finance',
        avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face',
        school: {
          id: 'clz1school2',
          name: 'University of Michigan',
          slug: 'michigan',
          logo_url: 'https://logos-world.net/wp-content/uploads/2021/12/Michigan-Wolverines-Logo.png'
        },
        experiences: [
          { company: 'Goldman Sachs', title: 'Investment Banking Analyst', logoUrl: 'https://www.goldmansachs.com/favicon.ico' }
        ]
      }
    ]

    // Filter by school if requested
    let filteredProfiles = allProfiles
    if (schoolFilter) {
      filteredProfiles = allProfiles.filter(profile =>
        profile.school.slug === schoolFilter
      )
    }

    // Sort by Elo rating (descending)
    filteredProfiles.sort((a, b) => b.elo_rating - a.elo_rating)

    // Take top 50
    const topProfiles = filteredProfiles.slice(0, 50)

    return NextResponse.json({
      success: true,
      data: topProfiles,
      metadata: {
        groupSlug,
        schoolFilter,
        timestamp: new Date().toISOString(),
        total_profiles: topProfiles.length,
        showing: Math.min(50, filteredProfiles.length),
        available_schools: ['ohio-state', 'michigan']
      }
    })

  } catch (error) {
    console.error('Profiles leaderboard API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profiles leaderboard' },
      { status: 500 }
    )
  }
}