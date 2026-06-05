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
          "Tạm thời có quá nhiều yêu cầu giải thích. Vui lòng thử lại sau.",
        title: "Đã đạt giới hạn giải thích",
      };
    }

    if (error.code === "UNAUTHORIZED" || error.status === 401) {
      return {
        message: "Bạn cần đăng nhập để yêu cầu giải thích thành phần.",
        title: "Cần đăng nhập",
      };
    }

    if (error.code === "VALIDATION_ERROR" || error.status === 400) {
      return {
        message:
          "Chưa thể giải thích tên thành phần này. Hãy mở lại thành phần và thử lại.",
        title: "Chưa thể giải thích thành phần",
      };
    }

    return {
      message: "Không thể tải giải thích thành phần. Vui lòng thử lại sau.",
      title: "Không thể tải giải thích thành phần",
    };
  }

  return {
    message: "Không thể giải thích thành phần này. Vui lòng thử lại.",
    title: "Không thể tải giải thích thành phần",
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
            <CardTitle>Giải thích thành phần</CardTitle>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Yêu cầu giải thích dễ hiểu qua luồng provider hiện có. Nội dung
              chỉ mang tính giáo dục và có thể dùng phản hồi dự phòng an toàn
              khi dịch vụ AI không khả dụng hoặc đang tắt.
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
            Đang chuẩn bị giải thích thành phần...
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
  const sourceLabel = explanation.source === "ai" ? "AI" : "Phản hồi dự phòng";

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
          <AlertTitle>Đang dùng phản hồi dự phòng</AlertTitle>
          <AlertDescription>
            Giải thích này dùng phản hồi dự phòng an toàn vì dịch vụ AI không
            khả dụng hoặc đang tắt.
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-foreground">
          Giải thích ngắn gọn
        </h3>
        <p className="text-sm leading-6 text-muted-foreground">
          {explanation.simpleExplanation}
        </p>
      </div>

      <TextList label="Cách dùng thường gặp" values={explanation.commonUses} />
      <TextList label="Có thể phù hợp" values={explanation.suitableFor} />
      <TextList label="Cần thận trọng hơn" values={explanation.cautions} />
      <TextList label="Nên tránh kết hợp với" values={explanation.avoidWith} />

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-foreground">
          Gợi ý cho người mới bắt đầu
        </h3>
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
