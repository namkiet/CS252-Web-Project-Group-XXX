import { Button } from "@/shared/components/ui/button";
import { Bell } from "lucide-react";
import {
  Card,
  CardContent,
} from "@/shared/components/ui/card";

export function NotificationsTabContent() {
  return (
    <Card className="border-orange-100 shadow-sm dark:border-orange-900">
      <CardContent className="grid gap-6">
        {[
          "Email notifications",
          "Push notifications",
          "Monthly newsletter",
          "Security alerts",
        ].map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div>
              <p className="font-medium text-orange-700 dark:text-orange-500">{item}</p>
              <p className="text-sm text-muted-foreground dark:text-gray-400">
                Receive notifications about account activity
              </p>
            </div>
            <Button
              variant="outline"
              className="flex items-center gap-2 border-gray-300 text-gray-900 hover:bg-orange-50 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-700"
            >
              <Bell className=" h-4 w-4 text-orange-500" />
              Configure
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}