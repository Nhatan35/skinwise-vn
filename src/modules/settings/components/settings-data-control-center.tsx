"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  deleteAccountAppData,
  exportAccountData,
  fetchCurrentUser,
  requestAccountDeletion,
  SettingsClientError,
} from "@/modules/settings/settings.client";
import type { DeleteAccountAppDataDto } from "@/modules/account-data/delete-account-app-data.dto";
import type { MeUserDto } from "@/modules/users/app-user-profile.types";
import { EmptyState } from "@/shared/components/empty-state";
import { ErrorState } from "@/shared/components/error-state";
import { LoadingState } from "@/shared/components/loading-state";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Label } from "@/shared/components/ui/label";
import { routes } from "@/shared/constants/routes";

const managementCards = [
  {
    testId: "settings-data-card-skin-profile",
    title: "Skin Profile",
    description:
      "Quản lý loại da, mối quan tâm về da, mức nhạy cảm và các thành phần muốn tránh.",
    cta: "Quản lý Skin Profile",
    href: routes.SKIN_PROFILE,
  },
  {
    testId: "settings-data-card-routines",
    title: "Routines",
    description:
      "Quản lý morning/evening routine, sản phẩm và các bước chăm sóc da.",
    cta: "Quản lý Routines",
    href: routes.ROUTINES,
  },
  {
    testId: "settings-data-card-today-log",
    title: "Today Routine Logs",
    description:
      "Ghi nhận routine hôm nay, kiểm tra trạng thái routine logs và xóa ghi nhận hôm nay nếu cần.",
    cta: "Mở Today Log",
    href: routes.TODAY_LOG,
  },
  {
    testId: "settings-data-card-journal",
    title: "Skin Journal",
    description:
      "Quản lý nhật ký da, quan sát hằng ngày, triệu chứng và ghi chú cá nhân.",
    cta: "Mở Skin Journal",
    href: routes.JOURNAL,
  },
  {
    testId: "settings-data-card-saved-products",
    title: "Saved Products",
    description: "Quản lý danh sách sản phẩm đã lưu.",
    cta: "Mở Saved Products",
    href: routes.SAVED_PRODUCTS,
  },
] as const;

const dataCategories = [
  {
    title: "App profile",
    description:
      "Lưu trong app_user_profiles, gồm app role, trạng thái onboarding và trạng thái yêu cầu xóa tài khoản. Đây là dữ liệu profile cấp ứng dụng, tách biệt với Auth.js identity.",
  },
  {
    title: "Skin profile",
    description:
      "Được quản lý tại Skin Profile. Bạn có thể xem, cập nhật hoặc xóa qua trang/API hiện có.",
  },
  {
    title: "Routines",
    description:
      "Được quản lý tại Routines. Bạn có thể tạo, cập nhật hoặc xóa morning/evening routine qua Routine Builder.",
  },
  {
    title: "Routine logs",
    description:
      "Được quản lý qua Today Log và RoutineLog API. Bạn có thể tạo/cập nhật ghi nhận hôm nay và xóa một ghi nhận routine hiện có.",
  },
  {
    title: "Skin journal",
    description:
      "Được quản lý tại Skin Journal. Bạn có thể tạo, cập nhật hoặc xóa journal entry qua trang/API hiện có.",
  },
  {
    title: "Saved products",
    description:
      "Được quản lý tại Saved Products. Bạn có thể gỡ sản phẩm đã lưu qua UI/API hiện có.",
  },
  {
    title: "Product and ingredient catalogue",
    description:
      "Catalogue sản phẩm và thành phần là dữ liệu dùng chung của ứng dụng, không phải dữ liệu riêng tư do từng người dùng sở hữu, nên không xóa trực tiếp từ Settings.",
  },
] as const;

