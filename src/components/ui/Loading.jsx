import { motion } from 'framer-motion'

const Loading = ({ type = 'default' }) => {
  if (type === 'book-card') {
    return (
      <div className="bg-surface border border-secondary/20 rounded-lg p-6 paper-texture shadow-paper">
        <div className="flex items-start space-x-4">
          <div className="w-16 h-24 bg-secondary/20 rounded animate-pulse"></div>
          <div className="flex-1 space-y-3">
            <div className="h-6 bg-secondary/20 rounded animate-pulse"></div>
            <div className="h-4 bg-secondary/20 rounded w-3/4 animate-pulse"></div>
            <div className="h-4 bg-secondary/20 rounded w-1/2 animate-pulse"></div>
          </div>
        </div>
      </div>
    )
  }

  if (type === 'discussion') {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-surface border border-secondary/20 rounded-lg p-4 paper-texture shadow-paper">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-secondary/20 rounded-full animate-pulse"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-secondary/20 rounded w-1/4 animate-pulse"></div>
                <div className="h-4 bg-secondary/20 rounded animate-pulse"></div>
                <div className="h-4 bg-secondary/20 rounded w-3/4 animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (type === 'member-grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-surface border border-secondary/20 rounded-lg p-6 paper-texture shadow-paper">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-secondary/20 rounded-full animate-pulse"></div>
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-secondary/20 rounded animate-pulse"></div>
                <div className="h-4 bg-secondary/20 rounded w-2/3 animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center py-12">
      <motion.div
        className="flex space-x-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-3 h-3 bg-primary rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2
            }}
          />
        ))}
      </motion.div>
    </div>
  )
}

export default Loading