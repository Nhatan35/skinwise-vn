import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { AdminContentSummaryDto } from "@/modules/admin/admin-content-summary.dto";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

type AdminContentDashboardProps = {
  summary: AdminContentSummaryDto;
};

type MetricItemProps = {
  label: string;
  value: number;
  testId: string;
};

function MetricItem({ label, value, testId }: MetricItemProps) {
  return (
    <div
      className="rounded-xl border border-border bg-background p-3"
      data-testid={testId}
    >
      <p className="text-xs font-semibold uppercase tracking-normal text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-2xl font-semibold text-foreground">{value}</p>
    </div>
  );
}

export function AdminContentDashboard({ summary }: AdminContentDashboardProps) {
  return (
    <div className="space-y-6" data-testid="admin-content-dashboard">
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm shadow-stone-950/5">
        <p className="text-sm font-semibold text-primary">Admin tools</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Admin Content Dashboard
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
          Manage catalogue maintenance areas from one lightweight admin overview.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card data-testid="admin-product-summary-card">
          <CardHeader>
            <CardTitle>Products</CardTitle>
            <CardDescription>
              Review product catalogue status before updating public visibility.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              <MetricItem
                label="Total products"
                testId="admin-products-total"
                value={summary.products.total}
              />
              <MetricItem
                label="Pending review"
                testId="admin-products-unverified"
                value={summary.products.unverified}
              />
              <MetricItem
                label="Reviewed"
                testId="admin-products-reviewed"
                value={summary.products.reviewed}
              />
              <MetricItem
                label="Verified"
                testId="admin-products-verified"
                value={summary.products.verified}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link href={summary.products.manageHref}>
                Manage products
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card data-testid="admin-ingredient-summary-card">
          <CardHeader>
            <CardTitle>Ingredients</CardTitle>
            <CardDescription>
              Maintain Ingredient Library entries used by user-facing education.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MetricItem
              label="Total ingredients"
              testId="admin-ingredients-total"
              value={summary.ingredients.total}
            />
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline">
              <Link href={summary.ingredients.manageHref}>
                Manage ingredients
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div
        className="rounded-2xl border border-border bg-secondary/50 p-4 text-sm leading-6 text-muted-foreground"
        data-testid="admin-content-boundary-note"
      >
        <Badge className="mb-2" variant="outline">
          Release boundary
        </Badge>
        <p>{summary.boundaryNote}</p>
      </div>
    </div>
  );
}
