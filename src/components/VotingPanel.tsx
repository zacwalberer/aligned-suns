'use client'

import { useState, useEffect } from 'react'
import type { ReactElement } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { VoteButton } from '@/components/VoteButton'
import { getVisitorId } from '@/lib/fingerprint'
import type { VoteStatus, VoteResponse, VoteValue } from '@/types/vote'

export function VotingPanel(): ReactElement {
  const [selectedValue, setSelectedValue] = useState<VoteValue | null>(null)
  const [canVote, setCanVote] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [message, setMessage] = useState<string>('')
  const [fingerprintId, setFingerprintId] = useState<string>('')

  useEffect(() => {
    async function checkVoteStatus(): Promise<void> {
      try {
        const visitorId = await getVisitorId()
        setFingerprintId(visitorId)

        const response = await fetch(
          `/api/vote/status?fingerprintId=${visitorId}`
        )
        const status: VoteStatus = await response.json()
        setCanVote(status.canVote)

        if (!status.canVote && status.nextVoteTime) {
          const nextTime = new Date(status.nextVoteTime)
          setMessage(`You can vote again at ${nextTime.toLocaleTimeString()}`)
        }
      } catch (error) {
        console.error('Error checking vote status:', error)
        setCanVote(true) // Allow voting on error
      } finally {
        setIsLoading(false)
      }
    }

    checkVoteStatus()
  }, [])

  async function handleSubmit(): Promise<void> {
    if (!selectedValue || !fingerprintId) return

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fingerprintId, value: selectedValue }),
      })
      const result: VoteResponse = await response.json()

      if (result.success) {
        setCanVote(false)
        setMessage('Vote submitted! Thank you.')
      } else {
        setMessage(result.message)
      }
    } catch (error) {
      console.error('Error submitting vote:', error)
      setMessage('Failed to submit vote. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <Card className="text-center">
        <p className="text-gray-400">Loading...</p>
      </Card>
    )
  }

  return (
    <Card>
      <h2 className="text-xl font-bold text-white mb-4">
        How are you feeling about the Suns?
      </h2>

      <div className="flex items-center justify-center gap-2 mb-4">
        {([1, 2, 3, 4, 5] as const).map((value) => (
          <VoteButton
            key={value}
            value={value}
            selected={selectedValue === value}
            disabled={!canVote}
            onClick={setSelectedValue}
          />
        ))}
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <span>Terrible</span>
        <span>Amazing</span>
      </div>

      {canVote && (
        <Button
          onClick={handleSubmit}
          disabled={!selectedValue || isSubmitting}
          className="w-full"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Vote'}
        </Button>
      )}

      {message && (
        <p className="mt-4 text-center text-sm text-gray-400">{message}</p>
      )}
    </Card>
  )
}
