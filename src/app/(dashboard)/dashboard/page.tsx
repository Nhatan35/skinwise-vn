import { DashboardOverview } from "@/modules/dashboard/components/dashboard-overview";
import { dashboardRoute } from "@/modules/dashboard/dashboard-shell.config";

export default function DashboardPage() {
  return (
    <section className="space-y-6" data-route={dashboardRoute}>
      <div className="border border-stone-200 bg-white p-6">
        <p className="text-sm font-medium text-emerald-700">{dashboardRoute}</p>
        <h2 className="mt-2 text-3xl font-semibold">SkinWise overview</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-600">
          Dashboard summary for skin profile, routines, today&apos;s routine
          log progress, latest journal context, and latest routine safety
          analysis from the current authenticated account.
        </p>
      </div>

      <DashboardOverview />
    </section>
  );
}
