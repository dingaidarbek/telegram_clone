export const themeClasses = {
    // Light theme (default)
    light: {
        background: 'bg-white',
        text: 'text-gray-900',
        textSecondary: 'text-gray-500',
        border: 'border-gray-200',
        hover: 'hover:bg-gray-50',
        active: 'bg-gray-100',
        messageIn: 'bg-gray-100 text-gray-900',
        messageOut: 'bg-blue-500 text-white',
        input: 'bg-white border-gray-200 text-gray-900',
        sidebar: 'bg-white border-r border-gray-200',
        search: 'bg-gray-100 text-gray-900',
        unread: 'bg-blue-500 text-white',
        time: 'text-gray-500',
        date: 'text-gray-500 bg-gray-100',
    },
    // Dark theme
    dark: {
        background: 'bg-gray-900',
        text: 'text-gray-100',
        textSecondary: 'text-gray-400',
        border: 'border-gray-700',
        hover: 'hover:bg-gray-800',
        active: 'bg-gray-800',
        messageIn: 'bg-gray-800 text-gray-100',
        messageOut: 'bg-blue-600 text-white',
        input: 'bg-gray-800 border-gray-700 text-gray-100',
        sidebar: 'bg-gray-900 border-r border-gray-700',
        search: 'bg-gray-800 text-gray-100',
        unread: 'bg-blue-600 text-white',
        time: 'text-gray-400',
        date: 'text-gray-400 bg-gray-800',
    },
    sidebar: "bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col",
    chatHeader: "border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center",
    messageOut: "bg-blue-500 dark:bg-blue-600 text-white rounded-2xl rounded-br-md",
    messageIn: "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-2xl rounded-bl-md shadow-sm",
    messageTime: "text-xs text-gray-500 dark:text-gray-400 mt-1",
    messageDate: "text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 px-3 py-1 rounded-full",
    chatItem: "flex items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer",
    chatItemActive: "bg-gray-100 dark:bg-gray-800",
    chatItemUnread: "bg-blue-500 dark:bg-blue-600 text-white text-xs px-2 py-1 rounded-full",
    chatItemTime: "text-xs text-gray-500 dark:text-gray-400",
    chatItemLastMessage: "text-sm text-gray-500 dark:text-gray-400 truncate",
    chatItemName: "text-sm font-medium text-gray-900 dark:text-gray-100",
    searchInput: "w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
    messageInput: "flex-1 px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
    sendButton: "ml-2 p-2 text-blue-500 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-full",
    emptyState: "text-gray-500 dark:text-gray-400",
    avatar: "w-10 h-10 rounded-full",
    onlineIndicator: "absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900",
    themeToggle: "p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
}

export const getThemeClass = (baseClass: string, theme: 'light' | 'dark' = 'light'): string => {
    const themeClass = themeClasses[theme][baseClass as keyof typeof themeClasses.light]
    return themeClass || baseClass
}

// Type for the theme classes
export type ThemeClasses = typeof themeClasses;

// Type for individual class keys
export type ThemeClassKey = keyof ThemeClasses; 