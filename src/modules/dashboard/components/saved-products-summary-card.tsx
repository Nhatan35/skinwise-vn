import Link from "next/link";

import { DashboardCard } from "@/modules/dashboard/components/dashboard-card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { routes } from "@/shared/constants/routes";

export function SavedProductsSummaryCard() {
  return (
    <DashboardCard
      action={<Badge variant="outline">Xem lại</Badge>}
      testId="dashboard-saved-products-card"
      title="Sản phẩm đã lưu"
    >
      <div className="space-y-4">
        <p className="text-sm leading-6 text-muted-foreground">
          Mở danh sách sản phẩm đã lưu để xem lại thành phần trước khi thêm vào
          routine. Dashboard không hiển thị số lượng nếu dữ liệu chưa được nạp
          trong API tổng quan.
        </p>
        <Button asChild size="sm" variant="outline">
          <Link href={routes.SAVED_PRODUCTS}>Xem sản phẩm đã lưu</Link>
        </Button>
      </div>
    </DashboardCard>
  );
}
