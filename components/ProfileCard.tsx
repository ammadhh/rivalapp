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
  side?: 'left' | 'right'
  onVote?: (result: 'LEFT' | 'RIGHT') => void
  disabled?: boolean
}

export default function ProfileCard({ profile, side, onVote, disabled }: ProfileCardProps) {
  const handleClick = () => {
    if (onVote && !disabled && side) {
      onVote(side.toUpperCase() as 'LEFT' | 'RIGHT')
    }
  }

  return (
    <div className="group relative">
      {/* Main Card */}
      <div
        className={`bg-white rounded-2xl shadow-lg border border-gray-100 p-8 transition-all duration-300 relative overflow-hidden ${
          onVote && !disabled
            ? 'hover:shadow-2xl hover:-translate-y-2 cursor-pointer hover:border-indigo-200 active:scale-95'
            : 'hover:shadow-xl hover:-translate-y-1'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={handleClick}
      >

        {/* Gradient Accent Border */}
        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${
          side === 'left'
            ? 'from-blue-500 to-cyan-500'
            : side === 'right'
            ? 'from-emerald-500 to-teal-500'
            : 'from-indigo-500 to-purple-500'
        }`} />

        {/* Header Section */}
        <div className="text-center mb-6">
          {/* Avatar */}
          <div className="relative w-24 h-24 mx-auto mb-4">
            {profile.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt={profile.name}
                fill
                className="rounded-full object-cover ring-4 ring-white shadow-lg"
                onError={(e) => {
                  // Fallback to initials if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}

            <div className={`w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full flex items-center justify-center ring-4 ring-white shadow-lg ${profile.avatar_url ? 'hidden' : ''}`}>
              <span className="text-indigo-700 text-xl font-bold">
                {profile.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>

            {/* Online Status Indicator */}
            <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-400 rounded-full border-3 border-white flex items-center justify-center">
              <div className="w-2 h-2 bg-green-600 rounded-full" />
            </div>
          </div>

          {/* Name & Headline */}
          <h3 className="text-xl font-bold text-gray-900 mb-2 tracking-tight">
            {profile.name}
          </h3>
          {profile.headline && (
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              {profile.headline}
            </p>
          )}
        </div>

        {/* School Section */}
        <div className="mb-6">
          <div className="flex items-center justify-center p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div className="text-center min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {profile.school.name}
              </p>
              {profile.grad_year && profile.major && (
                <div className="flex items-center justify-center space-x-1 mt-1">
                  <span className="text-xs text-gray-500">{profile.major}</span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500">{profile.grad_year}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Experience Section */}
        {profile.experiences && profile.experiences.length > 0 && (
          <div className="mb-6">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 text-center">
              Experience
            </h4>
            <div className="space-y-3">
              {profile.experiences.slice(0, 2).map((exp, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-100 transition-colors hover:bg-gray-100"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {exp.title}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{exp.company}</p>
                  </div>
                </div>
              ))}

              {profile.experiences.length > 2 && (
                <div className="text-center">
                  <span className="text-xs text-gray-400">
                    +{profile.experiences.length - 2} more
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Elo Rating Badge */}
        <div className="flex justify-center">
          <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
            side === 'left'
              ? 'bg-blue-50 text-blue-700 border border-blue-200'
              : side === 'right'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
          }`}>
            <span className="text-xs font-medium opacity-75 mr-1">ELO</span>
            <span className="font-bold">{Math.round(profile.elo_rating)}</span>
          </div>
        </div>

        {/* Subtle Pattern Overlay */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
          <div className="w-full h-full bg-gradient-to-bl from-current to-transparent rounded-bl-full" />
        </div>

        {/* Clickable Indicator */}
        {onVote && !disabled && (
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl">
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className={`px-4 py-2 rounded-xl font-semibold text-white shadow-lg ${
                side === 'left'
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-500'
              }`}>
                Click to Vote
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Side Indicator */}
      {side && (
        <div className={`absolute -top-3 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full text-xs font-medium ${
          side === 'left'
            ? 'bg-blue-100 text-blue-700 border border-blue-200'
            : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
        }`}>
          {side === 'left' ? 'Candidate A' : 'Candidate B'}
        </div>
      )}
    </div>
  )
}