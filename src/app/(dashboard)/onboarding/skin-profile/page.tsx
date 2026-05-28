import { SkinProfileOnboardingForm } from "@/modules/skin-profile/components/skin-profile-onboarding-form";
import { routes } from "@/shared/constants/routes";

export default function SkinProfileOnboardingPage() {
  return (
    <section className="space-y-6" data-route={routes.ONBOARDING_SKIN_PROFILE}>
      <div className="border border-border bg-card p-6">
        <p className="text-sm font-medium text-emerald-700">
          Thiết lập hồ sơ da
        </p>
        <h2 className="mt-2 text-3xl font-semibold">Hồ sơ da của bạn</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
          Lưu các thông tin cơ bản để SkinWise có ngữ cảnh phù hợp cho các bước
          chăm sóc da. Thông tin này chỉ mang tính giáo dục.
        </p>
      </div>

      <SkinProfileOnboardingForm />
    </section>
  );
}
