import { InsightsPage } from "@/modules/insights/components/insights-page";
import { insightsRoute } from "@/modules/dashboard/dashboard-shell.config";

export default function SkinProgressInsightsPage() {
  return (
    <section className="space-y-6" data-route={insightsRoute}>
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm shadow-stone-950/5">
        <p className="text-sm font-semibold text-primary">{insightsRoute}</p>
        <h2
          aria-label="Skin Progress Insights"
          className="mt-2 text-3xl font-semibold tracking-tight text-foreground"
        >
          Skin Progress Insights
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
          Review your routine consistency, journal activity, and recent skincare
          patterns.
        </p>
      </div>

      <InsightsPage />
    </section>
  );
}
