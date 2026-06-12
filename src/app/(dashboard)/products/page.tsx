import { ProductCatalogue } from "@/modules/products/components/product-catalogue";
import { routes } from "@/shared/constants/routes";

type ProductsPageProps = {
  searchParams?: Promise<{
    q?: string | string[];
  }>;
};

function getInitialQuery(searchParams?: { q?: string | string[] }) {
  const q = searchParams?.q;

  if (Array.isArray(q)) {
    return q[0] ?? "";
  }

  return q ?? "";
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const initialQuery = getInitialQuery(resolvedSearchParams);

  return (
    <section className="space-y-6" data-route={routes.PRODUCTS}>
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm shadow-stone-950/5">
        <p className="text-sm font-semibold text-primary">Product Catalogue</p>
        <h2
          aria-label="Sản phẩm skincare"
          className="mt-2 text-3xl font-semibold tracking-tight text-foreground"
        >
          Sản phẩm skincare
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
          Tìm kiếm và lọc sản phẩm theo danh mục, mức giá, loại da hoặc mối quan
          tâm. Thông tin sản phẩm chỉ mang tính giáo dục và không thay thế tư
          vấn chuyên môn.
        </p>
      </div>

      <ProductCatalogue initialQuery={initialQuery} />
    </section>
  );
}
