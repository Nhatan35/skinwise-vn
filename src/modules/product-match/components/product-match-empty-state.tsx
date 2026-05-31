import Link from "next/link";

import { EmptyState } from "@/shared/components/empty-state";
import { Button } from "@/shared/components/ui/button";
import { routes } from "@/shared/constants/routes";

export function ProductMatchNoProfileEmptyState() {
  return (
    <EmptyState
      action={
        <Button asChild>
          <Link href={routes.ONBOARDING_SKIN_PROFILE}>Tạo hồ sơ da</Link>
        </Button>
      }
      description="Tạo hồ sơ da trước để xem gợi ý sản phẩm phù hợp."
      title="Cần hồ sơ da"
    />
  );
}

export function ProductMatchNoProductsEmptyState() {
  return (
    <EmptyState
      description="Hiện chưa có gợi ý sản phẩm phù hợp để hiển thị. Vui lòng quay lại sau khi có thêm sản phẩm đã được kiểm duyệt."
      title="Chưa có gợi ý sản phẩm phù hợp"
    />
  );
}
