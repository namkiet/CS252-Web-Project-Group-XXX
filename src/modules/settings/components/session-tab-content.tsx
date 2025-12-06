import { useEffect, useState } from "react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import { Clock, Info } from "lucide-react";

export function SessionTabContent() {
  const [lastActivity, setLastActivity] = useState(new Date().toLocaleString());
  const autoLogoutTime = "1 hour";

  useEffect(() => {
    const interval = setInterval(() => {
      setLastActivity(new Date().toLocaleString());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <Card className="border-orange-100 shadow-sm">
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="auto-logout" className=" text-orange-700">Auto Logout Time</Label>
              <div className="flex items-center space-x-3">
                <Input
                  id="auto-logout"
                  value={autoLogoutTime}
                  disabled
                  className="max-w-[200px] border-gray-300 bg-white text-gray-900"
                />
                <Badge variant="secondary" className="flex items-center border border-orange-200 bg-orange-50 text-orange-700">
                  <Clock className="mr-1 h-3 w-3 text-orange-500" />
                  Fixed
                </Badge>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-900">
                <Info className="h-4 w-4 " />
                <p>Auto logout time is currently fixed at 1 hour for security purposes</p>
              </div>
            </div>

            <div className="border-t pt-6">
              <div className="space-y-4">
                <Label className="text-orange-700">Session Information</Label>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-orange-700">Last Activity</Label>
                    <p className="text-sm text-gray-600">{lastActivity}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-orange-700">Session Status</Label>
                    <Badge variant="default" className="w-fit border border-orange-200 bg-orange-50 text-orange-700">
                      Active
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <div className="space-y-4">
                <Label className="text-orange-700">Session Security</Label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Automatic logout after inactivity</span>
                    <Badge variant="outline" className="border-orange-300 text-orange-700">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Session timeout warning</span>
                    <Badge variant="outline" className="border-orange-300 text-orange-700">5 minutes before</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Remember login session</span>
                    <Badge variant="outline" className="border-orange-300 text-orange-700">Disabled</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}