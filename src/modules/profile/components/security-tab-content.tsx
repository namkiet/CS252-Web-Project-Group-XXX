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
      <Card className="border-orange-100 shadow-sm dark:border-orange-900">
        <CardHeader>
          <CardTitle className="text-orange-700 dark:text-orange-500">Security Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-orange-700 dark:text-orange-500">Two-Factor Authentication</p>
              <p className="text-sm text-muted-foreground dark:text-gray-400">
                Add an extra layer of security to your account
              </p>
            </div>
            <Button variant="outline" className="border-gray-300 text-gray-900 hover:bg-orange-50 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-700">
              <Fingerprint className="mr-2 h-4 w-4 text-orange-500" /> Enable
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-orange-700 dark:text-orange-500">Password</p>
              <p className="text-sm text-muted-foreground dark:text-gray-400">
                Last changed 3 months ago
              </p>
            </div>
            <Button variant="outline" className="border-gray-300 text-gray-900 hover:bg-orange-50 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-700">Change</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-orange-100 shadow-sm dark:border-orange-900">
        <CardHeader>
          <CardTitle className="text-orange-700 dark:text-orange-500">Active Sessions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-muted p-2 dark:bg-gray-700">
                <Laptop className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-gray-900 dark:text-gray-100">MacBook Pro</p>
                  <Badge variant="secondary" className="text-xs font-normal border border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-900/30 dark:text-orange-500">
                    Current
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground dark:text-gray-400">
                  San Francisco, CA • Active now
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-muted p-2 dark:bg-gray-700">
                <Smartphone className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">iPhone 12</p>
                <p className="text-sm text-muted-foreground dark:text-gray-400">
                  New York, NY • 2 days ago
                </p>
              </div>
            </div>
            <Button variant="outline" className="border-gray-300 text-gray-900 hover:bg-orange-50 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-700">Revoke</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}