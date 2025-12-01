import { Routes, Route } from 'react-router-dom'

import MainLayout from './shared/components/main-layout';
import ChatPage from './modules/chat'
import HomePage from './modules/home'

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/chat" element={<ChatPage />} />
        {/* <Route path="/staff" element={<div>Trang Staff</div>} />
        <Route path="/about" element={<div>Trang About Us</div>} /> */}
      </Route>

        {/* <Route path="/login" element={<LoginPage />} /> */}
    </Routes>
  )
}