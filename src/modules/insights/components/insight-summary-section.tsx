"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { getSymptomLabel } from "@/modules/insights/components/insights-overview-cards";
import { getInsightSummary } from "@/modules/insights/insights.client";
import type {
  InsightCalculationMetaDto,
  InsightSummaryDto,
  TrackingQualityChecklistDto,
  TrackingQualityStatus,
} from "@/modules/insights/insight-summary.dto";
import { EmptyState } from "@/shared/components/empty-state";
import { ErrorState } from "@/shared/components/error-state";
import { LoadingState } from "@/shared/components/loading-state";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { routes } from "@/shared/constants/routes";

type InsightSummarySectionProps = {
  to: string;
};

type RoutineConsistencySummary = InsightSummaryDto["routineConsistency"];
type SymptomFrequencySummary = InsightSummaryDto["symptomFrequency"];
type StressReflectionSummary = InsightSummaryDto["stressReflection"];
type ProductMentionPatternSummary =
  InsightSummaryDto["productMentionPattern"];

const trackingQualityStatusLabels: Record<TrackingQualityStatus, string> = {
  available: "Đủ dữ liệu theo dõi",
  limited: "Còn hạn chế",
  not_enough_data: "Cần thêm dữ liệu",
  not_configured: "Chưa thiết lập",
};

function hasStressData(stressReflection: StressReflectionSummary) {
  return (
    stressReflection.highStressCount +
      stressReflection.mediumStressCount +
      stressReflection.lowStressCount >
    0
  );
}

function SummaryStat({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border border-border/70 bg-secondary/40 px-4 py-3">
      <dt className="text-xs font-medium uppercase text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 text-xl font-semibold tracking-tight text-foreground">
        {value}
      </dd>
    </div>
  );
}

function InsightCalculationNote({
  calculationMeta,
}: {
  calculationMeta?: InsightCalculationMetaDto;
}) {
  if (!calculationMeta) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-border/70 bg-secondary/30 px-4 py-3">
      <p className="text-sm font-semibold text-foreground">
        Cách tính
      </p>
      <dl className="mt-3 space-y-2 text-sm leading-6">
        <div>
          <dt className="font-medium text-foreground">Giai đoạn xem lại</dt>
          <dd className="text-muted-foreground">
            {calculationMeta.periodDays} ngày gần đây
          </dd>
        </div>
        <div>
          <dt className="font-medium text-foreground">Dữ liệu sử dụng</dt>
          <dd className="text-muted-foreground">
            {calculationMeta.dataSourceLabel}
          </dd>
        </div>
        <div>
          <dt className="font-medium text-foreground">Cách tổng hợp</dt>
          <dd className="text-muted-foreground">
            {calculationMeta.calculationLabel}
          </dd>
        </div>
      </dl>
      <p className="mt-3 text-xs leading-5 text-muted-foreground">
        {calculationMeta.safetyText}
      </p>
    </div>
  );
}

function getTrackingStatusVariant(status: TrackingQualityStatus) {
  if (status === "available") {
    return "secondary" as const;
  }

  return "outline" as const;
}

function TrackingQualityChecklist({
  checklist,
}: {
  checklist?: TrackingQualityChecklistDto;
}) {
  if (!checklist) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Checklist dữ liệu theo dõi</CardTitle>
          <CardDescription>
            Chưa có đủ chi tiết về dữ liệu theo dõi. Hãy tiếp tục ghi nhận
            routine hoặc journal để tạo bối cảnh cá nhân rõ hơn.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Checklist dữ liệu theo dõi</CardTitle>
        <CardDescription>
          Checklist này chỉ phản ánh mức độ có dữ liệu theo dõi, không phải
          đánh giá làn da hay tư vấn chuyên môn.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm font-medium text-foreground">
          {checklist.summaryText}
        </p>
        <ul className="grid gap-3 lg:grid-cols-2">
          {checklist.checklistItems.map((item) => (
            <li
              className="rounded-2xl border border-border/70 bg-secondary/30 px-4 py-3"
              key={item.key}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium text-foreground">{item.label}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Số lần: {item.count} trong {item.periodDays} ngày
                  </p>
                </div>
                <Badge variant={getTrackingStatusVariant(item.status)}>
                  {trackingQualityStatusLabels[item.status]}
                </Badge>
              </div>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {item.helperText}
              </p>
            </li>
          ))}
        </ul>
        <p className="rounded-2xl border border-border/70 bg-secondary/40 px-4 py-3 text-sm leading-6 text-muted-foreground">
          {checklist.safetyNote}
        </p>
      </CardContent>
    </Card>
  );
}

