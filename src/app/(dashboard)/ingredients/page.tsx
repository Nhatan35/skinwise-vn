import { IngredientLibrary } from "@/modules/ingredients/components/ingredient-library";
import { routes } from "@/shared/constants/routes";

export default function IngredientsPage() {
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

      <IngredientLibrary />
    </section>
  );
}
