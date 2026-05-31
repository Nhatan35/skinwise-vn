import type { ProductMatchResponseDto } from "@/modules/product-match/product-match.dto";
import { Badge } from "@/shared/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

type ProductMatchSummaryProps = {
  productMatch: ProductMatchResponseDto;
};

export function ProductMatchSummary({
  productMatch,
}: ProductMatchSummaryProps) {
  const profile = productMatch.skinProfileSummary;

  if (!profile) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skin Profile used for matching</CardTitle>
        <CardDescription>
          Product Match uses your saved profile, visible products, and
          deterministic rules.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        <Badge variant="secondary">Skin type: {profile.skinType}</Badge>
        <Badge variant="secondary">
          Sensitivity: {profile.sensitivityLevel}
        </Badge>
        <Badge variant="secondary">Budget: {profile.budgetRange}</Badge>
        <Badge variant="secondary">Experience: {profile.experienceLevel}</Badge>
        {profile.concerns.map((concern) => (
          <Badge key={concern} variant="outline">
            Concern: {concern}
          </Badge>
        ))}
        {profile.avoidIngredientsCount > 0 ? (
          <Badge variant="outline">
            Avoided ingredients: {profile.avoidIngredientsCount}
          </Badge>
        ) : null}
      </CardContent>
    </Card>
  );
}
