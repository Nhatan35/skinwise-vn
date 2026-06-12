import { TodayRoutineChecklist } from "@/modules/routine-logs/components/today-routine-checklist";
import { routes } from "@/shared/constants/routes";

export default function TodayRoutineLogPage() {
  return (
    <section className="space-y-6" data-route={routes.TODAY_LOG}>
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm shadow-stone-950/5">
        <p className="text-sm font-semibold text-primary">Today Log</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
          Checklist routine hôm nay
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
          Ghi nhận routine hôm nay như một checklist nhanh: hoàn thành, một
          phần hoặc bỏ qua. Sau đó bạn có thể viết nhật ký da để ghi lại cảm
          nhận, sản phẩm đã dùng và thói quen liên quan mà không cần kết luận
          quá sớm sau một vài lần dùng.
        </p>
      </div>

      <TodayRoutineChecklist />
    </section>
  );
}
