"use client";

import Link from "next/link";

import { ErrorState } from "@/shared/components/error-state";
import { Button } from "@/shared/components/ui/button";
import { routes } from "@/shared/constants/routes";

type RootErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function RootError({ reset }: RootErrorProps) {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl items-center px-4 py-10 sm:px-6">
      <ErrorState
        action={
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button onClick={reset} type="button">
              Thử tải lại
            </Button>
            <Button asChild variant="outline">
              <Link href={routes.HOME}>Về trang chủ</Link>
            </Button>
          </div>
        }
        className="w-full"
        description="Trang này chưa thể hiển thị. Hãy thử tải lại hoặc quay về trang chủ để tiếp tục."
        title="Chưa thể mở trang"
      />
    </main>
  );
}
