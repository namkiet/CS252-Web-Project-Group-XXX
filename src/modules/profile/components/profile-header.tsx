import { useState, useRef } from "react";
import type { User } from "@/services/auth.service";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/shared/components/ui/button";
import { Loader2, Upload } from "lucide-react";
import { toast } from "sonner"; 
import { uploadAvatar } from "@/services/profile.service";

interface ProfileHeaderProps {
  user: User | null;
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  const { updateUser } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(
    user?.avatar_url
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getInitials = (name: string) => {
    return name
      ? name.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2)
      : "JD";
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file.");
        return;
    }
    if (file.size > 2 * 1024 * 1024) { 
        toast.error("Image size should be less than 2MB.");
        return;
    }

    try {
      setIsUploading(true);
      const res = await uploadAvatar(file);
      if (res.success) {
        if (res.url) {
          setAvatarUrl(res.url);
          updateUser({ avatar_url: res.url });
        }
        toast.success("Avatar updated successfully!");
      } else {
        toast.error(res.message || "Failed to update avatar.");
      }
    } catch (error) {
       console.error(error);
       toast.error("Failed to update avatar.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    // Mobile: flex-col center, Desktop: flex-row start
    <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Avatar Container */}
      <div className="relative group cursor-pointer" onClick={handleButtonClick}>
        <div className="relative h-24 w-24 md:h-28 md:w-28 rounded-full overflow-hidden border-4 border-white shadow-lg ring-2 ring-orange-100 transition-all group-hover:ring-orange-300">
          <div className="h-full w-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold">
            {avatarUrl ? (
              <img src={avatarUrl} alt={user?.full_name} className="h-full w-full object-cover" />
            ) : (
              <span className="text-3xl">{getInitials(user?.full_name || "")}</span>
            )}
          </div>
          
          {/* Hover/Uploading Overlay */}
          <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-200 ${isUploading ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
            {isUploading ? (
              <Loader2 className="h-8 w-8 text-white animate-spin" />
            ) : (
              <Upload className="h-8 w-8 text-white" />
            )}
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="space-y-1 text-center md:text-left pt-1">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            {user?.full_name || "Guest User"}
          </h1>
          <p className="text-muted-foreground dark:text-gray-400 text-sm md:text-base">
            {user?.email}
          </p>
        </div>

        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleButtonClick}
          disabled={isUploading}
          className="mt-3 border-orange-200 text-orange-700 hover:bg-orange-50 hover:text-orange-800 dark:border-orange-800 dark:text-orange-400"
        >
          {isUploading ? (
              <>Uploading...</>
          ) : (
              <>Change Avatar</>
          )}
        </Button>
      </div>
    </div>
  );
}