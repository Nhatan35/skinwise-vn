import { Pencil, Trash2 } from "lucide-react";

import type { SkinJournalDto } from "@/modules/journals/skin-journal.dto";
import {
  resolveJournalProductLabels,
  type ProductLookup,
} from "@/modules/journals/skin-journal-product-display";
import type {
  SkinJournalStressLevel,
  SkinJournalSymptom,
} from "@/modules/journals/skin-journal.types";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

const symptomLabels: Record<SkinJournalSymptom, string> = {
  dryness: "Dryness",
  oiliness: "Oiliness",
  redness: "Redness",
  stinging: "Stinging",
  new_breakouts: "New breakouts",
  itchiness: "Itchiness",
  other: "Other",
};

const stressLabels: Record<SkinJournalStressLevel, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

type SkinJournalEntryCardProps = {
  entry: SkinJournalDto;
  isDeleting: boolean;
  onDelete: (entry: SkinJournalDto) => void;
  onEdit: (entry: SkinJournalDto) => void;
  productLookup: ProductLookup;
};

function formatLocalDate(localDate: string) {
  const [year, month, day] = localDate.split("-").map(Number);

  if (!year || !month || !day) {
    return localDate;
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(new Date(year, month - 1, day));
}

function formatUpdatedAt(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function SkinJournalEntryCard({
  entry,
  isDeleting,
  onDelete,
  onEdit,
  productLookup,
}: SkinJournalEntryCardProps) {
  const productLabels = resolveJournalProductLabels(
    entry.productsUsed,
    productLookup,
  );

  return (
    <Card className="border-stone-200 bg-white">
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle>{formatLocalDate(entry.localDate)}</CardTitle>
            <p className="mt-2 text-sm text-stone-600">
              {entry.localDate} - {entry.timezone}
            </p>
            <p className="mt-1 text-sm text-stone-600">
              Updated {formatUpdatedAt(entry.updatedAt)}
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button onClick={() => onEdit(entry)} type="button" variant="outline">
              <Pencil aria-hidden="true" />
              Edit
            </Button>
            <Button
              disabled={isDeleting}
              onClick={() => onDelete(entry)}
              type="button"
              variant="destructive"
            >
              <Trash2 aria-hidden="true" />
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-stone-900">Symptoms</h3>
          {entry.symptoms.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {entry.symptoms.map((symptom) => (
                <Badge key={symptom} variant="secondary">
                  {symptomLabels[symptom]}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-stone-600">No symptoms selected.</p>
          )}
        </div>

        <JournalList label="Observations" values={entry.observations} />
        <JournalProductList productLabels={productLabels} />

        <div className="grid gap-3 sm:grid-cols-2">
          <JournalDetail
            label="Sleep"
            value={
              entry.sleepHours !== undefined
                ? `${entry.sleepHours} hours`
                : "Not tracked"
            }
          />
          <JournalDetail
            label="Stress"
            value={
              entry.stressLevel ? stressLabels[entry.stressLevel] : "Not tracked"
            }
          />
        </div>

        {entry.notes ? (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-stone-900">Notes</h3>
            <p className="whitespace-pre-wrap text-sm leading-6 text-stone-700">
              {entry.notes}
            </p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

type JournalProductListProps = {
  productLabels: {
    id: string;
    label: string;
  }[];
};

function JournalProductList({ productLabels }: JournalProductListProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-stone-900">Products used</h3>
      {productLabels.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {productLabels.map((productLabel, index) => (
            <Badge key={`${productLabel.id}-${index}`} variant="outline">
              {productLabel.label}
            </Badge>
          ))}
        </div>
      ) : (
        <p className="text-sm text-stone-600">No products recorded.</p>
      )}
    </div>
  );
}

type JournalDetailProps = {
  label: string;
  value: string;
};

function JournalDetail({ label, value }: JournalDetailProps) {
  return (
    <div className="border border-stone-200 bg-stone-50 p-3">
      <dt className="text-sm font-medium text-stone-700">{label}</dt>
      <dd className="mt-1 text-sm font-semibold text-stone-950">{value}</dd>
    </div>
  );
}

type JournalListProps = {
  label: string;
  values: string[];
};

function JournalList({ label, values }: JournalListProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-stone-900">{label}</h3>
      {values.length > 0 ? (
        <ul className="space-y-1 text-sm text-stone-700">
          {values.map((value) => (
            <li key={value}>{value}</li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-stone-600">No items recorded.</p>
      )}
    </div>
  );
}
