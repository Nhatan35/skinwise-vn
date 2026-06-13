import Link from "next/link";

import { EmptyState } from "@/shared/components/empty-state";
import { Button } from "@/shared/components/ui/button";
import { routes } from "@/shared/constants/routes";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl items-center px-4 py-10 sm:px-6">
      <EmptyState
        action={
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button asChild>
              <Link href={routes.HOME}>Về trang chủ</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={routes.DASHBOARD}>Mở dashboard</Link>
            </Button>
          </div>
        }
        className="w-full"
        description="Đường dẫn này không tồn tại hoặc nội dung đã được chuyển. Hãy quay về trang chủ hoặc mở dashboard để tiếp tục."
        title="Không tìm thấy trang"
      />
    </main>
  );
}
