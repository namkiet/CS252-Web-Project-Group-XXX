import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { User } from "@/services/auth.service";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { saveProfile, updateSocialAccount, type SocialAccountStatus } from "@/services/profile.service";
import { toast } from "sonner";

interface ProfileTabContentProps {
  user: User | null;
}

export function ProfileTabContent({ user }: ProfileTabContentProps) {
  const { t } = useTranslation();

  const fullName = user?.full_name?.split(" ") || [];
  const [firstName, setFirstName] = useState(fullName.length > 0 ? fullName[0] : "");
  const [lastName, setLastName] = useState(fullName.length > 1 ? fullName.slice(1).join(" ") : "");
  const [nickname] = useState(user?.full_name || "");
  const [socials, setSocials] = useState<SocialAccountStatus[]>([
    { platform: "facebook", connected: false },
    { platform: "instagram", connected: false },
  ]);

  const handleSaveProfile = async () => {
    const payload = {
      first_name: firstName,
      last_name: lastName,
      nickname,
      email: user?.email,
    };
    const res = await saveProfile(payload);
    if (res.success) {
      toast.success(t('profile.details.toast.success'));
    } else {
      toast.error(res.message || t('profile.details.toast.error'));
    }
  };

  const toggleSocial = async (platform: SocialAccountStatus["platform"]) => {
    const current = socials.find(s => s.platform === platform);
    if (!current) return;
    const nextStatus: SocialAccountStatus = { ...current, connected: !current.connected };
    const res = await updateSocialAccount(nextStatus);
    if (res.success) {
      setSocials(prev => prev.map(s => (s.platform === platform ? nextStatus : s)));
      const platformName = platform.charAt(0).toUpperCase() + platform.slice(1);
      toast.success(t(nextStatus.connected ? 'profile.socials.toast_connected' : 'profile.socials.toast_disconnected', { platform: platformName }));
    } else {
      toast.error(res.message || "Failed to update social account");
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Details Card */}
      <Card className="border-orange-100 shadow-sm dark:border-orange-900">
        <CardHeader>
          <CardTitle className="text-orange-700 dark:text-orange-500">{t('profile.details.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstname" className="text-gray-900 dark:text-gray-100">{t('profile.details.first_name')}</Label>
              <Input id="firstname" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder={t('profile.details.first_name')} className="border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastname" className="text-gray-900 dark:text-gray-100">{t('profile.details.last_name')}</Label>
              <Input id="lastname" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder={t('profile.details.last_name')} className="border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-900 dark:text-gray-100">{t('profile.details.email')}</Label>
              <Input id="email" defaultValue={user?.email || ""} disabled className="border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 bg-gray-50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nickname" className="text-gray-900 dark:text-gray-100">{t('profile.details.nickname')}</Label>
              <Input id="nickname" value={nickname} disabled className="border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 bg-gray-50" />
            </div>
          </div>
          
          <div className="mt-8 flex justify-end">
            <Button 
              onClick={handleSaveProfile}
              variant="outline"
              className="w-full sm:w-auto border-orange-500 text-orange-700 hover:bg-orange-50 dark:border-orange-600 dark:text-orange-500 dark:hover:bg-orange-900/20"
            >
              {t('profile.details.save_changes')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Connected Accounts Card */}
      <Card className="border-orange-100 shadow-sm dark:border-orange-900">
        <CardHeader>
          <CardTitle className="text-orange-700 dark:text-orange-500">{t('profile.socials.title')}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          {socials.map((social) => (
            <div key={social.platform} className="flex flex-col sm:flex-row items-start sm:items-center justify-between border border-gray-300 rounded-md p-4 gap-4 dark:border-gray-600 dark:bg-gray-800">
              <div className="space-y-1">
                <p className="font-medium capitalize text-gray-900 dark:text-gray-100">{social.platform}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {social.connected ? t('profile.socials.connected') : t('profile.socials.not_connected')}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => toggleSocial(social.platform)}
                className="w-full sm:w-auto border-gray-300 text-gray-900 hover:bg-orange-50 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-700"
              >
                {social.connected ? t('profile.socials.disconnect') : t('profile.socials.connect')}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}