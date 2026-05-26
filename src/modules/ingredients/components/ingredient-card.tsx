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
  basic: "Basic evidence",
  moderate: "Moderate evidence",
  strong: "Strong evidence",
  uncertain: "Uncertain evidence",
};

type IngredientCardProps = {
  ingredient: IngredientDto;
};

function formatUpdatedAt(value: string) {
  return new Intl.DateTimeFormat("en-US", {
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
    <Card className="border-stone-200 bg-white" data-testid="ingredient-card">
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="text-xl">{ingredient.inciName}</CardTitle>
            {ingredient.aliases.length > 0 ? (
              <p className="mt-2 text-sm text-stone-600">
                Also known as {ingredient.aliases.slice(0, 2).join(", ")}
                {ingredient.aliases.length > 2
                  ? `, +${ingredient.aliases.length - 2} more`
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
          label="Functions"
          values={ingredient.functions}
          variant="secondary"
        />
        <TextList label="Common uses" values={ingredient.commonUses} />
        <BadgeGroup label="May suit" values={ingredient.suitableFor} />

        <p className="border-t border-stone-200 pt-4 text-xs text-stone-500">
          Updated {formatUpdatedAt(ingredient.updatedAt)}
        </p>

        <div className="border-t border-stone-200 pt-4">
          <Button asChild variant="outline">
            <Link href={`/ingredients/${ingredient.id}`}>View details</Link>
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
      <h3 className="text-sm font-medium text-stone-900">{label}</h3>
      <div className="flex flex-wrap gap-2">
        {visibleValues.map((value) => (
          <Badge key={value} variant={variant}>
            {value}
          </Badge>
        ))}
        {hiddenCount > 0 ? <Badge variant="outline">+{hiddenCount} more</Badge> : null}
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
      <h3 className="text-sm font-medium text-stone-900">{label}</h3>
      <ul className="list-disc space-y-1 pl-5 text-sm leading-6 text-stone-700">
        {visibleValues.map((value) => (
          <li key={value}>{value}</li>
        ))}
      </ul>
      {hiddenCount > 0 ? (
        <p className="text-xs text-stone-500">+{hiddenCount} more</p>
      ) : null}
    </div>
  );
}
