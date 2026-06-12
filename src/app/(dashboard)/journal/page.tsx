import { SkinJournalTimeline } from "@/modules/journals/components/skin-journal-timeline";
import { routes } from "@/shared/constants/routes";

export default function JournalPage() {
  return (
    <section className="space-y-6" data-route={routes.JOURNAL}>
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm shadow-stone-950/5">
        <p className="text-sm font-semibold text-primary">Skin Journal</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
          Nhật ký da
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
          Ghi lại cảm nhận hằng ngày, dấu hiệu bạn tự quan sát, sản phẩm đã
          dùng, giấc ngủ, stress và ghi chú riêng tư để dễ nhìn lại thói quen
          skincare. Nhật ký chỉ hỗ trợ theo dõi cá nhân và không thay thế tư
          vấn chuyên môn.
        </p>
      </div>

      <SkinJournalTimeline />
    </section>
  );
}
