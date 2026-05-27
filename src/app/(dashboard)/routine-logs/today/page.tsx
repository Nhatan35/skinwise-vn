import { TodayRoutineChecklist } from "@/modules/routine-logs/components/today-routine-checklist";
import { routes } from "@/shared/constants/routes";

export default function TodayRoutineLogPage() {
  return (
    <section className="space-y-6" data-route={routes.TODAY_LOG}>
      <div className="border border-stone-200 bg-white p-6">
        <p className="text-sm font-medium text-emerald-700">Today Log</p>
        <h2 className="mt-2 text-3xl font-semibold">
          Today Routine Checklist
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-600">
          Ghi nhận routine hôm nay để theo dõi sự nhất quán và cập nhật
          dashboard.
        </p>
      </div>

      <TodayRoutineChecklist />
    </section>
  );
}
