import { SavedProductsPage } from "@/modules/saved-products/components/saved-products-page";
import { routes } from "@/shared/constants/routes";

export default function SavedProductsRoutePage() {
  return (
    <section className="space-y-6" data-route={routes.SAVED_PRODUCTS}>
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm shadow-stone-950/5">
        <p className="text-sm font-semibold text-primary">Saved Products</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
          Sản phẩm đã lưu
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
          Lưu các sản phẩm bạn muốn xem lại trước khi thêm vào routine. Đây là
          danh sách cân nhắc, không phải giỏ hàng mua sắm.
        </p>
      </div>

      <SavedProductsPage />
    </section>
  );
}
