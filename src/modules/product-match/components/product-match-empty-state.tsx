import Link from "next/link";

import { EmptyState } from "@/shared/components/empty-state";
import { Button } from "@/shared/components/ui/button";
import { routes } from "@/shared/constants/routes";

export function ProductMatchNoProfileEmptyState() {
  return (
    <EmptyState
      action={
        <Button asChild>
          <Link href={routes.ONBOARDING_SKIN_PROFILE}>Cập nhật hồ sơ da</Link>
        </Button>
      }
      description="SkinWise cần thêm thông tin hồ sơ da để có thêm ngữ cảnh gợi ý sản phẩm. Hồ sơ da càng rõ, phần giải thích càng dễ hiểu hơn dựa trên dữ liệu bạn đã nhập."
      title="Cập nhật hồ sơ da để xem Product Match"
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
