import Link from "next/link";

import { DashboardCard } from "@/modules/dashboard/components/dashboard-card";
import type { DashboardDto } from "@/modules/dashboard/dashboard.dto";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { routes } from "@/shared/constants/routes";

type LatestAnalysisCardProps = {
  latestAnalysis: DashboardDto["latestRoutineAnalysis"];
};

const riskLabels = {
  low: "Thấp",
  medium: "Trung bình",
  high: "Cao",
};

export function LatestAnalysisCard({
  latestAnalysis,
}: LatestAnalysisCardProps) {
  if (!latestAnalysis.exists) {
    return (
      <DashboardCard
        testId="dashboard-latest-analysis-card"
        title="Phân tích an toàn gần nhất"
      >
        <div className="space-y-4">
          <p className="text-sm leading-6 text-stone-600">
            Bạn chưa phân tích routine nào. Hãy mở trang routine để chạy phân
            tích an toàn cơ bản.
          </p>
          <Button asChild size="sm" variant="outline">
            <Link href={routes.ROUTINES}>Phân tích routine</Link>
          </Button>
        </div>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard
      action={<Badge variant="outline">{riskLabels[latestAnalysis.riskLevel]}</Badge>}
      testId="dashboard-latest-analysis-card"
      title="Phân tích an toàn gần nhất"
    >
      <dl className="space-y-3 text-sm">
        <div>
          <dt className="font-medium text-stone-900">Routine</dt>
          <dd className="mt-1 text-stone-600">{latestAnalysis.routineName}</dd>
        </div>
        <div>
          <dt className="font-medium text-stone-900">Mức rủi ro</dt>
          <dd className="mt-1 text-stone-600">
            {riskLabels[latestAnalysis.riskLevel]}
          </dd>
        </div>
        <div>
          <dt className="font-medium text-stone-900">Cảnh báo</dt>
          <dd className="mt-1 text-stone-600">
            {latestAnalysis.warningCount} cảnh báo
          </dd>
        </div>
        <div>
          <dt className="font-medium text-stone-900">Thời điểm</dt>
          <dd className="mt-1 text-stone-600">{latestAnalysis.createdAt}</dd>
        </div>
      </dl>
      <Button asChild className="mt-4" size="sm" variant="outline">
        <Link href={routes.ROUTINES}>Xem routine</Link>
      </Button>
    </DashboardCard>
  );
}
