import { motion } from 'framer-motion'

const Card = ({ 
  children, 
  className = '', 
  hover = true, 
  gradient = false,
  torn = false,
  ...props 
}) => {
  const baseClasses = `
    bg-surface border border-secondary/20 rounded-lg shadow-paper paper-texture
    ${hover ? 'hover:shadow-paper-hover transition-all duration-200' : ''}
    ${gradient ? 'bg-gradient-to-br from-surface to-surface/80' : ''}
    ${torn ? 'torn-paper' : ''}
    ${className}
  `

  if (hover) {
    return (
      <motion.div
        className={baseClasses}
        whileHover={{ scale: 1.02, y: -2 }}
        transition={{ duration: 0.2 }}
        {...props}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <div className={baseClasses} {...props}>
      {children}
    </div>
  )
}

export default Card