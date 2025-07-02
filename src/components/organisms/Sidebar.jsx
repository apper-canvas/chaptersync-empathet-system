import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Sidebar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const navigation = [
    { name: 'Current Read', to: '/current-read', icon: 'BookOpen' },
    { name: 'Discussions', to: '/discussions', icon: 'MessageCircle' },
    { name: 'Schedule', to: '/schedule', icon: 'Calendar' },
    { name: 'Voting', to: '/voting', icon: 'Vote' },
    { name: 'Members', to: '/members', icon: 'Users' }
  ]

  const toggleMobile = () => setIsMobileOpen(!isMobileOpen)

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobile}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-primary text-white rounded-lg shadow-paper"
      >
        <ApperIcon name={isMobileOpen ? 'X' : 'Menu'} className="w-6 h-6" />
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleMobile}
          />
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 bg-wood-grain border-r border-secondary/20 shadow-paper">
        <div className="flex flex-col h-full p-6">
          <div className="mb-8">
            <h1 className="font-display text-2xl font-bold text-white mb-2">
              ChapterSync
            </h1>
            <p className="text-white/80 text-sm font-body">
              Literary Book Club
            </p>
          </div>

          <nav className="flex-1 space-y-2">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-lg transition-all duration-200 font-body ${
                    isActive
                      ? 'bg-white/20 text-white shadow-paper backdrop-blur-sm'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                <ApperIcon name={item.icon} className="w-5 h-5 mr-3" />
                {item.name}
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto pt-6 border-t border-white/20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <ApperIcon name="User" className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-medium font-body">Book Lover</p>
                <p className="text-white/60 text-sm font-body">Active Member</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            className="lg:hidden fixed left-0 top-0 z-50 w-64 h-full bg-wood-grain shadow-paper"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
          >
            <div className="flex flex-col h-full p-6">
              <div className="mb-8 mt-12">
                <h1 className="font-display text-2xl font-bold text-white mb-2">
                  ChapterSync
                </h1>
                <p className="text-white/80 text-sm font-body">
                  Literary Book Club
                </p>
              </div>

              <nav className="flex-1 space-y-2">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.to}
                    onClick={toggleMobile}
                    className={({ isActive }) =>
                      `flex items-center px-4 py-3 rounded-lg transition-all duration-200 font-body ${
                        isActive
                          ? 'bg-white/20 text-white shadow-paper backdrop-blur-sm'
                          : 'text-white/80 hover:bg-white/10 hover:text-white'
                      }`
                    }
                  >
                    <ApperIcon name={item.icon} className="w-5 h-5 mr-3" />
                    {item.name}
                  </NavLink>
                ))}
              </nav>

              <div className="mt-auto pt-6 border-t border-white/20">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <ApperIcon name="User" className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium font-body">Book Lover</p>
                    <p className="text-white/60 text-sm font-body">Active Member</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Sidebar