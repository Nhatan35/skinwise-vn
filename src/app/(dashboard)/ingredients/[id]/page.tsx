import { IngredientDetail } from "@/modules/ingredients/components/ingredient-detail";

type IngredientDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function IngredientDetailPage({
  params,
}: IngredientDetailPageProps) {
  const { id } = await params;

  return <IngredientDetail ingredientId={id} />;
}
