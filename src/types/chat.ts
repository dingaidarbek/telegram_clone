export interface Message {
    id: string
    text: string
    time: string
    isOutgoing: boolean
}

export interface ChatData {
    id: string
    name: string
    avatar: string
    lastMessage: string
    lastMessageTime: string
    unreadCount: number
    isOnline?: boolean
    lastSeen?: string
} 