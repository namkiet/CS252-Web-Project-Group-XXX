import { Routes, Route } from 'react-router-dom'

import MainLayout from './shared/components/main-layout';
import ChatPage from './modules/chat'
import HomePage from './modules/home'
import StaffPage from './modules/staff'
import FoodGuidePage from './modules/guide';
import LogInPage from './modules/login';
import ProfilePage from './modules/profile';
import { Toaster } from 'sonner';

export default function App() {
  return (
    <>
      <Toaster 
        position="top-center" 
        richColors 
        closeButton
        toastOptions={{
          style: { zIndex: 10000 }
        }} 
      />

      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/staff" element={<StaffPage/>} />
          <Route path="/food-guide" element={<FoodGuidePage/>} />
          <Route path="/login" element={<LogInPage/>} />
          <Route path="/profile" element={<ProfilePage/>} />
        </Route>
      </Routes>
    </>
    
  )
}