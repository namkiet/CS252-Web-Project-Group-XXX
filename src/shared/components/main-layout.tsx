import { Outlet } from "react-router-dom";
import { Navbar } from './nav-bar'

export default function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}