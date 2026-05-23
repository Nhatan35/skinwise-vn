import { SkinJournalTimeline } from "@/modules/journals/components/skin-journal-timeline";
import { routes } from "@/shared/constants/routes";

export default function JournalPage() {
  return (
    <section className="space-y-6" data-route={routes.JOURNAL}>
      <div className="border border-stone-200 bg-white p-6">
        <p className="text-sm font-medium text-emerald-700">Skin Journal</p>
        <h2 className="mt-2 text-3xl font-semibold">Skin Journal</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-600">
          Track your daily skin condition, symptoms, routine context, sleep,
          stress, and notes.
        </p>
      </div>

      <SkinJournalTimeline />
    </section>
  );
}
