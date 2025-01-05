import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function NavigationButtons() {
  return (
    <section className="mb-12 flex justify-center space-x-4">
      <Link href="/ask">
        <Button variant="outline">Ask AI Assistant</Button>
      </Link>
      <Link href="/library">
        <Button variant="outline">Mental Health Library</Button>
      </Link>
    </section>
  )
}

