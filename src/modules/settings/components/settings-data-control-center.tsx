"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  deleteAccountAppData,
  exportAccountData,
  fetchCurrentUser,
  getAccountAppDataSummary,
  requestAccountDeletion,
  SettingsClientError,
} from "@/modules/settings/settings.client";
import type { AccountAppDataSummaryDto } from "@/modules/account-data/account-app-data-summary.dto";
import type { DeleteAccountAppDataDto } from "@/modules/account-data/delete-account-app-data.dto";
import { AccountDataSummaryCard } from "@/modules/settings/components/account-data-summary-card";
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

const APP_DATA_DELETE_CONFIRMATION_ID =
  "settings-app-data-delete-confirmation";
const ACCOUNT_DELETE_CONFIRMATION_ID =
  "settings-account-delete-confirmation";
const APP_DATA_DELETE_ACTION_GUIDANCE_ID =
  "settings-app-data-delete-action-guidance";
const ACCOUNT_DELETE_ACTION_GUIDANCE_ID =
  "settings-account-delete-action-guidance";
const SETTINGS_SIGN_IN_HREF = `/api/auth/signin?callbackUrl=${routes.SETTINGS}`;

const managementCards = [
  {
    testId: "settings-data-card-skin-profile",
    title: "Hồ sơ da",
    description:
      "Quản lý loại da, mối quan tâm về da, mức nhạy cảm và các thành phần muốn tránh.",
    cta: "Quản lý hồ sơ da",
    href: routes.SKIN_PROFILE,
  },
  {
    testId: "settings-data-card-routines",
    title: "Routine",
    description:
      "Quản lý routine buổi sáng hoặc buổi tối, sản phẩm và các bước chăm sóc da.",
    cta: "Quản lý routine",
    href: routes.ROUTINES,
  },
  {
    testId: "settings-data-card-today-log",
    title: "Routine hôm nay",
    description:
      "Ghi nhận routine hôm nay, kiểm tra trạng thái và xóa ghi nhận hôm nay nếu cần.",
    cta: "Mở routine hôm nay",
    href: routes.TODAY_LOG,
  },
  {
    testId: "settings-data-card-journal",
    title: "Nhật ký da",
    description:
      "Quản lý nhật ký da, quan sát hằng ngày, triệu chứng và ghi chú cá nhân.",
    cta: "Mở nhật ký da",
    href: routes.JOURNAL,
  },
  {
    testId: "settings-data-card-saved-products",
    title: "Sản phẩm đã lưu",
    description: "Quản lý danh sách sản phẩm đã lưu.",
    cta: "Xem sản phẩm đã lưu",
    href: routes.SAVED_PRODUCTS,
  },
] as const;

