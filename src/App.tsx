import { Routes, Route } from 'react-router-dom'

import MainLayout from './shared/components/main-layout';
import ChatPage from './modules/chat'
import HomePage from './modules/home'
import StaffPage from './modules/staff'
import FoodGuidePage from './modules/guide';

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/staff" element={<StaffPage/>} />
        <Route path="/food-guide" element={<FoodGuidePage/>} />
      </Route>

        {/* <Route path="/login" element={<LoginPage />} /> */}
    </Routes>
  )
}