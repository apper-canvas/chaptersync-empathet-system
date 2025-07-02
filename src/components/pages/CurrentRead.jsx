import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import CurrentBookHeader from '@/components/organisms/CurrentBookHeader'
import BookmarkTab from '@/components/molecules/BookmarkTab'
import DiscussionThread from '@/components/organisms/DiscussionThread'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import clubService from '@/services/api/clubService'
import discussionService from '@/services/api/discussionService'

const CurrentRead = () => {
  const [clubData, setClubData] = useState(null)
  const [currentDiscussion, setCurrentDiscussion] = useState(null)
  const [activeChapter, setActiveChapter] = useState(1)
  const [loading, setLoading] = useState(true)
  const [discussionLoading, setDiscussionLoading] = useState(false)
  const [error, setError] = useState('')

  const loadClubData = async () => {
    try {
      setError('')
      setLoading(true)
      const data = await clubService.getClubInfo()
      setClubData(data)
      setActiveChapter(data.readingProgress?.currentChapter || 1)
    } catch (err) {
      setError('Failed to load club information')
      console.error('Error loading club data:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadDiscussion = async (chapter) => {
    try {
      setError('')
      setDiscussionLoading(true)
      const discussion = await discussionService.getByChapter(chapter)
      setCurrentDiscussion(discussion)
    } catch (err) {
      setError('Failed to load discussion')
      console.error('Error loading discussion:', err)
    } finally {
      setDiscussionLoading(false)
    }
  }

  const handleChapterChange = (chapter) => {
    setActiveChapter(chapter)
    loadDiscussion(chapter)
  }

  const handleAddComment = async (discussionId, content) => {
    try {
      await discussionService.addComment(discussionId, content)
      // Reload the discussion to show the new comment
      await loadDiscussion(activeChapter)
    } catch (err) {
      throw new Error('Failed to add comment')
    }
  }

  const handleReaction = async (commentId, reaction) => {
    try {
      await discussionService.addReaction(commentId, reaction)
      // Reload the discussion to show the updated reactions
      await loadDiscussion(activeChapter)
    } catch (err) {
      throw new Error('Failed to add reaction')
    }
  }

  useEffect(() => {
    loadClubData()
  }, [])

  useEffect(() => {
    if (activeChapter) {
      loadDiscussion(activeChapter)
    }
  }, [activeChapter])

  if (loading) {
    return <Loading type="book-card" />
  }

  if (error && !clubData) {
    return <Error message={error} onRetry={loadClubData} />
  }

  if (!clubData?.currentBook) {
    return (
      <Empty
        type="discussions"
        title="No current book selected"
        description="Your book club hasn't selected a current read yet. Check the voting section to see what's being considered for your next literary adventure!"
        actionText="View Voting"
        onAction={() => window.location.href = '/voting'}
      />
    )
  }

  return (
    <div className="space-y-8">
      <CurrentBookHeader 
        book={clubData.currentBook} 
        progress={clubData.readingProgress} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-6">
          {/* Chapter Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <div className="bg-surface border border-secondary/20 rounded-t-lg p-4 paper-texture">
              <h2 className="font-display text-lg font-semibold text-primary mb-4">
                Chapter Discussions
              </h2>
              
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: clubData.currentBook.totalChapters }, (_, i) => i + 1).map((chapter) => (
                  <BookmarkTab
                    key={chapter}
                    chapter={chapter}
                    isActive={activeChapter === chapter}
                    isComplete={chapter <= (clubData.readingProgress?.currentChapter || 0)}
                    onClick={handleChapterChange}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Discussion Content */}
          <motion.div
            key={activeChapter}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {discussionLoading ? (
              <Loading type="discussion" />
            ) : currentDiscussion ? (
              <DiscussionThread
                discussion={currentDiscussion}
                onAddComment={handleAddComment}
                onReaction={handleReaction}
              />
            ) : (
              <Empty
                type="discussions"
                title={`No discussion for Chapter ${activeChapter} yet`}
                description="Be the first to start the conversation! Share your thoughts, questions, or favorite quotes from this chapter."
                actionText="Start Discussion"
                onAction={() => {
                  // This would trigger the comment form focus
                  const commentForm = document.querySelector('textarea')
                  if (commentForm) {
                    commentForm.focus()
                  }
                }}
              />
            )}
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <motion.div
            className="bg-surface border border-secondary/20 rounded-lg p-6 paper-texture shadow-paper"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <h3 className="font-display text-lg font-semibold text-primary mb-4">
              Reading Progress
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-body text-primary/70">Current Chapter</span>
                <span className="font-display text-xl font-bold text-accent">
                  {clubData.readingProgress?.currentChapter || 1}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-body text-primary/70">Total Chapters</span>
                <span className="font-display text-lg font-semibold text-primary">
                  {clubData.currentBook.totalChapters}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-body text-primary/70">Members Caught Up</span>
                <span className="font-display text-lg font-semibold text-secondary">
                  {clubData.readingProgress?.membersCompleted || 0}/{clubData.readingProgress?.totalMembers || 0}
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-surface border border-secondary/20 rounded-lg p-6 paper-texture shadow-paper"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <h3 className="font-display text-lg font-semibold text-primary mb-4">
              Quick Actions
            </h3>
            
            <div className="space-y-3">
              <button
                onClick={() => window.location.href = '/schedule'}
                className="w-full text-left p-3 bg-gradient-to-r from-accent/10 to-secondary/10 border border-accent/20 rounded-lg hover:shadow-paper transition-all duration-200 font-body"
              >
                <div className="font-medium text-primary">View Schedule</div>
                <div className="text-sm text-primary/60">Check upcoming meetings</div>
              </button>
              
              <button
                onClick={() => window.location.href = '/members'}
                className="w-full text-left p-3 bg-gradient-to-r from-secondary/10 to-accent/10 border border-secondary/20 rounded-lg hover:shadow-paper transition-all duration-200 font-body"
              >
                <div className="font-medium text-primary">Club Members</div>
                <div className="text-sm text-primary/60">See who's reading what</div>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default CurrentRead