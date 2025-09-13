import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { getPolls, hasVoted } from '../utils/contract'

interface Poll {
  id: number
  title: string
  options: string[]
  endTime: number
  isActive: boolean
  totalVotes: number
  hasVoted: boolean
}

export function usePolls() {
  const { address } = useAccount()
  const [polls, setPolls] = useState<Poll[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchPolls = async () => {
    if (!address) {
      setPolls([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError('')
      
      // Get all polls from the contract
      const allPolls = await getPolls()
      
      // Check voting status for each poll
      const pollsWithVotingStatus = await Promise.all(
        allPolls.map(async (poll) => {
          const voted = await hasVoted(poll.id, address)
          return { ...poll, hasVoted: voted }
        })
      )
      
      setPolls(pollsWithVotingStatus)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch polls')
      console.error('Error fetching polls:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPolls()
  }, [address])

  return {
    polls,
    loading,
    error,
    refetch: fetchPolls
  }
}
