import { RoutineBuilder } from "@/modules/routines/components/routine-builder";
import { routes } from "@/shared/constants/routes";

export default function RoutinesPage() {
  return (
    <section className="space-y-6" data-route={routes.ROUTINES}>
      <div className="border border-stone-200 bg-white p-6">
        <p className="text-sm font-medium text-emerald-700">Routine</p>
        <h2 className="mt-2 text-3xl font-semibold">
          Xây dựng routine chăm sóc da
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-600">
          Tạo routine sáng hoặc tối bằng các bước đơn giản. Thông tin này chỉ
          mang tính giáo dục và giúp bạn quản lý routine đã nhập.
        </p>
      </div>

      <RoutineBuilder />
    </section>
  );
}
