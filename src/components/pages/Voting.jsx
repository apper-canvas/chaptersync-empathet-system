import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import VoteCard from '@/components/molecules/VoteCard'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Card from '@/components/atoms/Card'
import Badge from '@/components/atoms/Badge'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import voteService from '@/services/api/voteService'

const Voting = () => {
  const [votes, setVotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showProposeForm, setShowProposeForm] = useState(false)
  const [userVotes, setUserVotes] = useState({}) // Track user's votes
  const [proposalForm, setProposalForm] = useState({
    title: '',
    author: '',
    isbn: '',
    description: '',
    coverUrl: ''
  })
  const [submitting, setSubmitting] = useState(false)

  const loadVotes = async () => {
    try {
      setError('')
      setLoading(true)
      const data = await voteService.getAll()
      setVotes(data)
    } catch (err) {
      setError('Failed to load voting data')
      console.error('Error loading votes:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleVote = async (bookId) => {
    try {
      // Find the vote that contains this book
      const vote = votes.find(v => v.bookId === bookId)
      if (!vote) return

      await voteService.submitVote(vote.Id, 'current-user')
      
      // Update local state
      setUserVotes(prev => ({ ...prev, [vote.Id]: bookId }))
      
      // Reload votes to get updated counts
      await loadVotes()
      
      toast.success('Vote submitted successfully!')
    } catch (err) {
      toast.error('Failed to submit vote')
      console.error('Error voting:', err)
    }
  }

  const handleProposeBook = async (e) => {
    e.preventDefault()
    
    if (!proposalForm.title || !proposalForm.author) {
      toast.error('Title and author are required')
      return
    }

    setSubmitting(true)
    try {
      await voteService.proposeBook(proposalForm)
      
      // Reset form and hide it
      setProposalForm({
        title: '',
        author: '',
        isbn: '',
        description: '',
        coverUrl: ''
      })
      setShowProposeForm(false)
      
      // Reload votes
      await loadVotes()
      
      toast.success('Book proposal submitted successfully!')
    } catch (err) {
      toast.error('Failed to propose book')
      console.error('Error proposing book:', err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleInputChange = (field, value) => {
    setProposalForm(prev => ({ ...prev, [field]: value }))
  }

  useEffect(() => {
    loadVotes()
  }, [])

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Error message={error} onRetry={loadVotes} />
  }

  // Separate votes by status
  const activeVotes = votes.filter(v => v.status === 'active')
  const endedVotes = votes.filter(v => v.status === 'ended')
  const upcomingVotes = votes.filter(v => v.status === 'upcoming')

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="bg-surface border border-secondary/20 rounded-lg p-6 paper-texture shadow-paper">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="font-display text-3xl font-bold text-primary mb-2">
                Book Voting
              </h1>
              <p className="text-primary/70 font-body">
                Help choose our next literary adventure
              </p>
            </div>
            
            <Button 
              variant="primary" 
              icon="Plus"
              onClick={() => setShowProposeForm(!showProposeForm)}
            >
              Propose Book
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="font-display text-2xl font-bold text-accent">
                {activeVotes.length}
              </div>
              <div className="text-sm text-primary/60 font-body">Active Votes</div>
            </div>
            <div className="text-center">
              <div className="font-display text-2xl font-bold text-secondary">
                {votes.reduce((total, v) => total + v.votes.length, 0)}
              </div>
              <div className="text-sm text-primary/60 font-body">Total Votes Cast</div>
            </div>
            <div className="text-center">
              <div className="font-display text-2xl font-bold text-primary">
                {endedVotes.length}
              </div>
              <div className="text-sm text-primary/60 font-body">Books Selected</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Propose Book Form */}
      {showProposeForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-6" gradient>
            <h2 className="font-display text-xl font-semibold text-primary mb-4">
              Propose a New Book
            </h2>
            
            <form onSubmit={handleProposeBook} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Book Title"
                  value={proposalForm.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter book title"
                  required
                />
                
                <Input
                  label="Author"
                  value={proposalForm.author}
                  onChange={(e) => handleInputChange('author', e.target.value)}
                  placeholder="Enter author name"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="ISBN (Optional)"
                  value={proposalForm.isbn}
                  onChange={(e) => handleInputChange('isbn', e.target.value)}
                  placeholder="Enter ISBN"
                />
                
                <Input
                  label="Cover Image URL (Optional)"
                  value={proposalForm.coverUrl}
                  onChange={(e) => handleInputChange('coverUrl', e.target.value)}
                  placeholder="Enter cover image URL"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-primary mb-2 font-body">
                  Description (Optional)
                </label>
                <textarea
                  value={proposalForm.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Tell us why this book would be great for our club..."
                  rows={3}
                  className="w-full px-4 py-2.5 border border-secondary/20 rounded-lg font-body bg-white/50 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all duration-200 placeholder-primary/40 hover:border-secondary/40"
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowProposeForm(false)}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  icon="Send"
                  loading={submitting}
                  disabled={submitting}
                >
                  Submit Proposal
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      )}

      {/* Active Votes */}
      {activeVotes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="flex items-center space-x-3 mb-6">
            <Badge variant="accent" icon="Vote">
              Active Voting
            </Badge>
            <h2 className="font-display text-xl font-semibold text-primary">
              Cast Your Votes
            </h2>
          </div>
          
          <div className="space-y-6">
            {activeVotes.map((vote, index) => (
              <motion.div
                key={vote.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <VoteCard
                  book={vote.bookProposal}
                  votes={vote.votes}
                  userVote={userVotes[vote.Id]}
                  onVote={() => handleVote(vote.bookId)}
                  status="active"
                  deadline={vote.deadline}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Ended Votes */}
      {endedVotes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="flex items-center space-x-3 mb-6">
            <Badge variant="primary" icon="CheckCircle">
              Previous Selections
            </Badge>
            <h2 className="font-display text-xl font-semibold text-primary">
              Books We've Chosen
            </h2>
          </div>
          
          <div className="space-y-6">
            {endedVotes.map((vote, index) => (
              <motion.div
                key={vote.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <VoteCard
                  book={vote.bookProposal}
                  votes={vote.votes}
                  status="ended"
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {!activeVotes.length && !endedVotes.length && (
        <Empty
          type="votes"
          title="No books up for voting"
          description="No books are currently being voted on. Be the first to propose your next favorite read and get the community excited about a new literary adventure!"
          actionText="Propose First Book"
          onAction={() => setShowProposeForm(true)}
        />
      )}
    </div>
  )
}

export default Voting