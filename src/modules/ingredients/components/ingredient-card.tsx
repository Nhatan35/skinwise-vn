import Link from "next/link";

import type { IngredientDto } from "@/modules/ingredients/ingredient.dto";
import type { IngredientEvidenceLevel } from "@/modules/ingredients/ingredient.types";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

const evidenceLevelLabels: Record<IngredientEvidenceLevel, string> = {
  basic: "Thông tin cơ bản",
  moderate: "Mức tham khảo vừa",
  strong: "Mức tham khảo tốt",
  uncertain: "Chưa chắc chắn",
};

type IngredientCardProps = {
  ingredient: IngredientDto;
};

function formatUpdatedAt(value: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
  }).format(new Date(value));
}

function getPreviewValues(values: string[], limit = 4) {
  return {
    hiddenCount: Math.max(0, values.length - limit),
    visibleValues: values.slice(0, limit),
  };
}

export function IngredientCard({ ingredient }: IngredientCardProps) {
  return (
    <Card className="h-full" data-testid="ingredient-card">
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="text-xl">{ingredient.inciName}</CardTitle>
            {ingredient.aliases.length > 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">
                Còn được biết đến như {ingredient.aliases.slice(0, 2).join(", ")}
                {ingredient.aliases.length > 2
                  ? `, +${ingredient.aliases.length - 2} tên khác`
                  : ""}
              </p>
            ) : null}
          </div>
          <Badge variant="secondary">
            {evidenceLevelLabels[ingredient.evidenceLevel]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <BadgeGroup
          label="Công dụng"
          values={ingredient.functions}
          variant="secondary"
        />
        <TextList label="Cách dùng thường gặp" values={ingredient.commonUses} />
        <BadgeGroup label="Có thể phù hợp" values={ingredient.suitableFor} />

        <p className="border-t border-border pt-4 text-xs text-muted-foreground">
          Cập nhật {formatUpdatedAt(ingredient.updatedAt)}
        </p>

        <div className="border-t border-border pt-4">
          <Button
            asChild
            aria-label={`Xem chi tiết thành phần ${ingredient.inciName}`}
            variant="outline"
          >
            <Link href={`/ingredients/${ingredient.id}`}>Xem chi tiết</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

type BadgeGroupProps = {
  label: string;
  values: string[];
  variant?: "outline" | "secondary";
};

function BadgeGroup({
  label,
  values,
  variant = "outline",
}: BadgeGroupProps) {
  if (values.length === 0) {
    return null;
  }

  const { hiddenCount, visibleValues } = getPreviewValues(values);

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-foreground">{label}</h3>
      <div className="flex flex-wrap gap-2">
        {visibleValues.map((value) => (
          <Badge key={value} variant={variant}>
            {value}
          </Badge>
        ))}
        {hiddenCount > 0 ? (
          <Badge variant="outline">+{hiddenCount} mục khác</Badge>
        ) : null}
      </div>
    </div>
  );
}

type TextListProps = {
  label: string;
  values: string[];
};

function TextList({ label, values }: TextListProps) {
  if (values.length === 0) {
    return null;
  }

  const { hiddenCount, visibleValues } = getPreviewValues(values, 3);

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-foreground">{label}</h3>
      <ul className="list-disc space-y-1 pl-5 text-sm leading-6 text-muted-foreground">
        {visibleValues.map((value) => (
          <li key={value}>{value}</li>
        ))}
      </ul>
      {hiddenCount > 0 ? (
        <p className="text-xs text-muted-foreground">
          +{hiddenCount} mục khác
        </p>
      ) : null}
    </div>
  );
}
