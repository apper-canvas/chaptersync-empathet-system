import discussionsData from '@/services/mockData/discussions.json'

const discussionService = {
  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400))
    
    return [...discussionsData]
  },

  async getByChapter(chapter) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const discussion = discussionsData.find(d => d.chapter === chapter)
    return discussion ? { ...discussion } : null
  },

  async addComment(discussionId, content) {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const discussion = discussionsData.find(d => d.Id === discussionId)
    if (!discussion) {
      throw new Error('Discussion not found')
    }

    const newComment = {
      Id: Math.max(...discussion.comments.map(c => c.Id)) + 1,
      content,
      userName: 'You',
      userAvatar: null,
      created: new Date().toISOString(),
      reactions: {},
      userReactions: []
    }

    discussion.comments.push(newComment)
    return { ...newComment }
  },

  async addReaction(commentId, reaction) {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    // Find comment across all discussions
    for (const discussion of discussionsData) {
      const comment = discussion.comments.find(c => c.Id === commentId)
      if (comment) {
        if (!comment.reactions) comment.reactions = {}
        if (!comment.userReactions) comment.userReactions = []
        
        if (comment.userReactions.includes(reaction)) {
          // Remove reaction
          comment.reactions[reaction] = Math.max(0, (comment.reactions[reaction] || 0) - 1)
          comment.userReactions = comment.userReactions.filter(r => r !== reaction)
        } else {
          // Add reaction
          comment.reactions[reaction] = (comment.reactions[reaction] || 0) + 1
          comment.userReactions.push(reaction)
        }
        
        return { ...comment }
      }
    }
    
    throw new Error('Comment not found')
  }
}

export default discussionService