const dataCategories = [
  {
    title: "Hồ sơ trong app",
    description:
      "Lưu trong app_user_profiles, gồm vai trò trong app, trạng thái onboarding và trạng thái yêu cầu xóa tài khoản. Đây là dữ liệu hồ sơ cấp ứng dụng, tách biệt với danh tính Auth.js.",
  },
  {
    title: "Hồ sơ da",
    description:
      "Được quản lý tại Hồ sơ da. Bạn có thể xem, cập nhật hoặc xóa qua trang hiện có.",
  },
  {
    title: "Routine",
    description:
      "Được quản lý tại Routine. Bạn có thể tạo, cập nhật hoặc xóa routine buổi sáng hoặc buổi tối trên trang Routine.",
  },
  {
    title: "Ghi nhận routine",
    description:
      "Được quản lý qua Routine hôm nay. Bạn có thể tạo/cập nhật ghi nhận hôm nay và xóa một ghi nhận routine hiện có.",
  },
  {
    title: "Nhật ký da",
    description:
      "Được quản lý tại Nhật ký da. Bạn có thể tạo, cập nhật hoặc xóa mục nhật ký qua trang hiện có.",
  },
  {
    title: "Sản phẩm đã lưu",
    description:
      "Được quản lý tại Sản phẩm đã lưu. Bạn có thể gỡ sản phẩm đã lưu qua trang hiện có.",
  },
  {
    title: "Danh mục sản phẩm và thành phần",
    description:
      "Danh mục sản phẩm và thành phần là dữ liệu dùng chung của ứng dụng, không phải dữ liệu riêng tư do từng người dùng sở hữu, nên không xóa trực tiếp từ Cài đặt.",
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

function createEmptyAccountDataSummary(
  generatedAt: string,
): AccountAppDataSummaryDto {
  return {
    generatedAt,
    counts: {
      skinProfiles: 0,
      savedProducts: 0,
      routines: 0,
      routineLogs: 0,
      routineAnalyses: 0,
      skinJournals: 0,
    },
    sharedCatalogueData: {
      productsPreserved: true,
      ingredientsPreserved: true,
    },
  };
}

function getSettingsActionErrorMessage(
  error: unknown,
  fallbackMessage: string,
  unauthorizedMessage: string,
) {
  if (
    error instanceof SettingsClientError &&
    error.code === "UNAUTHORIZED"
  ) {
    return unauthorizedMessage;
  }

  return fallbackMessage;
}

export function SettingsDataControlCenter() {
  const router = useRouter();
  const [user, setUser] = useState<MeUserDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [accountDataSummary, setAccountDataSummary] =
    useState<AccountAppDataSummaryDto | null>(null);
  const [isAccountDataSummaryLoading, setIsAccountDataSummaryLoading] =
    useState(true);
  const [accountDataSummaryError, setAccountDataSummaryError] = useState<
    string | null
  >(null);
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

  async function loadAccountDataSummary({
    showLoading = true,
  }: { showLoading?: boolean } = {}) {
    if (showLoading) {
      setIsAccountDataSummaryLoading(true);
    }
    setAccountDataSummaryError(null);

    try {
      const summary = await getAccountAppDataSummary();

      setAccountDataSummary(summary);
    } catch (error) {
      setAccountDataSummary(null);
      setAccountDataSummaryError(
        getSettingsActionErrorMessage(
          error,
          "Không thể tải tóm tắt dữ liệu ứng dụng lúc này. Bạn vẫn có thể dùng các thao tác bên dưới.",
          "Phiên đăng nhập không còn hiệu lực. Vui lòng đăng nhập lại để xem tóm tắt dữ liệu ứng dụng.",
        ),
      );
    } finally {
      if (showLoading) {
        setIsAccountDataSummaryLoading(false);
      }
    }
  }

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
            getSettingsActionErrorMessage(
              error,
              "Không thể tải phần cài đặt và quản lý dữ liệu. Vui lòng thử lại hoặc làm mới trang.",
              "Phiên đăng nhập không còn hiệu lực. Vui lòng đăng nhập lại để tiếp tục.",
            ),
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
  }, [reloadKey]);

  useEffect(() => {
    let isMounted = true;

    async function loadInitialAccountDataSummary() {
      try {
        const summary = await getAccountAppDataSummary();

        if (isMounted) {
          setAccountDataSummary(summary);
          setAccountDataSummaryError(null);
        }
      } catch (error) {
        if (isMounted) {
          setAccountDataSummary(null);
          setAccountDataSummaryError(
            getSettingsActionErrorMessage(
              error,
              "Không thể tải tóm tắt dữ liệu ứng dụng lúc này. Bạn vẫn có thể dùng các thao tác bên dưới.",
              "Phiên đăng nhập không còn hiệu lực. Vui lòng đăng nhập lại để xem tóm tắt dữ liệu ứng dụng.",
            ),
          );
        }
      } finally {
        if (isMounted) {
          setIsAccountDataSummaryLoading(false);
        }
      }
    }

    void loadInitialAccountDataSummary();

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
        getSettingsActionErrorMessage(
          error,
          "Không thể gửi yêu cầu xóa tài khoản lúc này. Vui lòng thử lại.",
          "Phiên đăng nhập không còn hiệu lực. Vui lòng đăng nhập lại trước khi gửi yêu cầu xóa tài khoản.",
        ),
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
        getSettingsActionErrorMessage(
          error,
          "Không thể xuất dữ liệu lúc này. Vui lòng thử lại.",
          "Phiên đăng nhập không còn hiệu lực. Vui lòng đăng nhập lại trước khi xuất dữ liệu.",
        ),
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
      "Thao tác này sẽ xóa dữ liệu SkinWise VN app của bạn, bao gồm hồ sơ da, sản phẩm đã lưu, routine, ghi nhận routine, phân tích routine và nhật ký da. Thao tác này không thể hoàn tác. Tài khoản Google/OAuth, dữ liệu danh mục sản phẩm/thành phần dùng chung và dữ liệu người dùng khác sẽ không bị xóa. Bạn muốn tiếp tục xóa dữ liệu app của mình?",
    );

    if (!confirmed) {
      return;
    }

    setIsDeletingAppData(true);
    setAppDataDeleteError(null);
    setAppDataDeleteSuccessMessage(null);

    try {
      const result = await deleteAccountAppData();
      const emptySummary = createEmptyAccountDataSummary(result.deletedAt);

      setIsAppDataDeleteConfirmed(false);
      setAccountDataSummary(emptySummary);
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
      await loadAccountDataSummary({ showLoading: false });
    } catch (error) {
      setAppDataDeleteError(
        getSettingsActionErrorMessage(
          error,
          "Không thể xóa dữ liệu skincare trong app lúc này. Vui lòng thử lại.",
          "Phiên đăng nhập không còn hiệu lực. Vui lòng đăng nhập lại trước khi xóa dữ liệu ứng dụng.",
        ),
      );
    } finally {
      setIsDeletingAppData(false);
    }
  }

  if (isLoading) {
    return <LoadingState label="Đang tải cài đặt..." />;
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
              Thử lại
            </Button>
            <Button asChild variant="outline">
              <Link href={routes.DASHBOARD}>Về dashboard</Link>
            </Button>
          </div>
        }
        description={loadError}
        title="Không thể tải phần cài đặt và quản lý dữ liệu"
      />
    );
  }

  if (!user) {
    return (
      <EmptyState
        action={
          <Button asChild>
            <Link href={SETTINGS_SIGN_IN_HREF}>Đăng nhập lại</Link>
          </Button>
        }
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
            Chỉ hiển thị các trường an toàn phục vụ trải nghiệm app. Cài đặt
            không hiển thị dữ liệu xác thực nội bộ hoặc thông tin kỹ thuật nhạy cảm.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
          <AccountField label="Tên" value={user.name ?? "Chưa có"} />
          <AccountField label="Email" value={user.email ?? "Chưa có"} />
          <AccountField label="Vai trò trong app" value={user.role} />
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
                {category.title === "Danh mục sản phẩm và thành phần" ? (
                  <Badge variant="secondary">Dữ liệu dùng chung</Badge>
                ) : null}
              </div>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {category.description}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      <AccountDataSummaryCard
        error={accountDataSummaryError}
        isLoading={isAccountDataSummaryLoading}
        onRetry={loadAccountDataSummary}
        summary={accountDataSummary}
      />

      <Card className="border-border bg-card" data-testid="settings-export-data">
        <CardHeader>
          <CardTitle>Xuất dữ liệu</CardTitle>
          <CardDescription>
            Tải xuống dữ liệu skincare app cá nhân của bạn dưới dạng JSON, gồm
            các nhóm dữ liệu người dùng tự tạo trong ứng dụng. File xuất không
            bao gồm dữ liệu danh mục chung như sản phẩm và thành phần.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            data-testid="settings-export-data-button"
            disabled={isExporting}
            onClick={exportMySkincareData}
            type="button"
          >
            {isExporting ? "Đang xuất dữ liệu..." : "Xuất dữ liệu skincare"}
          </Button>

          {exportSuccessMessage ? (
            <Alert role="status">
              <AlertDescription>{exportSuccessMessage}</AlertDescription>
            </Alert>
          ) : null}

          {exportError ? (
            <Alert role="alert" variant="destructive">
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
          <CardTitle>Khu vực cần thận trọng</CardTitle>
          <CardDescription>
            Xóa dữ liệu app chỉ xóa dữ liệu SkinWise VN cá nhân như hồ sơ da,
            sản phẩm đã lưu, routine, ghi nhận routine, phân tích routine và
            nhật ký da. Thao tác này không thể hoàn tác, không xóa tài khoản
            Google/OAuth, không xóa danh mục sản phẩm hoặc thành phần dùng chung,
            và không xóa dữ liệu của người dùng khác.
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
            <span id={APP_DATA_DELETE_CONFIRMATION_ID}>
              Tôi hiểu thao tác này sẽ xóa vĩnh viễn dữ liệu SkinWise VN app của tôi và không thể hoàn tác.
            </span>
          </Label>

          <p
            className="text-sm text-muted-foreground"
            id={APP_DATA_DELETE_ACTION_GUIDANCE_ID}
          >
            Chọn ô xác nhận ở trên để mở khóa nút xóa dữ liệu ứng dụng.
          </p>

          {appDataDeleteSuccessMessage ? (
            <Alert role="status">
              <AlertDescription>{appDataDeleteSuccessMessage}</AlertDescription>
            </Alert>
          ) : null}

          {appDataDeleteError ? (
            <Alert role="alert" variant="destructive">
              <AlertDescription>{appDataDeleteError}</AlertDescription>
            </Alert>
          ) : null}

          <Button
            aria-describedby={`${APP_DATA_DELETE_CONFIRMATION_ID} ${APP_DATA_DELETE_ACTION_GUIDANCE_ID}`}
            data-testid="app-data-delete-button"
            disabled={!isAppDataDeleteConfirmed || isDeletingAppData}
            onClick={deleteMySkincareAppData}
            type="button"
            variant="destructive"
          >
            {isDeletingAppData
              ? "Đang xóa dữ liệu app..."
              : "Xóa dữ liệu app của tôi"}
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
            <>
              <Label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-secondary/50 p-3 text-sm font-normal text-muted-foreground">
                <input
                  data-testid="account-deletion-confirm-checkbox"
                  checked={isConfirmed}
                  className="mt-1"
                  onChange={(event) => setIsConfirmed(event.target.checked)}
                  type="checkbox"
                />
                <span id={ACCOUNT_DELETE_CONFIRMATION_ID}>
                  Tôi hiểu đây là yêu cầu xóa tài khoản, không phải thao tác xóa tự động ngay lập tức.
                </span>
              </Label>
              <p
                className="text-sm text-muted-foreground"
                id={ACCOUNT_DELETE_ACTION_GUIDANCE_ID}
              >
                Chọn ô xác nhận ở trên để mở khóa nút gửi yêu cầu.
              </p>
            </>
          )}

          {successMessage ? (
            <Alert role="status">
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          ) : null}

          {submitError ? (
            <Alert role="alert" variant="destructive">
              <AlertDescription>{submitError}</AlertDescription>
            </Alert>
          ) : null}

          <Button
            aria-describedby={
              deletionRequested
                ? undefined
                : `${ACCOUNT_DELETE_CONFIRMATION_ID} ${ACCOUNT_DELETE_ACTION_GUIDANCE_ID}`
            }
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
