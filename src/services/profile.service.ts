export type SocialPlatform = "facebook" | "instagram";

export interface ProfileUpdatePayload {
  first_name?: string;
  last_name?: string;
  nickname?: string;
  email?: string;
}

export interface ProfileResponse {
  success: boolean;
  message?: string;
  data?: unknown;
}

export async function saveProfile(payload: ProfileUpdatePayload): Promise<ProfileResponse> {
  try {
    // TODO: plug real endpoint
    // const res = await fetch("/api/profile", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    // const data = await res.json();
    return { success: true, data: payload };
  } catch (error) {
    return { success: false, message: "Failed to save profile" };
  }
}

export interface UploadAvatarResponse {
  success: boolean;
  url?: string;
  message?: string;
}

export async function uploadAvatar(file: File): Promise<UploadAvatarResponse> {
  try {
    // const form = new FormData();
    // form.append("avatar", file);
    // const res = await fetch("/api/profile/avatar", { method: "POST", body: form });
    // const data = await res.json();
    return { success: true, url: URL.createObjectURL(file) };
  } catch (error) {
    return { success: false, message: "Failed to upload avatar" };
  }
}

export interface SocialAccountStatus {
  platform: SocialPlatform;
  connected: boolean;
  handle?: string;
}

export async function updateSocialAccount(status: SocialAccountStatus): Promise<ProfileResponse> {
  try {
    // const res = await fetch(`/api/profile/social/${status.platform}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(status) });
    // const data = await res.json();
    return { success: true, data: { ...status } };
  } catch (error) {
    return { success: false, message: "Failed to update social account" };
  }
}

export interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
}

export async function changePassword(payload: ChangePasswordPayload): Promise<ProfileResponse> {
  try {
    // const res = await fetch("/api/profile/change-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    // const data = await res.json();
    return { success: false, message: "Current password is incorrect", data: payload };
  } catch (error) {
    return { success: false, message: "Current password is incorrect" };
  }
}
