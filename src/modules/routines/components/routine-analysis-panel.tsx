"use client";

import { Check } from "lucide-react";

import type { RoutineAnalysisDto } from "@/modules/ai-analysis/routine-analysis.dto";
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";

type RoutineAnalysisPanelProps = {
  error: string | null;
  history: RoutineAnalysisDto[];
  isAnalyzing: boolean;
  isHistoryLoaded: boolean;
  isHistoryLoading: boolean;
  latestAnalysis: RoutineAnalysisDto | null;
  onAnalyze: () => void;
  onLoadHistory: () => void;
};

const riskLevelLabels: Record<RoutineAnalysisDto["riskLevel"], string> = {
  high: "Cao",
  low: "Thấp",
  medium: "Trung bình",
};

const riskLevelClasses: Record<RoutineAnalysisDto["riskLevel"], string> = {
  high: "border-red-200 bg-red-50 text-red-800",
  low: "border-emerald-200 bg-emerald-50 text-emerald-800",
  medium: "border-amber-200 bg-amber-50 text-amber-800",
};

const suggestionPriorityLabels: Record<
  RoutineAnalysisDto["suggestions"][number]["priority"],
  string
> = {
  must_fix: "Cao",
  optional: "Thấp",
  should_fix: "Trung bình",
};

const suggestionPriorityClasses: Record<
  RoutineAnalysisDto["suggestions"][number]["priority"],
  string
> = {
  must_fix: "border-red-200 bg-red-50 text-red-800",
  optional: "border-stone-200 bg-stone-50 text-stone-700",
  should_fix: "border-amber-200 bg-amber-50 text-amber-800",
};

const warningSeverityLabels: Record<
  RoutineAnalysisDto["warnings"][number]["severity"],
  string
> = {
  high: "Cao",
  low: "Thấp",
  medium: "Trung bình",
};

const warningSeverityClasses: Record<
  RoutineAnalysisDto["warnings"][number]["severity"],
  string
> = {
  high: "border-red-200 bg-red-50 text-red-800",
  low: "border-stone-200 bg-stone-50 text-stone-700",
  medium: "border-amber-200 bg-amber-50 text-amber-800",
};

