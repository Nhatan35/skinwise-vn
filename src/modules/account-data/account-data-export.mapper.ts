import type { CurrentUser } from "@/modules/auth/types";
import type {
  AccountDataExportAppProfileDto,
  AccountDataExportDto,
  AccountDataLinkedProductDto,
  AccountDataSavedProductExportDto,
} from "@/modules/account-data/account-data-export.dto";
import { ACCOUNT_DATA_EXPORT_SCHEMA_VERSION } from "@/modules/account-data/account-data-export.dto";
import type {
  AccountDataExportSnapshot,
  AccountDataSavedProductSnapshot,
} from "@/modules/account-data/account-data.repository";
import type { DeleteAccountAppDataDto } from "@/modules/account-data/delete-account-app-data.dto";
import type { DeleteAccountAppDataRepositoryResult } from "@/modules/account-data/account-data.repository";
import type { Product } from "@/modules/products/product.types";
import { toRoutineAnalysisDto } from "@/modules/ai-analysis/routine-analysis.mapper";
import { toRoutineLogDto } from "@/modules/routine-logs/routine-log.mapper";
import { toRoutineDto } from "@/modules/routines/routine.mapper";
import { toSkinJournalDto } from "@/modules/journals/skin-journal.mapper";
import { toSkinProfileDto } from "@/modules/skin-profile/skin-profile.mapper";
import type { AppUserProfile } from "@/modules/users/app-user-profile.types";

function toOptionalIsoString(value: Date | null | undefined) {
  return value ? value.toISOString() : undefined;
}

function toAccountDataExportAppProfileDto(
  profile: AppUserProfile | null,
): AccountDataExportAppProfileDto | null {
  if (!profile) {
    return null;
  }

  const accountDeletionRequestedAt = toOptionalIsoString(
    profile.accountDeletionRequestedAt,
  );

  return {
    role: profile.role,
    onboardingCompleted: profile.onboardingCompleted,
    ...(accountDeletionRequestedAt ? { accountDeletionRequestedAt } : {}),
    accountDeletionRequestStatus: accountDeletionRequestedAt
      ? "requested"
      : "not_requested",
    createdAt: profile.createdAt.toISOString(),
    updatedAt: profile.updatedAt.toISOString(),
  };
}

function toLinkedProductDto(product: Product): AccountDataLinkedProductDto {
  return {
    id: product._id.toString(),
    name: product.name,
    brand: product.brand,
    category: product.category,
    keyActives: [...product.keyActives],
  };
}

function toSavedProductExportDto(
  snapshot: AccountDataSavedProductSnapshot,
): AccountDataSavedProductExportDto {
  return {
    id: snapshot.savedProduct._id.toString(),
    productId: snapshot.savedProduct.productId.toString(),
    ...(snapshot.product ? { product: toLinkedProductDto(snapshot.product) } : {}),
    tags: Array.isArray(snapshot.savedProduct.tags)
      ? [...snapshot.savedProduct.tags]
      : [],
    createdAt: snapshot.savedProduct.createdAt.toISOString(),
    updatedAt: snapshot.savedProduct.updatedAt.toISOString(),
  };
}

export function toAccountDataExportDto(input: {
  currentUser: CurrentUser;
  exportedAt: Date;
  snapshot: AccountDataExportSnapshot;
}): AccountDataExportDto {
  return {
    schemaVersion: ACCOUNT_DATA_EXPORT_SCHEMA_VERSION,
    exportedAt: input.exportedAt.toISOString(),
    user: {
      id: input.currentUser.id,
      email: input.currentUser.email,
      name: input.currentUser.name,
    },
    appProfile: toAccountDataExportAppProfileDto(input.snapshot.appProfile),
    skinProfile: input.snapshot.skinProfile
      ? toSkinProfileDto(input.snapshot.skinProfile)
      : null,
    savedProducts: input.snapshot.savedProducts.map(toSavedProductExportDto),
    routines: input.snapshot.routines.map(toRoutineDto),
    routineLogs: input.snapshot.routineLogs.map(toRoutineLogDto),
    routineAnalyses: input.snapshot.routineAnalyses.map(toRoutineAnalysisDto),
    skinJournals: input.snapshot.skinJournals.map(toSkinJournalDto),
  };
}

export function toDeleteAccountAppDataDto(input: {
  deletedAt: Date;
  result: DeleteAccountAppDataRepositoryResult;
}): DeleteAccountAppDataDto {
  return {
    deleted: true,
    deletedAt: input.deletedAt.toISOString(),
    deletedCounts: {
      ...input.result.deletedCounts,
    },
    appUserProfile: {
      preserved: input.result.appUserProfileMatched,
      onboardingCompletedReset: input.result.appUserProfileOnboardingReset,
    },
  };
}
