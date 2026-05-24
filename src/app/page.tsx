import Link from "next/link";

import { appConfig } from "@/config/app";
import { routes } from "@/shared/constants/routes";

export default function Home() {
  const implementedItems = [
    "Skin profile and onboarding",
    "Routine builder and routine logs",
    "Product catalogue and detail pages",
    "Private journal timeline",
    "Dashboard summaries",
    "Deterministic routine safety analysis",
  ];

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,#d7f5e8,transparent_32rem),linear-gradient(135deg,#fffaf0_0%,#f7efe2_45%,#e7f2ec_100%)] px-6 py-10">
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl flex-col justify-between rounded-2xl border border-white/70 bg-white/75 p-8 shadow-2xl shadow-stone-300/40 backdrop-blur md:p-12">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="rounded-full bg-emerald-950 px-4 py-2 text-sm font-semibold tracking-wide text-emerald-50">
            Post Week 6 MVP cleanup
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
            <h1 className="max-w-3xl text-5xl font-semibold leading-tight text-stone-950 md:text-7xl">
              {appConfig.name}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-700">
              {appConfig.description} The MVP is in cleanup, validation, and
              deployment preparation after the core Week 1-6 implementation.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                className="inline-flex min-h-11 items-center justify-center bg-emerald-950 px-5 text-sm font-semibold text-white"
                href={routes.DASHBOARD}
              >
                Open dashboard
              </Link>
              <Link
                className="inline-flex min-h-11 items-center justify-center border border-stone-300 bg-white px-5 text-sm font-semibold text-stone-900"
                href={routes.PRODUCTS}
              >
                Browse products
              </Link>
            </div>
          </div>

          <div className="border border-emerald-900/10 bg-emerald-50 p-6">
            <h2 className="text-lg font-semibold text-emerald-950">
              Implemented MVP areas
            </h2>
            <ul className="mt-5 space-y-3 text-sm leading-6 text-emerald-950/80">
              {implementedItems.map((item) => (
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
              Current phase
            </p>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              Security cleanup, documentation synchronization, local validation,
              deployment preparation, and portfolio readiness.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-stone-900">
              Safety boundary
            </p>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              Educational skincare guidance only. No diagnosis, prescriptions,
              treatment guarantees, skin scoring, or appearance rating.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
