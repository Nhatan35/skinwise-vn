"use client";

import { SavedProductDecisionSupport } from "@/modules/saved-products/components/saved-product-decision-support";
import type { SavedProductDto } from "@/modules/saved-products/saved-product.dto";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

export type ProductDetailSavedDecisionState =
  | "error"
  | "loading"
  | "ready"
  | "signed-out";

type ProductDetailSavedDecisionShortcutProps = {
  item: SavedProductDto | null;
  onUpdated: (item: SavedProductDto) => void;
  state: ProductDetailSavedDecisionState;
};

export function ProductDetailSavedDecisionShortcut({
  item,
  onUpdated,
  state,
}: ProductDetailSavedDecisionShortcutProps) {
  return (
    <Card data-testid="product-detail-saved-decision-shortcut">
      <CardHeader>
        <CardTitle>Thông tin cân nhắc cá nhân</CardTitle>
        <p className="text-sm leading-6 text-muted-foreground">
          Lưu lại cách bạn đang cân nhắc sản phẩm này để dễ xem lại trong danh
          sách đã lưu.
        </p>
      </CardHeader>
      <CardContent>
        {state === "loading" ? (
          <p className="text-sm text-muted-foreground" role="status">
            Đang tải thông tin cân nhắc đã lưu...
          </p>
        ) : null}

        {state === "signed-out" ? (
          <p className="text-sm leading-6 text-muted-foreground">
            Đăng nhập và lưu sản phẩm để thêm trạng thái cân nhắc và ghi chú cá
            nhân.
          </p>
        ) : null}

        {state === "error" ? (
          <p className="text-sm leading-6 text-muted-foreground" role="status">
            Chưa tải được thông tin cân nhắc đã lưu. Bạn vẫn có thể xem thông
            tin sản phẩm.
          </p>
        ) : null}

        {state === "ready" && !item ? (
          <div className="space-y-2 text-sm leading-6 text-muted-foreground">
            <p>
              Lưu sản phẩm để thêm trạng thái cân nhắc và ghi chú cá nhân.
            </p>
            <p>
              Thông tin này chỉ dùng để bạn xem lại quyết định sau, không thay
              thế việc theo dõi phản ứng thực tế của da.
            </p>
          </div>
        ) : null}

        {state === "ready" && item ? (
          <SavedProductDecisionSupport
            item={item}
            layout="compact"
            onUpdated={onUpdated}
          />
        ) : null}
      </CardContent>
    </Card>
  );
}
