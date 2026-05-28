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

function getJournalTrendText(journalTrend: DashboardDto["journalTrend"]) {
  if (journalTrend.status === "not_enough_data") {
    return "Chưa đủ dữ liệu để nhìn ra xu hướng trong 7 ngày gần đây.";
  }

  if (journalTrend.mostCommonSymptom) {
    return `7 ngày gần đây có ${journalTrend.recentEntries} nhật ký. Dấu hiệu thường gặp nhất: ${symptomLabels[journalTrend.mostCommonSymptom]}.`;
  }

  return `7 ngày gần đây có ${journalTrend.recentEntries} nhật ký. Hãy tiếp tục ghi nhận đều để thấy xu hướng rõ hơn.`;
}

export function LatestJournalCard({
  journalTrend,
  latestJournal,
}: LatestJournalCardProps) {
  if (!latestJournal.exists) {
    return (
      <DashboardCard
        action={<Badge variant="outline">Chưa đủ dữ liệu</Badge>}
        testId="dashboard-latest-journal-card"
        title="Nhật ký gần đây"
      >
        <div className="space-y-4">
          <p className="text-sm leading-6 text-muted-foreground">
            Bạn chưa có nhật ký da. Thêm một ghi chú ngắn cho hôm nay để hoàn
            thiện bối cảnh theo dõi skincare.
          </p>
          <p className="rounded-2xl bg-secondary p-3 text-xs leading-5 text-muted-foreground">
            {getJournalTrendText(journalTrend)}
          </p>
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
        <p className="rounded-2xl bg-secondary p-3 text-xs leading-5 text-muted-foreground">
          {getJournalTrendText(journalTrend)}
        </p>
        <dl className="space-y-3 text-sm">
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
