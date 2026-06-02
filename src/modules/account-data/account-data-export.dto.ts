import type { RoutineAnalysisDto } from "@/modules/ai-analysis/routine-analysis.dto";
import type { ProductCategory } from "@/modules/products/product.types";
import type { RoutineLogDto } from "@/modules/routine-logs/routine-log.dto";
import type { RoutineDto } from "@/modules/routines/routine.dto";
import type { SavedProductDto } from "@/modules/saved-products/saved-product.dto";
import type { SkinJournalDto } from "@/modules/journals/skin-journal.dto";
import type { SkinProfileDto } from "@/modules/skin-profile/skin-profile.dto";
import type { AppUserRole } from "@/modules/users/app-user-profile.types";

export const ACCOUNT_DATA_EXPORT_SCHEMA_VERSION = "1.0";

export type AccountDataExportUserDto = {
  id: string;
  email?: string;
  name?: string;
};

export type AccountDataExportAppProfileDto = {
  role: AppUserRole;
  onboardingCompleted: boolean;
  accountDeletionRequestedAt?: string;
  accountDeletionRequestStatus: "not_requested" | "requested";
  createdAt: string;
  updatedAt: string;
};

export type AccountDataLinkedProductDto = {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  keyActives: string[];
};

export type AccountDataSavedProductExportDto = Omit<SavedProductDto, "product"> & {
  product?: AccountDataLinkedProductDto;
};

export type AccountDataExportDto = {
  schemaVersion: typeof ACCOUNT_DATA_EXPORT_SCHEMA_VERSION;
  exportedAt: string;
  user: AccountDataExportUserDto;
  appProfile: AccountDataExportAppProfileDto | null;
  skinProfile: SkinProfileDto | null;
  savedProducts: AccountDataSavedProductExportDto[];
  routines: RoutineDto[];
  routineLogs: RoutineLogDto[];
  routineAnalyses: RoutineAnalysisDto[];
  skinJournals: SkinJournalDto[];
};
