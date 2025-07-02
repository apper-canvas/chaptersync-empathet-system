const clubService = {
  async getClubInfo() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    
    return {
      Id: 1,
      name: "Literary Explorers",
      members: 8,
      created: "2024-01-15T00:00:00Z",
      currentBook: {
        Id: 1,
        title: "The Seven Husbands of Evelyn Hugo",
        author: "Taylor Jenkins Reid",
        isbn: "9781501161933",
        coverUrl: "/api/placeholder/200/300",
        totalChapters: 12,
        description: "A reclusive Hollywood icon finally tells her story to an unknown journalist, revealing the truth behind her seven marriages."
      },
      readingProgress: {
        currentChapter: 4,
        totalChapters: 12,
        startDate: "2024-01-15T00:00:00Z",
        targetDate: "2024-02-28T00:00:00Z",
        membersCompleted: 5,
        totalMembers: 8
      }
    }
  }
}

export default clubService