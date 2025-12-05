import { useState, useRef } from "react";
import type { User } from "@/services/auth.service";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import { Loader2, Upload } from "lucide-react";
import { toast } from "sonner"; 
import { uploadAvatar } from "@/services/profile.service";

interface ProfileHeaderProps {
  user: User | null;
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(
    (user as any)?.avatar_url || (user as any)?.image || undefined
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
        if (res.url) setAvatarUrl(res.url);
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
    <div className="mb-8 flex flex-col md:flex-row items-start md:items-center gap-6">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      <div className="relative h-20 w-20 md:h-24 md:w-24 rounded-full overflow-hidden border-2 border-border">
        <Avatar className="h-full w-full">
          <AvatarImage 
            alt={user?.full_name} 
            src={avatarUrl}
            className="object-cover"
          />
          <AvatarFallback className="text-lg">
            {getInitials(user?.full_name || "")}
          </AvatarFallback>
        </Avatar>
        
        {isUploading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
             <Loader2 className="h-6 w-6 text-white animate-spin" />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div>
          <h1 className="text-2xl font-bold">{user?.full_name || "Account Settings"}</h1>
          <p className="text-muted-foreground">
            {user?.email}
          </p>
        </div>

        <Button 
            variant="outline" 
            size="sm" 
            onClick={handleButtonClick}
            disabled={isUploading}
            className="mt-2"
        >
            {isUploading ? (
                <>Upload...</>
            ) : (
                <>
                    <Upload className="mr-2 h-4 w-4" />
                    Change Avatar
                </>
            )}
        </Button>
      </div>
    </div>
  );
}