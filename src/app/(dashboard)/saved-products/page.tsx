import { SavedProductsPage } from "@/modules/saved-products/components/saved-products-page";
import { routes } from "@/shared/constants/routes";

export default function SavedProductsRoutePage() {
  return (
    <section className="space-y-6" data-route={routes.SAVED_PRODUCTS}>
      <div className="border border-stone-200 bg-white p-6">
        <p className="text-sm font-medium text-emerald-700">
          Saved Products
        </p>
        <h2 className="mt-2 text-3xl font-semibold">Your saved products</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-600">
          Keep track of skincare products you want to revisit or use in your
          routine planning.
        </p>
      </div>

      <SavedProductsPage />
    </section>
  );
}