function formatAnalysisDate(value: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function RoutineAnalysisResult({
  analysis,
  title,
}: {
  analysis: RoutineAnalysisDto;
  title: string;
}) {
  const positiveFindings = analysis.positiveFindings ?? [];

  return (
    <div
      className="space-y-4 border border-border bg-card p-4"
      data-testid="routine-analysis-result"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h4 className="font-semibold text-foreground">{title}</h4>
          <p className="mt-1 text-xs text-muted-foreground">
            Mã phân tích: {analysis.analysisId}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Tạo lúc: {formatAnalysisDate(analysis.createdAt)}
          </p>
        </div>
        <Badge
          className={riskLevelClasses[analysis.riskLevel]}
          variant="outline"
        >
          Mức rủi ro: {riskLevelLabels[analysis.riskLevel]}
        </Badge>
      </div>

      <section className="space-y-3 border border-border bg-secondary/30 p-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h5 className="text-sm font-semibold text-foreground">
            Tổng quan an toàn routine
          </h5>
          <Badge
            className={riskLevelClasses[analysis.riskLevel]}
            variant="outline"
          >
            Dựa trên dữ liệu hiện có: {riskLevelLabels[analysis.riskLevel]}
          </Badge>
        </div>
        <p className="text-sm leading-6 text-muted-foreground">
          {analysis.summary}
        </p>

        {analysis.shouldSeeProfessional ? (
          <Alert>
            <AlertTitle>Nên cân nhắc gặp chuyên gia</AlertTitle>
            <AlertDescription>
              Nếu kích ứng kéo dài, nghiêm trọng hoặc làm bạn lo lắng, nên trao
              đổi với chuyên gia phù hợp để được tư vấn trực tiếp.
            </AlertDescription>
          </Alert>
        ) : null}
      </section>

      <section className="space-y-3">
        <h5 className="text-sm font-semibold text-foreground">Điểm ổn</h5>
        {positiveFindings.length > 0 ? (
          <ul className="space-y-2">
            {positiveFindings.map((finding, index) => (
              <li
                className="flex gap-2 border border-emerald-100 bg-emerald-50 p-3 text-sm leading-6 text-emerald-950"
                data-testid="routine-analysis-positive-finding"
                key={`${analysis.analysisId}-positive-${index}-${finding}`}
              >
                <Check
                  aria-hidden="true"
                  className="mt-0.5 size-4 shrink-0"
                />
                <span>{finding}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            Chưa có đủ dữ liệu để xác định điểm mạnh của routine.
          </p>
        )}
      </section>

      <section className="space-y-3">
        <h5 className="text-sm font-semibold text-foreground">
          Cần lưu ý
        </h5>
        {analysis.warnings.length > 0 ? (
          <ul className="space-y-2">
            {analysis.warnings.map((warning, index) => (
              <li
                className="border border-border bg-secondary/50 p-3"
                data-testid="routine-analysis-warning"
                key={`${analysis.analysisId}-warning-${index}-${warning.code}`}
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <p className="text-sm font-medium text-foreground">
                    {warning.message}
                  </p>
                  <Badge
                    className={warningSeverityClasses[warning.severity]}
                    variant="outline"
                  >
                    Mức độ: {warningSeverityLabels[warning.severity]}
                  </Badge>
                </div>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {warning.reason}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            Chưa phát hiện lưu ý lớn từ dữ liệu hiện có.
          </p>
        )}
      </section>

      <section className="space-y-3">
        <h5 className="text-sm font-semibold text-foreground">
          Gợi ý chỉnh sửa
        </h5>
        {analysis.suggestions.length > 0 ? (
          <ul className="space-y-2">
            {analysis.suggestions.map((suggestion, index) => (
              <li
                className="border border-border bg-secondary/50 p-3"
                data-testid="routine-analysis-suggestion"
                key={`${analysis.analysisId}-suggestion-${index}-${suggestion.title}`}
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <p className="text-sm font-medium text-foreground">
                    {suggestion.title}
                  </p>
                  <Badge
                    className={suggestionPriorityClasses[suggestion.priority]}
                    variant="outline"
                  >
                    Ưu tiên: {suggestionPriorityLabels[suggestion.priority]}
                  </Badge>
                </div>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {suggestion.description}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            Bạn có thể tiếp tục theo dõi routine bằng Today Log và Journal.
          </p>
        )}
      </section>

      <section className="space-y-2 border border-blue-100 bg-blue-50 p-3">
        <h5 className="text-sm font-semibold text-blue-950">
          Thông tin tham khảo
        </h5>
        <p className="text-sm leading-6 text-blue-950">
          {analysis.disclaimer}
        </p>
      </section>
    </div>
  );
}

export function RoutineAnalysisPanel({
  error,
  history,
  isAnalyzing,
  isHistoryLoaded,
  isHistoryLoading,
  latestAnalysis,
  onAnalyze,
  onLoadHistory,
}: RoutineAnalysisPanelProps) {
  return (
    <div className="mt-4 space-y-4 border-t border-border pt-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h4 className="font-semibold text-foreground">Phân tích routine</h4>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Dựa trên dữ liệu routine hiện có để chỉ ra điểm cần lưu ý và việc
            nên chỉnh tiếp theo; thông tin này không thay thế tư vấn y tế.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            data-testid="routine-analyze-button"
            disabled={isAnalyzing}
            onClick={onAnalyze}
            type="button"
          >
            {isAnalyzing
              ? "Đang kiểm tra..."
              : "Phân tích routine"}
          </Button>
          <Button
            disabled={isHistoryLoading}
            onClick={onLoadHistory}
            type="button"
            variant="outline"
          >
            {isHistoryLoading ? "Đang tải lịch sử..." : "Xem lịch sử"}
          </Button>
        </div>
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertTitle>Chưa xử lý được phân tích</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {isAnalyzing ? (
        <p className="text-sm text-muted-foreground">
          Đang kiểm tra routine bằng các quy tắc an toàn cơ bản...
        </p>
      ) : null}

      {latestAnalysis ? (
        <RoutineAnalysisResult
          analysis={latestAnalysis}
          title="Kết quả kiểm tra mới nhất"
        />
      ) : (
        <div className="border border-dashed border-stone-300 bg-card p-4">
          <p className="text-sm text-muted-foreground">
            Chưa có kết quả phân tích nào trong phiên này.
          </p>
        </div>
      )}

      {isHistoryLoaded ? (
        <div className="space-y-3">
          <h4 className="font-semibold text-foreground">Lịch sử phân tích</h4>
          {history.length > 0 ? (
            <div className="space-y-3">
              {history.map((analysis) => (
                <RoutineAnalysisResult
                  analysis={analysis}
                  key={analysis.analysisId}
                  title={`Kết quả ${formatAnalysisDate(analysis.createdAt)}`}
                />
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-stone-300 bg-card p-4">
              <p className="text-sm text-muted-foreground">
                Chưa có lịch sử phân tích nào cho routine này.
              </p>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
