import { RoutineBuilder } from "@/modules/routines/components/routine-builder";
import { routes } from "@/shared/constants/routes";

export default function RoutinesPage() {
  return (
    <section className="space-y-6" data-route={routes.ROUTINES}>
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm shadow-stone-950/5">
        <p className="text-sm font-semibold text-primary">Routine</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
          Xây dựng routine chăm sóc da
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
          Tạo routine sáng hoặc tối theo thứ tự dễ theo dõi, sau đó dùng phân
          tích routine để xem các điểm cần lưu ý như thiếu kem chống nắng,
          nhiều hoạt chất mạnh hoặc sản phẩm cần thận trọng với da nhạy cảm.
          Sau khi dùng routine, hãy ghi nhận hôm nay và viết nhật ký khi có cảm
          nhận đáng chú ý để dễ xem lại thói quen theo thời gian. Thông tin này
          chỉ mang tính giáo dục.
        </p>
      </div>

      <RoutineBuilder />
    </section>
  );
}
