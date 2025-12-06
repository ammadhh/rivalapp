import { NextRequest, NextResponse } from 'next/server'

// For now, we'll use direct SQL via Supabase MCP since we can't connect Prisma directly
// This will return matchup data that the frontend can use

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const groupSlug = searchParams.get('groupSlug') || 'osu-michigan-2025'

    // For now, return mock data that matches our seeded profiles
    // In production, this would use smart matchmaking logic

    const mockMatchups = [
      // Cross-school matchups (preferred)
      {
        id: 'temp_matchup_1',
        leftProfile: {
          id: 'clz1profile1',
          name: 'Alex Chen',
          school: {
            name: 'The Ohio State University',
            slug: 'ohio-state',
            logo_url: 'https://logos-world.net/wp-content/uploads/2022/04/Ohio-State-Logo.png'
          },
          grad_year: 2023,
          major: 'Computer Science',
          avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
          headline: 'Software Engineer at Google',
          experiences: [
            { company: 'Google', title: 'Software Engineer', logoUrl: 'https://www.google.com/favicon.ico' },
            { company: 'Microsoft', title: 'SDE Intern', logoUrl: 'https://www.microsoft.com/favicon.ico' }
          ],
          elo_rating: 1500
        },
        rightProfile: {
          id: 'clz1profile3',
          name: 'Marcus Williams',
          school: {
            name: 'University of Michigan',
            slug: 'michigan',
            logo_url: 'https://logos-world.net/wp-content/uploads/2021/12/Michigan-Wolverines-Logo.png'
          },
          grad_year: 2023,
          major: 'Business Administration',
          avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
          headline: 'Product Manager at Apple',
          experiences: [
            { company: 'Apple', title: 'Product Manager', logoUrl: 'https://www.apple.com/favicon.ico' },
            { company: 'Amazon', title: 'PM Intern', logoUrl: 'https://www.amazon.com/favicon.ico' }
          ],
          elo_rating: 1500
        }
      },
      {
        id: 'temp_matchup_2',
        leftProfile: {
          id: 'clz1profile2',
          name: 'Sarah Johnson',
          school: {
            name: 'The Ohio State University',
            slug: 'ohio-state',
            logo_url: 'https://logos-world.net/wp-content/uploads/2022/04/Ohio-State-Logo.png'
          },
          grad_year: 2024,
          major: 'Data Science',
          avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b6232d8a?w=150&h=150&fit=crop&crop=face',
          headline: 'ML Engineer at Meta',
          experiences: [
            { company: 'Meta', title: 'ML Engineer', logoUrl: 'https://www.facebook.com/favicon.ico' },
            { company: 'Tesla', title: 'Data Scientist', logoUrl: 'https://www.tesla.com/favicon.ico' }
          ],
          elo_rating: 1500
        },
        rightProfile: {
          id: 'clz1profile4',
          name: 'Emily Rodriguez',
          school: {
            name: 'University of Michigan',
            slug: 'michigan',
            logo_url: 'https://logos-world.net/wp-content/uploads/2021/12/Michigan-Wolverines-Logo.png'
          },
          grad_year: 2024,
          major: 'Electrical Engineering',
          avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
          headline: 'Hardware Engineer at NVIDIA',
          experiences: [
            { company: 'NVIDIA', title: 'Hardware Engineer', logoUrl: 'https://www.nvidia.com/favicon.ico' },
            { company: 'Intel', title: 'Engineering Intern', logoUrl: 'https://www.intel.com/favicon.ico' }
          ],
          elo_rating: 1500
        }
      }
    ]

    // Return a random matchup
    const randomMatchup = mockMatchups[Math.floor(Math.random() * mockMatchups.length)]

    return NextResponse.json(randomMatchup)
  } catch (error) {
    console.error('Matchup API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch matchup' },
      { status: 500 }
    )
  }
}