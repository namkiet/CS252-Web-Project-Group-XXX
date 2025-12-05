import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Clock, Info, LogOut } from "lucide-react";

export function SessionTabContent() {
  const [lastActivity, setLastActivity] = useState(new Date().toLocaleString());
  const autoLogoutTime = "1 hour";

  useEffect(() => {
    const interval = setInterval(() => {
      setLastActivity(new Date().toLocaleString());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      window.location.href = "/login";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Session Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="auto-logout">Auto Logout Time</Label>
              <div className="flex items-center space-x-3">
                <Input
                  id="auto-logout"
                  value={autoLogoutTime}
                  disabled
                  className="max-w-[200px]"
                />
                <Badge variant="secondary" className="flex items-center">
                  <Clock className="mr-1 h-3 w-3" />
                  Fixed
                </Badge>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Info className="h-4 w-4" />
                <p>Auto logout time is currently fixed at 1 hour for security purposes</p>
              </div>
            </div>

            <div className="border-t pt-6">
              <div className="space-y-4">
                <Label>Session Information</Label>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Last Activity</Label>
                    <p className="text-sm text-muted-foreground">{lastActivity}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Session Status</Label>
                    <Badge variant="default" className="w-fit">
                      Active
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <div className="space-y-4">
                <Label>Session Security</Label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Automatic logout after inactivity</span>
                    <Badge variant="outline">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Session timeout warning</span>
                    <Badge variant="outline">5 minutes before</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Remember login session</span>
                    <Badge variant="outline">Disabled</Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <Button 
                variant="destructive" 
                onClick={handleLogout}
                className="w-full"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout Now
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}