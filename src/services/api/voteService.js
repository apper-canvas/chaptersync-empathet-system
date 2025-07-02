import votesData from '@/services/mockData/votes.json'
import booksData from '@/services/mockData/books.json'

const voteService = {
  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400))
    
    return [...votesData].map(vote => ({
      ...vote,
      bookProposal: booksData.find(b => b.Id === vote.bookId) || vote.bookProposal
    }))
  },

  async getActive() {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const activeVotes = votesData.filter(v => v.status === 'active')
    return activeVotes.map(vote => ({
      ...vote,
      bookProposal: booksData.find(b => b.Id === vote.bookId) || vote.bookProposal
    }))
  },

  async submitVote(voteId, userId) {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const vote = votesData.find(v => v.Id === voteId)
    if (!vote) {
      throw new Error('Vote not found')
    }
    
    if (vote.status !== 'active') {
      throw new Error('Voting is not active')
    }
    
    // Remove existing vote from this user
    vote.votes = vote.votes.filter(v => v.userId !== userId)
    
    // Add new vote
    vote.votes.push({
      userId,
      bookId: vote.bookId,
      created: new Date().toISOString()
    })
    
    return { ...vote }
  },

  async proposeBook(bookData) {
    await new Promise(resolve => setTimeout(resolve, 600))
    
    // Add book if it doesn't exist
    const existingBook = booksData.find(b => b.isbn === bookData.isbn)
    let bookId
    
    if (existingBook) {
      bookId = existingBook.Id
    } else {
      bookId = Math.max(...booksData.map(b => b.Id)) + 1
      const newBook = {
        Id: bookId,
        ...bookData
      }
      booksData.push(newBook)
    }
    
    // Create vote
    const newVote = {
      Id: Math.max(...votesData.map(v => v.Id)) + 1,
      bookId,
      votes: [],
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      status: 'active',
      created: new Date().toISOString()
    }
    
    votesData.push(newVote)
    
    return {
      ...newVote,
      bookProposal: booksData.find(b => b.Id === bookId)
    }
  }
}

export default voteService