import { forwardRef } from 'react'
import ApperIcon from '@/components/ApperIcon'

const Input = forwardRef(({ 
  label, 
  error, 
  icon, 
  iconPosition = 'left',
  className = '', 
  type = 'text',
  ...props 
}, ref) => {
  const inputClasses = `
    w-full px-4 py-2.5 border rounded-lg font-body bg-white/50 
    focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent
    transition-all duration-200 placeholder-primary/40
    ${error ? 'border-error' : 'border-secondary/20 hover:border-secondary/40'}
    ${icon ? (iconPosition === 'left' ? 'pl-10' : 'pr-10') : ''}
    ${className}
  `

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-primary mb-2 font-body">
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <ApperIcon name={icon} className="h-4 w-4 text-primary/40" />
          </div>
        )}
        
        <input
          ref={ref}
          type={type}
          className={inputClasses}
          {...props}
        />
        
        {icon && iconPosition === 'right' && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <ApperIcon name={icon} className="h-4 w-4 text-primary/40" />
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-error font-body">{error}</p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input