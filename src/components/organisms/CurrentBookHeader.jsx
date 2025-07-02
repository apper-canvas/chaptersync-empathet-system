import { motion } from 'framer-motion'
import Card from '@/components/atoms/Card'
import Badge from '@/components/atoms/Badge'
import ProgressBar from '@/components/molecules/ProgressBar'
import ApperIcon from '@/components/ApperIcon'
import { format } from 'date-fns'

const CurrentBookHeader = ({ book, progress = {} }) => {
  if (!book) return null

  const {
    currentChapter = 1,
    totalChapters = 12,
    startDate = new Date(),
    targetDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    membersCompleted = 0,
    totalMembers = 8
  } = progress

  const chapterProgress = (currentChapter / totalChapters) * 100
  const memberProgress = (membersCompleted / totalMembers) * 100

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-6 mb-8" gradient>
        <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-6 lg:space-y-0 lg:space-x-8">
          <div className="flex items-start space-x-6">
            <img
              src={book.coverUrl || '/api/placeholder/120/180'}
              alt={book.title}
              className="w-24 h-36 object-cover rounded-lg shadow-book"
            />
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h1 className="font-display text-3xl font-bold text-primary mb-2">
                    {book.title}
                  </h1>
                  <p className="text-lg text-primary/70 font-body mb-2">
                    by {book.author}
                  </p>
                  <div className="flex items-center space-x-3">
                    <Badge variant="accent" icon="BookOpen">
                      {totalChapters} Chapters
                    </Badge>
                    <Badge variant="secondary" icon="Users">
                      {totalMembers} Members
                    </Badge>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-sm text-primary/60 font-body mb-1">
                    Target Date
                  </div>
                  <div className="font-display text-lg font-semibold text-primary">
                    {format(new Date(targetDate), 'MMM dd, yyyy')}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-80 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-primary font-body">
                  Reading Progress
                </span>
                <span className="text-sm text-primary/70 font-body">
                  Chapter {currentChapter} of {totalChapters}
                </span>
              </div>
              <ProgressBar 
                progress={currentChapter} 
                total={totalChapters}
                showLabel={false}
                color="accent"
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-primary font-body">
                  Club Progress
                </span>
                <span className="text-sm text-primary/70 font-body">
                  {membersCompleted} of {totalMembers} caught up
                </span>
              </div>
              <ProgressBar 
                progress={membersCompleted} 
                total={totalMembers}
                showLabel={false}
                color="secondary"
              />
            </div>

            <div className="flex items-center justify-between text-sm font-body">
              <div className="flex items-center text-primary/60">
                <ApperIcon name="Calendar" className="w-4 h-4 mr-1" />
                Started {format(new Date(startDate), 'MMM dd')}
              </div>
              <div className="flex items-center text-accent">
                <ApperIcon name="Target" className="w-4 h-4 mr-1" />
                {Math.ceil((new Date(targetDate) - new Date()) / (1000 * 60 * 60 * 24))} days left
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default CurrentBookHeader