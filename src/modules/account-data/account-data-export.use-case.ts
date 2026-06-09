import type { CurrentUser } from "@/modules/auth/types";
import type { AccountDataExportDto } from "@/modules/account-data/account-data-export.dto";
import type { AccountAppDataSummaryDto } from "@/modules/account-data/account-app-data-summary.dto";
import type { DeleteAccountAppDataDto } from "@/modules/account-data/delete-account-app-data.dto";
import {
  countAccountAppDataByUserId,
  deleteAccountAppDataByUserId,
  getAccountDataExportSnapshot,
} from "@/modules/account-data/account-data.repository";
import {
  toAccountDataExportDto,
  toDeleteAccountAppDataDto,
} from "@/modules/account-data/account-data-export.mapper";

export async function exportAccountDataForUser(
  currentUser: CurrentUser,
  exportedAt = new Date(),
): Promise<AccountDataExportDto> {
  const snapshot = await getAccountDataExportSnapshot(currentUser.id);

  return toAccountDataExportDto({
    currentUser,
    exportedAt,
    snapshot,
  });
}

export async function getAccountAppDataSummaryForUser(
  userId: string,
  generatedAt = new Date(),
): Promise<AccountAppDataSummaryDto> {
  const counts = await countAccountAppDataByUserId(userId);

  return {
    generatedAt: generatedAt.toISOString(),
    counts,
    sharedCatalogueData: {
      productsPreserved: true,
      ingredientsPreserved: true,
    },
  };
}

export async function deleteAccountAppDataForUser(
  userId: string,
  deletedAt = new Date(),
): Promise<DeleteAccountAppDataDto> {
  const result = await deleteAccountAppDataByUserId(userId, deletedAt);

  return toDeleteAccountAppDataDto({
    deletedAt,
    result,
  });
}
