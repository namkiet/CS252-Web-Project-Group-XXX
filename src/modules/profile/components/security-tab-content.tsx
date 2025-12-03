import { Fingerprint, Laptop, Smartphone } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

export function SecurityTabContent() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Security Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Two-Factor Authentication</p>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security to your account
              </p>
            </div>
            <Button variant="outline">
              <Fingerprint className="mr-2 h-4 w-4" /> Enable
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Password</p>
              <p className="text-sm text-muted-foreground">
                Last changed 3 months ago
              </p>
            </div>
            <Button variant="outline">Change</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Sessions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-muted p-2">
                <Laptop className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">MacBook Pro</p>
                  <Badge variant="secondary" className="text-xs font-normal">
                    Current
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  San Francisco, CA • Active now
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-muted p-2">
                <Smartphone className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">iPhone 12</p>
                <p className="text-sm text-muted-foreground">
                  New York, NY • 2 days ago
                </p>
              </div>
            </div>
            <Button variant="outline">Revoke</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}