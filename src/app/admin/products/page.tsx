import Link from "next/link";
import { redirect } from "next/navigation";

import {
  AdminPermissionRequiredError,
  requireAdminUser,
} from "@/modules/auth/require-admin-user";
import { AuthenticationRequiredError } from "@/modules/auth/types";
import { AdminProductReview } from "@/modules/products/components/admin-product-review";
import { ErrorState } from "@/shared/components/error-state";
import { Button } from "@/shared/components/ui/button";
import { routes } from "@/shared/constants/routes";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  try {
    await requireAdminUser();
  } catch (error) {
    if (error instanceof AuthenticationRequiredError) {
      redirect("/api/auth/signin?callbackUrl=/admin/products");
    }

    if (error instanceof AdminPermissionRequiredError) {
      return <AdminProductsUnauthorizedState />;
    }

    throw error;
  }

  return (
    <main className="min-h-screen bg-background px-4 py-6 text-foreground sm:px-6 lg:px-8">
      <section
        className="mx-auto max-w-7xl space-y-6"
        data-route={routes.ADMIN_PRODUCTS}
      >
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm shadow-stone-950/5">
          <p className="text-sm font-semibold text-primary">Admin tools</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Admin Product Review
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
            Review product catalogue visibility status through
            verificationStatus. This workflow changes only whether products are
            pending review, reviewed, or verified.
          </p>
        </div>

        <AdminProductReview />
      </section>
    </main>
  );
}

function AdminProductsUnauthorizedState() {
  return (
    <main className="min-h-screen bg-background px-4 py-6 text-foreground sm:px-6 lg:px-8">
      <section className="mx-auto max-w-3xl" data-route={routes.ADMIN_PRODUCTS}>
        <ErrorState
          action={
            <Button asChild variant="outline">
              <Link href={routes.DASHBOARD}>Back to dashboard</Link>
            </Button>
          }
          description="This page is available only to SkinWise admin users. Product review data is not shown for this account."
          title="Admin access required"
        />
      </section>
    </main>
  );
}
