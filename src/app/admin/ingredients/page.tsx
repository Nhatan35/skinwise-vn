import Link from "next/link";
import { redirect } from "next/navigation";

import {
  AdminPermissionRequiredError,
  requireAdminUser,
} from "@/modules/auth/require-admin-user";
import { AuthenticationRequiredError } from "@/modules/auth/types";
import { AdminIngredientManagement } from "@/modules/ingredients/components/admin-ingredient-management";
import { ErrorState } from "@/shared/components/error-state";
import { Button } from "@/shared/components/ui/button";
import { routes } from "@/shared/constants/routes";

export const dynamic = "force-dynamic";

export default async function AdminIngredientsPage() {
  try {
    await requireAdminUser();
  } catch (error) {
    if (error instanceof AuthenticationRequiredError) {
      redirect("/api/auth/signin?callbackUrl=/admin/ingredients");
    }

    if (error instanceof AdminPermissionRequiredError) {
      return <AdminIngredientsUnauthorizedState />;
    }

    throw error;
  }

  return (
    <main className="min-h-screen bg-background px-4 py-6 text-foreground sm:px-6 lg:px-8">
      <section
        className="mx-auto max-w-7xl space-y-6"
        data-route={routes.ADMIN_INGREDIENTS}
      >
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm shadow-stone-950/5">
          <p className="text-sm font-semibold text-primary">Admin tools</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Quản lý thành phần
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
            Tạo và chỉnh sửa dữ liệu Ingredient Library ở mức Lite, giữ nguyên
            trải nghiệm user-facing cho thư viện, chi tiết và giải thích thành
            phần.
          </p>
        </div>

        <AdminIngredientManagement />
      </section>
    </main>
  );
}

function AdminIngredientsUnauthorizedState() {
  return (
    <main className="min-h-screen bg-background px-4 py-6 text-foreground sm:px-6 lg:px-8">
      <section
        className="mx-auto max-w-3xl"
        data-route={routes.ADMIN_INGREDIENTS}
      >
        <ErrorState
          action={
            <Button asChild variant="outline">
              <Link href={routes.DASHBOARD}>Về dashboard</Link>
            </Button>
          }
          description="Trang này chỉ dành cho admin SkinWise. Dữ liệu quản lý thành phần không hiển thị cho tài khoản này."
          title="Cần quyền truy cập admin"
        />
      </section>
    </main>
  );
}
