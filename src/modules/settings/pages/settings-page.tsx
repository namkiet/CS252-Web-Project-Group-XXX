import { useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { Settings, Clock } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Button } from "@/shared/components/ui/button";

import { GeneralSettingsTabContent } from "../components/general-settings-tab-content";
import { SessionTabContent } from "../components/session-tab-content";
import { useGeneralSettingsStore } from "../types";

export default function SettingsPage() {
  const { user, isLoading } = useAuth();
  const { loadSettings, fixing, setFixing, saveSettings, current } = useGeneralSettingsStore();

  useEffect(() => {
    loadSettings();
  }, []); // Empty dependency array - only run once on mount

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

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading settings...</div>;
  }

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
      
      <div className="mb-8">
        <h1 className="flex items-center gap-3 text-3xl font-bold">
          <Settings className="h-8 w-8" />
          Settings
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage your application preferences and configurations
        </p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-8 grid w-full grid-cols-2 bg-transparent p-0 md:w-[400px]">
          <TabsTrigger
            value="general"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:rounded-md data-[state=active]:border-none transition-all duration-200 hover:scale-105 hover:-translate-y-0.5"
          >
            <Settings className="mr-2 h-4 w-4" />
            General Settings
          </TabsTrigger>
          <TabsTrigger
            value="session"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:rounded-md data-[state=active]:border-none transition-all duration-200 hover:scale-105 hover:-translate-y-0.5"
          >
            <Clock className="mr-2 h-4 w-4" />
            Session
          </TabsTrigger>
        </TabsList>

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