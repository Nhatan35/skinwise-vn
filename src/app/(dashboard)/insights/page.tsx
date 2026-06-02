import { InsightsPage } from "@/modules/insights/components/insights-page";
import { insightsRoute } from "@/modules/dashboard/dashboard-shell.config";

export default function SkinProgressInsightsPage() {
  return (
    <section className="space-y-6" data-route={insightsRoute}>
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm shadow-stone-950/5">
        <p className="text-sm font-semibold text-primary">{insightsRoute}</p>
        <h2
          aria-label="Insights tiến trình chăm sóc da"
          className="mt-2 text-3xl font-semibold tracking-tight text-foreground"
        >
          Insights tiến trình chăm sóc da
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
          Nhìn lại độ đều đặn của routine, nhật ký da, hoạt động theo dõi gần
          đây và các bước tiếp theo dựa trên dữ liệu bạn đã ghi nhận.
        </p>
      </div>

      <InsightsPage />
    </section>
  );
}
