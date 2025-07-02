import { motion } from 'framer-motion'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'

const AchievementBadges = ({ member, maxDisplay = 3, showAll = false }) => {
  // Achievement definitions with thresholds and visual properties
  const achievementTypes = {
    streak: {
      icon: 'Flame',
      color: 'error',
      levels: [
        { threshold: 7, name: 'Week Warrior', description: '7-day reading streak' },
        { threshold: 30, name: 'Monthly Master', description: '30-day reading streak' },
        { threshold: 60, name: 'Streak Legend', description: '60-day reading streak' },
        { threshold: 100, name: 'Century Achiever', description: '100-day reading streak' }
      ]
    },
    books: {
      icon: 'BookOpen',
      color: 'success',
      levels: [
        { threshold: 5, name: 'Book Explorer', description: '5 books completed' },
        { threshold: 10, name: 'Page Turner', description: '10 books completed' },
        { threshold: 20, name: 'Library Regular', description: '20 books completed' },
        { threshold: 50, name: 'Bookworm Elite', description: '50 books completed' }
      ]
    },
    contributions: {
      icon: 'MessageCircle',
      color: 'accent',
      levels: [
        { threshold: 10, name: 'Discussion Starter', description: '10+ comments posted' },
        { threshold: 25, name: 'Active Participant', description: '25+ comments posted' },
        { threshold: 50, name: 'Community Leader', description: '50+ comments posted' },
        { threshold: 100, name: 'Discussion Expert', description: '100+ comments posted' }
      ]
    },
    host: {
      icon: 'Crown',
      color: 'warning',
      levels: [
        { threshold: 1, name: 'Club Host', description: 'Leading the book club' }
      ]
    }
  }

  // Calculate earned achievements
  const calculateAchievements = () => {
    const achievements = []

    // Reading streak achievements
    const streakValue = member.readingStreak || 0
    const streakAchievements = achievementTypes.streak.levels.filter(level => streakValue >= level.threshold)
    if (streakAchievements.length > 0) {
      const highest = streakAchievements[streakAchievements.length - 1]
      achievements.push({
        ...highest,
        type: 'streak',
        icon: achievementTypes.streak.icon,
        color: achievementTypes.streak.color,
        value: streakValue
      })
    }

    // Books read achievements
    const booksValue = member.booksRead || 0
    const bookAchievements = achievementTypes.books.levels.filter(level => booksValue >= level.threshold)
    if (bookAchievements.length > 0) {
      const highest = bookAchievements[bookAchievements.length - 1]
      achievements.push({
        ...highest,
        type: 'books',
        icon: achievementTypes.books.icon,
        color: achievementTypes.books.color,
        value: booksValue
      })
    }

    // Contribution achievements
    const commentsValue = member.totalComments || 0
    const contributionAchievements = achievementTypes.contributions.levels.filter(level => commentsValue >= level.threshold)
    if (contributionAchievements.length > 0) {
      const highest = contributionAchievements[contributionAchievements.length - 1]
      achievements.push({
        ...highest,
        type: 'contributions',
        icon: achievementTypes.contributions.icon,
        color: achievementTypes.contributions.color,
        value: commentsValue
      })
    }

    // Host achievement
    if (member.isHost) {
      achievements.push({
        ...achievementTypes.host.levels[0],
        type: 'host',
        icon: achievementTypes.host.icon,
        color: achievementTypes.host.color,
        value: 1
      })
    }

    // Include stored achievements from member data
    if (member.achievements && Array.isArray(member.achievements)) {
      member.achievements.forEach(achievement => {
        // Avoid duplicates
        if (!achievements.find(a => a.name === achievement.name)) {
          achievements.push(achievement)
        }
      })
    }

    return achievements
  }

  const achievements = calculateAchievements()
  const displayAchievements = showAll ? achievements : achievements.slice(0, maxDisplay)
  const remainingCount = achievements.length - maxDisplay

  if (achievements.length === 0) {
    return null
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-primary font-body">
          Achievements
        </span>
        {achievements.length > 0 && (
          <span className="text-xs text-primary/60 font-body">
            {achievements.length} earned
          </span>
        )}
      </div>
      
      <div className="flex flex-wrap gap-1">
        {displayAchievements.map((achievement, index) => (
          <motion.div
            key={`${achievement.type}-${achievement.name}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="group relative"
          >
            <Badge 
              variant={achievement.color} 
              size="small"
              className="flex items-center space-x-1 cursor-help"
            >
              <ApperIcon 
                name={achievement.icon} 
                className="w-3 h-3" 
              />
              <span>{achievement.name}</span>
            </Badge>
            
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-primary text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
              {achievement.description}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-primary"></div>
            </div>
          </motion.div>
        ))}
        
        {!showAll && remainingCount > 0 && (
          <Badge variant="secondary" size="small">
            +{remainingCount}
          </Badge>
        )}
      </div>
    </div>
  )
}

export default AchievementBadges