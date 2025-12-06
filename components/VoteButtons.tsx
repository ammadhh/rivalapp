interface VoteButtonsProps {
  onVote: (result: 'LEFT' | 'RIGHT' | 'EQUAL' | 'SKIP') => void
  voting: boolean
}

export default function VoteButtons({ onVote, voting }: VoteButtonsProps) {
  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Main Vote Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
        {/* Left Vote Button */}
        <button
          onClick={() => onVote('LEFT')}
          disabled={voting}
          className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95"
        >
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
          <div className="relative flex items-center justify-center space-x-2">
            <span className="text-2xl">👈</span>
            <span>{voting ? 'Voting...' : 'Choose A'}</span>
          </div>
        </button>

        {/* Right Vote Button */}
        <button
          onClick={() => onVote('RIGHT')}
          disabled={voting}
          className="group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95"
        >
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
          <div className="relative flex items-center justify-center space-x-2">
            <span>{voting ? 'Voting...' : 'Choose B'}</span>
            <span className="text-2xl">👉</span>
          </div>
        </button>
      </div>

      {/* Equal Button */}
      <button
        onClick={() => onVote('EQUAL')}
        disabled={voting}
        className="group relative overflow-hidden bg-gradient-to-r from-purple-500 to-pink-500 text-white px-12 py-3 rounded-xl font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95"
      >
        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
        <div className="relative flex items-center justify-center space-x-2">
          <span className="text-xl">⚖️</span>
          <span>{voting ? 'Voting...' : "They're Equal"}</span>
        </div>
      </button>

      {/* Skip Button */}
      <button
        onClick={() => onVote('SKIP')}
        disabled={voting}
        className="group relative overflow-hidden bg-gray-100 hover:bg-gray-200 text-gray-600 px-8 py-2 rounded-lg font-medium border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-md active:scale-95"
      >
        <div className="relative flex items-center justify-center space-x-2">
          <span className="text-lg">⏭️</span>
          <span className="text-sm">{voting ? 'Skipping...' : 'Skip This Match'}</span>
        </div>
      </button>

      {/* Vote Helper Text */}
      <div className="text-center text-sm text-gray-500 max-w-md">
        <p>Compare these two professionals and choose who you'd rather work with.</p>
      </div>

      {/* Decorative Elements */}
      <div className="flex items-center space-x-4 opacity-30">
        <div className="w-12 h-px bg-gradient-to-r from-transparent to-gray-300" />
        <div className="w-2 h-2 bg-gray-300 rounded-full" />
        <div className="w-12 h-px bg-gradient-to-l from-transparent to-gray-300" />
      </div>
    </div>
  )
}