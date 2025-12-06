import Image from 'next/image'

interface School {
  id: string
  name: string
  slug: string
  logo_url: string
}

interface Experience {
  company: string
  title: string
  logoUrl: string
}

interface Profile {
  id: string
  name: string
  elo_rating: number
  headline: string
  grad_year?: number
  major?: string
  avatar_url?: string
  school: School
  experiences?: Experience[]
}

interface ProfileLeaderboardProps {
  profiles: Profile[]
  loading: boolean
  schoolFilter?: string | null
  onSchoolFilterChange: (school: string | null) => void
  availableSchools: string[]
}

export default function ProfileLeaderboard({
  profiles,
  loading,
  schoolFilter,
  onSchoolFilterChange,
  availableSchools
}: ProfileLeaderboardProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex space-x-4">
          <div className="h-10 bg-gray-300 rounded w-32 animate-pulse"></div>
          <div className="h-10 bg-gray-300 rounded w-32 animate-pulse"></div>
        </div>
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="bg-white rounded-lg shadow p-4 animate-pulse">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
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

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => onSchoolFilterChange(null)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            !schoolFilter
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All Schools
        </button>
        {availableSchools.map(schoolSlug => (
          <button
            key={schoolSlug}
            onClick={() => onSchoolFilterChange(schoolSlug)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
              schoolFilter === schoolSlug
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {schoolSlug.replace('-', ' ')}
          </button>
        ))}
      </div>

      {/* Profile List */}
      {profiles.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No profiles found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {profiles.map((profile, index) => (
            <div
              key={profile.id}
              className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* Rank */}
                  <div className="w-8 h-8 bg-indigo-100 text-indigo-800 rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>

                  {/* Avatar */}
                  <div className="relative w-12 h-12">
                    {profile.avatar_url ? (
                      <Image
                        src={profile.avatar_url}
                        alt={profile.name}
                        fill
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 text-sm font-medium">
                          {profile.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Profile Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-medium text-gray-900 truncate">
                        {profile.name}
                      </h3>
                      <div className="flex items-center space-x-2">
                        {profile.school.logo_url && (
                          <div className="relative w-5 h-5">
                            <Image
                              src={profile.school.logo_url}
                              alt={profile.school.name}
                              fill
                              className="object-contain"
                            />
                          </div>
                        )}
                        <span className="text-sm text-gray-500">{profile.school.name}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 truncate">{profile.headline}</p>
                    {profile.grad_year && profile.major && (
                      <p className="text-xs text-gray-500">
                        {profile.major} • {profile.grad_year}
                      </p>
                    )}
                  </div>
                </div>

                {/* Elo Rating */}
                <div className="text-right">
                  <div className="text-2xl font-bold text-indigo-600">
                    {Math.round(profile.elo_rating)}
                  </div>
                  <div className="text-xs text-gray-500">Elo Rating</div>
                </div>
              </div>

              {/* Experience Preview */}
              {profile.experiences && profile.experiences.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="text-gray-500">Latest:</span>
                    {profile.experiences[0].logoUrl && (
                      <div className="relative w-4 h-4">
                        <Image
                          src={profile.experiences[0].logoUrl}
                          alt={profile.experiences[0].company}
                          fill
                          className="object-contain"
                        />
                      </div>
                    )}
                    <span className="font-medium text-gray-900">
                      {profile.experiences[0].title}
                    </span>
                    <span className="text-gray-500">at {profile.experiences[0].company}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}