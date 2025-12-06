import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database
export interface RivalryGroup {
  id: string
  name: string
  slug: string
  created_at?: string
  updated_at?: string
}

export interface School {
  id: string
  name: string
  slug: string
  logo_url?: string
  rivalry_points: number
  created_at?: string
  updated_at?: string
}

export interface Profile {
  id: string
  name: string
  school_id: string
  rivalry_group_id: string
  elo_rating: number
  visible: boolean
  grad_year?: number
  major?: string
  avatar_url?: string
  headline?: string
  experiences?: any[]
  created_at?: string
  updated_at?: string
  school?: School
}

export interface Matchup {
  id: string
  left_profile_id: string
  right_profile_id: string
  rivalry_group_id: string
  created_at?: string
  left_profile?: Profile
  right_profile?: Profile
}

export interface Vote {
  id: string
  matchup_id: string
  voter_fingerprint: string
  result: 'LEFT' | 'RIGHT' | 'EQUAL' | 'SKIP'
  left_elo_before: number
  right_elo_before: number
  left_elo_change: number
  right_elo_change: number
  created_at?: string
}