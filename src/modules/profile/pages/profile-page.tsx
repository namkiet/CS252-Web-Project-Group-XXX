import { useAuth } from "@/context/auth-context";
import { Bell, Lock, User as UserIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";

import { ProfileHeader } from "../components/profile-header";
import { ProfileTabContent } from "../components/profile-tab-content";
import { SecurityTabContent } from "../components/security-tab-content";
import { NotificationsTabContent } from "../components/notification-tab-content";
import { Button } from "@/shared/components/ui/button";

export default function ProfilePage() {
  const { user, isLoading, logout } = useAuth();

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
      <div className="flex justify-between items-start">
        <ProfileHeader user={user} />
        
        {/* LogOut button */}
        <Button variant="destructive" onClick={logout}>
            Logout
        </Button>
      </div>

      {/* Tabs Navigation System */}
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-8 grid w-full grid-cols-3 bg-transparent p-0 md:w-[400px]">
          <TabsTrigger
            value="profile"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:rounded-md data-[state=active]:border-none"
          >
            <UserIcon className="mr-2 h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:rounded-md data-[state=active]:border-none"
          >
            <Lock className="mr-2 h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:rounded-md data-[state=active]:border-none"
          >
            <Bell className="mr-2 h-4 w-4" />
            Notifications
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
      </Tabs>
    </div>
  );
}