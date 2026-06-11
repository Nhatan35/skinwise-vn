import { ArrowRight, Circle, CircleCheck } from "lucide-react";
import Link from "next/link";

import { DashboardCard } from "@/modules/dashboard/components/dashboard-card";
import type { DashboardDto } from "@/modules/dashboard/dashboard.dto";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { routes } from "@/shared/constants/routes";

export type OnboardingStep = {
  id: string;
  label: string;
  description: string;
  outcome: string;
  ctaLabel: string;
  href: string;
  completed: boolean;
};

type OnboardingProgressCardProps = {
  dashboard: DashboardDto;
};

type OnboardingNextStepCardProps = {
  step: OnboardingStep;
};

export function buildOnboardingSteps(
  dashboard: DashboardDto,
): OnboardingStep[] {
  const todayLogCount =
    dashboard.todayRoutineLogs.completed +
    dashboard.todayRoutineLogs.partial +
    dashboard.todayRoutineLogs.skipped;

  return [
    {
      id: "skin-profile",
      label: "Cập nhật hồ sơ da",
      description:
        "Cho SkinWise biết loại da, mối quan tâm và mức độ nhạy cảm của bạn.",
      outcome:
        "Các gợi ý sản phẩm và routine có thể dựa trên thông tin bạn đã nhập.",
      ctaLabel: "Cập nhật hồ sơ da",
      href: routes.ONBOARDING_SKIN_PROFILE,
      completed: dashboard.profileCompletion.percentage >= 100,
    },
    {
      id: "saved-product",
      label: "Lưu sản phẩm phù hợp",
      description:
        "Chọn một sản phẩm bạn muốn theo dõi hoặc cân nhắc dùng trong routine.",
      outcome: "Bạn có thể dùng sản phẩm đã lưu để xây dựng routine dễ hơn.",
      ctaLabel: "Xem sản phẩm phù hợp",
      href: routes.PRODUCT_MATCH,
      completed: dashboard.savedProducts.count > 0,
    },
    {
      id: "first-routine",
      label: "Tạo routine đầu tiên",
      description: "Sắp xếp các bước chăm sóc da thành một routine dễ theo dõi.",
      outcome: "Bạn có một kế hoạch chăm sóc da rõ ràng hơn cho hằng ngày.",
      ctaLabel: "Tạo routine đầu tiên",
      href: routes.ROUTINES,
      completed: dashboard.routines.hasAnyRoutine || dashboard.routines.total > 0,
    },
    {
      id: "today-log",
      label: "Ghi nhận routine hôm nay",
      description:
        "Đánh dấu các bước bạn đã thực hiện để theo dõi thói quen chăm sóc da.",
      outcome:
        "Bạn có dữ liệu để xem lại mức độ duy trì routine theo thời gian.",
      ctaLabel: "Ghi nhận routine hôm nay",
      href: routes.TODAY_LOG,
      completed: todayLogCount > 0,
    },
    {
      id: "first-journal",
      label: "Viết nhật ký da đầu tiên",
      description:
        "Ghi lại cảm nhận, tình trạng quan sát được và ghi chú cá nhân của bạn.",
      outcome: "Bạn có thể xem lại cảm nhận và ghi chú cá nhân theo thời gian.",
      ctaLabel: "Viết nhật ký da",
      href: routes.JOURNAL,
      completed: dashboard.latestJournal.exists,
    },
  ];
}

export function getNextIncompleteOnboardingStep(
  steps: OnboardingStep[],
) {
  return steps.find((step) => !step.completed);
}

