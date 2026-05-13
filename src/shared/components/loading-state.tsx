import { Skeleton } from "@/shared/components/ui/skeleton";

type LoadingStateProps = {
  label?: string;
};

export function LoadingState({ label = "Loading" }: LoadingStateProps) {
  return (
    <div aria-busy="true" aria-label={label} className="space-y-3">
      <Skeleton className="h-5 w-40" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-5 w-2/3" />
    </div>
  );
}
