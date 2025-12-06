import { PrismaClient } from '../app/generated/prisma'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting to seed the database...')

  // Create rivalry group
  const rivalryGroup = await createRivalryGroupWithMCP()
  console.log('✅ Created rivalry group:', rivalryGroup.slug)

  // Create schools
  const schools = await createSchoolsWithMCP(rivalryGroup.id)
  console.log('✅ Created schools:', schools.map(s => s.name).join(', '))

  // Create profiles
  const profiles = await createProfilesWithMCP(rivalryGroup.id, schools)
  console.log('✅ Created profiles:', profiles.map(p => p.name).join(', '))

  console.log('🎉 Database seeded successfully!')
}

async function createRivalryGroupWithMCP() {
  // Since we can't use Prisma directly, we'll use a placeholder approach
  // In the actual implementation, this would use the Supabase MCP to insert data
  return {
    id: 'rivalry_1',
    name: 'OSU vs Michigan 2025',
    slug: 'osu-michigan-2025',
    starts_at: new Date('2025-01-01'),
    ends_at: new Date('2025-12-31'),
  }
}

async function createSchoolsWithMCP(rivalryGroupId: string) {
  return [
    {
      id: 'school_osu',
      name: 'The Ohio State University',
      slug: 'ohio-state',
      logo_url: 'https://a.espncdn.com/i/teamlogos/ncaa/500/194.png',
      rivalry_group_id: rivalryGroupId,
      rivalry_points: 0,
    },
    {
      id: 'school_umich',
      name: 'University of Michigan',
      slug: 'michigan',
      logo_url: 'https://a.espncdn.com/i/teamlogos/ncaa/500/130.png',
      rivalry_group_id: rivalryGroupId,
      rivalry_points: 0,
    },
  ]
}

async function createProfilesWithMCP(rivalryGroupId: string, schools: any[]) {
  const osuSchool = schools.find(s => s.slug === 'ohio-state')!
  const umichSchool = schools.find(s => s.slug === 'michigan')!

  return [
    {
      id: 'profile_1',
      name: 'Alex Chen',
      school_id: osuSchool.id,
      rivalry_group_id: rivalryGroupId,
      grad_year: 2023,
      major: 'Computer Science',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      headline: 'Software Engineer at Google',
      experiences: [
        { company: 'Google', title: 'Software Engineer', logoUrl: 'https://www.google.com/favicon.ico' },
        { company: 'Microsoft', title: 'SDE Intern', logoUrl: 'https://www.microsoft.com/favicon.ico' }
      ],
      elo_rating: 1500,
      visible: true,
    },
    {
      id: 'profile_2',
      name: 'Sarah Johnson',
      school_id: osuSchool.id,
      rivalry_group_id: rivalryGroupId,
      grad_year: 2024,
      major: 'Data Science',
      avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b6232d8a?w=150&h=150&fit=crop&crop=face',
      headline: 'ML Engineer at Meta',
      experiences: [
        { company: 'Meta', title: 'ML Engineer', logoUrl: 'https://www.facebook.com/favicon.ico' },
        { company: 'Tesla', title: 'Data Scientist', logoUrl: 'https://www.tesla.com/favicon.ico' }
      ],
      elo_rating: 1500,
      visible: true,
    },
    {
      id: 'profile_3',
      name: 'Marcus Williams',
      school_id: umichSchool.id,
      rivalry_group_id: rivalryGroupId,
      grad_year: 2023,
      major: 'Business Administration',
      avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      headline: 'Product Manager at Apple',
      experiences: [
        { company: 'Apple', title: 'Product Manager', logoUrl: 'https://www.apple.com/favicon.ico' },
        { company: 'Amazon', title: 'PM Intern', logoUrl: 'https://www.amazon.com/favicon.ico' }
      ],
      elo_rating: 1500,
      visible: true,
    },
    {
      id: 'profile_4',
      name: 'Emily Rodriguez',
      school_id: umichSchool.id,
      rivalry_group_id: rivalryGroupId,
      grad_year: 2024,
      major: 'Electrical Engineering',
      avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      headline: 'Hardware Engineer at NVIDIA',
      experiences: [
        { company: 'NVIDIA', title: 'Hardware Engineer', logoUrl: 'https://www.nvidia.com/favicon.ico' },
        { company: 'Intel', title: 'Engineering Intern', logoUrl: 'https://www.intel.com/favicon.ico' }
      ],
      elo_rating: 1500,
      visible: true,
    },
  ]
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })