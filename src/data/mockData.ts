import type { ChatData, Message } from '../types/chat'

export const chats: ChatData[] = [
    {
        id: '1',
        name: 'Jane Smith',
        avatar: 'https://i.pravatar.cc/150?img=1',
        lastMessage: 'Hey, how are you?',
        lastMessageTime: '10:30 AM',
        unreadCount: 2,
        isOnline: false,
        lastSeen: 'last seen recently'
    },
    {
        id: '2',
        name: 'Mike Johnson',
        avatar: 'https://i.pravatar.cc/150?img=2',
        lastMessage: 'See you tomorrow!',
        lastMessageTime: 'Yesterday',
        unreadCount: 0,
        isOnline: false,
        lastSeen: 'last seen yesterday at 15:30'
    },
    {
        id: '3',
        name: 'Sarah Wilson',
        avatar: 'https://i.pravatar.cc/150?img=3',
        lastMessage: 'Thanks for the help!',
        lastMessageTime: 'Yesterday',
        unreadCount: 1,
        isOnline: true,
        lastSeen: 'online'
    }
]

export const messages: Record<string, Message[]> = {
    '1': [
        {
            id: '1',
            chatId: '1',
            text: 'Hey, how are you?',
            time: '10:30 AM',
            isOutgoing: false
        },
        {
            id: '2',
            chatId: '1',
            text: 'I\'m good, thanks! How about you?',
            time: '10:31 AM',
            isOutgoing: true
        }
    ],
    '2': [
        {
            id: '1',
            chatId: '2',
            text: 'Are we still meeting tomorrow?',
            time: 'Yesterday',
            isOutgoing: false
        },
        {
            id: '2',
            chatId: '2',
            text: 'Yes, at 2 PM!',
            time: 'Yesterday',
            isOutgoing: true
        },
        {
            id: '3',
            chatId: '2',
            text: 'See you tomorrow!',
            time: 'Yesterday',
            isOutgoing: false
        }
    ],
    '3': [
        {
            id: '1',
            chatId: '3',
            text: 'Can you help me with the project?',
            time: 'Yesterday',
            isOutgoing: false
        },
        {
            id: '2',
            chatId: '3',
            text: 'Of course! What do you need?',
            time: 'Yesterday',
            isOutgoing: true
        },
        {
            id: '3',
            chatId: '3',
            text: 'Thanks for the help!',
            time: 'Yesterday',
            isOutgoing: false
        }
    ]
} 