import membersData from '@/services/mockData/members.json'

const memberService = {
  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    
    return [...membersData]
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const member = membersData.find(m => m.Id === id)
    return member ? { ...member } : null
  },

  async updateReadingProgress(memberId, bookId, chapter) {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    const member = membersData.find(m => m.Id === memberId)
    if (!member) {
      throw new Error('Member not found')
    }
    
    if (!member.readingProgress) {
      member.readingProgress = {}
    }
    
    member.readingProgress[bookId] = {
      currentChapter: chapter,
      lastUpdated: new Date().toISOString()
    }
return { ...member }
  },

  calculateAchievements(member) {
    const achievements = []

    // Reading streak achievements
    const streakValue = member.readingStreak || 0
    if (streakValue >= 100) {
      achievements.push({
        name: 'Century Achiever',
        description: '100-day reading streak',
        icon: 'Flame',
        color: 'error',
        type: 'streak',
        earnedDate: new Date().toISOString()
      })
    } else if (streakValue >= 60) {
      achievements.push({
        name: 'Streak Legend',
        description: '60-day reading streak',
        icon: 'Flame',
        color: 'error',
        type: 'streak',
        earnedDate: new Date().toISOString()
      })
    } else if (streakValue >= 30) {
      achievements.push({
        name: 'Monthly Master',
        description: '30-day reading streak',
        icon: 'Flame',
        color: 'error',
        type: 'streak',
        earnedDate: new Date().toISOString()
      })
    } else if (streakValue >= 7) {
      achievements.push({
        name: 'Week Warrior',
        description: '7-day reading streak',
        icon: 'Flame',
        color: 'error',
        type: 'streak',
        earnedDate: new Date().toISOString()
      })
    }

    // Books read achievements
    const booksValue = member.booksRead || 0
    if (booksValue >= 50) {
      achievements.push({
        name: 'Bookworm Elite',
        description: '50 books completed',
        icon: 'BookOpen',
        color: 'success',
        type: 'books',
        earnedDate: new Date().toISOString()
      })
    } else if (booksValue >= 20) {
      achievements.push({
        name: 'Library Regular',
        description: '20 books completed',
        icon: 'BookOpen',
        color: 'success',
        type: 'books',
        earnedDate: new Date().toISOString()
      })
    } else if (booksValue >= 10) {
      achievements.push({
        name: 'Page Turner',
        description: '10 books completed',
        icon: 'BookOpen',
        color: 'success',
        type: 'books',
        earnedDate: new Date().toISOString()
      })
    } else if (booksValue >= 5) {
      achievements.push({
        name: 'Book Explorer',
        description: '5 books completed',
        icon: 'BookOpen',
        color: 'success',
        type: 'books',
        earnedDate: new Date().toISOString()
      })
    }

    // Contribution achievements
    const commentsValue = member.totalComments || 0
    if (commentsValue >= 100) {
      achievements.push({
        name: 'Discussion Expert',
        description: '100+ comments posted',
        icon: 'MessageCircle',
        color: 'accent',
        type: 'contributions',
        earnedDate: new Date().toISOString()
      })
    } else if (commentsValue >= 50) {
      achievements.push({
        name: 'Community Leader',
        description: '50+ comments posted',
        icon: 'MessageCircle',
        color: 'accent',
        type: 'contributions',
        earnedDate: new Date().toISOString()
      })
    } else if (commentsValue >= 25) {
      achievements.push({
        name: 'Active Participant',
        description: '25+ comments posted',
        icon: 'MessageCircle',
        color: 'accent',
        type: 'contributions',
        earnedDate: new Date().toISOString()
      })
    } else if (commentsValue >= 10) {
      achievements.push({
        name: 'Discussion Starter',
        description: '10+ comments posted',
        icon: 'MessageCircle',
        color: 'accent',
        type: 'contributions',
        earnedDate: new Date().toISOString()
      })
    }

    // Host achievement
    if (member.isHost) {
      achievements.push({
        name: 'Club Host',
        description: 'Leading the book club',
        icon: 'Crown',
        color: 'warning',
        type: 'host',
        earnedDate: new Date().toISOString()
      })
    }

    return achievements
  }
}

export default memberService