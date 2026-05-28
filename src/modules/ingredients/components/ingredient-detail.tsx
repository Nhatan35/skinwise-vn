"use client";

import { ArrowLeft, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { IngredientExplanationPanel } from "@/modules/ingredients/components/ingredient-explanation-panel";
import {
  getIngredient,
  IngredientClientError,
} from "@/modules/ingredients/ingredient.client";
import type { IngredientDto } from "@/modules/ingredients/ingredient.dto";
import type { IngredientEvidenceLevel } from "@/modules/ingredients/ingredient.types";
import { EmptyState } from "@/shared/components/empty-state";
import { ErrorState } from "@/shared/components/error-state";
import { LoadingState } from "@/shared/components/loading-state";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/shared/components/ui/alert";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

type IngredientDetailProps = {
  ingredientId: string;
};

const evidenceLevelLabels: Record<IngredientEvidenceLevel, string> = {
  basic: "Basic evidence",
  moderate: "Moderate evidence",
  strong: "Strong evidence",
  uncertain: "Uncertain evidence",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(new Date(value));
}

function getLoadError(error: unknown) {
  if (error instanceof IngredientClientError) {
    return {
      message: error.message,
      status: error.status,
    };
  }

  return {
    message: "Could not load the ingredient details.",
    status: 500,
  };
}

export function IngredientDetail({ ingredientId }: IngredientDetailProps) {
  const [ingredient, setIngredient] = useState<IngredientDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<{
    message: string;
    status: number;
  } | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isMounted = true;

    async function loadIngredientDetail() {
      setIsLoading(true);
      setLoadError(null);
      setIngredient(null);

      try {
        const loadedIngredient = await getIngredient(ingredientId);

        if (!isMounted) {
          return;
        }

        setIngredient(loadedIngredient);
      } catch (error) {
        if (isMounted) {
          setLoadError(getLoadError(error));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadIngredientDetail();

    return () => {
      isMounted = false;
    };
  }, [ingredientId, reloadKey]);

  if (isLoading) {
    return (
      <Card className="border-border bg-card">
        <CardContent>
          <LoadingState label="Loading ingredient details" />
        </CardContent>
      </Card>
    );
  }

  if (loadError?.status === 404) {
    return (
      <EmptyState
        action={<BackToIngredientsButton />}
        description="This ingredient may be unavailable in the library."
        title="Ingredient not found"
      />
    );
  }

  if (loadError) {
    return (
      <ErrorState
        action={
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              onClick={() => setReloadKey((current) => current + 1)}
              type="button"
            >
              <RotateCcw aria-hidden="true" />
              Thử lại
            </Button>
            <BackToIngredientsButton />
          </div>
        }
        description={loadError.message}
        title="Ingredient details could not load"
      />
    );
  }

  if (!ingredient) {
    return (
      <EmptyState
        action={<BackToIngredientsButton />}
        description="Try returning to the ingredient library and opening the ingredient again."
        title="Ingredient not found"
      />
    );
  }

  return (
    <article className="space-y-4">
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm font-medium text-emerald-700">
                Ingredient Library
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-foreground">
                {ingredient.inciName}
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge variant="secondary">
                  {evidenceLevelLabels[ingredient.evidenceLevel]}
                </Badge>
                {ingredient.functions.slice(0, 3).map((value) => (
                  <Badge key={value} variant="outline">
                    {value}
                  </Badge>
                ))}
              </div>
            </div>
            <BackToIngredientsButton />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">
            Ingredient ID: {ingredient.id} - Updated{" "}
            {formatDate(ingredient.updatedAt)}
          </p>
        </CardContent>
      </Card>

      <Alert>
        <AlertTitle>Educational ingredient details</AlertTitle>
        <AlertDescription>
          Ingredient information is provided for education only. It does not
          diagnose skin conditions, replace professional advice, or guarantee
          that an ingredient is suitable for every person.
        </AlertDescription>
      </Alert>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle>Ingredient information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <DetailField
            label="INCI name"
            value={ingredient.inciName}
          />
          <DetailField
            label="Evidence level"
            value={evidenceLevelLabels[ingredient.evidenceLevel]}
          />
          <DetailField label="Created" value={formatDate(ingredient.createdAt)} />
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle>Common names and functions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <BadgeGroup label="Aliases" values={ingredient.aliases} />
          <BadgeGroup
            label="Functions"
            values={ingredient.functions}
            variant="secondary"
          />
          <TextList label="Common uses" values={ingredient.commonUses} />
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle>Suitability and caution</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <BadgeGroup label="May suit" values={ingredient.suitableFor} />
          <TextList label="Use extra caution" values={ingredient.cautionFor} />
          <TextList label="Avoid with" values={ingredient.avoidWith} />
        </CardContent>
      </Card>

      {ingredient.sourceRefs.length > 0 ? (
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle>Source references</CardTitle>
          </CardHeader>
          <CardContent>
            <TextList label="References" values={ingredient.sourceRefs} />
          </CardContent>
        </Card>
      ) : null}

      <IngredientExplanationPanel ingredientName={ingredient.inciName} />
    </article>
  );
}

function BackToIngredientsButton() {
  return (
    <Button asChild variant="outline">
      <Link href="/ingredients">
        <ArrowLeft aria-hidden="true" />
        Back to ingredients
      </Link>
    </Button>
  );
}

type DetailFieldProps = {
  label: string;
  value: string;
};

function DetailField({ label, value }: DetailFieldProps) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium uppercase text-muted-foreground">{label}</p>
      <p className="text-sm text-foreground">{value}</p>
    </div>
  );
}

type BadgeGroupProps = {
  label: string;
  values: string[];
  variant?: "outline" | "secondary";
};

function BadgeGroup({ label, values, variant = "outline" }: BadgeGroupProps) {
  if (values.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-foreground">{label}</h3>
      <div className="flex flex-wrap gap-2">
        {values.map((value) => (
          <Badge key={value} variant={variant}>
            {value}
          </Badge>
        ))}
      </div>
    </div>
  );
}

type TextListProps = {
  label: string;
  values: string[];
};

function TextList({ label, values }: TextListProps) {
  if (values.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-foreground">{label}</h3>
      <ul className="list-disc space-y-1 pl-5 text-sm leading-6 text-muted-foreground">
        {values.map((value) => (
          <li key={value}>{value}</li>
        ))}
      </ul>
    </div>
  );
}
