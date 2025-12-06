import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    // Update Ohio State logo
    const { error: osuError } = await supabase
      .from('schools')
      .update({ logo_url: 'https://a.espncdn.com/i/teamlogos/ncaa/500/194.png' })
      .eq('slug', 'ohio-state')

    if (osuError) {
      console.error('Error updating OSU logo:', osuError)
      return NextResponse.json({ error: 'Failed to update OSU logo' }, { status: 500 })
    }

    // Update Michigan logo
    const { error: michiganError } = await supabase
      .from('schools')
      .update({ logo_url: 'https://a.espncdn.com/i/teamlogos/ncaa/500/130.png' })
      .eq('slug', 'michigan')

    if (michiganError) {
      console.error('Error updating Michigan logo:', michiganError)
      return NextResponse.json({ error: 'Failed to update Michigan logo' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'School logos updated successfully',
      updates: {
        'ohio-state': 'https://a.espncdn.com/i/teamlogos/ncaa/500/194.png',
        'michigan': 'https://a.espncdn.com/i/teamlogos/ncaa/500/130.png'
      }
    })

  } catch (error) {
    console.error('Fix school logos API error:', error)
    return NextResponse.json(
      { error: 'Failed to fix school logos' },
      { status: 500 }
    )
  }
}