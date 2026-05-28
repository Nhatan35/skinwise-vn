import { SettingsDataControlCenter } from "@/modules/settings/components/settings-data-control-center";
import { routes } from "@/shared/constants/routes";

export default function SettingsPage() {
  return (
    <section className="space-y-6" data-route={routes.SETTINGS}>
      <div className="border border-border bg-card p-6">
        <p className="text-sm font-medium text-emerald-700">Settings</p>
        <h2 className="mt-2 text-3xl font-semibold">
          Settings & Data Control
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
