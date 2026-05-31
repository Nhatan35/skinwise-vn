import { Circle, CircleCheck } from "lucide-react";
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
  href: string;
  completed: boolean;
};

type OnboardingProgressCardProps = {
  dashboard: DashboardDto;
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
      label: "Hoàn thiện hồ sơ da",
      description:
        "Cho SkinWise biết loại da, mối quan tâm và mức độ nhạy cảm của bạn.",
      href: routes.SKIN_PROFILE,
      completed: dashboard.profileCompletion.percentage >= 100,
    },
    {
      id: "saved-product",
      label: "Lưu sản phẩm phù hợp",
      description: "Lưu ít nhất một sản phẩm phù hợp để bắt đầu xây routine.",
      href: routes.PRODUCT_MATCH,
      completed: dashboard.savedProducts.count > 0,
    },
    {
      id: "first-routine",
      label: "Tạo routine đầu tiên",
      description:
        "Tạo routine sáng hoặc tối để theo dõi chăm sóc da đều đặn.",
      href: routes.ROUTINES,
      completed: dashboard.routines.hasAnyRoutine || dashboard.routines.total > 0,
    },
    {
      id: "today-log",
      label: "Ghi nhận routine hôm nay",
      description: "Đánh dấu routine đã hoàn thành, một phần hoặc bỏ qua.",
      href: routes.TODAY_LOG,
      completed: todayLogCount > 0,
    },
    {
      id: "first-journal",
      label: "Viết nhật ký da đầu tiên",
      description:
        "Ghi lại tình trạng da để xem xu hướng thay đổi theo thời gian.",
      href: routes.JOURNAL,
      completed: dashboard.latestJournal.exists,
    },
  ];
}

export function OnboardingProgressCard({
  dashboard,
}: OnboardingProgressCardProps) {
  const steps = buildOnboardingSteps(dashboard);
  const completedSteps = steps.filter((step) => step.completed).length;
  const totalSteps = steps.length;
  const progressPercentage = Math.round((completedSteps / totalSteps) * 100);
  const nextIncompleteStep = steps.find((step) => !step.completed);

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
              <div className="min-w-0 flex-1 space-y-1">
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
              </div>
            </li>
          ))}
        </ul>

        {nextIncompleteStep ? (
          <Button asChild className="w-full sm:w-auto" size="sm">
            <Link href={nextIncompleteStep.href}>
              Tiếp tục: {nextIncompleteStep.label}
            </Link>
          </Button>
        ) : (
          <p className="rounded-2xl border border-border bg-secondary/40 p-3 text-sm leading-6 text-muted-foreground">
            Bạn đã hoàn tất các bước thiết lập chính. Tiếp tục duy trì routine
            và nhật ký để SkinWise theo dõi tiến triển chính xác hơn.
          </p>
        )}
      </div>
    </DashboardCard>
  );
}
