import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  icon, 
  iconPosition = 'left',
  disabled = false,
  loading = false,
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus-visible disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    primary: 'bg-gradient-to-r from-accent to-secondary text-white shadow-paper hover:shadow-paper-hover hover:scale-105',
    secondary: 'bg-gradient-to-r from-surface to-surface/80 text-primary border border-secondary/20 hover:border-secondary/40 hover:scale-102',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white hover:scale-105',
    ghost: 'text-primary hover:bg-surface hover:scale-105',
    danger: 'bg-gradient-to-r from-error to-error/80 text-white shadow-paper hover:shadow-paper-hover hover:scale-105'
  }
  
  const sizes = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-6 py-2.5 text-sm',
    large: 'px-8 py-3 text-base'
  }

  const buttonClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`

  return (
    <motion.button
      className={buttonClasses}
      disabled={disabled || loading}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      {...props}
    >
      {loading && (
        <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
      )}
      
      {icon && iconPosition === 'left' && !loading && (
        <ApperIcon name={icon} className="w-4 h-4 mr-2" />
      )}
      
      {children}
      
      {icon && iconPosition === 'right' && !loading && (
        <ApperIcon name={icon} className="w-4 h-4 ml-2" />
      )}
    </motion.button>
  )
}

export default Button