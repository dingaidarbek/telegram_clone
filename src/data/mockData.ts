import type { Chat, Message } from '../types/chat'

export const chats: Chat[] = [
    {
        id: '1',
        name: 'John Doe',
        avatar: 'https://i.pravatar.cc/150?img=1',
        lastMessage: 'Hey, how are you?',
        lastMessageTime: '10:30',
        unreadCount: 2,
        isOnline: true
    },
    {
        id: '2',
        name: 'Jane Smith',
        avatar: 'https://i.pravatar.cc/150?img=2',
        lastMessage: 'See you tomorrow!',
        lastMessageTime: '09:15',
        unreadCount: 0,
        isOnline: false,
        lastSeen: 'last seen recently'
    },
    {
        id: '3',
        name: 'Mike Johnson',
        avatar: 'https://i.pravatar.cc/150?img=3',
        lastMessage: 'The meeting is at 2 PM',
        lastMessageTime: 'Yesterday',
        unreadCount: 1,
        isOnline: false,
        lastSeen: 'last seen yesterday at 15:30'
    }
]

export const messages: Record<string, Message[]> = {
    '1': [
        {
            id: '1',
            text: 'Hey, how are you?',
            time: '10:30',
            isOutgoing: false
        },
        {
            id: '2',
            text: 'I\'m good, thanks! How about you?',
            time: '10:31',
            isOutgoing: true
        },
        {
            id: '3',
            text: 'Doing great! Just finished the project we discussed.',
            time: '10:32',
            isOutgoing: false
        }
    ],
    '2': [
        {
            id: '4',
            text: 'Are we still on for tomorrow?',
            time: '09:14',
            isOutgoing: true
        },
        {
            id: '5',
            text: 'Yes, absolutely!',
            time: '09:15',
            isOutgoing: false
        },
        {
            id: '6',
            text: 'See you tomorrow!',
            time: '09:15',
            isOutgoing: true
        }
    ],
    '3': [
        {
            id: '7',
            text: 'Don\'t forget about the meeting',
            time: 'Yesterday',
            isOutgoing: false
        },
        {
            id: '8',
            text: 'What time is it again?',
            time: 'Yesterday',
            isOutgoing: true
        },
        {
            id: '9',
            text: 'The meeting is at 2 PM',
            time: 'Yesterday',
            isOutgoing: false
        }
    ]
} 