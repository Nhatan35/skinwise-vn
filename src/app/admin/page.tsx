import Link from "next/link";
import { redirect } from "next/navigation";

import { AdminContentDashboard } from "@/modules/admin/components/admin-content-dashboard";
import { getAdminContentSummary } from "@/modules/admin/admin-content-summary.use-case";
import {
  AdminPermissionRequiredError,
  requireAdminUser,
} from "@/modules/auth/require-admin-user";
import { AuthenticationRequiredError } from "@/modules/auth/types";
import { ErrorState } from "@/shared/components/error-state";
import { Button } from "@/shared/components/ui/button";
import { routes } from "@/shared/constants/routes";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  try {
    await requireAdminUser();
  } catch (error) {
    if (error instanceof AuthenticationRequiredError) {
      redirect("/api/auth/signin?callbackUrl=/admin");
    }

    if (error instanceof AdminPermissionRequiredError) {
      return <AdminUnauthorizedState />;
    }

    throw error;
  }

  const summary = await getAdminContentSummary();

  return (
    <main className="min-h-screen bg-background px-4 py-6 text-foreground sm:px-6 lg:px-8">
      <section className="mx-auto max-w-7xl space-y-6" data-route={routes.ADMIN}>
        <AdminContentDashboard summary={summary} />
      </section>
    </main>
  );
}

function AdminUnauthorizedState() {
  return (
    <main className="min-h-screen bg-background px-4 py-6 text-foreground sm:px-6 lg:px-8">
      <section className="mx-auto max-w-3xl" data-route={routes.ADMIN}>
        <ErrorState
          action={
            <Button asChild variant="outline">
              <Link href={routes.DASHBOARD}>Back to dashboard</Link>
            </Button>
          }
          description="This page is available only to SkinWise admin users. Catalogue summary data is not shown for this account."
          title="Admin access required"
        />
      </section>
    </main>
  );
}
