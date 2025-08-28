import { cn } from "@/lib/utils";

interface ProgressBarProps {
  current: number;
  total: number;
  className?: string;
}

export const ProgressBar = ({ current, total, className }: ProgressBarProps) => {
  const percentage = (current / total) * 100;

  return (
    <div className={cn("w-full", className)}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-foreground">
          Progress
        </span>
        <span className="text-sm text-muted-foreground">
          {current} / {total}
        </span>
      </div>
      
      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
        <div
          className="h-full gradient-primary rounded-full transition-smooth"
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      <div className="flex justify-between mt-2">
        {Array.from({ length: total }, (_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-smooth ${
              index < current 
                ? 'bg-primary' 
                : index === current 
                ? 'bg-secondary' 
                : 'bg-muted'
            }`}
          />
        ))}
      </div>
    </div>
  );
};