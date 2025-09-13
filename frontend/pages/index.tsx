import { useState, useEffect } from 'react'
import { useAccount, useConnect } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import Head from 'next/head'
import { Shield, Lock, Eye, Users, Clock, CheckCircle } from 'lucide-react'
import CreatePollModal from '../components/CreatePollModal'
import PollCard from '../components/PollCard'
import { usePolls } from '../hooks/usePolls'

export default function Home() {
  const { address, isConnected } = useAccount()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const { polls, loading, refetch } = usePolls()

  return (
    <>
      <Head>
        <title>FHEVM Private Voting - Zama Builder Track</title>
        <meta name="description" content="Privacy-preserving voting system using FHEVM technology" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">FHEVM Private Voting</h1>
              </div>
              <ConnectButton />
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Privacy-Preserving Voting with{' '}
                <span className="text-gradient">FHEVM</span>
              </h2>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Cast your vote with complete privacy. Your individual choice remains encrypted 
                while ensuring transparent and verifiable results.
              </p>
              
              {isConnected && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="btn-primary text-lg px-8 py-3"
                >
                  Create New Poll
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Complete Privacy</h3>
                <p className="text-gray-600">
                  Your vote is encrypted using FHEVM technology. No one can see your individual choice.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Eye className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Transparent Results</h3>
                <p className="text-gray-600">
                  Final vote counts are publicly verifiable while maintaining individual privacy.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Decentralized</h3>
                <p className="text-gray-600">
                  Built on blockchain technology for trustless and censorship-resistant voting.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Polls Section */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900">Active Polls</h3>
              {isConnected && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="btn-secondary"
                >
                  Create Poll
                </button>
              )}
            </div>

            {!isConnected ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-12 h-12 text-gray-400" />
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">Connect Your Wallet</h4>
                <p className="text-gray-600 mb-6">
                  Connect your wallet to view and participate in polls
                </p>
                <ConnectButton />
              </div>
            ) : loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="card animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : polls.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-12 h-12 text-gray-400" />
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">No Active Polls</h4>
                <p className="text-gray-600 mb-6">
                  Be the first to create a poll and start voting!
                </p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="btn-primary"
                >
                  Create First Poll
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {polls.map((poll) => (
                  <PollCard key={poll.id} poll={poll} onVote={refetch} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <Shield className="w-6 h-6" />
                <span className="text-lg font-semibold">FHEVM Private Voting</span>
              </div>
              <p className="text-gray-400">
                Built for Zama Builder Track - Demonstrating privacy-preserving blockchain technology
              </p>
            </div>
          </div>
        </footer>

        {/* Create Poll Modal */}
        {showCreateModal && (
          <CreatePollModal
            onClose={() => setShowCreateModal(false)}
            onSuccess={() => {
              setShowCreateModal(false)
              refetch()
            }}
          />
        )}
      </div>
    </>
  )
}
