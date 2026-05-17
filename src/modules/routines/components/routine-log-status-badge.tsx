"use client";

import type { RoutineLogStatus } from "@/modules/routine-logs/routine-log.types";
import { getRoutineLogStatusLabel } from "@/modules/routine-logs/routine-log.client";
import { Badge } from "@/shared/components/ui/badge";

type RoutineLogStatusBadgeProps = {
  hasLog: boolean;
  status?: RoutineLogStatus;
};

export function RoutineLogStatusBadge({
  hasLog,
  status,
}: RoutineLogStatusBadgeProps) {
  const label = hasLog ? getRoutineLogStatusLabel(status) : "Chưa ghi nhận";
  const variant = !hasLog || status === "partial" ? "outline" : "secondary";

  return <Badge variant={variant}>{label}</Badge>;
}
