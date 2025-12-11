import { useState } from "react";
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
      toast.success("Profile saved");
    } else {
      toast.error(res.message || "Failed to save profile");
    }
  };

  const toggleSocial = async (platform: SocialAccountStatus["platform"]) => {
    const current = socials.find(s => s.platform === platform);
    if (!current) return;
    const nextStatus: SocialAccountStatus = { ...current, connected: !current.connected };
    const res = await updateSocialAccount(nextStatus);
    if (res.success) {
      setSocials(prev => prev.map(s => (s.platform === platform ? nextStatus : s)));
      toast.success(`${platform === "facebook" ? "Facebook" : "Instagram"} ${nextStatus.connected ? "connected" : "disconnected"}`);
    } else {
      toast.error(res.message || "Failed to update social account");
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      toast.error("Please fill all password fields");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast.error("New passwords do not match");
      return;
    }

    const res = await changePassword({ current_password: currentPassword, new_password: newPassword });
    const msg = res.message || (res.success ? "Password changed" : "Current password is incorrect");
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
          <CardTitle className="text-orange-700 dark:text-orange-500">Profile Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstname" className="text-gray-900 dark:text-gray-100">First name</Label>
              <Input id="firstname" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First name" className="border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastname" className="text-gray-900 dark:text-gray-100">Last name</Label>
              <Input id="lastname" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last name" className="border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-900 dark:text-gray-100">Email</Label>
              {/* Readonly for email */}
              <Input id="email" defaultValue={user?.email || ""} disabled className="border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nickname" className="text-gray-900 dark:text-gray-100">Nickname</Label>
              <Input id="nickname" value={nickname} disabled className="border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100" />
            </div>
          </div>
          <div className="mt-6 flex flex-col gap-3">
            {showChangePassword && (
              <div className="grid gap-3 md:grid-cols-3">
                <div className="space-y-1">
                  <Label htmlFor="current-password" className="text-gray-900 dark:text-gray-100">Current Password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="new-password" className="text-gray-900 dark:text-gray-100">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="confirm-password" className="text-gray-900 dark:text-gray-100">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                  />
                </div>

                {changePwdResult && (
                  <div className="md:col-span-3 text-sm text-muted-foreground dark:text-gray-400">
                    {changePwdResult}
                  </div>
                )}

                <div className="md:col-span-3 flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowChangePassword(false);
                      resetPasswordFields();
                    }}
                    className="border-gray-300 text-gray-900 hover:bg-orange-50 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleChangePassword}
                    variant="outline"
                    className="border-orange-500 text-orange-700 hover:bg-orange-50 dark:border-orange-600 dark:text-orange-500 dark:hover:bg-orange-900/20"
                  >
                    OK{changePwdResult ? ` – ${changePwdResult}` : ""}
                  </Button>
                </div>
              </div>
            )}

            <div className="flex justify-between gap-3">
              <Button 
                variant="outline" 
                onClick={() => setShowChangePassword((v) => !v)}
                className="border-orange-500 text-orange-700 hover:bg-orange-50 dark:border-orange-600 dark:text-orange-500 dark:hover:bg-orange-900/20"
              >
                {showChangePassword ? "Hide Change Password" : "Change Password"}
              </Button>
              <Button 
                onClick={handleSaveProfile}
                variant="outline"
                className="border-orange-500 text-orange-700 hover:bg-orange-50 dark:border-orange-600 dark:text-orange-500 dark:hover:bg-orange-900/20"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Not yet */}
      <Card className="border-orange-100 shadow-sm dark:border-orange-900">
        <CardHeader>
          <CardTitle className="text-orange-700 dark:text-orange-500">Connected Accounts</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          {socials.map((social) => (
            <div key={social.platform} className="flex items-center justify-between border border-gray-300 rounded-md p-4 dark:border-gray-600 dark:bg-gray-800">
              <div className="space-y-1">
                <p className="font-medium capitalize text-gray-900 dark:text-gray-100">{social.platform}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {social.connected ? "Connected" : "Not connected"}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => toggleSocial(social.platform)}
                className={social.connected ? "border-gray-300 text-gray-900 hover:bg-orange-50 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-700" : "border-gray-300 text-gray-900 hover:bg-orange-50 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-700"}
              >
                {social.connected ? "Disconnect" : "Connect"}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}