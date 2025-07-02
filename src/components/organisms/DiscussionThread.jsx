import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'
import { format } from 'date-fns'

const DiscussionThread = ({ 
  discussion, 
  onAddComment, 
  onReaction,
  currentUser = { name: 'You', avatar: null }
}) => {
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [expandedComments, setExpandedComments] = useState(new Set())

  const handleSubmitComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setIsSubmitting(true)
    try {
      await onAddComment?.(discussion.Id, newComment.trim())
      setNewComment('')
      toast.success('Comment added successfully!')
    } catch (error) {
      toast.error('Failed to add comment')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReaction = async (commentId, reaction) => {
    try {
      await onReaction?.(commentId, reaction)
      toast.success('Reaction added!')
    } catch (error) {
      toast.error('Failed to add reaction')
    }
  }

  const toggleCommentExpansion = (commentId) => {
    const newExpanded = new Set(expandedComments)
    if (newExpanded.has(commentId)) {
      newExpanded.delete(commentId)
    } else {
      newExpanded.add(commentId)
    }
    setExpandedComments(newExpanded)
  }

  const reactions = ['👍', '❤️', '😊', '🤔', '📚', '💡']

  return (
    <div className="space-y-6">
      <Card className="p-6" gradient>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Badge variant="accent" icon="MessageCircle">
              Chapter {discussion.chapter}
            </Badge>
            <h2 className="font-display text-xl font-semibold text-primary">
              Discussion
            </h2>
          </div>
          
          <div className="text-sm text-primary/60 font-body">
            {discussion.comments?.length || 0} comments
          </div>
        </div>

        {/* Add Comment Form */}
        <form onSubmit={handleSubmitComment} className="space-y-4">
          <div>
            <Input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts about this chapter..."
              className="min-h-[100px] resize-none"
            />
          </div>
          
          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              icon="Send"
              loading={isSubmitting}
              disabled={!newComment.trim() || isSubmitting}
            >
              Add Comment
            </Button>
          </div>
        </form>
      </Card>

      {/* Comments */}
      <div className="space-y-4">
        <AnimatePresence>
          {discussion.comments?.map((comment, index) => (
            <motion.div
              key={comment.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="p-4" torn>
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-accent/20 to-secondary/20 rounded-full flex items-center justify-center flex-shrink-0">
                    {comment.userAvatar ? (
                      <img
                        src={comment.userAvatar}
                        alt={comment.userName}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <ApperIcon name="User" className="w-5 h-5 text-primary" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-medium text-primary font-body">
                        {comment.userName}
                      </span>
                      <span className="text-sm text-primary/60 font-body">
                        {format(new Date(comment.created), 'MMM dd, h:mm a')}
                      </span>
                    </div>
                    
                    <div className="text-primary/80 font-body leading-relaxed mb-3">
                      {expandedComments.has(comment.Id) || comment.content.length <= 200 ? (
                        comment.content
                      ) : (
                        <>
                          {comment.content.substring(0, 200)}...
                          <button
                            onClick={() => toggleCommentExpansion(comment.Id)}
                            className="text-accent hover:text-accent/80 ml-1 font-medium"
                          >
                            Read more
                          </button>
                        </>
                      )}
                      
                      {expandedComments.has(comment.Id) && comment.content.length > 200 && (
                        <button
                          onClick={() => toggleCommentExpansion(comment.Id)}
                          className="text-accent hover:text-accent/80 ml-2 font-medium"
                        >
                          Show less
                        </button>
                      )}
                    </div>
                    
                    {/* Reactions */}
                    <div className="flex items-center space-x-2">
                      {reactions.map((reaction) => {
                        const count = comment.reactions?.[reaction] || 0
                        const hasReacted = comment.userReactions?.includes(reaction)
                        
                        return (
                          <motion.button
                            key={reaction}
                            onClick={() => handleReaction(comment.Id, reaction)}
                            className={`
                              flex items-center space-x-1 px-2 py-1 rounded-full text-sm transition-all duration-200
                              ${hasReacted 
                                ? 'bg-accent/20 text-accent border border-accent/30' 
                                : 'bg-surface hover:bg-surface/80 text-primary/60 hover:text-primary border border-secondary/20'
                              }
                            `}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <span>{reaction}</span>
                            {count > 0 && <span className="font-medium">{count}</span>}
                          </motion.button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default DiscussionThread