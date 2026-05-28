import { SettingsDataControlCenter } from "@/modules/settings/components/settings-data-control-center";
import { routes } from "@/shared/constants/routes";

export default function SettingsPage() {
  return (
    <section className="space-y-6" data-route={routes.SETTINGS}>
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm shadow-stone-950/5">
        <p className="text-sm font-semibold text-primary">Cài đặt</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
          Cài đặt và quản lý dữ liệu
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
          Quản lý thông tin tài khoản, dữ liệu skincare cá nhân và các yêu cầu
          liên quan đến quyền kiểm soát dữ liệu.
        </p>
      </div>

      <SettingsDataControlCenter />
    </section>
  );
}
