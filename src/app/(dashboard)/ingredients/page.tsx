import { IngredientLibrary } from "@/modules/ingredients/components/ingredient-library";
import { routes } from "@/shared/constants/routes";

export default function IngredientsPage() {
  return (
    <section className="space-y-6" data-route={routes.INGREDIENTS}>
      <div className="border border-stone-200 bg-white p-6">
        <p className="text-sm font-medium text-emerald-700">
          Ingredient Library
        </p>
        <h2 className="mt-2 text-3xl font-semibold">Skincare ingredients</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-600">
          Learn what common skincare ingredients do, who they may suit, and when
          to use extra caution. Ingredient information is educational and does
          not replace professional advice.
        </p>
      </div>

      <IngredientLibrary />
    </section>
  );
}
