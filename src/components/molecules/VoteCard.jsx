import { useState } from 'react'
import { motion } from 'framer-motion'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'

const VoteCard = ({ 
  book, 
  votes = [], 
  userVote = null, 
  onVote, 
  status = 'active',
  deadline 
}) => {
  const [isVoting, setIsVoting] = useState(false)
  
  const totalVotes = votes.length
  const votePercentage = totalVotes > 0 ? ((votes.filter(v => v.bookId === book.Id).length / totalVotes) * 100) : 0

  const handleVote = async (bookId) => {
    setIsVoting(true)
    try {
      await onVote?.(bookId)
    } finally {
      setIsVoting(false)
    }
  }

  const formatDeadline = (date) => {
    if (!date) return ''
    const now = new Date()
    const deadlineDate = new Date(date)
    const diffDays = Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Ends today'
    if (diffDays === 1) return 'Ends tomorrow'
    if (diffDays > 1) return `${diffDays} days left`
    return 'Voting ended'
  }

  return (
    <Card className="p-6" torn>
      <div className="flex items-start space-x-4">
        <img
          src={book.coverUrl || '/api/placeholder/100/150'}
          alt={book.title}
          className="w-20 h-30 object-cover rounded-lg shadow-book"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-display text-lg font-semibold text-primary mb-1">
                {book.title}
              </h3>
              <p className="text-primary/70 font-body">by {book.author}</p>
            </div>
            
            <div className="flex flex-col items-end space-y-2">
              <Badge 
                variant={status === 'active' ? 'accent' : status === 'ended' ? 'primary' : 'secondary'}
                icon={status === 'active' ? 'Clock' : status === 'ended' ? 'CheckCircle' : 'Calendar'}
              >
                {status === 'active' ? 'Active' : status === 'ended' ? 'Ended' : 'Upcoming'}
              </Badge>
              
              {deadline && status === 'active' && (
                <span className="text-sm text-primary/60 font-body">
                  {formatDeadline(deadline)}
                </span>
              )}
            </div>
          </div>
          
          {book.description && (
            <p className="text-primary/70 text-sm mb-4 font-body line-clamp-2">
              {book.description}
            </p>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-sm font-body">
                <span className="font-semibold text-primary">{totalVotes}</span>
                <span className="text-primary/60"> votes</span>
              </div>
              
              {votePercentage > 0 && (
                <div className="flex items-center space-x-2">
                  <div className="w-16 h-2 bg-surface border border-secondary/20 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-accent to-secondary rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${votePercentage}%` }}
                      transition={{ duration: 0.6 }}
                    />
                  </div>
                  <span className="text-sm text-primary/60 font-body">
                    {Math.round(votePercentage)}%
                  </span>
                </div>
              )}
            </div>
            
            {status === 'active' && (
              <Button
                variant={userVote === book.Id ? 'primary' : 'secondary'}
                size="small"
                icon={userVote === book.Id ? 'CheckCircle' : 'Heart'}
                loading={isVoting}
                onClick={() => handleVote(book.Id)}
                disabled={isVoting}
              >
                {userVote === book.Id ? 'Voted' : 'Vote'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}

export default VoteCard