import type { InsightsDto } from "@/modules/insights/insights.dto";
import { Badge } from "@/shared/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

type ProductUsageCardProps = {
  products: InsightsDto["productUsage"]["mostUsedProducts"];
};

export function ProductUsageCard({ products }: ProductUsageCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sản phẩm xuất hiện trong nhật ký</CardTitle>
        <CardDescription>
          Dựa trên các lần bạn ghi nhận sản phẩm trong nhật ký. Thông tin này
          giúp nhìn lại thói quen sử dụng, không kết luận nguyên nhân hoặc hiệu
          quả từ sản phẩm.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {products.length > 0 ? (
          <ul className="space-y-3">
            {products.map((product) => (
              <li
                className="flex items-center justify-between gap-3 rounded-2xl border border-border/70 bg-secondary/40 px-4 py-3"
                key={product.productId}
              >
                <span>
                  <span className="block font-medium">{product.name}</span>
                  {product.brand ? (
                    <span className="text-xs text-muted-foreground">{product.brand}</span>
                  ) : null}
                </span>
                <Badge variant="secondary">{product.count} lần</Badge>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            Chưa có dữ liệu sản phẩm trong nhật ký. Khi bạn ghi nhận sản phẩm
            đã dùng, SkinWise sẽ giúp bạn nhìn lại thói quen sử dụng.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
