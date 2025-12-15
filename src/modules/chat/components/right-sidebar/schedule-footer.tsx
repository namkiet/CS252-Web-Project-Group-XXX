import { Button } from "@/shared/components/ui/button";
import { PlusCircle, CalendarPlus } from "lucide-react";

interface ScheduleFooterProps {
  AddDay: () => void;
  AddInDay: () => void;
}

export function ScheduleFooter ({
  AddDay ,
  AddInDay,
}: ScheduleFooterProps) {
  return (
    <div className="p-4 border-t border-zinc-200 bg-white">
      <div className="flex justify-between gap-2">
        <Button 
          variant="outline" 
          className="flex-1 border-orange-200 text-orange-700 hover:bg-orange-50 hover:text-orange-800 transition-colors"
          onClick={AddDay}
        >
          <CalendarPlus className="w-4 h-4 mr-2" />
          Add Day
        </Button>
        <Button 
          variant="outline" 
          className="flex-1 bg-orange-500 hover:bg-orange-600 text-white shadow-sm"
          onClick={AddInDay}
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Add Meal
        </Button>
      </div>
    </div>
  );
};
