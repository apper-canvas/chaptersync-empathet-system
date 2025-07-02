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
  }
}

export default memberService