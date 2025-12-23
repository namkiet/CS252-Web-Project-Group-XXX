import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { User } from "@/services/auth.service";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { saveProfile, updateSocialAccount, changePassword, type SocialAccountStatus } from "@/services/profile.service";
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
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [changePwdResult, setChangePwdResult] = useState<string | null>(null);

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

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      toast.error(t('profile.password.toast.fill_all'));
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast.error(t('profile.password.toast.mismatch'));
      return;
    }

    const res = await changePassword({ current_password: currentPassword, new_password: newPassword });
    const msg = res.success ? t('profile.password.toast.success') : t('profile.password.toast.error');
    setChangePwdResult(msg);
    toast[res.success ? "success" : "error"](msg);
  };

  const resetPasswordFields = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setChangePwdResult(null);
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
              <Input id="lastname" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder={t('profile.details.first_name')} className="border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-900 dark:text-gray-100">{t('profile.details.email')}</Label>
              {/* Readonly for email */}
              <Input id="email" defaultValue={user?.email || ""} disabled className="border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 bg-gray-50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nickname" className="text-gray-900 dark:text-gray-100">{t('profile.details.nickname')}</Label>
              <Input id="nickname" value={nickname} disabled className="border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 bg-gray-50" />
            </div>
          </div>
          
          <div className="mt-8 flex flex-col gap-4">
            {showChangePassword && (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 dark:bg-gray-800/50 dark:border-gray-700">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-1">
                  <Label htmlFor="current-password" className="text-gray-900 dark:text-gray-100">{t('profile.password.current')}</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="bg-white border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                  />
                  </div>
                  <div className="space-y-1">
                  <Label htmlFor="new-password" className="text-gray-900 dark:text-gray-100">{t('profile.password.new')}</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="bg-white border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                  />
                  </div>
                  <div className="space-y-1">
                  <Label htmlFor="confirm-password" className="text-gray-900 dark:text-gray-100">{t('profile.password.confirm')}</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="bg-white border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                  />
                  </div>

                  {changePwdResult && (
                  <div className="md:col-span-3 text-sm text-muted-foreground dark:text-gray-400">
                    {changePwdResult}
                  </div>
                  )}

                  <div className="md:col-span-3 flex justify-end gap-2 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                    setShowChangePassword(false);
                    resetPasswordFields();
                    }}
                    className="border-gray-300 text-gray-900 hover:bg-orange-50 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-700"
                  >
                    {t('profile.password.cancel')}
                  </Button>
                  <Button 
                    onClick={handleChangePassword}
                    variant="outline"
                    className="bg-orange-600 text-white border-orange-600 hover:bg-orange-700 hover:text-white"
                  >
                    {t('profile.password.ok')}{changePwdResult ? ` – ${changePwdResult}` : ""}
                  </Button>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row justify-between gap-3">
              <Button 
                variant="outline" 
                onClick={() => setShowChangePassword((v) => !v)}
                className="w-full sm:w-auto border-orange-500 text-orange-700 hover:bg-orange-50 dark:border-orange-600 dark:text-orange-500 dark:hover:bg-orange-900/20"
              >
                {showChangePassword ? t('profile.details.hide_pwd') : t('profile.details.change_pwd')}
              </Button>
              <Button 
                onClick={handleSaveProfile}
                variant="outline"
                className="w-full sm:w-auto border-orange-500 text-orange-700 hover:bg-orange-50 dark:border-orange-600 dark:text-orange-500 dark:hover:bg-orange-900/20"
              >
                {t('profile.details.save_changes')}
              </Button>
            </div>
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
                className={`w-full sm:w-auto ${social.connected ? "border-gray-300 text-gray-900 hover:bg-orange-50 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-700" : "border-gray-300 text-gray-900 hover:bg-orange-50 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-700"}`}
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