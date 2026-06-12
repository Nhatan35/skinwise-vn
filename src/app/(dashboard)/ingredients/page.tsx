import { IngredientLibrary } from "@/modules/ingredients/components/ingredient-library";
import { routes } from "@/shared/constants/routes";

type IngredientsPageProps = {
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

export default async function IngredientsPage({
  searchParams,
}: IngredientsPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const initialQuery = getInitialQuery(resolvedSearchParams);

  return (
    <section className="space-y-6" data-route={routes.INGREDIENTS}>
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm shadow-stone-950/5">
        <p className="text-sm font-semibold text-primary">Thành phần</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
          Thành phần chăm sóc da
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
          Tìm hiểu công dụng thường gặp, trường hợp có thể phù hợp và những điểm
          cần thận trọng trước khi đưa thành phần vào routine. Nội dung chỉ mang
          tính giáo dục.
        </p>
      </div>

      <IngredientLibrary initialQuery={initialQuery} />
    </section>
  );
}
