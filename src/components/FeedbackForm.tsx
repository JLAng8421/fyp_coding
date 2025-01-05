'use client'

import { useState } from 'react'
import { useActionState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { submitFeedback } from '@/app/actions'

export function FeedbackForm() {
  const [feedback, setFeedback] = useState('')
  const [state, action, isPending] = useActionState(submitFeedback)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    action(new FormData(e.target as HTMLFormElement))
    setFeedback('')
  }

  return (
    <section className="mt-12 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-blue-700">Submit Feedback</h2>
      <form onSubmit={handleSubmit}>
        <Textarea
          name="feedback"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Share your thoughts about the system..."
          className="mb-4"
          required
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Submitting...' : 'Submit Feedback'}
        </Button>
      </form>
      {state && (
        <p className={`mt-4 ${state.success ? 'text-green-600' : 'text-red-600'}`}>
          {state.message}
        </p>
      )}
    </section>
  )
}

