import { redirect } from 'next/navigation'

export default function Home() {
  // Automatically redirect to vote page
  redirect('/vote')
}
