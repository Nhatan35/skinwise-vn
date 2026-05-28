"use client";

import { Sparkles } from "lucide-react";
import { useState } from "react";

import {
  explainIngredient,
  IngredientClientError,
} from "@/modules/ingredients/ingredient.client";
import type { IngredientExplanationDto } from "@/modules/ingredients/ingredient-explanation.dto";
import { ErrorState } from "@/shared/components/error-state";
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

type IngredientExplanationPanelProps = {
  ingredientName: string;
};

function getExplanationError(error: unknown) {
  if (error instanceof IngredientClientError) {
    if (error.code === "RATE_LIMITED" || error.status === 429) {
      return {
        message:
          "Explanation requests are temporarily limited. Please try again later.",
        title: "Explanation limit reached",
      };
    }

    if (error.code === "UNAUTHORIZED" || error.status === 401) {
      return {
        message: "You need to sign in to request ingredient explanations.",
        title: "Sign in required",
      };
    }

    if (error.code === "VALIDATION_ERROR" || error.status === 400) {
      return {
        message:
          "This ingredient name could not be explained. Try opening the ingredient again.",
        title: "Ingredient explanation could not run",
      };
    }

    return {
      message: error.message,
      title: "Ingredient explanation could not load",
    };
  }

  return {
    message: "Could not explain this ingredient. Please try again.",
    title: "Ingredient explanation could not load",
  };
}

export function IngredientExplanationPanel({
  ingredientName,
}: IngredientExplanationPanelProps) {
  const [explanation, setExplanation] =
    useState<IngredientExplanationDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{
    message: string;
    title: string;
  } | null>(null);

  async function handleExplain() {
    setIsLoading(true);
    setError(null);

    try {
      const nextExplanation = await explainIngredient({ ingredientName });

      setExplanation(nextExplanation);
    } catch (loadError) {
      setExplanation(null);
      setError(getExplanationError(loadError));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card
      className="border-border bg-card"
      data-testid="ingredient-explanation-panel"
    >
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle>Ingredient explanation</CardTitle>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Request a beginner-friendly explanation through the existing
              provider flow. Explanations are educational and may use a safe
              fallback when the AI service is unavailable or disabled.
            </p>
          </div>
          <Button disabled={isLoading} onClick={handleExplain} type="button">
            <Sparkles aria-hidden="true" />
            {isLoading ? "Đang giải thích..." : "Giải thích thành phần này"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">
            Loading ingredient explanation...
          </p>
        ) : null}

        {error ? (
          <ErrorState description={error.message} title={error.title} />
        ) : null}

        {explanation ? <ExplanationResult explanation={explanation} /> : null}
      </CardContent>
    </Card>
  );
}

type ExplanationResultProps = {
  explanation: IngredientExplanationDto;
};

function ExplanationResult({ explanation }: ExplanationResultProps) {
  const sourceLabel = explanation.source === "ai" ? "AI" : "Fallback";

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary">{sourceLabel}</Badge>
        <span className="text-sm font-medium text-foreground">
          {explanation.ingredientName}
        </span>
      </div>

      {explanation.source === "fallback" ? (
        <Alert>
          <AlertTitle>Safe fallback response</AlertTitle>
          <AlertDescription>
            This explanation uses a safe fallback response because the AI
            explanation service is unavailable or disabled.
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-foreground">
          Simple explanation
        </h3>
        <p className="text-sm leading-6 text-muted-foreground">
          {explanation.simpleExplanation}
        </p>
      </div>

      <TextList label="Common uses" values={explanation.commonUses} />
      <TextList label="May suit" values={explanation.suitableFor} />
      <TextList label="Use extra caution" values={explanation.cautions} />
      <TextList label="Avoid with" values={explanation.avoidWith} />

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-foreground">Beginner advice</h3>
        <p className="text-sm leading-6 text-muted-foreground">
          {explanation.beginnerAdvice}
        </p>
      </div>

      <p className="border-t border-border pt-4 text-sm leading-6 text-muted-foreground">
        {explanation.disclaimer}
      </p>
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
