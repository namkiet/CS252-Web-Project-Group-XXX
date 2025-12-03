import { Button } from "@/shared/components/ui/button";

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
          className="flex-1"
          onClick={AddDay}
        >
          Add Day
        </Button>
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={AddInDay}
        >
          Add Meal
        </Button>
      </div>
    </div>
  );
};

