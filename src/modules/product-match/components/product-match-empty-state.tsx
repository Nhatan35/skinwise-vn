import Link from "next/link";

import { EmptyState } from "@/shared/components/empty-state";
import { Button } from "@/shared/components/ui/button";
import { routes } from "@/shared/constants/routes";

export function ProductMatchNoProfileEmptyState() {
  return (
    <EmptyState
      action={
        <Button asChild>
          <Link href={routes.ONBOARDING_SKIN_PROFILE}>Create Skin Profile</Link>
        </Button>
      }
      description="Create your Skin Profile first to see personalized product matches."
      title="Skin Profile needed"
    />
  );
}

export function ProductMatchNoProductsEmptyState() {
  return (
    <EmptyState
      description="No product matches are available yet. Please check back after more reviewed products are added."
      title="No product matches available yet"
    />
  );
}
