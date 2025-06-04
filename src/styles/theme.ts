export const themeClasses = {
    sidebar: "bg-white border-r border-gray-200 flex flex-col",
    chatHeader: "bg-white border-b border-gray-200 px-4 py-3 flex items-center",
    messageOut: "bg-blue-500 text-white rounded-2xl rounded-br-md",
    messageIn: "bg-white text-gray-900 rounded-2xl rounded-bl-md shadow-sm",
    inputArea: "bg-white border-t border-gray-200 px-4 py-3",
    onlineIndicator: "w-3 h-3 bg-green-500 rounded-full border-2 border-white"
} as const;

// Type for the theme classes
export type ThemeClasses = typeof themeClasses;

// Type for individual class keys
export type ThemeClassKey = keyof ThemeClasses; 