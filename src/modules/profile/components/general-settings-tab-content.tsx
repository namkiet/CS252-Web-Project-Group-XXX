import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/shared/components/ui/dropdown-menu";
import {  Globe, Bell, BellOff, ChevronDown, Check, Volume2, VolumeX, Sun, Moon, Monitor } from "lucide-react";
import type { GeneralSettings } from "../types";

interface GeneralSettingsTabContentProps {
  fixing: GeneralSettings;
  setFixing: (settings: Partial<GeneralSettings>) => void;
  saveSettings: () => void;
}

export function GeneralSettingsTabContent({ fixing, setFixing, saveSettings }: GeneralSettingsTabContentProps) {
  const { t, i18n } = useTranslation();
  const themes = [
    { value: "light", label: t('settings.general.themes.light'), icon: Sun },
    { value: "dark", label: t('settings.general.themes.dark'), icon: Moon },
    { value: "system", label: t('settings.general.themes.system'), icon: Monitor },
  ] as const;

  const languages = [
    { value: "en", label: "English", nativeLabel: "English" },
    { value: "vi", label: "Vietnamese", nativeLabel: "Tiếng Việt" },
  ] as const;

  const handleThemeChange = (theme: GeneralSettings["theme"]) => {
    setFixing({ theme });
  };

  const handleLanguageChange = (language: GeneralSettings["language"]) => {
    setFixing({ language });
    i18n.changeLanguage(language);
  };

  const handleNotificationToggle = () => {
    setFixing({ messageNotifications: !fixing.messageNotifications });
  };

  const handleSoundEffectsToggle = () => {
    setFixing({ soundEffects: !fixing.soundEffects });
  };

  const selectedTheme = themes.find(t => t.value === fixing.theme);
  const selectedLanguage = languages.find(l => l.value === (fixing.language || i18n.language));

  return (
    <div className="space-y-6">
      <Card className="border-orange-100 shadow-sm">
        <CardContent>
          <div className="space-y-6">
            
            {/* Theme Setting */}
            <div className="space-y-2">
              <Label className="text-orange-700">{t('settings.general.theme')}</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between border-gray-300 bg-white text-gray-900 shadow-none hover:bg-orange-50">
                    <div className="flex items-center space-x-2">
                      {selectedTheme?.icon && <selectedTheme.icon className="h-4 w-4 text-orange-500" />}
                      <span>{selectedTheme?.label}</span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-900" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 border-orange-100" align="start">
                  {themes.map((theme) => {
                    const IconComponent = theme.icon;
                    return (
                      <DropdownMenuItem
                        key={theme.value}
                        onClick={() => handleThemeChange(theme.value)}
                        className="flex items-center justify-between data-[highlighted]:bg-orange-50"
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
            <div className="space-y-2">
              <Label className="text-orange-700">{t('settings.general.language')}</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between border-gray-300 bg-white text-gray-900 shadow-none hover:bg-orange-50">
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4 text-orange-500" />
                      <span>{selectedLanguage?.label}</span>
                      <span className="text-muted-foreground text-xs">({selectedLanguage?.nativeLabel})</span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-900" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 border-orange-100" align="start">
                  {languages.map((language) => (
                    <DropdownMenuItem
                      key={language.value}
                      onClick={() => handleLanguageChange(language.value)}
                      className="flex items-center justify-between data-[highlighted]:bg-orange-50"
                    >
                      <div className="flex items-center space-x-2">
                        <span>{language.label}</span>
                        <span className="text-muted-foreground text-xs">({language.nativeLabel})</span>
                      </div>
                      {(fixing.language === language.value || (!fixing.language && i18n.language === language.value)) && (
                        <Check className="h-4 w-4 text-orange-500" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Message Notifications */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-orange-700">{t('settings.general.notifications.title')}</Label>
                <p className="text-sm text-muted-foreground">
                  {t('settings.general.notifications.desc')}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNotificationToggle}
                className="min-w-[140px] border-gray-300 bg-white text-gray-900 hover:bg-orange-50"
              >
                {fixing.messageNotifications ? (
                  <>
                    <Bell className="mr-2 h-4 w-4 text-orange-500" />
                    {t('settings.general.status.enabled')}
                  </>
                ) : (
                  <>
                    <BellOff className="mr-2 h-4 w-4 text-orange-500" />
                    {t('settings.general.status.disabled')}
                  </>
                )}
              </Button>
            </div>

            {/* Sound Effects */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-orange-700">{t('settings.general.sounds.title')}</Label>
                <p className="text-sm text-muted-foreground">
                  {t('settings.general.sounds.desc')}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSoundEffectsToggle}
                className="min-w-[140px] border-gray-300 bg-white text-gray-900 hover:bg-orange-50"
              >
                {fixing.soundEffects ? (
                  <>
                    <Volume2 className="mr-2 h-4 w-4 text-orange-500" />
                    {t('settings.general.status.enabled')}
                  </>
                ) : (
                  <>
                    <VolumeX className="mr-2 h-4 w-4 text-orange-500" />
                    {t('settings.general.status.disabled')}
                  </>
                )}
              </Button>
            </div>

          </div>

          <div className="mt-6 flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="border-orange-300 bg-white text-orange-700 transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.02] hover:bg-orange-50"
            >
              {t('settings.general.reset')}
            </Button>
            <Button
              variant="outline"
              onClick={saveSettings}
              className="border-orange-400 bg-white text-orange-700 transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.02] hover:bg-orange-50"
            >
              {t('settings.general.save')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}