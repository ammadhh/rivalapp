import Image from 'next/image'

interface Experience {
  company: string
  title: string
  logoUrl: string
}

interface School {
  name: string
  slug: string
  logo_url: string
}

interface Profile {
  id: string
  name: string
  school: School
  grad_year?: number
  major?: string
  avatar_url?: string
  headline?: string
  experiences?: Experience[]
  elo_rating: number
}

interface ProfileCardProps {
  profile: Profile
  side: 'left' | 'right'
}

export default function ProfileCard({ profile, side }: ProfileCardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 max-w-sm mx-auto ${
      side === 'left' ? 'border-l-4 border-blue-500' : 'border-r-4 border-red-500'
    }`}>
      {/* Avatar and Basic Info */}
      <div className="text-center mb-4">
        <div className="relative w-20 h-20 mx-auto mb-3">
          {profile.avatar_url ? (
            <Image
              src={profile.avatar_url}
              alt={profile.name}
              fill
              className="rounded-full object-cover"
            />
          ) : (
            <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-600 text-sm">
                {profile.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
          )}
        </div>
        <h3 className="text-xl font-bold text-gray-900">{profile.name}</h3>
        {profile.headline && (
          <p className="text-sm text-gray-600 mt-1">{profile.headline}</p>
        )}
      </div>

      {/* School Badge */}
      <div className="flex items-center justify-center mb-4 p-3 bg-gray-50 rounded-lg">
        {profile.school.logo_url && (
          <div className="relative w-8 h-8 mr-3">
            <Image
              src={profile.school.logo_url}
              alt={profile.school.name}
              fill
              className="object-contain"
            />
          </div>
        )}
        <div className="text-center">
          <p className="text-sm font-medium text-gray-900">{profile.school.name}</p>
          {profile.grad_year && profile.major && (
            <p className="text-xs text-gray-500">
              {profile.major} • {profile.grad_year}
            </p>
          )}
        </div>
      </div>

      {/* Experiences */}
      {profile.experiences && profile.experiences.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Experience</h4>
          {profile.experiences.slice(0, 3).map((exp, index) => (
            <div key={index} className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
              {exp.logoUrl && (
                <div className="relative w-6 h-6 flex-shrink-0">
                  <Image
                    src={exp.logoUrl}
                    alt={exp.company}
                    fill
                    className="object-contain"
                  />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {exp.title}
                </p>
                <p className="text-xs text-gray-500 truncate">{exp.company}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Elo Rating */}
      <div className="mt-4 text-center">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
          Elo: {Math.round(profile.elo_rating)}
        </span>
      </div>
    </div>
  )
}