import { IngredientDetail } from "@/modules/ingredients/components/ingredient-detail";

interface IngredientDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function IngredientDetailPage({
  params,
}: IngredientDetailPageProps) {
  const { id } = await params;

  return <IngredientDetail ingredientId={id} />;
}