function formatOptionalDate(value?: string) {
  if (!value) {
    return "Chưa có";
  }

  try {
    return new Intl.DateTimeFormat("vi-VN", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function getExportFileName(exportedAt: string) {
  const exportDate = exportedAt.slice(0, 10);

  return `skinwise-vn-data-export-${exportDate}.json`;
}

function downloadJsonFile(fileName: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = fileName;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function formatDeletedCounts(
  counts: DeleteAccountAppDataDto["deletedCounts"],
) {
  const total =
    counts.skinProfiles +
    counts.savedProducts +
    counts.routines +
    counts.routineLogs +
    counts.routineAnalyses +
    counts.skinJournals;

  return `${total} bản ghi đã được xóa khỏi dữ liệu skincare app cá nhân.`;
}

export function SettingsDataControlCenter() {
  const router = useRouter();
  const [user, setUser] = useState<MeUserDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [exportSuccessMessage, setExportSuccessMessage] = useState<string | null>(
    null,
  );
  const [isAppDataDeleteConfirmed, setIsAppDataDeleteConfirmed] =
    useState(false);
  const [isDeletingAppData, setIsDeletingAppData] = useState(false);
  const [appDataDeleteError, setAppDataDeleteError] = useState<string | null>(
    null,
  );
  const [appDataDeleteSuccessMessage, setAppDataDeleteSuccessMessage] =
    useState<string | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadSettingsData() {
      setIsLoading(true);
      setLoadError(null);

      try {
        const currentUser = await fetchCurrentUser();

        if (isMounted) {
          setUser(currentUser);
        }
      } catch (error) {
        if (isMounted) {
          setLoadError(
            error instanceof SettingsClientError
              ? error.message
              : "Không thể tải thông tin Settings. Vui lòng thử lại.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadSettingsData();

    return () => {
      isMounted = false;
    };
  }, []);

  async function submitAccountDeletionRequest() {
    if (!isConfirmed || user?.accountDeletionRequestStatus === "requested") {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setSuccessMessage(null);

    try {
      const result = await requestAccountDeletion();

      setUser((currentUser) =>
        currentUser
          ? {
              ...currentUser,
              accountDeletionRequestedAt: result.accountDeletionRequestedAt,
              accountDeletionRequestStatus: "requested",
            }
          : currentUser,
      );
      setSuccessMessage("Yêu cầu xóa tài khoản đã được ghi nhận.");
    } catch (error) {
      setSubmitError(
        error instanceof SettingsClientError
          ? error.message
          : "Không thể gửi yêu cầu xóa tài khoản lúc này. Vui lòng thử lại.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function exportMySkincareData() {
    setIsExporting(true);
    setExportError(null);
    setExportSuccessMessage(null);

    try {
      const accountDataExport = await exportAccountData();

      downloadJsonFile(
        getExportFileName(accountDataExport.exportedAt),
        accountDataExport,
      );
      setExportSuccessMessage("Đã tải xuống file JSON export dữ liệu skincare.");
    } catch (error) {
      setExportError(
        error instanceof SettingsClientError
          ? error.message
          : "Không thể export dữ liệu lúc này. Vui lòng thử lại.",
      );
    } finally {
      setIsExporting(false);
    }
  }

  async function deleteMySkincareAppData() {
    if (!isAppDataDeleteConfirmed || isDeletingAppData) {
      return;
    }

    const confirmed = window.confirm(
      "Thao tác này sẽ xóa dữ liệu skincare app cá nhân của bạn, nhưng không xóa tài khoản đăng nhập Auth.js. Bạn muốn tiếp tục?",
    );

    if (!confirmed) {
      return;
    }

    setIsDeletingAppData(true);
    setAppDataDeleteError(null);
    setAppDataDeleteSuccessMessage(null);

    try {
      const result = await deleteAccountAppData();

      setIsAppDataDeleteConfirmed(false);
      setUser((currentUser) =>
        currentUser
          ? {
              ...currentUser,
              onboardingCompleted: false,
            }
          : currentUser,
      );
      router.refresh();
      setAppDataDeleteSuccessMessage(formatDeletedCounts(result.deletedCounts));
    } catch (error) {
      setAppDataDeleteError(
        error instanceof SettingsClientError
          ? error.message
          : "Không thể xóa dữ liệu skincare app lúc này. Vui lòng thử lại.",
      );
    } finally {
      setIsDeletingAppData(false);
    }
  }

  if (isLoading) {
    return <LoadingState label="Đang tải cài đặt và quản lý dữ liệu" />;
  }

  if (loadError) {
    return (
      <ErrorState
        description={loadError}
        title="Chưa tải được cài đặt và quản lý dữ liệu"
      />
    );
  }

  if (!user) {
    return (
      <EmptyState
        description="Không tìm thấy thông tin tài khoản hiện tại. Vui lòng đăng nhập lại."
        title="Chưa có thông tin tài khoản"
      />
    );
  }

  const deletionRequested = user.accountDeletionRequestStatus === "requested";

  return (
    <div className="space-y-6" data-testid="settings-data-control-center">
      <Card className="border-border bg-card" data-testid="settings-account-overview">
        <CardHeader>
          <CardTitle>Thông tin tài khoản</CardTitle>
          <CardDescription>
            Chỉ hiển thị các trường an toàn phục vụ trải nghiệm app. Settings
            không hiển thị token, session hoặc dữ liệu xác thực nội bộ.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
          <AccountField label="Tên" value={user.name ?? "Chưa có"} />
          <AccountField label="Email" value={user.email ?? "Chưa có"} />
          <AccountField label="App role" value={user.role} />
          <AccountField
            label="Onboarding"
            value={user.onboardingCompleted ? "Đã hoàn thành" : "Chưa hoàn thành"}
          />
          <AccountField
            label="Trạng thái yêu cầu xóa tài khoản"
            testId="account-deletion-request-status"
            value={deletionRequested ? "Đã yêu cầu" : "Chưa yêu cầu"}
          />
          <AccountField
            label="Ngày gửi yêu cầu"
            value={formatOptionalDate(user.accountDeletionRequestedAt)}
          />
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle>Quản lý dữ liệu của bạn</CardTitle>
          <CardDescription>
            Các dữ liệu dưới đây thuộc về tài khoản của bạn. Bạn có thể mở từng
            khu vực để xem, cập nhật hoặc xóa dữ liệu tương ứng.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {managementCards.map((card) => (
            <article
              className="flex flex-col justify-between gap-4 rounded-lg border border-border bg-secondary/50 p-4"
              data-testid={card.testId}
              key={card.title}
            >
              <div>
                <h3 className="font-semibold text-foreground">{card.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {card.description}
                </p>
              </div>
              <Button asChild size="sm" variant="outline">
                <Link href={card.href}>{card.cta}</Link>
              </Button>
            </article>
          ))}
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle>Dữ liệu SkinWise VN lưu trữ</CardTitle>
          <CardDescription>
            Trung tâm này giúp bạn hiểu từng nhóm dữ liệu đang được quản lý ở
            đâu trong MVP.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {dataCategories.map((category) => (
            <div
              className="rounded-lg border border-border bg-secondary/50 p-3"
              key={category.title}
            >
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-medium text-foreground">{category.title}</h3>
                {category.title === "Product and ingredient catalogue" ? (
                  <Badge variant="secondary">Shared app data</Badge>
                ) : null}
              </div>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {category.description}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-border bg-card" data-testid="settings-export-data">
        <CardHeader>
          <CardTitle>Export data</CardTitle>
          <CardDescription>
            Tải xuống dữ liệu skincare app cá nhân của bạn dưới dạng JSON. File
            export chỉ chứa payload dữ liệu, không chứa token, session hoặc
            wrapper API nội bộ.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            data-testid="settings-export-data-button"
            disabled={isExporting}
            onClick={exportMySkincareData}
            type="button"
          >
            {isExporting ? "Đang export..." : "Export my skincare data"}
          </Button>

          {exportSuccessMessage ? (
            <Alert>
              <AlertDescription>{exportSuccessMessage}</AlertDescription>
            </Alert>
          ) : null}

          {exportError ? (
            <Alert variant="destructive">
              <AlertDescription>{exportError}</AlertDescription>
            </Alert>
          ) : null}
        </CardContent>
      </Card>

      <Card
        className="border-destructive/40 bg-card"
        data-testid="settings-delete-app-data"
      >
        <CardHeader>
          <CardTitle>Danger zone</CardTitle>
          <CardDescription>
            Delete my skincare app data chỉ xóa dữ liệu skincare cá nhân như
            skin profile, saved products, routines, routine logs, routine
            analyses và skin journals. Thao tác này không xóa tài khoản đăng
            nhập Auth.js, OAuth account, session hoặc catalogue dùng chung.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-secondary/50 p-3 text-sm font-normal text-muted-foreground">
            <input
              data-testid="app-data-delete-confirm-checkbox"
              checked={isAppDataDeleteConfirmed}
              className="mt-1"
              onChange={(event) =>
                setIsAppDataDeleteConfirmed(event.target.checked)
              }
              type="checkbox"
            />
            <span>
              I understand this will delete my personal skincare app data from SkinWise VN.
            </span>
          </Label>

          {appDataDeleteSuccessMessage ? (
            <Alert>
              <AlertDescription>{appDataDeleteSuccessMessage}</AlertDescription>
            </Alert>
          ) : null}

          {appDataDeleteError ? (
            <Alert variant="destructive">
              <AlertDescription>{appDataDeleteError}</AlertDescription>
            </Alert>
          ) : null}

          <Button
            data-testid="app-data-delete-button"
            disabled={!isAppDataDeleteConfirmed || isDeletingAppData}
            onClick={deleteMySkincareAppData}
            type="button"
            variant="destructive"
          >
            {isDeletingAppData
              ? "Đang xóa dữ liệu..."
              : "Delete my skincare app data"}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle>Yêu cầu xóa tài khoản</CardTitle>
          <CardDescription>
            Trong phiên bản MVP portfolio, yêu cầu xóa tài khoản sẽ được ghi
            nhận an toàn. Hệ thống không tự động hard-delete toàn bộ Auth.js
            identity để tránh xóa nhầm dữ liệu xác thực.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {deletionRequested ? (
            <Alert>
              <AlertDescription>
                Bạn đã gửi yêu cầu xóa tài khoản. Thời điểm ghi nhận: {" "}
                {formatOptionalDate(user.accountDeletionRequestedAt)}.
              </AlertDescription>
            </Alert>
          ) : (
            <Label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-secondary/50 p-3 text-sm font-normal text-muted-foreground">
              <input
                data-testid="account-deletion-confirm-checkbox"
                checked={isConfirmed}
                className="mt-1"
                onChange={(event) => setIsConfirmed(event.target.checked)}
                type="checkbox"
              />
              <span>
                Tôi hiểu đây là yêu cầu xóa tài khoản, không phải thao tác xóa tự động ngay lập tức.
              </span>
            </Label>
          )}

          {successMessage ? (
            <Alert>
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          ) : null}

          {submitError ? (
            <Alert variant="destructive">
              <AlertDescription>{submitError}</AlertDescription>
            </Alert>
          ) : null}

          <Button
            data-testid="account-deletion-request-button"
            disabled={deletionRequested || !isConfirmed || isSubmitting}
            onClick={submitAccountDeletionRequest}
            type="button"
            variant={deletionRequested ? "outline" : "destructive"}
          >
            {deletionRequested
              ? "Đã gửi yêu cầu"
              : isSubmitting
                ? "Đang gửi..."
                : "Gửi yêu cầu xóa tài khoản"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function AccountField({
  label,
  testId,
  value,
}: {
  label: string;
  testId?: string;
  value: string;
}) {
  return (
    <div
      className="rounded-lg border border-border bg-secondary/50 p-3"
      data-testid={testId}
    >
      <p className="font-medium text-foreground">{label}</p>
      <p className="mt-1 break-words text-muted-foreground">{value}</p>
    </div>
  );
}
