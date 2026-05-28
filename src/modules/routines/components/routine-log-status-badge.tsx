"use client";

import type { RoutineLogStatus } from "@/modules/routine-logs/routine-log.types";
import { getRoutineLogStatusLabel } from "@/modules/routine-logs/routine-log.client";
import { Badge } from "@/shared/components/ui/badge";

type RoutineLogStatusBadgeProps = {
  hasLog: boolean;
  status?: RoutineLogStatus;
  testId?: string;
};

export function RoutineLogStatusBadge({
  hasLog,
  status,
  testId,
}: RoutineLogStatusBadgeProps) {
  const label = hasLog ? getRoutineLogStatusLabel(status) : "Chưa ghi nhận";
  const variant = !hasLog || status === "partial" ? "outline" : "secondary";

  return (
    <Badge data-testid={testId} variant={variant}>
      {label}
    </Badge>
  );
}
