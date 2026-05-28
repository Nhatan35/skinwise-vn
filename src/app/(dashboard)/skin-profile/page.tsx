import { SkinProfileViewEdit } from "@/modules/skin-profile/components/skin-profile-view-edit";
import { routes } from "@/shared/constants/routes";

export default function SkinProfilePage() {
  return (
    <section className="space-y-6" data-route={routes.SKIN_PROFILE}>
      <div className="border border-border bg-card p-6">
        <p className="text-sm font-medium text-emerald-700">
          Hồ sơ da
        </p>
        <h2 className="mt-2 text-3xl font-semibold">
          Xem và chỉnh sửa hồ sơ da
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
          Kiểm tra lại thông tin nền tảng về làn da của bạn và cập nhật khi
          routine hoặc nhu cầu chăm sóc da thay đổi. Thông tin này chỉ mang tính
          giáo dục.
        </p>
      </div>

      <SkinProfileViewEdit />
    </section>
  );
}
