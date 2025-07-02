import { useState } from 'react'
import Input from '@/components/atoms/Input'
import Button from '@/components/atoms/Button'

const SearchBar = ({ 
  onSearch, 
  placeholder = "Search...", 
  className = '',
  showButton = true 
}) => {
  const [searchTerm, setSearchTerm] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch?.(searchTerm)
  }

  const handleChange = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    if (!showButton) {
      onSearch?.(value)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`flex space-x-2 ${className}`}>
      <div className="flex-1">
        <Input
          type="text"
          value={searchTerm}
          onChange={handleChange}
          placeholder={placeholder}
          icon="Search"
          iconPosition="left"
        />
      </div>
      
      {showButton && (
        <Button type="submit" variant="primary">
          Search
        </Button>
      )}
    </form>
  )
}

export default SearchBar