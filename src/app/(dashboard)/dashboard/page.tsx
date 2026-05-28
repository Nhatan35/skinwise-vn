import { DashboardOverview } from "@/modules/dashboard/components/dashboard-overview";
import { dashboardRoute } from "@/modules/dashboard/dashboard-shell.config";

export default function DashboardPage() {
  return (
    <section className="space-y-6" data-route={dashboardRoute}>
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm shadow-stone-950/5">
        <p className="text-sm font-semibold text-primary">{dashboardRoute}</p>
        <h2
          aria-label="SkinWise overview"
          className="mt-2 text-3xl font-semibold tracking-tight text-foreground"
        >
          Tổng quan SkinWise
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
          Xem hồ sơ da, routine hôm nay, nhật ký gần nhất và gợi ý hành động
          tiếp theo dựa trên dữ liệu thật của tài khoản hiện tại.
        </p>
      </div>

      <DashboardOverview />
    </section>
  );
}