export function OnboardingNextStepCard({ step }: OnboardingNextStepCardProps) {
  return (
    <section
      className="rounded-3xl border border-border bg-primary p-6 text-primary-foreground shadow-xl shadow-primary/15"
      data-testid="dashboard-next-onboarding-step-card"
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <Badge className="bg-card/15 text-primary-foreground" variant="outline">
            Bước nên làm tiếp theo
          </Badge>
          <h3 className="mt-4 text-2xl font-semibold tracking-tight">
            {step.label}
          </h3>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-primary-foreground/85">
            {step.description}
          </p>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-primary-foreground/85">
            <span className="font-semibold text-primary-foreground">
              Kết quả bạn nhận được:
            </span>{" "}
            {step.outcome}
          </p>
        </div>
        <Button asChild className="bg-card text-primary hover:bg-card/90" size="lg">
          <Link href={step.href}>
            {step.ctaLabel}
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}

export function OnboardingProgressCard({
  dashboard,
}: OnboardingProgressCardProps) {
  const steps = buildOnboardingSteps(dashboard);
  const completedSteps = steps.filter((step) => step.completed).length;
  const totalSteps = steps.length;
  const progressPercentage = Math.round((completedSteps / totalSteps) * 100);
  const nextIncompleteStep = getNextIncompleteOnboardingStep(steps);

  return (
    <DashboardCard
      action={
        <Badge variant={nextIncompleteStep ? "outline" : "secondary"}>
          {progressPercentage}%
        </Badge>
      }
      testId="dashboard-onboarding-progress-card"
      title="Thiết lập SkinWise của bạn"
    >
      <div className="space-y-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3 text-sm">
            <p className="font-semibold text-foreground">
              {completedSteps}/{totalSteps} bước hoàn thành
            </p>
            <p className="text-muted-foreground">{progressPercentage}%</p>
          </div>
          <div
            aria-label={`Tiến độ thiết lập SkinWise: ${completedSteps} trên ${totalSteps} bước hoàn thành`}
            aria-valuemax={totalSteps}
            aria-valuemin={0}
            aria-valuenow={completedSteps}
            className="h-2 overflow-hidden rounded-full bg-secondary"
            role="progressbar"
          >
            <div
              className="h-full rounded-full bg-primary transition-[width]"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        <ul className="space-y-3">
          {steps.map((step) => (
            <li
              className="flex gap-3 rounded-2xl border border-border bg-secondary/30 p-3"
              key={step.id}
            >
              {step.completed ? (
                <CircleCheck
                  aria-hidden="true"
                  className="mt-0.5 size-5 shrink-0 text-primary"
                />
              ) : (
                <Circle
                  aria-hidden="true"
                  className="mt-0.5 size-5 shrink-0 text-muted-foreground"
                />
              )}
              <div className="min-w-0 flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    className="font-semibold text-foreground underline-offset-4 hover:text-primary hover:underline"
                    href={step.href}
                  >
                    {step.label}
                  </Link>
                  <span className="text-xs font-medium text-muted-foreground">
                    {step.completed ? "Đã hoàn thành" : "Chưa hoàn thành"}
                  </span>
                </div>
                <p className="text-sm leading-6 text-muted-foreground">
                  {step.description}
                </p>
                <p className="text-sm leading-6 text-muted-foreground">
                  <span className="font-medium text-foreground">Kết quả:</span>{" "}
                  {step.outcome}
                </p>
                {!step.completed ? (
                  <Button asChild size="sm" variant="outline">
                    <Link href={step.href}>{step.ctaLabel}</Link>
                  </Button>
                ) : null}
              </div>
            </li>
          ))}
        </ul>

        {!nextIncompleteStep ? (
          <div className="rounded-2xl border border-border bg-secondary/40 p-3 text-sm leading-6 text-muted-foreground">
            <p className="font-semibold text-foreground">
              Bạn đã hoàn thành các bước khởi đầu.
            </p>
            <p>
              Tiếp tục duy trì routine, ghi nhận journal và xem lại dữ liệu cá
              nhân theo thời gian.
            </p>
            <p>
              Thông tin trong SkinWise chỉ mang tính tham khảo và không thay thế
              tư vấn chuyên môn.
            </p>
          </div>
        ) : null}
      </div>
    </DashboardCard>
  );
}
