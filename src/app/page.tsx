import Link from "next/link";

import { appConfig } from "@/config/app";
import { routes } from "@/shared/constants/routes";

const featureCards = [
  {
    title: "Theo dõi routine",
    description:
      "Tạo routine sáng hoặc tối, ghi nhận từng ngày và giữ việc skincare đơn giản hơn.",
  },
  {
    title: "Nhật ký da cá nhân",
    description:
      "Ghi lại quan sát, triệu chứng, giấc ngủ, stress và sản phẩm đã dùng trong ngày.",
  },
  {
    title: "Xem lại sản phẩm",
    description:
      "Lưu sản phẩm bạn muốn cân nhắc và xem thông tin thành phần trước khi thêm vào routine.",
  },
  {
    title: "Giải thích thành phần",
    description:
      "Đọc thông tin giáo dục về thành phần mỹ phẩm bằng ngôn ngữ dễ hiểu, không thay thế tư vấn y tế.",
  },
];

const previewCards = [
  ["Routine hôm nay", "2 routine cần ghi nhận", "Ghi nhận routine"],
  ["Nhật ký da", "Chưa có ghi chú hôm nay", "Thêm nhật ký"],
  ["Thành phần", "Có thể cần xem lại", "Xem giải thích"],
  ["Sản phẩm đã lưu", "Dùng để cân nhắc routine", "Xem danh sách"],
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden px-4 py-5 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-7xl">
        <nav className="flex flex-col gap-4 rounded-3xl border border-white/70 bg-card/85 px-5 py-4 shadow-sm shadow-stone-950/5 backdrop-blur md:flex-row md:items-center md:justify-between">
          <Link
            className="text-lg font-semibold tracking-tight text-foreground"
            href={routes.HOME}
          >
            {appConfig.name}
          </Link>
          <div className="flex flex-wrap gap-2 text-sm font-medium text-muted-foreground">
            <Link className="rounded-full px-3 py-2 hover:bg-secondary" href="#features">
              Tính năng
            </Link>
            <Link className="rounded-full px-3 py-2 hover:bg-secondary" href="#how-it-works">
              Cách hoạt động
            </Link>
            <Link className="rounded-full px-3 py-2 hover:bg-secondary" href={routes.PRODUCTS}>
              Khám phá sản phẩm
            </Link>
          </div>
          <Link
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/15 hover:bg-primary/90"
            href={routes.DASHBOARD}
          >
            Bắt đầu theo dõi
          </Link>
        </nav>

        <div className="grid gap-8 py-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:py-16">
          <section className="space-y-8">
            <div className="inline-flex rounded-full border border-border bg-card/80 px-4 py-2 text-sm font-semibold text-primary shadow-sm">
              SkinWise Simple Skincare Bento UI
            </div>
            <div className="space-y-5">
              <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-7xl">
                Xây dựng routine skincare phù hợp hơn với làn da của bạn.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
                Theo dõi routine hằng ngày, ghi lại thay đổi của da và xem lại
                sản phẩm với thông tin thành phần dễ hiểu.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                className="inline-flex min-h-12 items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/15 hover:bg-primary/90"
                href={routes.DASHBOARD}
              >
                Bắt đầu theo dõi
              </Link>
              <Link
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground shadow-sm shadow-stone-950/5 hover:bg-secondary"
                href={routes.PRODUCTS}
              >
                Khám phá sản phẩm
              </Link>
            </div>
            <p className="max-w-2xl text-xs leading-6 text-muted-foreground">
              Thông tin trong SkinWise VN chỉ mang tính giáo dục và không thay
              thế tư vấn từ bác sĩ da liễu.
            </p>
          </section>

          <section aria-label="SkinWise preview" className="relative">
            <div className="absolute inset-0 -rotate-3 rounded-[2.5rem] bg-accent/30 blur-2xl" />
            <div className="relative grid gap-4 rounded-[2rem] border border-white/70 bg-card/85 p-4 shadow-2xl shadow-stone-950/10 backdrop-blur sm:grid-cols-2 sm:p-6">
              {previewCards.map(([title, status, action], index) => (
                <div
                  className={
                    index === 0
                      ? "rounded-3xl border border-border bg-secondary p-5 sm:col-span-2"
                      : "rounded-3xl border border-border bg-card p-5"
                  }
                  key={title}
                >
                  <div className="mb-6 size-12 rounded-2xl bg-primary/10" />
                  <h2 className="text-lg font-semibold text-foreground">{title}</h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{status}</p>
                  <p className="mt-5 text-sm font-semibold text-primary">{action}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="grid gap-4 py-8 md:grid-cols-2 xl:grid-cols-4" id="features">
          {featureCards.map((feature) => (
            <article
              className="rounded-3xl border border-border bg-card p-6 shadow-sm shadow-stone-950/5"
              key={feature.title}
            >
              <div className="mb-5 size-11 rounded-2xl bg-secondary" />
              <h2 className="text-lg font-semibold tracking-tight text-foreground">
                {feature.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {feature.description}
              </p>
            </article>
          ))}
        </section>

        <section
          className="my-10 rounded-[2rem] border border-border bg-card p-6 shadow-sm shadow-stone-950/5 md:p-8"
          id="how-it-works"
        >
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-primary">Cách SkinWise hoạt động</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
              Bắt đầu nhẹ nhàng, theo dõi đều đặn.
            </h2>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              ["01", "Hoàn thiện hồ sơ da", "Thêm loại da, mối quan tâm và mục tiêu chăm sóc."],
              ["02", "Tạo routine", "Xây dựng routine sáng hoặc tối từ sản phẩm có sẵn hoặc sản phẩm tự nhập."],
              ["03", "Theo dõi mỗi ngày", "Ghi nhận routine và nhật ký để dễ nhìn lại thói quen theo thời gian."],
            ].map(([step, title, description]) => (
              <article className="rounded-3xl bg-secondary p-5" key={step}>
                <p className="text-sm font-semibold text-primary">{step}</p>
                <h3 className="mt-4 text-lg font-semibold text-foreground">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mb-10 rounded-[2rem] bg-primary p-6 text-primary-foreground shadow-xl shadow-primary/20 md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">
                Sẵn sàng theo dõi routine hôm nay?
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-primary-foreground/85">
                Vào dashboard để hoàn thiện hồ sơ da, tạo routine và bắt đầu ghi
                nhận skincare một cách đơn giản.
              </p>
            </div>
            <Link
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-primary hover:bg-white/90"
              href={routes.DASHBOARD}
            >
              Bắt đầu theo dõi
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}
