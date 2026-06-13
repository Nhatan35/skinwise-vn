import { LoadingState } from "@/shared/components/loading-state";

export default function DashboardLoading() {
  return (
    <section
      aria-label="Đang tải trang SkinWise"
      className="rounded-3xl border border-border bg-card p-6 shadow-sm shadow-stone-950/5"
    >
      <LoadingState label="Đang tải trang SkinWise..." />
    </section>
  );
}
