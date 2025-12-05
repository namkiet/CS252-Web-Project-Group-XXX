
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/shared/components/ui/dropdown-menu";
import { Palette, Globe, Bell, BellOff, ChevronDown, Check, Volume2, VolumeX, Sun, Moon, Monitor } from "lucide-react";
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
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            
            {/* Theme Setting */}
            <div className="space-y-2">
              <Label>Theme</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    <div className="flex items-center space-x-2">
                      <Palette className="h-4 w-4" />
                      {selectedTheme?.icon && <selectedTheme.icon className="h-4 w-4" />}
                      <span>{selectedTheme?.label}</span>
                    </div>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="start">
                  {themes.map((theme) => {
                    const IconComponent = theme.icon;
                    return (
                      <DropdownMenuItem
                        key={theme.value}
                        onClick={() => handleThemeChange(theme.value)}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-2">
                          <IconComponent className="h-4 w-4" />
                          <span>{theme.label}</span>
                        </div>
                        {fixing.theme === theme.value && <Check className="h-4 w-4" />}
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Language Setting */}
            <div className="space-y-2">
              <Label>Language</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4" />
                      <span>{selectedLanguage?.label}</span>
                      <span className="text-muted-foreground text-xs">({selectedLanguage?.nativeLabel})</span>
                    </div>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="start">
                  {languages.map((language) => (
                    <DropdownMenuItem
                      key={language.value}
                      onClick={() => handleLanguageChange(language.value)}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-2">
                        <span>{language.label}</span>
                        <span className="text-muted-foreground text-xs">({language.nativeLabel})</span>
                      </div>
                      {fixing.language === language.value && <Check className="h-4 w-4" />}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Message Notifications */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Message Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications when you get new messages
                </p>
              </div>
              <Button
                variant={fixing.messageNotifications ? "default" : "outline"}
                size="sm"
                onClick={handleNotificationToggle}
                className="min-w-[120px]"
              >
                {fixing.messageNotifications ? (
                  <>
                    <Bell className="mr-2 h-4 w-4" />
                    Enabled
                  </>
                ) : (
                  <>
                    <BellOff className="mr-2 h-4 w-4" />
                    Disabled
                  </>
                )}
              </Button>
            </div>

            {/* Sound Effects */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Sound Effects</Label>
                <p className="text-sm text-muted-foreground">
                  Play sound effects for app interactions
                </p>
              </div>
              <Button
                variant={fixing.soundEffects ? "default" : "outline"}
                size="sm"
                onClick={handleSoundEffectsToggle}
                className="min-w-[120px]"
              >
                {fixing.soundEffects ? (
                  <>
                    <Volume2 className="mr-2 h-4 w-4" />
                    Enabled
                  </>
                ) : (
                  <>
                    <VolumeX className="mr-2 h-4 w-4" />
                    Disabled
                  </>
                )}
              </Button>
            </div>

          </div>

          <div className="mt-6 flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.02]"
            >
              Reset
            </Button>
            <Button
              onClick={saveSettings}
              className="transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.02]"
            >
              Save Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}