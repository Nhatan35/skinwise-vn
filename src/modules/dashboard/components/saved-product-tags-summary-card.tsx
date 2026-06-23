import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { DashboardCard } from "@/modules/dashboard/components/dashboard-card";
import type { DashboardDto } from "@/modules/dashboard/dashboard.dto";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { routes } from "@/shared/constants/routes";

type SavedProductTagsSummaryCardProps = {
  savedProductTags: DashboardDto["savedProductTags"];
};

function toTagTestId(label: string) {
  return label
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function SavedProductTagsSummaryCard({
  savedProductTags,
}: SavedProductTagsSummaryCardProps) {
  const hasSavedProducts = savedProductTags.totalSavedProducts > 0;
  const hasTags = savedProductTags.topTags.length > 0;

  return (
    <DashboardCard
      action={
        <Badge variant={hasTags ? "secondary" : "outline"}>
          {hasTags ? `${savedProductTags.topTags.length} tag` : "Chưa có tag"}
        </Badge>
      }
      testId="dashboard-saved-product-tags-summary-card"
      title="Phân loại sản phẩm đã lưu"
    >
      <div className="space-y-4">
        <p className="text-sm leading-6 text-muted-foreground">
          Tóm tắt này giúp bạn xem cách bạn đang tự phân loại sản phẩm đã lưu.
        </p>

        <div className="grid gap-2 sm:grid-cols-3">
          <div className="rounded-2xl bg-secondary p-3">
            <p className="text-xs font-semibold uppercase tracking-normal text-muted-foreground">
              Tổng sản phẩm đã lưu
            </p>
            <p className="mt-1 text-2xl font-semibold text-foreground">
              {savedProductTags.totalSavedProducts}
            </p>
          </div>
          <div className="rounded-2xl bg-secondary p-3">
            <p className="text-xs font-semibold uppercase tracking-normal text-muted-foreground">
              Đã có tag cá nhân
            </p>
            <p className="mt-1 text-2xl font-semibold text-foreground">
              {savedProductTags.taggedProductCount}
            </p>
          </div>
          <div className="rounded-2xl bg-secondary p-3">
            <p className="text-xs font-semibold uppercase tracking-normal text-muted-foreground">
              Chưa có tag
            </p>
            <p className="mt-1 text-2xl font-semibold text-foreground">
              {savedProductTags.untaggedProductCount}
            </p>
          </div>
        </div>

        <div
          className="rounded-2xl border border-border bg-background p-3"
          data-testid="dashboard-saved-product-tags-top-tags"
        >
          <p className="text-sm font-semibold text-foreground">
            Tag dùng nhiều
          </p>

          {!hasSavedProducts ? (
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Bạn chưa lưu sản phẩm nào. Khi lưu sản phẩm, bạn có thể thêm tag cá
              nhân để dễ xem lại.
            </p>
          ) : !hasTags ? (
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Bạn đã có sản phẩm đã lưu nhưng chưa thêm tag cá nhân.
            </p>
          ) : (
            <ul className="mt-3 space-y-2">
              {savedProductTags.topTags.map((tag) => (
                <li
                  className="flex items-center justify-between gap-3 rounded-xl bg-secondary/60 px-3 py-2"
                  data-testid={`dashboard-saved-product-tag-${toTagTestId(
                    tag.label,
                  )}`}
                  key={tag.label}
                >
                  <span className="text-sm font-medium text-foreground">
                    {tag.label}
                  </span>
                  <Badge variant="outline">{tag.count} sản phẩm</Badge>
                </li>
              ))}
            </ul>
          )}
        </div>

        <p className="text-xs leading-5 text-muted-foreground">
          Các tag này đến từ ghi chú cá nhân của bạn và chỉ dùng để tổ chức sản
          phẩm đã lưu.
        </p>

        <Button asChild size="sm" variant="outline">
          <Link href={routes.SAVED_PRODUCTS}>
            Quản lý sản phẩm đã lưu
            <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </DashboardCard>
  );
}
