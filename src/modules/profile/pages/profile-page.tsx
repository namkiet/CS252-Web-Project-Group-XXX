import { useAuth } from "@/context/auth-context";
import { Bell, Lock, User as UserIcon, Settings as SettingsIcon, Clock } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { ProfileHeader } from "../components/profile-header";
import { ProfileTabContent } from "../components/profile-tab-content";
import { SecurityTabContent } from "../components/security-tab-content";
import { NotificationsTabContent } from "../components/notification-tab-content";
import { GeneralSettingsTabContent } from "../components/general-settings-tab-content";
import { SessionTabContent } from "../components/session-tab-content";
import { useGeneralSettingsStore } from "../types";
import { Button } from "@/shared/components/ui/button";
import { toast } from "sonner";

export default function ProfilePage() {
  const { user, isLoading, logout } = useAuth();
  const { loadSettings, fixing, setFixing, saveSettings, current } = useGeneralSettingsStore();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    loadSettings();
  }, []);

  // Check if there's a tab query param and set it
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "general" || tab === "session") {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Apply theme to the document for live preview
  useEffect(() => {
    const applyTheme = (theme: string) => {
      const root = document.documentElement;
      if (theme === "dark") {
        root.classList.add("dark");
      } else if (theme === "light") {
        root.classList.remove("dark");
      } else {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        root.classList.toggle("dark", prefersDark);
      }
    };

    applyTheme(fixing?.theme ?? current.theme);
  }, [fixing?.theme, current.theme]);

  const handleDeleteAccount = () => {
    const confirmed = window.confirm("Are you sure you want to delete your account? This cannot be undone.");
    if (!confirmed) return;
    toast.success("Account deletion requested.");
  };

  // Loading state
  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading profile...</div>;
  }

  // If no log in yet
  if (!user) {
    return (
        <div className="flex h-screen flex-col items-center justify-center gap-4">
            <p>You need to login to view this page.</p>
            <Button onClick={() => window.location.href = '/login'}>Go to Login</Button>
        </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl py-10">
      
      {/* Header */}
      <div className="flex justify-between items-start gap-4">
        <ProfileHeader user={user} />
        <div className="flex flex-col items-center gap-2">
          <Button 
            variant="default" 
            onClick={logout} 
            className="w-40 bg-orange-500 text-white border border-orange-500 hover:bg-orange-600"
          >
              Logout
          </Button>
          <Button 
            variant="default" 
            onClick={handleDeleteAccount} 
            className="w-40 bg-orange-500 text-white border border-orange-500 hover:bg-orange-600"
          >
              Delete Account
          </Button>
        </div>
      </div>

      {/* Tabs Navigation System */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-8 grid w-full grid-cols-5 bg-transparent p-0 gap-0 md:w-[750px]">
          <TabsTrigger
            value="profile"
            className="group relative rounded-none border-none px-4 py-2 text-gray-900 transition-colors duration-150 hover:text-orange-600 data-[state=active]:text-orange-600 data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:right-0 data-[state=active]:after:h-0.5 data-[state=active]:after:bg-orange-500"
          >
            <UserIcon className="mr-2 h-4 w-4 text-gray-900 transition-colors group-hover:text-orange-600 group-data-[state=active]:text-orange-600" />
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="group relative rounded-none border-none px-4 py-2 text-gray-900 transition-colors duration-150 hover:text-orange-600 data-[state=active]:text-orange-600 data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:right-0 data-[state=active]:after:h-0.5 data-[state=active]:after:bg-orange-500"
          >
            <Lock className="mr-2 h-4 w-4 text-gray-900 transition-colors group-hover:text-orange-600 group-data-[state=active]:text-orange-600" />
            Security
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="group relative rounded-none border-none px-4 py-2 text-gray-900 transition-colors duration-150 hover:text-orange-600 data-[state=active]:text-orange-600 data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:right-0 data-[state=active]:after:h-0.5 data-[state=active]:after:bg-orange-500"
          >
            <Bell className="mr-2 h-4 w-4 text-gray-900 transition-colors group-hover:text-orange-600 group-data-[state=active]:text-orange-600" />
            Notifications
          </TabsTrigger>
          <TabsTrigger
            value="general"
            className="group relative rounded-none border-none px-4 py-2 text-gray-900 transition-colors duration-150 hover:text-orange-600 data-[state=active]:text-orange-600 data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:right-0 data-[state=active]:after:h-0.5 data-[state=active]:after:bg-orange-500"
          >
            <SettingsIcon className="mr-2 h-4 w-4 text-gray-900 transition-colors group-hover:text-orange-600 group-data-[state=active]:text-orange-600" />
            Settings
          </TabsTrigger>
          <TabsTrigger
            value="session"
            className="group relative rounded-none border-none px-4 py-2 text-gray-900 transition-colors duration-150 hover:text-orange-600 data-[state=active]:text-orange-600 data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:right-0 data-[state=active]:after:h-0.5 data-[state=active]:after:bg-orange-500"
          >
            <Clock className="mr-2 h-4 w-4 text-gray-900 transition-colors group-hover:text-orange-600 group-data-[state=active]:text-orange-600" />
            Session
          </TabsTrigger>
        </TabsList>

        {/* Tab Contents */}
        <TabsContent value="profile">
          <ProfileTabContent user={user} />
        </TabsContent>

        <TabsContent value="security">
          <SecurityTabContent />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationsTabContent />
        </TabsContent>

        <TabsContent value="general">
          <GeneralSettingsTabContent
            fixing={fixing}
            setFixing={setFixing}
            saveSettings={saveSettings}
          />
        </TabsContent>

        <TabsContent value="session">
          <SessionTabContent />
        </TabsContent>
      </Tabs>
    </div>
  );
}