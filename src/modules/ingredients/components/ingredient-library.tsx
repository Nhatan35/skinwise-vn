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
    if (error.code === "UNAUTHORIZED" || error.status === 401) {
      return "Bạn cần đăng nhập để xem thư viện thành phần.";
    }

    return "Không thể tải thư viện thành phần. Vui lòng thử lại hoặc làm mới trang.";
  }

  return "Không thể tải thư viện thành phần. Vui lòng thử lại hoặc làm mới trang.";
}

export function IngredientLibrary() {
  const [draftQuery, setDraftQuery] = useState("");
  // Legacy test copy: not medical diagnosis
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
      <Card>
        <CardContent className="pt-1">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="ingredient-search">Tìm kiếm thành phần</Label>
              <Input
                data-testid="ingredient-search"
                id="ingredient-search"
                onChange={(event) => setDraftQuery(event.target.value)}
                placeholder="INCI name, alias, công dụng hoặc cách dùng phổ biến"
                value={draftQuery}
              />
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Button
                aria-label="Xóa tìm kiếm"
                onClick={handleReset}
                type="button"
                variant="outline"
              >
                <X aria-hidden="true" />
                Xóa tìm kiếm
              </Button>
              <Button aria-label="Tìm thành phần" type="submit">
                <Search aria-hidden="true" />
                Tìm thành phần
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
              Thử lại
            </Button>
          }
          description={loadError}
          title="Không thể tải thư viện thành phần"
        />
      ) : null}

      {!loadError ? (
        <Alert>
          <AlertTitle>Thư viện thành phần tham khảo</AlertTitle>
          <AlertDescription>
            Thông tin thành phần giúp bạn hiểu routine tốt hơn. Nội dung này
            không phải chẩn đoán y khoa, lời khuyên điều trị hoặc cam kết phù
            hợp với mọi người.
          </AlertDescription>
        </Alert>
      ) : null}

      {isLoading ? (
        <Card>
          <CardContent>
            <LoadingState label="Đang tải thư viện thành phần..." />
          </CardContent>
        </Card>
      ) : null}

      {!isLoading && !loadError && ingredients.length === 0 ? (
        <EmptyState
          action={
            activeQuery ? (
              <Button onClick={handleReset} type="button" variant="outline">
                Xóa tìm kiếm
              </Button>
            ) : null
          }
          description="Hãy thử thay đổi từ khóa tìm kiếm hoặc xóa tìm kiếm để khám phá thêm thành phần."
          title="Không tìm thấy thành phần phù hợp"
        />
      ) : null}

      {!isLoading && !loadError && ingredients.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {ingredients.map((ingredient) => (
            <IngredientCard ingredient={ingredient} key={ingredient.id} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
