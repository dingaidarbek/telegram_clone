import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import type { ChatData } from '../types/chat'
import { storage } from '../utils/storage'

interface ChatStats {
    totalMessages: number
    activeChats: number
    unreadMessages: number
    lastActive: string
}

interface ChatStatsProps {
    onClose: () => void
}

async function fetchChatStats(): Promise<ChatStats> {
    const chats = storage.getChats()
    const messages = storage.getMessages()

    const totalMessages = Object.values(messages).reduce(
        (acc, chatMessages) => acc + chatMessages.length,
        0
    )

    const activeChats = chats.length
    const unreadMessages = chats.reduce(
        (acc, chat) => acc + chat.unreadCount,
        0
    )

    const lastActive = new Date().toLocaleString()

    return {
        totalMessages,
        activeChats,
        unreadMessages,
        lastActive
    }
}

async function updateChatSettings(settings: { notifications: boolean; theme: string }) {
    // Update theme in document
    if (settings.theme === 'dark') {
        document.documentElement.classList.add('dark')
    } else {
        document.documentElement.classList.remove('dark')
    }

    // Save theme preference
    localStorage.setItem('theme', settings.theme)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    return settings
}

export function ChatStats({ onClose }: ChatStatsProps) {
    const queryClient = useQueryClient()
    const [notifications, setNotifications] = useState(true)
    const [theme, setTheme] = useState(() => {
        // Initialize theme from localStorage or default to 'light'
        return localStorage.getItem('theme') || 'light'
    })

    const { data: stats, isLoading } = useQuery({
        queryKey: ['chatStats'],
        queryFn: fetchChatStats,
        refetchInterval: 5000, // Refetch every 5 seconds
    })

    const settingsMutation = useMutation({
        mutationFn: updateChatSettings,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['chatStats'] })
        },
    })

    // Listen for storage changes
    useEffect(() => {
        const handleStorageChange = () => {
            queryClient.invalidateQueries({ queryKey: ['chatStats'] })
        }

        // Listen for storage events
        window.addEventListener('storage', handleStorageChange)

        // Create a custom event for local storage changes
        const originalSetItem = storage.setChats
        storage.setChats = function (...args) {
            originalSetItem.apply(this, args)
            window.dispatchEvent(new Event('storage'))
        }

        const originalSetMessages = storage.setMessages
        storage.setMessages = function (...args) {
            originalSetMessages.apply(this, args)
            window.dispatchEvent(new Event('storage'))
        }

        return () => {
            window.removeEventListener('storage', handleStorageChange)
            // Restore original methods
            storage.setChats = originalSetItem
            storage.setMessages = originalSetMessages
        }
    }, [queryClient])

    // Apply initial theme
    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }, [])

    if (isLoading) {
        return (
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Chat Statistics</h2>
                <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    title="Close"
                >
                    <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-sm text-blue-600 dark:text-blue-400">Total Messages</p>
                    <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{stats?.totalMessages}</p>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-sm text-green-600 dark:text-green-400">Active Chats</p>
                    <p className="text-2xl font-bold text-green-700 dark:text-green-300">{stats?.activeChats}</p>
                </div>
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <p className="text-sm text-yellow-600 dark:text-yellow-400">Unread Messages</p>
                    <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{stats?.unreadMessages}</p>
                </div>
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <p className="text-sm text-purple-600 dark:text-purple-400">Last Active</p>
                    <p className="text-sm font-medium text-purple-700 dark:text-purple-300">{stats?.lastActive}</p>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-800 dark:text-white">Settings</h3>

                <div className="flex items-center justify-between">
                    <label className="text-gray-700 dark:text-gray-300">Notifications</label>
                    <button
                        onClick={() => {
                            setNotifications(!notifications)
                            settingsMutation.mutate({ notifications: !notifications, theme })
                        }}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${notifications ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                            }`}
                    >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications ? 'translate-x-6' : 'translate-x-1'
                                }`}
                        />
                    </button>
                </div>

                <div className="flex items-center justify-between">
                    <label className="text-gray-700 dark:text-gray-300">Theme</label>
                    <select
                        value={theme}
                        onChange={(e) => {
                            const newTheme = e.target.value
                            setTheme(newTheme)
                            settingsMutation.mutate({ notifications, theme: newTheme })
                        }}
                        className="rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                    </select>
                </div>
            </div>
        </div>
    )
} 