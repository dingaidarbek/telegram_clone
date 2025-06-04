import { useState } from 'react'

interface NewChatModalProps {
    isOpen: boolean
    onClose: () => void
    onAddChat: (name: string) => void
}

function NewChatModal({ isOpen, onClose, onAddChat }: NewChatModalProps) {
    const [chatName, setChatName] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (chatName.trim()) {
            onAddChat(chatName.trim())
            setChatName('')
            onClose()
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[var(--bg-primary)] rounded-lg p-6 w-96">
                <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">New Chat</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="chatName" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                            Contact Name
                        </label>
                        <input
                            type="text"
                            id="chatName"
                            value={chatName}
                            onChange={(e) => setChatName(e.target.value)}
                            placeholder="Enter contact name"
                            className="w-full rounded-lg border border-[var(--border-color)] px-4 py-2 focus:outline-none focus:border-[var(--primary-blue)]"
                            autoFocus
                        />
                    </div>
                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-[var(--primary-blue)] text-white px-4 py-2 rounded-lg hover:bg-[var(--dark-blue)] transition-colors"
                        >
                            Create Chat
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default NewChatModal 