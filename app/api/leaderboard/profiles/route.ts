import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const rivalryGroupId = searchParams.get('rivalry_group_id') || 'clz1rivalry1'
    const schoolFilter = searchParams.get('school') // Optional filter by school

    let query = supabase
      .from('profiles')
      .select(`
        *,
        school:schools(*)
      `)
      .eq('rivalry_group_id', rivalryGroupId)
      .eq('visible', true)

    // Filter by school if requested
    if (schoolFilter) {
      // First get the school ID from the slug
      const { data: schoolData } = await supabase
        .from('schools')
        .select('id')
        .eq('slug', schoolFilter)
        .single()

      if (schoolData) {
        query = query.eq('school_id', schoolData.id)
      }
    }

    const { data: profiles, error } = await query
      .order('elo_rating', { ascending: false })
      .limit(50)

    if (error) {
      console.error('Error fetching profiles:', error)
      return NextResponse.json({ error: 'Failed to fetch profiles' }, { status: 500 })
    }

    // Get available schools for filtering
    const { data: schools } = await supabase
      .from('schools')
      .select('slug')

    const availableSchools = schools?.map(school => school.slug) || []

    return NextResponse.json({
      success: true,
      data: profiles || [],
      metadata: {
        rivalryGroupId,
        schoolFilter,
        timestamp: new Date().toISOString(),
        total_profiles: profiles?.length || 0,
        showing: Math.min(50, profiles?.length || 0),
        available_schools: availableSchools
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