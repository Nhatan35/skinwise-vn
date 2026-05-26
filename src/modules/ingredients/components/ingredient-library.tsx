"use client";

import { RotateCcw, Search, X } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

import { IngredientCard } from "@/modules/ingredients/components/ingredient-card";
import {
  IngredientClientError,
  listIngredients,
  type IngredientListClientInput,
} from "@/modules/ingredients/ingredient.client";
import type { IngredientDto } from "@/modules/ingredients/ingredient.dto";
import { EmptyState } from "@/shared/components/empty-state";
import { ErrorState } from "@/shared/components/error-state";
import { LoadingState } from "@/shared/components/loading-state";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/shared/components/ui/alert";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

function toClientInput(query: string): IngredientListClientInput {
  const q = query.trim();

  return {
    limit: 50,
    ...(q ? { q } : {}),
  };
}

function getLoadErrorMessage(error: unknown) {
  if (error instanceof IngredientClientError) {
    return error.message;
  }

  return "Could not load the ingredient library.";
}

export function IngredientLibrary() {
  const [draftQuery, setDraftQuery] = useState("");
  const [activeQuery, setActiveQuery] = useState("");
  const [ingredients, setIngredients] = useState<IngredientDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isMounted = true;

    async function loadIngredientLibrary() {
      setIsLoading(true);
      setLoadError(null);

      try {
        const items = await listIngredients(toClientInput(activeQuery));

        if (!isMounted) {
          return;
        }

        setIngredients(items);
      } catch (error) {
        if (isMounted) {
          setIngredients([]);
          setLoadError(getLoadErrorMessage(error));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadIngredientLibrary();

    return () => {
      isMounted = false;
    };
  }, [activeQuery, reloadKey]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextQuery = draftQuery.trim();

    if (nextQuery === activeQuery) {
      setReloadKey((current) => current + 1);
      return;
    }

    setActiveQuery(nextQuery);
  }

  function handleReset() {
    setDraftQuery("");

    if (activeQuery === "") {
      setReloadKey((current) => current + 1);
      return;
    }

    setActiveQuery("");
  }

  return (
    <div className="space-y-4">
      <Card className="border-stone-200 bg-white">
        <CardContent className="pt-6">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="ingredient-search">Search</Label>
              <Input
                data-testid="ingredient-search"
                id="ingredient-search"
                onChange={(event) => setDraftQuery(event.target.value)}
                placeholder="Search INCI name, alias, function, or common use"
                value={draftQuery}
              />
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Button onClick={handleReset} type="button" variant="outline">
                <X aria-hidden="true" />
                Reset
              </Button>
              <Button type="submit">
                <Search aria-hidden="true" />
                Search ingredients
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {loadError ? (
        <ErrorState
          action={
            <Button
              onClick={() => setReloadKey((current) => current + 1)}
              type="button"
            >
              <RotateCcw aria-hidden="true" />
              Retry
            </Button>
          }
          description={loadError}
          title="Ingredient library could not load"
        />
      ) : null}

      {!loadError ? (
        <Alert>
          <AlertTitle>Educational ingredient library</AlertTitle>
          <AlertDescription>
            Ingredient information can help with routine literacy, but it is
            not medical diagnosis, treatment advice, or a guarantee that an
            ingredient will suit every person.
          </AlertDescription>
        </Alert>
      ) : null}

      {isLoading ? (
        <Card className="border-stone-200 bg-white">
          <CardContent>
            <LoadingState label="Loading ingredient library" />
          </CardContent>
        </Card>
      ) : null}

      {!isLoading && !loadError && ingredients.length === 0 ? (
        <EmptyState
          description="Try a broader ingredient name, alias, function, or common use."
          title="No ingredients found"
        />
      ) : null}

      {!isLoading && !loadError && ingredients.length > 0 ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {ingredients.map((ingredient) => (
            <IngredientCard ingredient={ingredient} key={ingredient.id} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
