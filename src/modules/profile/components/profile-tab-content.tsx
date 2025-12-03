import type { User } from "@/services/auth.service";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

interface ProfileTabContentProps {
  user: User | null;
}

export function ProfileTabContent({ user }: ProfileTabContentProps) {
  const fullName = user?.full_name?.split(" ") || [];
  const firstName = fullName.length > 0 ? fullName[0] : "";
  const lastName = fullName.length > 1 ? fullName.slice(1).join(" ") : "";

  return (
    <div className="space-y-6">
      {/* Profile Details Card */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstname">First name</Label>
              <Input id="firstname" defaultValue={firstName} placeholder="First name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastname">Last name</Label>
              <Input id="lastname" defaultValue={lastName} placeholder="Last name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              {/* Readonly for email */}
              <Input id="email" defaultValue={user?.email || ""} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input id="role" defaultValue="User" />
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <Button>Save Changes</Button>
          </div>
        </CardContent>
      </Card>

      {/* Not yet */}
      <Card>
        <CardHeader>
          <CardTitle>Connected Accounts</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
           <div className="text-sm text-muted-foreground">
             Feature updating...
           </div>
        </CardContent>
      </Card>
    </div>
  );
}