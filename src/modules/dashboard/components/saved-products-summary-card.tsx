import Link from "next/link";

import { DashboardCard } from "@/modules/dashboard/components/dashboard-card";
import type { DashboardDto } from "@/modules/dashboard/dashboard.dto";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { routes } from "@/shared/constants/routes";

type SavedProductsSummaryCardProps = {
  savedProducts: DashboardDto["savedProducts"];
};

export function SavedProductsSummaryCard({
  savedProducts,
}: SavedProductsSummaryCardProps) {
  const hasSavedProducts = savedProducts.count > 0;

  return (
    <DashboardCard
      action={
        <Badge variant={hasSavedProducts ? "secondary" : "outline"}>
          {hasSavedProducts ? `${savedProducts.count} đã lưu` : "Chưa có"}
        </Badge>
      }
      testId="dashboard-saved-products-card"
      title="Sản phẩm đã lưu"
    >
      <div className="space-y-4">
        <p className="text-sm leading-6 text-muted-foreground">
          {hasSavedProducts
            ? `Bạn đang lưu ${savedProducts.count} sản phẩm để xem lại thành phần và cân nhắc trước khi thêm vào routine.`
            : "Bạn chưa lưu sản phẩm nào. Hãy lưu lại những sản phẩm muốn tìm hiểu kỹ hơn để dễ quay lại sau."}
        </p>
        <Button asChild size="sm" variant="outline">
          <Link href={routes.SAVED_PRODUCTS}>
            {hasSavedProducts ? "Xem sản phẩm đã lưu" : "Khám phá sản phẩm"}
          </Link>
        </Button>
      </div>
    </DashboardCard>
  );
}
