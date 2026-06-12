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
import { routes } from "@/shared/constants/routes";

type IngredientDetailProps = {
  ingredientId: string;
};

const evidenceLevelLabels: Record<IngredientEvidenceLevel, string> = {
  basic: "Bằng chứng cơ bản",
  moderate: "Bằng chứng trung bình",
  strong: "Bằng chứng mạnh",
  uncertain: "Bằng chứng chưa chắc chắn",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
  }).format(new Date(value));
}

function getLoadError(error: unknown) {
  if (error instanceof IngredientClientError) {
    return {
      message:
        "Không thể tải thông tin thành phần này. Vui lòng quay lại thư viện thành phần hoặc thử lại sau.",
      status: error.status,
    };
  }

  return {
    message:
      "Không thể tải thông tin thành phần này. Vui lòng quay lại thư viện thành phần hoặc thử lại sau.",
    status: 500,
  };
}

function getIngredientDisplayName(ingredient: IngredientDto) {
  return ingredient.inciName.trim() || ingredient.aliases[0]?.trim() || "";
}

function getProductCatalogueSearchHref(ingredientName: string) {
  const q = ingredientName.trim();

  if (!q) {
    return routes.PRODUCTS;
  }

  return `${routes.PRODUCTS}?q=${encodeURIComponent(q)}`;
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
          <LoadingState label="Đang tải thông tin thành phần..." />
        </CardContent>
      </Card>
    );
  }

  if (loadError?.status === 404) {
    return (
      <EmptyState
        action={<BackToIngredientsButton />}
        description="Thành phần này có thể không còn khả dụng trong thư viện. Hãy quay lại thư viện để chọn thành phần khác."
        title="Không tìm thấy thành phần"
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
        title="Không thể tải thông tin thành phần"
      />
    );
  }

  if (!ingredient) {
    return (
      <EmptyState
        action={<BackToIngredientsButton />}
        description="Hãy quay lại thư viện thành phần và mở lại thành phần này."
        title="Không tìm thấy thành phần"
      />
    );
  }

  const ingredientDisplayName = getIngredientDisplayName(ingredient);
  const productCatalogueSearchHref =
    getProductCatalogueSearchHref(ingredientDisplayName);

  return (
    <article className="space-y-4">
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm font-medium text-emerald-700">
                Thư viện thành phần
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
            Mã thành phần: {ingredient.id} · Cập nhật{" "}
            {formatDate(ingredient.updatedAt)}
          </p>
        </CardContent>
      </Card>

      <Alert>
        <AlertTitle>Thông tin thành phần tham khảo</AlertTitle>
        <AlertDescription>
          Thông tin thành phần chỉ phục vụ mục đích giáo dục. Nội dung này
          không chẩn đoán tình trạng da, không thay thế tư vấn chuyên môn và
          không cam kết thành phần phù hợp với mọi người.
        </AlertDescription>
      </Alert>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle>Khám phá sản phẩm liên quan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm leading-6 text-muted-foreground">
            Bạn có thể dùng tên INCI này để tìm các sản phẩm trong catalogue
            demo có nhắc đến thành phần tương ứng. Đây là bước tra cứu, không
            phải xếp hạng hoặc lựa chọn sản phẩm thay bạn.
          </p>
          <Button asChild variant="outline">
            <Link href={productCatalogueSearchHref}>
              Tìm sản phẩm có {ingredientDisplayName || ingredient.inciName}
            </Link>
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle>Thông tin thành phần</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <DetailField
            label="Tên INCI"
            value={ingredient.inciName}
          />
          <DetailField
            label="Mức bằng chứng"
            value={evidenceLevelLabels[ingredient.evidenceLevel]}
          />
          <DetailField label="Ngày tạo" value={formatDate(ingredient.createdAt)} />
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle>Tên thường gặp và công dụng</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <BadgeGroup label="Tên gọi khác" values={ingredient.aliases} />
          <BadgeGroup
            label="Công dụng"
            values={ingredient.functions}
            variant="secondary"
          />
          <TextList label="Cách dùng thường gặp" values={ingredient.commonUses} />
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle>Phù hợp và cần thận trọng</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <BadgeGroup label="Có thể phù hợp" values={ingredient.suitableFor} />
          <TextList label="Cần thận trọng hơn" values={ingredient.cautionFor} />
          <TextList label="Nên tránh kết hợp với" values={ingredient.avoidWith} />
        </CardContent>
      </Card>

      {ingredient.sourceRefs.length > 0 ? (
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle>Nguồn tham khảo</CardTitle>
          </CardHeader>
          <CardContent>
            <TextList label="Tài liệu tham khảo" values={ingredient.sourceRefs} />
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
        Quay lại thư viện
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
