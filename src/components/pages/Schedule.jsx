import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { format, isAfter, isBefore, startOfDay } from 'date-fns'
import { toast } from 'react-toastify'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import meetingService from '@/services/api/meetingService'

const Schedule = () => {
  const [meetings, setMeetings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [rsvpLoading, setRsvpLoading] = useState({})

  const loadMeetings = async () => {
    try {
      setError('')
      setLoading(true)
      const data = await meetingService.getAll()
      setMeetings(data)
    } catch (err) {
      setError('Failed to load meetings')
      console.error('Error loading meetings:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleRsvp = async (meetingId, status) => {
    setRsvpLoading(prev => ({ ...prev, [meetingId]: true }))
    
    try {
      await meetingService.updateRsvp(meetingId, 'current-user', status)
      await loadMeetings() // Reload to show updated RSVPs
      toast.success(`RSVP updated to ${status}`)
    } catch (err) {
      toast.error('Failed to update RSVP')
      console.error('Error updating RSVP:', err)
    } finally {
      setRsvpLoading(prev => ({ ...prev, [meetingId]: false }))
    }
  }

  const getMeetingStatus = (meetingDate) => {
    const now = new Date()
    const meeting = new Date(meetingDate)
    const today = startOfDay(now)
    const meetingDay = startOfDay(meeting)
    
    if (isBefore(meeting, now)) return 'past'
    if (meetingDay.getTime() === today.getTime()) return 'today'
    return 'upcoming'
  }

  const getMeetingBadgeProps = (status) => {
    switch (status) {
      case 'past':
        return { variant: 'secondary', icon: 'CheckCircle', text: 'Completed' }
      case 'today':
        return { variant: 'accent', icon: 'Clock', text: 'Today' }
      default:
        return { variant: 'primary', icon: 'Calendar', text: 'Upcoming' }
    }
  }

  const getUserRsvpStatus = (meeting) => {
    // In a real app, this would check against the actual user ID
    const userRsvp = meeting.rsvps.find(rsvp => rsvp.userId === 'current-user')
    return userRsvp?.status || null
  }

  const getRsvpCounts = (rsvps) => {
    const counts = { attending: 0, maybe: 0, declined: 0 }
    rsvps.forEach(rsvp => {
      counts[rsvp.status] = (counts[rsvp.status] || 0) + 1
    })
    return counts
  }

  useEffect(() => {
    loadMeetings()
  }, [])

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Error message={error} onRetry={loadMeetings} />
  }

  if (!meetings.length) {
    return (
      <Empty
        type="meetings"
        title="No meetings scheduled"
        description="No book club meetings are currently scheduled. Create your first meeting to bring the club together for discussions and literary fun!"
        actionText="Schedule Meeting"
      />
    )
  }

  // Sort meetings by date
  const sortedMeetings = [...meetings].sort((a, b) => new Date(a.date) - new Date(b.date))

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="bg-surface border border-secondary/20 rounded-lg p-6 paper-texture shadow-paper">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="font-display text-3xl font-bold text-primary mb-2">
                Meeting Schedule
              </h1>
              <p className="text-primary/70 font-body">
                Stay connected with your book club community
              </p>
            </div>
            
            <Button variant="primary" icon="Plus">
              Schedule Meeting
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Meetings List */}
      <div className="space-y-6">
        {sortedMeetings.map((meeting, index) => {
          const status = getMeetingStatus(meeting.date)
          const badgeProps = getMeetingBadgeProps(status)
          const userRsvp = getUserRsvpStatus(meeting)
          const rsvpCounts = getRsvpCounts(meeting.rsvps)
          const isLoading = rsvpLoading[meeting.Id]

          return (
            <motion.div
              key={meeting.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="p-6" torn>
                <div className="flex flex-col lg:flex-row lg:items-start space-y-4 lg:space-y-0 lg:space-x-6">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-display text-xl font-semibold text-primary mb-2">
                          {meeting.title}
                        </h3>
                        <div className="flex items-center space-x-4 mb-2">
                          <div className="flex items-center text-primary/70 font-body">
                            <ApperIcon name="Calendar" className="w-4 h-4 mr-1" />
                            {format(new Date(meeting.date), 'EEEE, MMMM d, yyyy')}
                          </div>
                          <div className="flex items-center text-primary/70 font-body">
                            <ApperIcon name="Clock" className="w-4 h-4 mr-1" />
                            {format(new Date(meeting.date), 'h:mm a')}
                          </div>
                          <div className="flex items-center text-primary/70 font-body">
                            <ApperIcon 
                              name={meeting.type === 'virtual' ? 'Video' : meeting.type === 'in-person' ? 'MapPin' : 'Users'} 
                              className="w-4 h-4 mr-1" 
                            />
                            {meeting.type === 'virtual' ? 'Virtual' : meeting.type === 'in-person' ? 'In Person' : 'Hybrid'}
                          </div>
                        </div>
                        <p className="text-primary/60 font-body">
                          {meeting.location}
                        </p>
                      </div>
                      
                      <Badge 
                        variant={badgeProps.variant} 
                        icon={badgeProps.icon}
                      >
                        {badgeProps.text}
                      </Badge>
                    </div>

                    {meeting.description && (
                      <p className="text-primary/80 font-body mb-4 leading-relaxed">
                        {meeting.description}
                      </p>
                    )}

                    {meeting.agenda && meeting.agenda.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-body font-semibold text-primary mb-2">Agenda:</h4>
                        <ul className="text-primary/70 font-body text-sm space-y-1">
                          {meeting.agenda.map((item, i) => (
                            <li key={i} className="flex items-start">
                              <span className="text-accent mr-2">•</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* RSVP Stats */}
                    <div className="flex items-center space-x-6 mb-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-success rounded-full"></div>
                        <span className="text-sm font-body text-primary/70">
                          {rsvpCounts.attending} attending
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-warning rounded-full"></div>
                        <span className="text-sm font-body text-primary/70">
                          {rsvpCounts.maybe} maybe
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-error rounded-full"></div>
                        <span className="text-sm font-body text-primary/70">
                          {rsvpCounts.declined} declined
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* RSVP Actions */}
                  {status !== 'past' && (
                    <div className="flex-shrink-0">
                      <div className="bg-gradient-to-br from-surface/50 to-surface/80 border border-secondary/20 rounded-lg p-4 space-y-3">
                        <h4 className="font-body font-semibold text-primary text-center mb-3">
                          Your RSVP
                        </h4>
                        
                        <div className="space-y-2">
                          {['attending', 'maybe', 'declined'].map((status) => (
                            <Button
                              key={status}
                              variant={userRsvp === status ? 'primary' : 'secondary'}
                              size="small"
                              icon={
                                status === 'attending' ? 'CheckCircle' :
                                status === 'maybe' ? 'HelpCircle' : 'XCircle'
                              }
                              loading={isLoading}
                              onClick={() => handleRsvp(meeting.Id, status)}
                              className="w-full justify-center"
                              disabled={isLoading}
                            >
                              {status === 'attending' ? 'Attending' :
                               status === 'maybe' ? 'Maybe' : 'Can\'t Attend'}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

export default Schedule