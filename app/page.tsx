import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800">
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-screen text-white text-center">

        {/* Logo/Title */}
        <div className="mb-8">
          <h1 className="text-6xl font-bold mb-4 tracking-tight">
            Major<span className="text-yellow-400">Rivals</span>
          </h1>
          <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
            Head-to-head voting platform comparing professionals from rival schools.
            Vote on profiles and watch Elo ratings battle it out!
          </p>
        </div>

        {/* Stats Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl w-full">
          <div className="bg-white/10 backdrop-blur rounded-lg p-6">
            <div className="text-3xl font-bold text-yellow-400">2</div>
            <div className="text-indigo-100">Rival Schools</div>
            <div className="text-sm text-indigo-200">OSU vs Michigan</div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-6">
            <div className="text-3xl font-bold text-yellow-400">6+</div>
            <div className="text-indigo-100">Profiles</div>
            <div className="text-sm text-indigo-200">Tech professionals</div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-6">
            <div className="text-3xl font-bold text-yellow-400">1500</div>
            <div className="text-indigo-100">Starting Elo</div>
            <div className="text-sm text-indigo-200">Rating system</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Link
            href="/vote"
            className="px-8 py-4 bg-yellow-400 hover:bg-yellow-300 text-black font-semibold rounded-lg transition-colors text-lg"
          >
            🗳️ Start Voting
          </Link>
          <Link
            href="/leaderboard"
            className="px-8 py-4 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-lg transition-colors backdrop-blur border border-white/30 text-lg"
          >
            🏆 View Leaderboard
          </Link>
        </div>

        {/* Quick Links */}
        <div className="text-indigo-200 space-y-2">
          <p>
            <Link href="/admin" className="hover:text-white underline">
              Admin Panel
            </Link>
            {" • "}
            <a
              href="https://github.com/ammadhh/rivalapp"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white underline"
            >
              GitHub Repository
            </a>
          </p>
          <p className="text-sm">
            Built with Next.js 16, Tailwind CSS, Prisma, and Supabase
          </p>
        </div>
      </div>
    </div>
  )
}
