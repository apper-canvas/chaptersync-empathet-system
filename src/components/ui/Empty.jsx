import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Empty = ({ 
  title = "Nothing here yet", 
  description = "Get started by adding some content", 
  actionText = "Get Started",
  onAction,
  icon = "Book",
  type = "default"
}) => {
  const getEmptyContent = () => {
    switch (type) {
      case 'discussions':
        return {
          icon: 'MessageCircle',
          title: 'No discussions yet',
          description: 'Start the conversation about this chapter! Share your thoughts, ask questions, or highlight interesting passages.',
          actionText: 'Start Discussion'
        }
      case 'votes':
        return {
          icon: 'Vote',
          title: 'No active votes',
          description: 'No books are currently up for voting. Propose your next favorite read and let the club decide!',
          actionText: 'Propose a Book'
        }
      case 'meetings':
        return {
          icon: 'Calendar',
          title: 'No meetings scheduled',
          description: 'Schedule your next book club gathering! Plan discussions, social meetups, or author events.',
          actionText: 'Schedule Meeting'
        }
      case 'members':
        return {
          icon: 'Users',
          title: 'Club is just getting started',
          description: 'Invite fellow book lovers to join your reading community and start meaningful discussions.',
          actionText: 'Invite Members'
        }
      default:
        return { icon, title, description, actionText }
    }
  }

  const content = getEmptyContent()

  return (
    <motion.div
      className="flex flex-col items-center justify-center py-16 px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-surface border border-secondary/20 rounded-lg p-8 paper-texture shadow-paper max-w-md w-full text-center">
        <motion.div
          className="w-20 h-20 bg-gradient-to-br from-accent/10 to-secondary/20 rounded-full flex items-center justify-center mx-auto mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <ApperIcon name={content.icon} className="w-10 h-10 text-accent" />
        </motion.div>
        
        <h3 className="font-display text-2xl font-semibold text-primary mb-3">
          {content.title}
        </h3>
        
        <p className="text-primary/70 mb-8 font-body leading-relaxed">
          {content.description}
        </p>
        
        {onAction && (
          <motion.button
            onClick={onAction}
            className="bg-gradient-to-r from-accent to-secondary text-white px-8 py-3 rounded-lg font-medium shadow-paper hover:shadow-paper-hover transition-all duration-200 transform hover:scale-105 focus-visible"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ApperIcon name="Plus" className="w-4 h-4 inline mr-2" />
            {content.actionText}
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}

export default Empty