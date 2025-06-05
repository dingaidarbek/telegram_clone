export const formatMessageDate = (date: Date): string => {
    const now = new Date()
    const yesterday = new Date(now)
    yesterday.setDate(yesterday.getDate() - 1)

    // Reset time part for date comparison
    const messageDate = new Date(date)
    messageDate.setHours(0, 0, 0, 0)
    const today = new Date(now)
    today.setHours(0, 0, 0, 0)
    const yesterdayDate = new Date(yesterday)
    yesterdayDate.setHours(0, 0, 0, 0)

    if (messageDate.getTime() === today.getTime()) {
        return 'Today'
    } else if (messageDate.getTime() === yesterdayDate.getTime()) {
        return 'Yesterday'
    } else {
        return date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        })
    }
}

export const formatMessageTime = (time: string): string => {
    // If the time is already in HH:MM format, return it as is
    if (/^\d{1,2}:\d{2} (AM|PM)$/.test(time)) {
        return time
    }

    // Try to parse the time string as a date
    const date = new Date(time)
    if (!isNaN(date.getTime())) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    // If parsing fails, return the original time string
    return time
}

export const getMessageDate = (timeString: string): Date => {
    // Handle "Yesterday" case
    if (timeString === 'Yesterday') {
        const date = new Date()
        date.setDate(date.getDate() - 1)
        return date
    }

    // Handle time format (e.g., "10:30 AM")
    const [time, period] = timeString.split(' ')
    const [hours, minutes] = time.split(':')
    const date = new Date()

    let hour = parseInt(hours)
    if (period === 'PM' && hour !== 12) {
        hour += 12
    } else if (period === 'AM' && hour === 12) {
        hour = 0
    }

    date.setHours(hour, parseInt(minutes), 0, 0)
    return date
} 