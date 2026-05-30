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
        <CardTitle>Product usage in journal</CardTitle>
        <CardDescription>
          Products that appeared most often in your journal entries.
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
                <Badge variant="secondary">{product.count} entry(s)</Badge>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            No product usage data yet. Products that appear in journal entries
            will be summarized here.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
