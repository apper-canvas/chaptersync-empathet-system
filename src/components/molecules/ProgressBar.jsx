import { motion } from 'framer-motion'

const ProgressBar = ({ 
  progress = 0, 
  total = 100, 
  showLabel = true, 
  size = 'medium',
  color = 'primary',
  className = '' 
}) => {
  const percentage = Math.min(Math.max((progress / total) * 100, 0), 100)
  
  const sizes = {
    small: 'h-2',
    medium: 'h-3',
    large: 'h-4'
  }
  
  const colors = {
    primary: 'from-primary to-primary/80',
    secondary: 'from-secondary to-secondary/80',
    accent: 'from-accent to-accent/80',
    success: 'from-success to-success/80'
  }

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-primary font-body">
            Progress
          </span>
          <span className="text-sm text-primary/70 font-body">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      
      <div className={`bg-surface border border-secondary/20 rounded-full ${sizes[size]} overflow-hidden shadow-inner`}>
        <motion.div
          className={`h-full bg-gradient-to-r ${colors[color]} rounded-full shadow-sm`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  )
}

export default ProgressBar