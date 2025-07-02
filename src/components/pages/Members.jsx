import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Card from '@/components/atoms/Card'
import Badge from '@/components/atoms/Badge'
import ProgressBar from '@/components/molecules/ProgressBar'
import AchievementBadges from '@/components/molecules/AchievementBadges'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import memberService from '@/services/api/memberService'
import clubService from '@/services/api/clubService'

const Members = () => {
  const [members, setMembers] = useState([])
  const [currentBook, setCurrentBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'

  const loadData = async () => {
    try {
      setError('')
      setLoading(true)
      
      const [membersData, clubData] = await Promise.all([
        memberService.getAll(),
        clubService.getClubInfo()
      ])
      
      setMembers(membersData)
      setCurrentBook(clubData.currentBook)
    } catch (err) {
      setError('Failed to load member data')
      console.error('Error loading members:', err)
    } finally {
      setLoading(false)
    }
  }

  const getMemberProgress = (member) => {
    if (!currentBook) return { chapter: 0, percentage: 0 }
    
    const chapter = member.currentChapter || 0
    const percentage = (chapter / currentBook.totalChapters) * 100
    
    return { chapter, percentage }
  }

  const getProgressColor = (percentage) => {
    if (percentage >= 80) return 'success'
    if (percentage >= 50) return 'accent'
    if (percentage >= 25) return 'secondary'
    return 'primary'
  }

  const sortedMembers = [...members].sort((a, b) => {
    const aProgress = getMemberProgress(a).percentage
    const bProgress = getMemberProgress(b).percentage
    return bProgress - aProgress // Sort by progress descending
  })

  useEffect(() => {
    loadData()
  }, [])

  if (loading) {
    return <Loading type="member-grid" />
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />
  }

  if (!members.length) {
    return (
      <Empty
        type="members"
        title="No members yet"
        description="Your book club is just getting started! Invite fellow book lovers to join your reading community and create meaningful discussions together."
        actionText="Invite Members"
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
                Club Members
              </h1>
              <p className="text-primary/70 font-body">
                Track reading progress and celebrate our literary community
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === 'grid'
                      ? 'bg-accent text-white'
                      : 'bg-surface border border-secondary/20 text-primary hover:border-secondary/40'
                  }`}
                >
                  <ApperIcon name="Grid3X3" className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === 'list'
                      ? 'bg-accent text-white'
                      : 'bg-surface border border-secondary/20 text-primary hover:border-secondary/40'
                  }`}
                >
                  <ApperIcon name="List" className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="font-display text-2xl font-bold text-accent">
                {members.length}
              </div>
              <div className="text-sm text-primary/60 font-body">Total Members</div>
            </div>
            <div className="text-center">
              <div className="font-display text-2xl font-bold text-success">
                {members.filter(m => getMemberProgress(m).percentage >= 80).length}
              </div>
              <div className="text-sm text-primary/60 font-body">Caught Up</div>
            </div>
            <div className="text-center">
              <div className="font-display text-2xl font-bold text-secondary">
                {Math.round(members.reduce((sum, m) => sum + (getMemberProgress(m).percentage || 0), 0) / members.length)}%
              </div>
              <div className="text-sm text-primary/60 font-body">Avg Progress</div>
            </div>
            <div className="text-center">
              <div className="font-display text-2xl font-bold text-primary">
                {Math.round(members.reduce((sum, m) => sum + (m.readingStreak || 0), 0) / members.length)}
              </div>
              <div className="text-sm text-primary/60 font-body">Avg Streak</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Members Grid/List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedMembers.map((member, index) => {
              const progress = getMemberProgress(member)
              const progressColor = getProgressColor(progress.percentage)

              return (
                <motion.div
                  key={member.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card className="p-6" torn>
                    <div className="flex items-start space-x-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-accent/20 to-secondary/20 rounded-full flex items-center justify-center flex-shrink-0">
                        {member.avatar ? (
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <ApperIcon name="User" className="w-6 h-6 text-primary" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-display text-lg font-semibold text-primary truncate">
                            {member.name}
                          </h3>
                          {member.isHost && (
                            <Badge variant="accent" size="small">
                              Host
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-primary/60 font-body mb-2">
                          <span>{member.booksRead || 0} books</span>
                          <span>{member.readingStreak || 0} day streak</span>
                        </div>
                      </div>
                    </div>

                    {currentBook && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-primary font-body">
                            Reading Progress
                          </span>
                          <span className="text-sm text-primary/70 font-body">
                            Chapter {progress.chapter} of {currentBook.totalChapters}
                          </span>
                        </div>
                        <ProgressBar
                          progress={progress.chapter}
                          total={currentBook.totalChapters}
                          showLabel={false}
                          color={progressColor}
                        />
                      </div>
                    )}

                    {member.bio && (
                      <p className="text-primary/70 text-sm font-body mb-3 line-clamp-2">
                        {member.bio}
                      </p>
                    )}

<AchievementBadges member={member} maxDisplay={3} />

                    {member.favoriteGenres && member.favoriteGenres.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {member.favoriteGenres.slice(0, 3).map((genre) => (
                          <Badge key={genre} variant="secondary" size="small">
                            {genre}
                          </Badge>
                        ))}
                        {member.favoriteGenres.length > 3 && (
                          <Badge variant="secondary" size="small">
                            +{member.favoriteGenres.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </Card>
                </motion.div>
              )
            })}
          </div>
        ) : (
          <div className="space-y-4">
            {sortedMembers.map((member, index) => {
              const progress = getMemberProgress(member)
              const progressColor = getProgressColor(progress.percentage)

              return (
                <motion.div
                  key={member.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <Card className="p-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-accent/20 to-secondary/20 rounded-full flex items-center justify-center flex-shrink-0">
                        {member.avatar ? (
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <ApperIcon name="User" className="w-6 h-6 text-primary" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-display text-lg font-semibold text-primary">
                              {member.name}
                            </h3>
                            {member.isHost && (
                              <Badge variant="accent" size="small">
                                Host
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-6 text-sm text-primary/60 font-body">
                            <span>{member.booksRead || 0} books read</span>
                            <span>{member.totalComments || 0} comments</span>
                            <span>{member.readingStreak || 0} day streak</span>
                          </div>
                        </div>
                        
{currentBook && (
                          <div className="flex items-center space-x-4 mb-3">
                            <div className="flex-1">
                              <ProgressBar
                                progress={progress.chapter}
                                total={currentBook.totalChapters}
                                showLabel={false}
                                color={progressColor}
                                size="small"
                              />
                            </div>
                            <span className="text-sm text-primary/70 font-body whitespace-nowrap">
                              Chapter {progress.chapter}/{currentBook.totalChapters}
                            </span>
                          </div>
                        )}
                        
                        <AchievementBadges member={member} maxDisplay={4} />
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default Members