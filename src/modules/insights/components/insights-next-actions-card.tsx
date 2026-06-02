import Link from "next/link";

import type { InsightsDto } from "@/modules/insights/insights.dto";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

type InsightsNextActionsCardProps = {
  nextActions: InsightsDto["nextActions"];
};

const priorityLabels: Record<InsightsDto["nextActions"][number]["priority"], string> = {
  high: "Ưu tiên",
  medium: "Nên làm",
  low: "Bổ sung",
};

export function InsightsNextActionsCard({
  nextActions,
}: InsightsNextActionsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gợi ý tiếp theo</CardTitle>
        <CardDescription>
          Các bước thực tế để dữ liệu theo dõi đầy đủ hơn, dựa trên trạng thái
          routine log và nhật ký hiện tại.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {nextActions.length > 0 ? (
          <ul className="space-y-3">
            {nextActions.map((action) => (
              <li
                className="rounded-2xl border border-border/70 bg-secondary/40 p-4"
                key={`${action.href}-${action.label}`}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-foreground">{action.label}</h3>
                      <Badge variant="outline">{priorityLabels[action.priority]}</Badge>
                    </div>
                    {action.description ? (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {action.description}
                      </p>
                    ) : null}
                  </div>
                  <Button asChild size="sm" variant="outline">
                    <Link href={action.href}>Mở</Link>
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            Bạn đã có dữ liệu routine và nhật ký cho cuối giai đoạn này. Có thể
            tiếp tục theo dõi thêm vài ngày để xem mẫu hoạt động rõ hơn.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
