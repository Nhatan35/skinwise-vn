import Link from "next/link";

import { getDashboardNextActionDescription } from "@/modules/dashboard/dashboard-next-action-copy";
import type { DashboardDto } from "@/modules/dashboard/dashboard.dto";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";

const priorityLabels = {
  high: "Cần làm trước",
  medium: "Nên làm hôm nay",
  low: "Đang ổn",
};

type PrimaryNextActionCardProps = {
  nextAction: DashboardDto["nextActions"][number];
};

export function PrimaryNextActionCard({
  nextAction,
}: PrimaryNextActionCardProps) {
  return (
    <section className="rounded-3xl border border-border bg-primary p-6 text-primary-foreground shadow-xl shadow-primary/15">
      <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <Badge className="bg-card/15 text-primary-foreground" variant="outline">
            {priorityLabels[nextAction.priority]}
          </Badge>
          <h3 className="mt-4 text-2xl font-semibold tracking-tight">
            {nextAction.label}
          </h3>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-primary-foreground/85">
            <span className="font-semibold text-primary-foreground">
              Vì sao SkinWise gợi ý bước này:
            </span>{" "}
            {getDashboardNextActionDescription(nextAction)}
          </p>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-primary-foreground/80">
            Gợi ý này chỉ dựa trên trạng thái hồ sơ, sản phẩm đã lưu, routine,
            log và journal trong tài khoản của bạn.
          </p>
        </div>
        <Button asChild className="bg-card text-primary hover:bg-card/90" size="lg">
          <Link href={nextAction.href}>{nextAction.label}</Link>
        </Button>
      </div>
    </section>
  );
}
