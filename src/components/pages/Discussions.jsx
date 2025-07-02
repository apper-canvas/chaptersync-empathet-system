import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import BookmarkTab from '@/components/molecules/BookmarkTab'
import DiscussionThread from '@/components/organisms/DiscussionThread'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import discussionService from '@/services/api/discussionService'
import clubService from '@/services/api/clubService'

const Discussions = () => {
  const [discussions, setDiscussions] = useState([])
  const [currentBook, setCurrentBook] = useState(null)
  const [activeChapter, setActiveChapter] = useState(1)
  const [currentDiscussion, setCurrentDiscussion] = useState(null)
  const [loading, setLoading] = useState(true)
  const [discussionLoading, setDiscussionLoading] = useState(false)
  const [error, setError] = useState('')

  const loadData = async () => {
    try {
      setError('')
      setLoading(true)
      
      const [discussionsData, clubData] = await Promise.all([
        discussionService.getAll(),
        clubService.getClubInfo()
      ])
      
      setDiscussions(discussionsData)
      setCurrentBook(clubData.currentBook)
      setActiveChapter(clubData.readingProgress?.currentChapter || 1)
    } catch (err) {
      setError('Failed to load discussions')
      console.error('Error loading discussions:', err)
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
    loadData()
  }, [])

  useEffect(() => {
    if (activeChapter) {
      loadDiscussion(activeChapter)
    }
  }, [activeChapter])

  if (loading) {
    return <Loading type="discussion" />
  }

  if (error && !discussions.length) {
    return <Error message={error} onRetry={loadData} />
  }

  if (!currentBook) {
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
                Chapter Discussions
              </h1>
              <p className="text-primary/70 font-body">
                Engage in meaningful conversations about <span className="font-semibold">{currentBook.title}</span>
              </p>
            </div>
            
            <div className="text-right">
              <div className="text-sm text-primary/60 font-body mb-1">Total Comments</div>
              <div className="font-display text-2xl font-bold text-accent">
                {discussions.reduce((total, d) => total + (d.comments?.length || 0), 0)}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Chapter Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className="bg-surface border border-secondary/20 rounded-lg p-6 paper-texture shadow-paper">
          <h2 className="font-display text-xl font-semibold text-primary mb-4">
            Select Chapter
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {Array.from({ length: currentBook.totalChapters }, (_, i) => i + 1).map((chapter) => {
              const hasDiscussion = discussions.some(d => d.chapter === chapter)
              const commentCount = discussions.find(d => d.chapter === chapter)?.comments?.length || 0
              
              return (
                <motion.button
                  key={chapter}
                  onClick={() => handleChapterChange(chapter)}
                  className={`
                    relative p-4 rounded-lg border transition-all duration-200 font-body text-center
                    ${activeChapter === chapter
                      ? 'bg-gradient-to-r from-accent to-secondary text-white shadow-paper border-accent'
                      : hasDiscussion
                        ? 'bg-surface border-secondary/40 text-primary hover:border-secondary hover:shadow-paper-hover'
                        : 'bg-surface border-secondary/20 text-primary/60 hover:text-primary hover:border-secondary/40'
                    }
                  `}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="font-semibold">Ch. {chapter}</div>
                  {commentCount > 0 && (
                    <div className={`text-xs mt-1 ${activeChapter === chapter ? 'text-white/80' : 'text-primary/60'}`}>
                      {commentCount} comments
                    </div>
                  )}
                  
                  {hasDiscussion && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full"></div>
                  )}
                </motion.button>
              )
            })}
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
          />
        )}
      </motion.div>
    </div>
  )
}

export default Discussions