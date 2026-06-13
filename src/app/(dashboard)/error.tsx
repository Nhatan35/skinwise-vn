"use client";

import Link from "next/link";

import { ErrorState } from "@/shared/components/error-state";
import { Button } from "@/shared/components/ui/button";
import { routes } from "@/shared/constants/routes";

type DashboardErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function DashboardError({ reset }: DashboardErrorProps) {
  return (
    <ErrorState
      action={
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button onClick={reset} type="button">
            Thử tải lại
          </Button>
          <Button asChild variant="outline">
            <Link href={routes.DASHBOARD}>Về dashboard</Link>
          </Button>
        </div>
      }
      description="Nội dung này chưa thể hiển thị. Hãy thử tải lại hoặc quay về dashboard để tiếp tục."
      title="Chưa thể mở nội dung"
    />
  );
}
