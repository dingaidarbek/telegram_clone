import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Chat from './pages/Chat'
import { useState } from 'react'
import { ChatStats } from './components/ChatStats'
import { ThemeProvider } from './context/ThemeContext'

const queryClient = new QueryClient()

function App() {
  const [showStats, setShowStats] = useState(false)

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router>
          <div className="h-full min-h-[100dvh] bg-gray-50 dark:bg-gray-900 overflow-hidden">
            <main className="h-full">
              <Routes>
                <Route path="/" element={<Navigate to="/chat" replace />} />
                <Route path="/chat" element={<Chat onToggleStats={() => setShowStats(!showStats)} />} />
                <Route path="/chat/:chatId" element={<Chat onToggleStats={() => setShowStats(!showStats)} />} />
              </Routes>
            </main>

            {showStats && (
              <div className="fixed left-0 top-0 w-80 h-full p-4 bg-white dark:bg-gray-800 shadow-lg overflow-y-auto animate-slide-in">
                <ChatStats onClose={() => setShowStats(false)} />
              </div>
            )}
          </div>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