function RoutineConsistencyReviewCard({
  routineConsistency,
}: {
  routineConsistency: RoutineConsistencySummary;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Độ đều đặn routine</CardTitle>
        <CardDescription>
          Tóm tắt hoàn thành routine trong 7 ngày gần đây, chỉ dựa trên log bạn
          đã ghi.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!routineConsistency.noRoutineConfigured ? (
          <dl className="grid gap-3 sm:grid-cols-3">
            <SummaryStat
              label="Hoàn thành"
              value={`${routineConsistency.completedDays}/${routineConsistency.periodDays}`}
            />
            <SummaryStat
              label="Một phần"
              value={`${routineConsistency.partialDays}/${routineConsistency.periodDays}`}
            />
            <SummaryStat
              label="Chưa có log"
              value={`${routineConsistency.missingDays}/${routineConsistency.periodDays}`}
            />
          </dl>
        ) : null}
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">
            {routineConsistency.summaryText}
          </p>
          <p className="text-sm leading-6 text-muted-foreground">
            {routineConsistency.helperText}
          </p>
        </div>
        <InsightCalculationNote
          calculationMeta={routineConsistency.calculationMeta}
        />
      </CardContent>
    </Card>
  );
}

function JournalSymptomFrequencyCard({
  symptomFrequency,
}: {
  symptomFrequency: SymptomFrequencySummary;
}) {
  const topSymptom = symptomFrequency.topSymptoms[0];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tần suất dấu hiệu trong journal</CardTitle>
        <CardDescription>
          Đếm các dấu hiệu hoặc cảm nhận bạn tự ghi trong journal 30 ngày gần
          đây.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {topSymptom ? (
          <div className="space-y-3">
            <div className="rounded-2xl border border-border/70 bg-secondary/40 px-4 py-3">
              <p className="text-xs font-medium uppercase text-muted-foreground">
                Ghi nhiều nhất
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{getSymptomLabel(topSymptom.label)}</Badge>
                <span className="text-sm font-medium text-foreground">
                  {topSymptom.count} lần trong {symptomFrequency.periodDays} ngày
                </span>
              </div>
            </div>
            <ul className="space-y-2">
              {symptomFrequency.topSymptoms.map((symptom) => (
                <li
                  className="flex items-center justify-between gap-3 text-sm"
                  key={symptom.label}
                >
                  <span className="text-muted-foreground">
                    {getSymptomLabel(symptom.label)}
                  </span>
                  <Badge variant="outline">{symptom.count} lần</Badge>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">
            {symptomFrequency.summaryText}
          </p>
          <p className="text-sm leading-6 text-muted-foreground">
            {symptomFrequency.helperText}
          </p>
        </div>
        <InsightCalculationNote
          calculationMeta={symptomFrequency.calculationMeta}
        />
      </CardContent>
    </Card>
  );
}

function StressReflectionCard({
  stressReflection,
}: {
  stressReflection: StressReflectionSummary;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ghi nhận stress</CardTitle>
        <CardDescription>
          Tóm tắt số lần bạn ghi mức stress trong nhật ký 30 ngày gần đây.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {hasStressData(stressReflection) ? (
          <dl className="grid gap-3 sm:grid-cols-3">
            <SummaryStat label="Cao" value={stressReflection.highStressCount} />
            <SummaryStat label="Vừa" value={stressReflection.mediumStressCount} />
            <SummaryStat label="Thấp" value={stressReflection.lowStressCount} />
          </dl>
        ) : null}
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">
            {stressReflection.summaryText}
          </p>
          <p className="text-sm leading-6 text-muted-foreground">
            {stressReflection.helperText}
          </p>
        </div>
        <InsightCalculationNote
          calculationMeta={stressReflection.calculationMeta}
        />
      </CardContent>
    </Card>
  );
}

function ProductMentionPatternCard({
  productMentionPattern,
}: {
  productMentionPattern: ProductMentionPatternSummary;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sản phẩm được nhắc trong journal</CardTitle>
        <CardDescription>
          Đếm sản phẩm xuất hiện trong nhật ký gần đây mà không kết luận hiệu
          quả, tác hại hay nguyên nhân.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {productMentionPattern.topProducts.length > 0 ? (
          <ul className="space-y-3">
            {productMentionPattern.topProducts.map((product, index) => {
              const safeKey = `${product.name}-${product.brand ?? "unknown"}-${index}`;

              return (
                <li
                  className="flex items-center justify-between gap-3 rounded-2xl border border-border/70 bg-secondary/40 px-4 py-3"
                  key={safeKey}
                >
                  <span>
                    <span className="block font-medium text-foreground">
                      {product.name}
                    </span>
                    {product.brand ? (
                      <span className="text-xs text-muted-foreground">
                        {product.brand}
                      </span>
                    ) : null}
                  </span>
                  <Badge variant="secondary">{product.count} lần</Badge>
                </li>
              );
            })}
          </ul>
        ) : null}
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">
            {productMentionPattern.summaryText}
          </p>
          <p className="text-sm leading-6 text-muted-foreground">
            {productMentionPattern.helperText}
          </p>
        </div>
        <InsightCalculationNote
          calculationMeta={productMentionPattern.calculationMeta}
        />
      </CardContent>
    </Card>
  );
}

function InsightSummaryCards({ summary }: { summary: InsightSummaryDto }) {
  return (
    <div className="space-y-4">
      {!summary.hasEnoughData ? (
        <EmptyState
          action={
            <div className="flex flex-col justify-center gap-2 sm:flex-row">
              <Button asChild size="sm">
                <Link href={routes.TODAY_LOG}>Ghi nhận routine</Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href={routes.JOURNAL}>Viết journal</Link>
              </Button>
            </div>
          }
          description="Chưa có đủ dữ liệu theo dõi. Hãy thêm một vài journal hoặc hoàn thành routine hôm nay để xem các thẻ tự quan sát cá nhân rõ hơn."
          title="Cần thêm dữ liệu cho phần tự quan sát cá nhân"
        />
      ) : null}

      <div className="grid gap-4 xl:grid-cols-2">
        <RoutineConsistencyReviewCard
          routineConsistency={summary.routineConsistency}
        />
        <JournalSymptomFrequencyCard
          symptomFrequency={summary.symptomFrequency}
        />
        <StressReflectionCard stressReflection={summary.stressReflection} />
        <ProductMentionPatternCard
          productMentionPattern={summary.productMentionPattern}
        />
      </div>

      <TrackingQualityChecklist checklist={summary.trackingQualityChecklist} />

      <p className="rounded-2xl border border-border/70 bg-secondary/40 px-4 py-3 text-sm leading-6 text-muted-foreground">
        {summary.safetyNote}
      </p>
    </div>
  );
}

export function InsightSummarySection({ to }: InsightSummarySectionProps) {
  const [summary, setSummary] = useState<InsightSummaryDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  async function loadSummary() {
    setIsLoading(true);
    setLoadError(null);

    try {
      setSummary(await getInsightSummary({ to }));
    } catch {
      setSummary(null);
      setLoadError(
        "Không thể tải phần tự quan sát cá nhân. Vui lòng thử lại.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    let isMounted = true;

    async function loadInitialSummary() {
      setIsLoading(true);
      setLoadError(null);

      try {
        const nextSummary = await getInsightSummary({ to });

        if (isMounted) {
          setSummary(nextSummary);
        }
      } catch {
        if (isMounted) {
          setSummary(null);
          setLoadError(
            "Không thể tải phần tự quan sát cá nhân. Vui lòng thử lại.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadInitialSummary();

    return () => {
      isMounted = false;
    };
  }, [to]);

  return (
    <section aria-labelledby="personal-insight-review" className="space-y-4">
      <div className="rounded-3xl border border-border bg-card p-5 shadow-sm shadow-stone-950/5">
        <h2
          className="text-xl font-semibold tracking-tight text-foreground"
          id="personal-insight-review"
        >
          Tự quan sát cá nhân
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          Các thẻ này chỉ tóm tắt dữ liệu bạn đã tự ghi lại. Nội dung dùng để
          tự quan sát, cần thêm ngữ cảnh theo thời gian và không thay thế tư
          vấn chuyên môn.
        </p>
      </div>

      {isLoading ? (
        <LoadingState label="Đang tải phần tự quan sát cá nhân..." />
      ) : null}

      {loadError ? (
        <ErrorState
          action={
            <Button onClick={() => void loadSummary()} size="sm" variant="outline">
              Thử lại
            </Button>
          }
          description={loadError}
          title="Chưa thể tải phần tự quan sát cá nhân"
        />
      ) : null}

      {!isLoading && !loadError && summary ? (
        <InsightSummaryCards summary={summary} />
      ) : null}
    </section>
  );
}
