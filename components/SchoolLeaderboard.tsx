import Image from 'next/image'

interface School {
  id: string
  name: string
  slug: string
  logo_url: string
  rivalry_points: number
  profile_count: number
  average_elo: number
  top_profiles: Array<{
    name: string
    elo_rating: number
    headline: string
  }>
}

interface SchoolLeaderboardProps {
  schools: School[]
  loading: boolean
}

export default function SchoolLeaderboard({ schools, loading }: SchoolLeaderboardProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2].map(i => (
          <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-300 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (schools.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No schools found</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {schools.map((school, index) => (
        <div
          key={school.id}
          className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6"
        >
          {/* School Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                  {school.logo_url ? (
                    <Image
                      src={school.logo_url}
                      alt={school.name}
                      width={48}
                      height={48}
                      className="object-contain"
                    />
                  ) : (
                    <span className="text-gray-500 font-bold text-lg">
                      {school.name.split(' ').map(w => w[0]).join('')}
                    </span>
                  )}
                </div>
                {/* Rank Badge */}
                <div className="absolute -top-2 -left-2 w-6 h-6 bg-indigo-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {index + 1}
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{school.name}</h3>
                <p className="text-sm text-gray-500">{school.profile_count} profiles</p>
              </div>
            </div>

            {/* Stats */}
            <div className="text-right space-y-1">
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600">
                    {school.rivalry_points}
                  </div>
                  <div className="text-xs text-gray-500">Rivalry Points</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {Math.round(school.average_elo)}
                  </div>
                  <div className="text-xs text-gray-500">Avg Elo</div>
                </div>
              </div>
            </div>
          </div>

          {/* Top Profiles Preview */}
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Top Profiles:</h4>
            <div className="space-y-2">
              {school.top_profiles.slice(0, 3).map((profile, profileIndex) => (
                <div key={profileIndex} className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-900">{profile.name}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600 truncate max-w-[200px]">
                      {profile.headline}
                    </span>
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                      {profile.elo_rating}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}