import type { ProductDto } from "@/modules/products/product.dto";
import type {
  SavedProductDecisionStatus,
  SavedProductPlannedRoutineSlot,
} from "@/modules/saved-products/saved-product.types";

export type SavedProductDto = {
  id: string;
  productId: string;
  product: ProductDto;
  decisionStatus?: SavedProductDecisionStatus;
  plannedRoutineSlot?: SavedProductPlannedRoutineSlot;
  personalNote?: string;
  createdAt: string;
  updatedAt: string;
};
