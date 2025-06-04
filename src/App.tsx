import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Chat from './pages/Chat'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/chat" replace />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/chat/:chatId" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
