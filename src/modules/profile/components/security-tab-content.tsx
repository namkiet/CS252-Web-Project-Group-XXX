import { Fingerprint } from "lucide-react";
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
          <CardTitle className="text-orange-700 dark:text-orange-500 text-lg md:text-xl">Security Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Item 1 */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray-100 last:border-0 last:pb-0">
            <div>
              <p className="font-medium text-gray-900 dark:text-orange-500 mb-1">Two-Factor Authentication</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Add an extra layer of security to your account
              </p>
            </div>
            <Button variant="outline" className="w-full sm:w-auto border-gray-300 text-gray-900 hover:bg-orange-50">
              <Fingerprint className="mr-2 h-4 w-4 text-orange-500" /> Enable
            </Button>
          </div>

          {/* Item 2 */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="font-medium text-gray-900 dark:text-orange-500 mb-1">Password</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Last changed 3 months ago
              </p>
            </div>
            <Button variant="outline" className="w-full sm:w-auto border-gray-300 text-gray-900 hover:bg-orange-50">
              Change
            </Button>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}