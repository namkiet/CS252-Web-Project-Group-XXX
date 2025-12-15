import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/shared/components/ui/dropdown-menu";
import { Globe, Bell, BellOff, ChevronDown, Check, Volume2, VolumeX, Sun, Moon, Monitor } from "lucide-react";
import type { GeneralSettings } from "../types";

interface GeneralSettingsTabContentProps {
  fixing: GeneralSettings;
  setFixing: (settings: Partial<GeneralSettings>) => void;
  saveSettings: () => void;
}

export function GeneralSettingsTabContent({ fixing, setFixing, saveSettings }: GeneralSettingsTabContentProps) {

  const themes = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ] as const;

  const languages = [
    { value: "en", label: "English", nativeLabel: "English" },
    { value: "vi", label: "Vietnamese", nativeLabel: "Tiếng Việt" },
    { value: "fr", label: "French", nativeLabel: "Français" },
    { value: "es", label: "Spanish", nativeLabel: "Español" },
  ] as const;

  const handleThemeChange = (theme: GeneralSettings["theme"]) => {
    setFixing({ theme });
  };

  const handleLanguageChange = (language: GeneralSettings["language"]) => {
    setFixing({ language });
  };

  const handleNotificationToggle = () => {
    setFixing({ messageNotifications: !fixing.messageNotifications });
  };

  const handleSoundEffectsToggle = () => {
    setFixing({ soundEffects: !fixing.soundEffects });
  };

  const selectedTheme = themes.find(t => t.value === fixing.theme);
  const selectedLanguage = languages.find(l => l.value === fixing.language);

  return (
    <div className="space-y-6">
      <Card className="border-orange-100 shadow-sm dark:border-orange-900">
        <CardHeader>
          <CardTitle className="text-orange-700 dark:text-orange-500 text-lg md:text-xl">General Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6 md:space-y-8">
            
            {/* Theme Setting */}
            <div className="space-y-3 md:space-y-2">
              <Label className="text-base md:text-sm text-gray-900 dark:text-gray-100 font-medium">Theme Preference</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between border-gray-300 bg-white text-gray-900 shadow-none hover:bg-orange-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 h-11 md:h-10">
                    <div className="flex items-center space-x-2">
                      {selectedTheme?.icon && <selectedTheme.icon className="h-4 w-4 text-orange-500" />}
                      <span>{selectedTheme?.label}</span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] min-w-[200px] border-orange-100 dark:border-orange-900 dark:bg-gray-800" align="start">
                  {themes.map((theme) => {
                    const IconComponent = theme.icon;
                    return (
                      <DropdownMenuItem
                        key={theme.value}
                        onClick={() => handleThemeChange(theme.value)}
                        className="flex items-center justify-between cursor-pointer focus:bg-orange-50 dark:focus:bg-gray-700"
                      >
                        <div className="flex items-center space-x-2">
                          <IconComponent className="h-4 w-4 text-orange-500" />
                          <span>{theme.label}</span>
                        </div>
                        {fixing.theme === theme.value && <Check className="h-4 w-4 text-orange-500" />}
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Language Setting */}
            <div className="space-y-3 md:space-y-2">
              <Label className="text-base md:text-sm text-gray-900 dark:text-gray-100 font-medium">Language</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between border-gray-300 bg-white text-gray-900 shadow-none hover:bg-orange-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 h-11 md:h-10">
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4 text-orange-500" />
                      <span>{selectedLanguage?.label}</span>
                      <span className="text-muted-foreground text-xs dark:text-gray-400 hidden sm:inline">({selectedLanguage?.nativeLabel})</span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] min-w-[200px] border-orange-100 dark:border-orange-900 dark:bg-gray-800" align="start">
                  {languages.map((language) => (
                    <DropdownMenuItem
                      key={language.value}
                      onClick={() => handleLanguageChange(language.value)}
                      className="flex items-center justify-between cursor-pointer focus:bg-orange-50 dark:focus:bg-gray-700"
                    >
                      <div className="flex items-center space-x-2">
                        <span>{language.label}</span>
                        <span className="text-muted-foreground text-xs dark:text-gray-400">({language.nativeLabel})</span>
                      </div>
                      {fixing.language === language.value && <Check className="h-4 w-4 text-orange-500" />}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Notifications Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 border-t border-gray-100 md:border-none pt-4 md:pt-0">
              <div className="space-y-1">
                <Label className="text-base md:text-sm text-gray-900 dark:text-gray-100 font-medium">Message Notifications</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  Receive notifications when you get new messages
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNotificationToggle}
                className={`w-full sm:w-[160px] h-10 border-gray-300 ${fixing.messageNotifications ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-white text-gray-600'}`}
              >
                {fixing.messageNotifications ? (
                  <>
                    <Bell className="mr-2 h-4 w-4 text-orange-500" /> Enabled
                  </>
                ) : (
                  <>
                    <BellOff className="mr-2 h-4 w-4 text-gray-400" /> Disabled
                  </>
                )}
              </Button>
            </div>

            {/* Sound Effects Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 border-t border-gray-100 md:border-none pt-4 md:pt-0">
              <div className="space-y-1">
                <Label className="text-base md:text-sm text-gray-900 dark:text-gray-100 font-medium">Sound Effects</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  Play sound effects for app interactions
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSoundEffectsToggle}
                className={`w-full sm:w-[160px] h-10 border-gray-300 ${fixing.soundEffects ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-white text-gray-600'}`}
              >
                {fixing.soundEffects ? (
                  <>
                    <Volume2 className="mr-2 h-4 w-4 text-orange-500" /> Enabled
                  </>
                ) : (
                  <>
                    <VolumeX className="mr-2 h-4 w-4 text-gray-400" /> Disabled
                  </>
                )}
              </Button>
            </div>

          </div>

          <div className="mt-8 flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-gray-100">
            <Button
              variant="ghost"
              onClick={() => window.location.reload()}
              className="w-full sm:w-auto text-gray-500 hover:text-gray-900 hover:bg-gray-100"
            >
              Reset to Defaults
            </Button>
            <Button
              variant="default"
              onClick={saveSettings}
              className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white shadow-sm"
            >
              Save Preferences
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}