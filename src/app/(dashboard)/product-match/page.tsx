import { ProductMatchPage } from "@/modules/product-match/components/product-match-page";
import { productMatchRoute } from "@/modules/dashboard/dashboard-shell.config";

export default function PersonalizedProductMatchPage() {
  return (
    <section className="space-y-6" data-route={productMatchRoute}>
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm shadow-stone-950/5">
        <p className="text-sm font-semibold text-primary">{productMatchRoute}</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
          Gợi ý sản phẩm phù hợp
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
          Gợi ý sản phẩm dựa trên hồ sơ da của bạn. Đây là thông tin tham
          khảo, không phải tư vấn y tế.
        </p>
      </div>

      <ProductMatchPage />
    </section>
  );
}
