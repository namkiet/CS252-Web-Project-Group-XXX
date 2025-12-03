import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

export function NotificationsTabContent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        {[
          "Email notifications",
          "Push notifications",
          "Monthly newsletter",
          "Security alerts",
        ].map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div>
              <p className="font-medium">{item}</p>
              <p className="text-sm text-muted-foreground">
                Receive notifications about account activity
              </p>
            </div>
            <Button variant="outline">Configure</Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}