import Link from "next/link";

import { DashboardCard } from "@/modules/dashboard/components/dashboard-card";
import type { DashboardDto } from "@/modules/dashboard/dashboard.dto";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { routes } from "@/shared/constants/routes";

type LatestJournalCardProps = {
  journalTrend: DashboardDto["journalTrend"];
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

function getJournalTrendBadgeLabel(journalTrend: DashboardDto["journalTrend"]) {
  return journalTrend.status === "available" ? "Có xu hướng" : "Chưa đủ dữ liệu";
}

function getJournalTrendSymptomText(journalTrend: DashboardDto["journalTrend"]) {
  if (!journalTrend.mostCommonSymptom) {
    return "Chưa có dấu hiệu nổi bật.";
  }

  return `${symptomLabels[journalTrend.mostCommonSymptom]} (${journalTrend.mostCommonSymptomCount} lần)`;
}

export function LatestJournalCard({
  journalTrend,
  latestJournal,
}: LatestJournalCardProps) {
  if (!latestJournal.exists) {
    return (
      <DashboardCard
        action={<Badge variant="outline">{getJournalTrendBadgeLabel(journalTrend)}</Badge>}
        testId="dashboard-latest-journal-card"
        title="Nhật ký gần đây"
      >
        <div className="space-y-4">
          <p className="text-sm leading-6 text-muted-foreground">
            Bạn chưa có nhật ký da. Thêm một ghi chú ngắn cho hôm nay để hoàn
            thiện bối cảnh theo dõi skincare.
          </p>
          <div className="rounded-2xl bg-secondary p-3 text-xs leading-5 text-muted-foreground">
            <p className="font-semibold text-foreground">
              {journalTrend.recentEntries} nhật ký trong 14 ngày gần đây
            </p>
            <p className="mt-1">{journalTrend.message}</p>
            <p className="mt-2 font-medium text-primary">
              {journalTrend.nextAction}
            </p>
            <p className="mt-2">{journalTrend.disclaimer}</p>
          </div>
          <Button asChild aria-label="Thêm nhật ký hôm nay" size="sm">
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
      title="Nhật ký gần đây"
    >
      <div className="space-y-4">
        <div className="rounded-2xl bg-secondary p-3 text-xs leading-5 text-muted-foreground">
          <p className="font-semibold text-foreground">
            {journalTrend.recentEntries} nhật ký trong 14 ngày gần đây
          </p>
          <p className="mt-1">{journalTrend.message}</p>
          <p className="mt-2 font-medium text-primary">
            {journalTrend.nextAction}
          </p>
          <p className="mt-2">{journalTrend.disclaimer}</p>
        </div>
        <dl className="space-y-3 text-sm">
          <div>
            <dt className="font-semibold text-foreground">Xu hướng dấu hiệu</dt>
            <dd className="mt-1 text-muted-foreground">
              {getJournalTrendSymptomText(journalTrend)}
            </dd>
          </div>

          <div>
            <dt className="font-semibold text-foreground">Ngày ghi nhận</dt>
            <dd className="mt-1 text-muted-foreground">{latestJournal.localDate}</dd>
          </div>

          <div>
            <dt className="font-semibold text-foreground">Quan sát</dt>
            <dd className="mt-1 text-muted-foreground">
              {latestJournal.observations.length > 0
                ? latestJournal.observations.join(", ")
                : "Chưa có quan sát."}
            </dd>
          </div>

          <div>
            <dt className="font-semibold text-foreground">Dấu hiệu đã ghi nhận</dt>
            <dd className="mt-1 text-muted-foreground">
              {latestJournal.symptoms.length > 0
                ? latestJournal.symptoms
                    .map((symptom) => symptomLabels[symptom])
                    .join(", ")
                : "Chưa có dấu hiệu."}
            </dd>
          </div>

          {latestJournal.stressLevel ? (
            <div>
              <dt className="font-semibold text-foreground">Mức stress</dt>
              <dd className="mt-1 text-muted-foreground">
                {stressLevelLabels[latestJournal.stressLevel]}
              </dd>
            </div>
          ) : null}

          {latestJournal.notesPreview ? (
            <div>
              <dt className="font-semibold text-foreground">Ghi chú</dt>
              <dd className="mt-1 text-muted-foreground">
                {latestJournal.notesPreview}
              </dd>
            </div>
          ) : null}

          <div>
            <dt className="font-semibold text-foreground">Sản phẩm đã dùng</dt>
            <dd className="mt-1 text-muted-foreground">
              {latestJournal.productsUsedCount} sản phẩm
            </dd>
          </div>
        </dl>

        <Button asChild aria-label="Xem nhật ký" size="sm" variant="outline">
          <Link href={routes.JOURNAL}>Xem nhật ký</Link>
        </Button>
      </div>
    </DashboardCard>
  );
}
