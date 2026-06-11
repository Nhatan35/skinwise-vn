import type { ReactNode } from "react";

import { X } from "lucide-react";
import Link from "next/link";

import type {
  ProductCategory,
  ProductConcern,
  ProductPriceRange,
  ProductSkinType,
} from "@/modules/products/product.types";
import type { SavedProductDto } from "@/modules/saved-products/saved-product.dto";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { routes } from "@/shared/constants/routes";

type SavedProductsComparisonPanelProps = {
  items: SavedProductDto[];
  onClear: () => void;
};

type ComparisonRow = {
  label: string;
  render: (item: SavedProductDto) => ReactNode;
};

const fallbackCopy = "Chưa có dữ liệu";

const categoryLabels: Record<ProductCategory, string> = {
  cleanser: "Sữa rửa mặt",
  moisturizer: "Dưỡng ẩm",
  sunscreen: "Chống nắng",
  treatment: "Sản phẩm hoạt chất",
  toner: "Toner",
  serum: "Serum",
  mask: "Mặt nạ",
  other: "Khác",
};

const priceRangeLabels: Record<ProductPriceRange, string> = {
  budget: "Tiết kiệm",
  mid: "Tầm trung",
  premium: "Cao cấp",
  unknown: "Chưa rõ giá",
};

const skinTypeLabels: Record<ProductSkinType, string> = {
  oily: "Da dầu",
  dry: "Da khô",
  combination: "Da hỗn hợp",
  normal: "Da thường",
  sensitive: "Da nhạy cảm",
  unknown: "Chưa rõ",
};

const concernLabels: Record<ProductConcern, string> = {
  acne: "Mụn",
  oiliness: "Dầu thừa",
  dryness: "Khô căng",
  redness: "Đỏ da",
  dark_spots: "Thâm/đốm tối màu",
  texture: "Bề mặt da",
  barrier_support: "Hỗ trợ hàng rào da",
  unknown: "Chưa rõ",
};

const comparisonRows: ComparisonRow[] = [
  {
    label: "Tên / thương hiệu",
    render: (item) => <ProductNameCell item={item} />,
  },
  {
    label: "Danh mục",
    render: (item) => categoryLabels[item.product.category],
  },
  {
    label: "Khoảng giá",
    render: (item) => priceRangeLabels[item.product.priceRange],
  },
  {
    label: "Loại da",
    render: (item) => (
      <BadgeList
        values={item.product.skinTypes.map(
          (skinType) => skinTypeLabels[skinType],
        )}
      />
    ),
  },
  {
    label: "Mối quan tâm",
    render: (item) => (
      <BadgeList
        values={item.product.concerns.map((concern) => concernLabels[concern])}
      />
    ),
  },
  {
    label: "Hoạt chất chính",
    render: (item) => (
      <BadgeList values={item.product.keyActives} variant="secondary" />
    ),
  },
  {
    label: "Cần cân nhắc nếu",
    render: (item) => <TextList values={item.product.warnings} />,
  },
  {
    label: "Có thể phù hợp khi",
    render: (item) => <TextList values={item.product.suitableFor} />,
  },
  {
    label: "Không phù hợp trong các trường hợp",
    render: (item) => <TextList values={item.product.notRecommendedFor} />,
  },
  {
    label: "Chi tiết",
    render: (item) => (
      <Button asChild size="sm" variant="outline">
        <Link href={`${routes.PRODUCTS}/${item.product.id}`}>
          Xem chi tiết
        </Link>
      </Button>
    ),
  },
];

export function SavedProductsComparisonPanel({
  items,
  onClear,
}: SavedProductsComparisonPanelProps) {
  return (
    <Card data-testid="saved-products-comparison-panel">
      <CardHeader className="gap-3 sm:grid-cols-[1fr_auto] sm:items-start">
        <div>
          <CardTitle className="text-xl">So sánh sản phẩm đã lưu</CardTitle>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Thông tin chỉ mang tính giáo dục, không thay thế tư vấn y khoa.
          </p>
        </div>
        <Button
          data-testid="clear-saved-products-comparison"
          onClick={onClear}
          type="button"
          variant="outline"
        >
          <X aria-hidden="true" />
          Xóa lựa chọn so sánh
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-separate border-spacing-0 text-left text-sm">
            <thead>
              <tr>
                <th className="w-44 border-b border-border pb-3 pr-4 text-xs font-semibold uppercase text-muted-foreground">
                  Thông tin
                </th>
                {items.map((item) => (
                  <th
                    className="border-b border-border px-4 pb-3 text-sm font-semibold text-foreground"
                    key={item.productId}
                    scope="col"
                  >
                    {item.product.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row) => (
                <tr key={row.label}>
                  <th
                    className="border-b border-border/70 py-4 pr-4 align-top text-sm font-semibold text-foreground"
                    scope="row"
                  >
                    {row.label}
                  </th>
                  {items.map((item) => (
                    <td
                      className="border-b border-border/70 px-4 py-4 align-top text-muted-foreground"
                      key={`${item.productId}-${row.label}`}
                    >
                      {row.render(item)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function ProductNameCell({ item }: { item: SavedProductDto }) {
  return (
    <div className="space-y-1">
      <p className="font-semibold text-foreground">{item.product.name}</p>
      <p className="text-sm text-muted-foreground">
        {item.product.brand || fallbackCopy}
      </p>
    </div>
  );
}

function BadgeList({
  values,
  variant = "outline",
}: {
  values: string[];
  variant?: "outline" | "secondary";
}) {
  if (values.length === 0) {
    return <FallbackText />;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {values.map((value, index) => (
        <Badge key={`${value}-${index}`} variant={variant}>
          {value}
        </Badge>
      ))}
    </div>
  );
}

function TextList({ values }: { values: string[] }) {
  if (values.length === 0) {
    return <FallbackText />;
  }

  return (
    <ul className="list-disc space-y-1 pl-5 text-sm leading-6">
      {values.map((value, index) => (
        <li key={`${value}-${index}`}>{value}</li>
      ))}
    </ul>
  );
}

function FallbackText() {
  return <span className="text-muted-foreground">{fallbackCopy}</span>;
}
