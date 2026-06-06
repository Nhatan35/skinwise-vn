import Link from "next/link";

import { EmptyState } from "@/shared/components/empty-state";
import { Button } from "@/shared/components/ui/button";
import { routes } from "@/shared/constants/routes";

export function ProductMatchNoProfileEmptyState() {
  return (
    <EmptyState
      action={
        <Button asChild>
          <Link href={routes.ONBOARDING_SKIN_PROFILE}>Hoàn thiện hồ sơ da</Link>
        </Button>
      }
      description="SkinWise cần thêm thông tin hồ sơ da để gợi ý sản phẩm phù hợp hơn. Hãy cập nhật loại da, mối quan tâm và độ nhạy cảm trước khi xem Product Match."
      title="SkinWise cần thêm thông tin hồ sơ da"
    />
  );
}

export function ProductMatchNoProductsEmptyState() {
  return (
    <EmptyState
      description="Hiện chưa có sản phẩm phù hợp để hiển thị. Bạn có thể quay lại sau khi danh mục có thêm sản phẩm đã được kiểm duyệt."
      title="Chưa có sản phẩm để gợi ý"
    />
  );
}
