import { useState, useRef, useEffect } from 'react'
import type { Message } from '../types/chat'
import { themeClasses } from '../styles/theme'
import MessageGroup from './MessageGroup'
import { getMessageDate } from '../utils/date'
import { generateAIResponse } from '../utils/gemini'
import { formatMessageTime } from '../utils/date'

interface AIChatWindowProps {
    messages: Message[]
    onSendMessage: (message: Message) => void
}

function AIChatWindow({ messages, onSendMessage }: AIChatWindowProps) {
    const [newMessage, setNewMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'auto' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages, isLoading])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (newMessage.trim() && !isLoading) {
            const userMessage = newMessage.trim()
            setNewMessage('') // Clear input immediately after getting the message
            setIsLoading(true)

            const now = new Date()
            const formattedTime = formatMessageTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))

            // Add user message
            const userMessageObj: Message = {
                id: Date.now().toString(),
                chatId: 'ai',
                text: userMessage,
                time: formattedTime,
                isOutgoing: true
            }
            onSendMessage(userMessageObj)

            try {
                // Get AI response
                const aiResponse = await generateAIResponse(userMessage)

                // Add AI response as incoming
                const aiMessageObj: Message = {
                    id: (Date.now() + 1).toString(),
                    chatId: 'ai',
                    text: aiResponse,
                    time: formattedTime,
                    isOutgoing: false
                }
                onSendMessage(aiMessageObj)
            } catch (error) {
                console.error('Error getting AI response:', error)
                const errorMessageObj: Message = {
                    id: (Date.now() + 1).toString(),
                    chatId: 'ai',
                    text: 'Sorry, I encountered an error. Please try again.',
                    time: formattedTime,
                    isOutgoing: false
                }
                onSendMessage(errorMessageObj)
            } finally {
                setIsLoading(false)
            }
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSubmit(e)
        }
    }

    // Group messages by date
    const groupedMessages = messages.reduce<Message[][]>((groups, message) => {
        const messageDate = getMessageDate(message.time)
        const lastGroup = groups[groups.length - 1]

        if (!lastGroup || getMessageDate(lastGroup[0].time).getDate() !== messageDate.getDate()) {
            groups.push([message])
        } else {
            lastGroup.push(message)
        }

        return groups
    }, [])

    return (
        <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
            {/* Chat Header */}
            <div className={`${themeClasses.chatHeader} bg-white dark:bg-gray-900`}>
                <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center mr-3">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">AI Assistant</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {isLoading ? 'Typing...' : 'Online'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
                {groupedMessages.map((group, index) => (
                    <MessageGroup key={index} messages={group} />
                ))}
                {isLoading && (
                    <div className="flex items-start space-x-2">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex-shrink-0 flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg px-3 py-2 shadow-sm inline-block">
                            <div className="flex space-x-1">
                                <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                <div className="flex items-end">
                    <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask me anything..."
                        className={`${themeClasses.messageInput} resize-none min-h-[40px] max-h-[120px] py-2`}
                        rows={1}
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleSubmit}
                        className={themeClasses.sendButton}
                        disabled={!newMessage.trim() || isLoading}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AIChatWindow 