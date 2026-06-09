import type { AccountAppDataSummaryDto } from "@/modules/account-data/account-app-data-summary.dto";
import { LoadingState } from "@/shared/components/loading-state";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

type AccountDataSummaryCardProps = {
  error: string | null;
  isLoading: boolean;
  onRetry: () => void;
  summary: AccountAppDataSummaryDto | null;
};

const countItems = [
  {
    key: "skinProfiles",
    label: "Hồ sơ da",
    testId: "account-data-summary-count-skin-profiles",
  },
  {
    key: "savedProducts",
    label: "Sản phẩm đã lưu",
    testId: "account-data-summary-count-saved-products",
  },
  {
    key: "routines",
    label: "Routine",
    testId: "account-data-summary-count-routines",
  },
  {
    key: "routineLogs",
    label: "Lịch sử routine",
    testId: "account-data-summary-count-routine-logs",
  },
  {
    key: "routineAnalyses",
    label: "Phân tích routine",
    testId: "account-data-summary-count-routine-analyses",
  },
  {
    key: "skinJournals",
    label: "Nhật ký da",
    testId: "account-data-summary-count-skin-journals",
  },
] as const;

export function AccountDataSummaryCard({
  error,
  isLoading,
  onRetry,
  summary,
}: AccountDataSummaryCardProps) {
  return (
    <Card className="border-border bg-card" data-testid="account-data-summary-card">
      <CardHeader>
        <CardTitle>Tóm tắt dữ liệu ứng dụng của bạn</CardTitle>
        <CardDescription>
          Phần này giúp bạn hiểu những dữ liệu chăm sóc da cá nhân đang được lưu
          trong ứng dụng trước khi xuất hoặc xóa dữ liệu. Dữ liệu danh mục chung
          như sản phẩm và thành phần không thuộc dữ liệu cá nhân của riêng bạn.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-6 text-muted-foreground">
          Dữ liệu cá nhân trong ứng dụng bao gồm hồ sơ da, sản phẩm đã lưu,
          routine, lịch sử routine, phân tích routine và nhật ký da do bạn tạo.
        </p>

        {isLoading ? (
          <div data-testid="account-data-summary-loading">
            <LoadingState label="Đang tải tóm tắt dữ liệu ứng dụng..." />
          </div>
        ) : null}

        {!isLoading && error ? (
          <Alert data-testid="account-data-summary-error" variant="destructive">
            <AlertDescription className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <span>{error}</span>
              <Button onClick={onRetry} size="sm" type="button" variant="outline">
                Thử lại
              </Button>
            </AlertDescription>
          </Alert>
        ) : null}

        {!isLoading && !error && summary ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {countItems.map((item) => (
              <div
                className="rounded-lg border border-border bg-secondary/50 p-3"
                data-testid={item.testId}
                key={item.key}
              >
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                <p className="mt-1 text-2xl font-semibold text-primary">
                  {summary.counts[item.key]}
                </p>
              </div>
            ))}
          </div>
        ) : null}

        <div
          className="rounded-lg border border-border bg-secondary/50 p-3 text-sm leading-6 text-muted-foreground"
          data-testid="account-data-summary-shared-catalogue-note"
        >
          Dữ liệu danh mục chung như sản phẩm và thành phần được giữ lại để ứng
          dụng tiếp tục hoạt động cho mọi người dùng.
        </div>
      </CardContent>
    </Card>
  );
}
