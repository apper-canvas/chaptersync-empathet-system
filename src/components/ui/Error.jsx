import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Error = ({ message = "Something went wrong", onRetry, showRetry = true }) => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-12 px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="bg-surface border border-error/20 rounded-lg p-8 paper-texture shadow-paper max-w-md w-full text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-error/10 to-error/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <ApperIcon name="AlertTriangle" className="w-8 h-8 text-error" />
        </div>
        
        <h3 className="font-display text-xl font-semibold text-primary mb-2">
          Oops! Something went wrong
        </h3>
        
        <p className="text-primary/70 mb-6 font-body">
          {message}
        </p>
        
        {showRetry && onRetry && (
          <motion.button
            onClick={onRetry}
            className="bg-gradient-to-r from-accent to-secondary text-white px-6 py-2 rounded-lg font-medium hover:shadow-paper-hover transition-all duration-200 transform hover:scale-105"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ApperIcon name="RotateCcw" className="w-4 h-4 inline mr-2" />
            Try Again
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}

export default Error