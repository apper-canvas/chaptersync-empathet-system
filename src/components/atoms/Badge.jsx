import ApperIcon from '@/components/ApperIcon'

const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'medium',
  icon,
  className = '' 
}) => {
  const variants = {
    default: 'bg-surface text-primary border border-secondary/20',
    primary: 'bg-gradient-to-r from-primary to-primary/80 text-white',
    secondary: 'bg-gradient-to-r from-secondary to-secondary/80 text-white',
    accent: 'bg-gradient-to-r from-accent to-accent/80 text-white',
    success: 'bg-gradient-to-r from-success to-success/80 text-white',
    warning: 'bg-gradient-to-r from-warning to-warning/80 text-white',
    error: 'bg-gradient-to-r from-error to-error/80 text-white',
    info: 'bg-gradient-to-r from-info to-info/80 text-white'
  }
  
  const sizes = {
    small: 'px-2 py-1 text-xs',
    medium: 'px-3 py-1 text-sm',
    large: 'px-4 py-2 text-base'
  }

  const badgeClasses = `
    inline-flex items-center rounded-full font-medium
    ${variants[variant]} ${sizes[size]} ${className}
  `

  return (
    <span className={badgeClasses}>
      {icon && (
        <ApperIcon name={icon} className="w-3 h-3 mr-1" />
      )}
      {children}
    </span>
  )
}

export default Badge