import meetingsData from '@/services/mockData/meetings.json'

const meetingService = {
  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 350))
    
    return [...meetingsData]
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 250))
    
    const meeting = meetingsData.find(m => m.Id === id)
    return meeting ? { ...meeting } : null
  },

  async create(meetingData) {
    await new Promise(resolve => setTimeout(resolve, 600))
    
    const newMeeting = {
      Id: Math.max(...meetingsData.map(m => m.Id)) + 1,
      ...meetingData,
      rsvps: [],
      created: new Date().toISOString()
    }
    
    meetingsData.push(newMeeting)
    return { ...newMeeting }
  },

  async updateRsvp(meetingId, userId, status) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const meeting = meetingsData.find(m => m.Id === meetingId)
    if (!meeting) {
      throw new Error('Meeting not found')
    }
    
    const existingRsvp = meeting.rsvps.find(r => r.userId === userId)
    if (existingRsvp) {
      existingRsvp.status = status
      existingRsvp.updated = new Date().toISOString()
    } else {
      meeting.rsvps.push({
        userId,
        status,
        created: new Date().toISOString()
      })
    }
    
    return { ...meeting }
  }
}

export default meetingService