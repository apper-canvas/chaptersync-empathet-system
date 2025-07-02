import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const BookmarkTab = ({ 
  chapter, 
  isActive = false, 
  isComplete = false,
  onClick,
  className = '' 
}) => {
  return (
    <motion.button
      onClick={() => onClick?.(chapter)}
      className={`
        relative px-4 py-2 font-body text-sm transition-all duration-200
        ${isActive 
          ? 'text-white bg-gradient-to-r from-accent to-secondary shadow-paper' 
          : 'text-primary hover:text-accent bg-surface hover:bg-surface/80 border border-secondary/20'
        }
        rounded-t-lg border-b-0 focus-visible ${className}
      `}
      whileHover={{ y: -2 }}
      whileTap={{ y: 0 }}
    >
      <div className="flex items-center space-x-2">
        <span>Chapter {chapter}</span>
        {isComplete && (
          <ApperIcon name="CheckCircle" className="w-3 h-3 text-success" />
        )}
      </div>
      
      {/* Bookmark ribbon effect */}
      <div className={`
        absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0
        ${isActive 
          ? 'border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-accent' 
          : 'border-l-6 border-r-6 border-t-6 border-l-transparent border-r-transparent border-t-surface'
        }
      `} />
    </motion.button>
  )
}

export default BookmarkTab