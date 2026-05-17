import { DashboardOverview } from "@/modules/dashboard/components/dashboard-overview";
import { dashboardRoute } from "@/modules/dashboard/dashboard-shell.config";

export default function DashboardPage() {
  return (
    <section className="space-y-6" data-route={dashboardRoute}>
      <div className="border border-stone-200 bg-white p-6">
        <p className="text-sm font-medium text-emerald-700">{dashboardRoute}</p>
        <h2 className="mt-2 text-3xl font-semibold">Tổng quan SkinWise</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-600">
          Dashboard tổng hợp hồ sơ da, routine, nhật ký routine hôm nay và phân
          tích an toàn gần nhất từ dữ liệu thật của tài khoản hiện tại.
        </p>
      </div>

      <DashboardOverview />
    </section>
  );
}
