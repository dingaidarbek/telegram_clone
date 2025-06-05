import type { ChatData, Message } from '../types/chat'

const STORAGE_KEYS = {
    CHATS: 'chats',
    MESSAGES: 'messages',
    AVATAR_CACHE: 'avatar_cache'
} as const

export const storage = {
    // Chat data storage
    getChats: (): ChatData[] => {
        const data = localStorage.getItem(STORAGE_KEYS.CHATS)
        return data ? JSON.parse(data) : []
    },

    setChats: (chats: ChatData[]): void => {
        localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(chats))
    },

    // Messages storage
    getMessages: (): Record<string, Message[]> => {
        const data = localStorage.getItem(STORAGE_KEYS.MESSAGES)
        return data ? JSON.parse(data) : {}
    },

    setMessages: (messages: Record<string, Message[]>): void => {
        localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages))
    },

    // Avatar cache
    getAvatarCache: (): Record<string, string> => {
        const data = localStorage.getItem(STORAGE_KEYS.AVATAR_CACHE)
        return data ? JSON.parse(data) : {}
    },

    setAvatarCache: (cache: Record<string, string>): void => {
        localStorage.setItem(STORAGE_KEYS.AVATAR_CACHE, JSON.stringify(cache))
    },

    // Helper to cache a single avatar
    cacheAvatar: async (url: string): Promise<string> => {
        const cache = storage.getAvatarCache()

        // Return cached version if available
        if (cache[url]) {
            return cache[url]
        }

        try {
            // Fetch and convert to base64
            const response = await fetch(url)
            const blob = await response.blob()
            const reader = new FileReader()

            const base64Promise = new Promise<string>((resolve) => {
                reader.onloadend = () => {
                    const base64data = reader.result as string
                    cache[url] = base64data
                    storage.setAvatarCache(cache)
                    resolve(base64data)
                }
            })

            reader.readAsDataURL(blob)
            return await base64Promise
        } catch (error) {
            console.error('Failed to cache avatar:', error)
            return url // Return original URL if caching fails
        }
    }
} 