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
      description="Product Match hoạt động tốt hơn khi bạn đã thiết lập loại da, mối quan tâm và độ nhạy cảm của da."
      title="Hãy tạo hồ sơ da trước"
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
