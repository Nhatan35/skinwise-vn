import Link from "next/link";

import { DashboardCard } from "@/modules/dashboard/components/dashboard-card";
import type { DashboardDto } from "@/modules/dashboard/dashboard.dto";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { routes } from "@/shared/constants/routes";

type LatestJournalCardProps = {
  latestJournal: DashboardDto["latestJournal"];
};

const symptomLabels = {
  dryness: "Khô căng",
  oiliness: "Dầu thừa",
  redness: "Đỏ da",
  stinging: "Châm chích",
  new_breakouts: "Mụn mới",
  itchiness: "Ngứa",
  other: "Khác",
};

const stressLevelLabels = {
  low: "Stress thấp",
  medium: "Stress trung bình",
  high: "Stress cao",
};

export function LatestJournalCard({ latestJournal }: LatestJournalCardProps) {
  if (!latestJournal.exists) {
    return (
      <DashboardCard
        testId="dashboard-latest-journal-card"
        title="Nhật ký da gần nhất"
      >
        <div className="space-y-4" data-legacy-label="Latest Journal Entry">
          <p className="text-sm leading-6 text-muted-foreground">
            Bạn chưa có nhật ký da. Thêm một ghi chú ngắn cho hôm nay để hoàn
            thiện bối cảnh theo dõi skincare.
          </p>
          <Button asChild aria-label="Add today&apos;s journal" size="sm">
            <Link href={routes.JOURNAL}>Thêm nhật ký hôm nay</Link>
          </Button>
        </div>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard
      action={<Badge variant="secondary">{latestJournal.localDate}</Badge>}
      testId="dashboard-latest-journal-card"
      title="Nhật ký da gần nhất"
    >
      <div className="space-y-4" data-legacy-label="Latest Journal Entry">
        <dl className="space-y-3 text-sm">
          <div>
            <dt className="font-semibold text-foreground" data-legacy-label="Entry date">
              Ngày ghi nhận
            </dt>
            <dd className="mt-1 text-muted-foreground">{latestJournal.localDate}</dd>
          </div>

          <div>
            <dt className="font-semibold text-foreground" data-legacy-label="Observations">
              Quan sát
            </dt>
            <dd className="mt-1 text-muted-foreground">
              {latestJournal.observations.length > 0
                ? latestJournal.observations.join(", ")
                : "Chưa có quan sát."}
            </dd>
          </div>

          <div>
            <dt className="font-semibold text-foreground" data-legacy-label="Symptoms">
              Triệu chứng
            </dt>
            <dd className="mt-1 text-muted-foreground">
              {latestJournal.symptoms.length > 0
                ? latestJournal.symptoms
                    .map((symptom) => symptomLabels[symptom])
                    .join(", ")
                : "Chưa có triệu chứng."}
            </dd>
          </div>

          {latestJournal.stressLevel ? (
            <div>
              <dt className="font-semibold text-foreground" data-legacy-label="Stress level">
                Mức stress
              </dt>
              <dd className="mt-1 text-muted-foreground">
                {stressLevelLabels[latestJournal.stressLevel]}
              </dd>
            </div>
          ) : null}

          {latestJournal.notesPreview ? (
            <div>
              <dt className="font-semibold text-foreground" data-legacy-label="Notes">
                Ghi chú
              </dt>
              <dd className="mt-1 text-muted-foreground">
                {latestJournal.notesPreview}
              </dd>
            </div>
          ) : null}

          <div>
            <dt className="font-semibold text-foreground" data-legacy-label="Products used">
              Sản phẩm đã dùng
            </dt>
            <dd className="mt-1 text-muted-foreground">
              {latestJournal.productsUsedCount} sản phẩm
            </dd>
          </div>
        </dl>

        <Button asChild aria-label="View journal" size="sm" variant="outline">
          <Link href={routes.JOURNAL}>Xem nhật ký</Link>
        </Button>
      </div>
    </DashboardCard>
  );
}
