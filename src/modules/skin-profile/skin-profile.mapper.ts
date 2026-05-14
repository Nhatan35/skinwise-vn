import type { SkinProfileDto } from "@/modules/skin-profile/skin-profile.dto";
import type { SkinProfile } from "@/modules/skin-profile/skin-profile.types";

export function toSkinProfileDto(profile: SkinProfile): SkinProfileDto {
  return {
    id: profile._id.toString(),
    skinType: profile.skinType,
    concerns: [...profile.concerns],
    sensitivityLevel: profile.sensitivityLevel,
    budgetRange: profile.budgetRange,
    experienceLevel: profile.experienceLevel,
    avoidIngredients: [...profile.avoidIngredients],
    createdAt: profile.createdAt.toISOString(),
    updatedAt: profile.updatedAt.toISOString(),
  };
}
