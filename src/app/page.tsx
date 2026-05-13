import { appConfig } from "@/config/app";
import { featureFlags } from "@/config/features";
import { routes } from "@/shared/constants/routes";

export default function Home() {
  const foundationItems = [
    "Next.js App Router foundation",
    "TypeScript strict mode",
    "Tailwind CSS base styling",
    "Vitest and Playwright config",
    "Safe feature flags for incomplete capabilities",
  ];

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,#d7f5e8,transparent_32rem),linear-gradient(135deg,#fffaf0_0%,#f7efe2_45%,#e7f2ec_100%)] px-6 py-10">
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl flex-col justify-between rounded-[2rem] border border-white/70 bg-white/75 p-8 shadow-2xl shadow-stone-300/40 backdrop-blur md:p-12">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="rounded-full bg-emerald-950 px-4 py-2 text-sm font-semibold tracking-wide text-emerald-50">
            Week 1 Foundation
          </p>
          <p className="text-sm font-medium text-stone-600">
            Route: {routes.HOME}
          </p>
        </div>

        <div className="grid gap-10 py-16 md:grid-cols-[1.2fr_0.8fr] md:items-end">
          <div>
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.25em] text-emerald-800">
              {appConfig.locale}
            </p>
            <h1 className="max-w-3xl text-5xl font-semibold leading-tight tracking-[-0.04em] text-stone-950 md:text-7xl">
              {appConfig.name}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-700">
              {appConfig.description} This foundation page does not provide
              medical diagnosis, treatment advice, AI output, or product
              recommendations.
            </p>
          </div>

          <div className="rounded-3xl border border-emerald-900/10 bg-emerald-50 p-6">
            <h2 className="text-lg font-semibold text-emerald-950">
              Foundation scope
            </h2>
            <ul className="mt-5 space-y-3 text-sm leading-6 text-emerald-950/80">
              {foundationItems.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 size-2 rounded-full bg-emerald-700" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid gap-4 border-t border-stone-200 pt-6 md:grid-cols-2">
          <div>
            <p className="text-sm font-semibold text-stone-900">
              Planned dashboard route
            </p>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              {routes.DASHBOARD} is reserved for the protected dashboard shell
              in Week 1. No dashboard behavior is implemented in this task.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-stone-900">
              Disabled capabilities
            </p>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              Routine analysis, ingredient explanation, image upload,
              marketplace, and notifications remain disabled:{" "}
              {Object.values(featureFlags).every((enabled) => !enabled)
                ? "all false"
                : "review required"}
              .
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
