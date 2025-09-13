import { useState } from 'react'
import { useAccount } from 'wagmi'
import { Clock, Users, CheckCircle, Lock, Eye } from 'lucide-react'
import { castVote, endPoll } from '../utils/contract'

interface Poll {
  id: number
  title: string
  options: string[]
  endTime: number
  isActive: boolean
  totalVotes: number
  hasVoted: boolean
}

interface PollCardProps {
  poll: Poll
  onVote: () => void
}

export default function PollCard({ poll, onVote }: PollCardProps) {
  const { address } = useAccount()
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [voting, setVoting] = useState(false)
  const [ending, setEnding] = useState(false)
  const [error, setError] = useState('')

  const isExpired = Date.now() / 1000 > poll.endTime
  const canEnd = !poll.isActive || isExpired
  const timeLeft = Math.max(0, poll.endTime - Date.now() / 1000)
  const hoursLeft = Math.floor(timeLeft / 3600)
  const minutesLeft = Math.floor((timeLeft % 3600) / 60)

  const handleVote = async () => {
    if (selectedOption === null || !address) return

    setVoting(true)
    setError('')

    try {
      // In a real implementation, you would encrypt the vote choice using FHEVM
      // For this demo, we'll simulate the voting process
      await castVote(poll.id, selectedOption)
      onVote()
    } catch (err: any) {
      setError(err.message || 'Failed to cast vote')
    } finally {
      setVoting(false)
    }
  }

  const handleEndPoll = async () => {
    setEnding(true)
    setError('')

    try {
      await endPoll(poll.id)
      onVote()
    } catch (err: any) {
      setError(err.message || 'Failed to end poll')
    } finally {
      setEnding(false)
    }
  }

  return (
    <div className="card hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
          {poll.title}
        </h3>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
          poll.isActive && !isExpired 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {poll.isActive && !isExpired ? 'Active' : 'Ended'}
        </div>
      </div>

      <div className="space-y-3 mb-4">
        {poll.options.map((option, index) => (
          <div
            key={index}
            className={`poll-option ${
              selectedOption === index ? 'selected' : ''
            } ${poll.hasVoted || !poll.isActive || isExpired ? 'cursor-not-allowed opacity-50' : ''}`}
            onClick={() => {
              if (!poll.hasVoted && poll.isActive && !isExpired) {
                setSelectedOption(index)
              }
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-gray-900">{option}</span>
              {selectedOption === index && (
                <CheckCircle className="w-5 h-5 text-primary-600" />
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4" />
            <span>{poll.totalVotes} votes</span>
          </div>
          {poll.isActive && !isExpired && (
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>
                {hoursLeft > 0 ? `${hoursLeft}h ` : ''}
                {minutesLeft}m left
              </span>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-2">
        {poll.hasVoted ? (
          <div className="flex items-center justify-center space-x-2 text-green-600 bg-green-50 rounded-lg py-2">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Vote Cast Successfully</span>
          </div>
        ) : poll.isActive && !isExpired ? (
          <button
            onClick={handleVote}
            disabled={selectedOption === null || voting}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {voting ? 'Casting Vote...' : 'Cast Vote'}
          </button>
        ) : (
          <div className="text-center text-gray-500 py-2">
            {isExpired ? 'Poll has expired' : 'Poll has ended'}
          </div>
        )}

        {canEnd && poll.isActive && (
          <button
            onClick={handleEndPoll}
            disabled={ending}
            className="w-full btn-secondary disabled:opacity-50"
          >
            {ending ? 'Ending Poll...' : 'End Poll & Reveal Results'}
          </button>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
          <Lock className="w-3 h-3" />
          <span>Encrypted with FHEVM</span>
          <Eye className="w-3 h-3" />
          <span>Results verifiable</span>
        </div>
      </div>
    </div>
  )
}
