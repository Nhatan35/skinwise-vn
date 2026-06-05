import { Skeleton } from "@/shared/components/ui/skeleton";
import { cn } from "@/shared/utils";

type LoadingStateProps = {
  className?: string;
  label?: string;
};

export function LoadingState({
  className,
  label = "Đang tải nội dung...",
}: LoadingStateProps) {
  return (
    <div
      aria-busy="true"
      aria-label={label}
      className={cn("space-y-3", className)}
      role="status"
    >
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <Skeleton className="h-5 w-40" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-5 w-2/3" />
    </div>
  );
}
