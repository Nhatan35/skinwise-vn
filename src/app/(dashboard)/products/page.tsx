import { ProductCatalogue } from "@/modules/products/components/product-catalogue";
import { routes } from "@/shared/constants/routes";

export default function ProductsPage() {
  return (
    <section className="space-y-6" data-route={routes.PRODUCTS}>
      <div className="border border-stone-200 bg-white p-6">
        <p className="text-sm font-medium text-emerald-700">
          Product Catalogue
        </p>
        <h2 className="mt-2 text-3xl font-semibold">Skincare products</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-600">
          Browse reviewed skincare products and filter by category, price range,
          skin type, or concern. Product information is educational and does not
          replace professional advice.
        </p>
      </div>

      <ProductCatalogue />
    </section>
  );
}
