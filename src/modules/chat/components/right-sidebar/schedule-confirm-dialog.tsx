import { useTranslation } from 'react-i18next';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Badge } from "@/shared/components/ui/badge";
import { Utensils } from "lucide-react";

interface ScheduleConfirmDialogProps {
  pendingSchedule: any;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ScheduleConfirmDialog({ 
  pendingSchedule, 
  onConfirm, 
  onCancel 
}: ScheduleConfirmDialogProps) {
  const { t } = useTranslation();

  if (!pendingSchedule) return null;

  const days = Array.isArray(pendingSchedule) 
    ? pendingSchedule 
    : (pendingSchedule.schedule || []);

  return (
    <AlertDialog open={!!pendingSchedule} onOpenChange={(open) => !open && onCancel()}>
      <AlertDialogContent className="max-w-md bg-white border-orange-100">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-orange-600">
            <Utensils className="h-5 w-5" />
            {t('chat.schedule_dialog.title')}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600">
            {t('chat.schedule_dialog.description')}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="my-4">
          <p className="text-xs font-semibold text-gray-400 uppercase mb-2 tracking-wider">
            {t('chat.schedule_dialog.preview_title')}
          </p>
          <ScrollArea className="h-[200px] w-full rounded-md border border-orange-50 bg-orange-50/30 p-3">
            <div className="space-y-4">
              {days.map((dayItem: any, idx: number) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-200">
                      {t('chat.schedule_dialog.day_label', { day: dayItem.day || idx + 1 })}
                    </Badge>
                  </div>
                  <ul className="space-y-1.5 ml-1 border-l-2 border-orange-200 pl-3">
                    {dayItem['dish-list']?.map((dish: any, dishIdx: number) => (
                      <li key={dishIdx} className="text-sm">
                        <span className="font-medium text-gray-800">{dish.restaurant_name}</span>
                        {dish.dish_name && (
                          <span className="text-gray-500 text-xs block italic">
                             — {dish.dish_name}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel 
            onClick={onCancel}
            className="border-gray-200 hover:bg-gray-100"
          >
            {t('chat.schedule_dialog.cancel')}
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className="bg-orange-500 hover:bg-orange-600 text-white shadow-orange-200 shadow-lg"
          >
            {t('chat.schedule_dialog.confirm')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}