import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/auth-context";
import { Lock, User as UserIcon, Settings as SettingsIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { ProfileHeader } from "../components/profile-header";
import { ProfileTabContent } from "../components/profile-tab-content";
import { SecurityTabContent } from "../components/security-tab-content";
import { GeneralSettingsTabContent } from "../components/general-settings-tab-content";
import { useGeneralSettingsStore } from "../types";
import { Button } from "@/shared/components/ui/button";
import { toast } from "sonner";

export default function ProfilePage() {
  const { t } = useTranslation();
  const { user, isLoading, logout } = useAuth();
  const { loadSettings, fixing, setFixing, saveSettings, current } = useGeneralSettingsStore();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "general" ) {
      setActiveTab(tab);
    }
  }, [searchParams]);

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
    const confirmed = window.confirm(t('profile_page.delete_confirm'));
    if (!confirmed) return;
    toast.success(t('profile_page.delete_requested'));
  };

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">{t('profile_page.loading')}</div>;
  }

  if (!user) {
    return (
        <div className="flex h-screen flex-col items-center justify-center gap-4 px-4 text-center">
            <p>{t('settings.login_required')}</p>
            <Button onClick={() => window.location.href = '/login'}>{t('settings.go_to_login')}</Button>
        </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl py-6 md:py-10 px-4">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
        <ProfileHeader user={user} />
        
        <div className="flex flex-col sm:flex-row md:flex-col w-full md:w-auto gap-3 items-stretch">
          <Button 
            variant="default" 
            onClick={logout} 
            className="w-full md:w-40 bg-orange-500 text-white border border-orange-500 hover:bg-orange-600 shadow-sm"
          >
            {t('profile_page.logout')}
          </Button>
          <Button 
            variant="default" 
            onClick={handleDeleteAccount} 
            className="w-full md:w-40 bg-white text-red-600 border border-red-200 hover:bg-red-50 hover:border-red-300"
          >
            {t('profile_page.delete_account')}
          </Button>
        </div>
      </div>

      {/* Tabs Navigation System */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        
        <div className="w-full overflow-x-auto pb-2 mb-6 no-scrollbar">
            <TabsList className="inline-flex md:grid w-auto md:w-[750px] md:grid-cols-5 bg-transparent p-0 gap-0">
            <TabsTrigger
                value="profile"
                className="group relative rounded-none border-none px-4 py-2 text-gray-900 transition-colors duration-150 hover:text-orange-600 data-[state=active]:text-orange-600 whitespace-nowrap data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:right-0 data-[state=active]:after:h-0.5 data-[state=active]:after:bg-orange-500"
            >
                <UserIcon className="mr-2 h-4 w-4 text-gray-900 transition-colors group-hover:text-orange-600 group-data-[state=active]:text-orange-600" />
                {t('profile_page.tabs.profile')}
            </TabsTrigger>
            <TabsTrigger
                value="security"
                className="group relative rounded-none border-none px-4 py-2 text-gray-900 transition-colors duration-150 hover:text-orange-600 data-[state=active]:text-orange-600 whitespace-nowrap data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:right-0 data-[state=active]:after:h-0.5 data-[state=active]:after:bg-orange-500"
            >
                <Lock className="mr-2 h-4 w-4 text-gray-900 transition-colors group-hover:text-orange-600 group-data-[state=active]:text-orange-600" />
                {t('profile_page.tabs.security')}
            </TabsTrigger>
            <TabsTrigger
                value="general"
                className="group relative rounded-none border-none px-4 py-2 text-gray-900 transition-colors duration-150 hover:text-orange-600 data-[state=active]:text-orange-600 whitespace-nowrap data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:right-0 data-[state=active]:after:h-0.5 data-[state=active]:after:bg-orange-500"
            >
                <SettingsIcon className="mr-2 h-4 w-4 text-gray-900 transition-colors group-hover:text-orange-600 group-data-[state=active]:text-orange-600" />
                {t('profile_page.tabs.settings')}
            </TabsTrigger>
            </TabsList>
        </div>

        {/* Tab Contents */}
        <div className="mt-2">
            <TabsContent value="profile">
            <ProfileTabContent user={user} />
            </TabsContent>

            <TabsContent value="security">
            <SecurityTabContent />
            </TabsContent>

            <TabsContent value="general">
            <GeneralSettingsTabContent
                fixing={fixing}
                setFixing={setFixing}
                saveSettings={saveSettings}
            />
            </TabsContent>
        </div>

      </Tabs>
    </div>
  );
}