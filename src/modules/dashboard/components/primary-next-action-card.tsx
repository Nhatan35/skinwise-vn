import Link from "next/link";

import type { DashboardDto } from "@/modules/dashboard/dashboard.dto";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";

const priorityLabels = {
  high: "Cần làm trước",
  medium: "Nên làm hôm nay",
  low: "Đang ổn",
};

const actionDescriptions: Record<string, string> = {
  "Hoàn thiện hồ sơ da":
    "Thêm loại da, mối quan tâm và mục tiêu để SkinWise có ngữ cảnh phù hợp hơn.",
  "Tạo routine đầu tiên":
    "Bắt đầu với một routine sáng hoặc tối đơn giản để theo dõi đều đặn hơn.",
  "Ghi nhận routine hôm nay":
    "Đánh dấu routine hôm nay để duy trì thói quen theo dõi skincare.",
  "Thêm nhật ký da hôm nay":
    "Ghi lại cảm nhận và quan sát ngắn để dễ nhìn lại thay đổi theo thời gian.",
  "Tìm sản phẩm phù hợp với hồ sơ da":
    "Xem gợi ý sản phẩm tham khảo dựa trên loại da, mối quan tâm, ngân sách và thành phần bạn muốn tránh.",
  "Xem phân tích an toàn routine":
    "Xem lại routine bằng các quy tắc an toàn cơ bản trước khi tiếp tục sử dụng.",
  "Hôm nay bạn đã cập nhật đủ theo dõi skincare":
    "Các hoạt động chính hôm nay đã được cập nhật. Bạn có thể xem lại tổng quan bất cứ lúc nào.",
};

type PrimaryNextActionCardProps = {
  nextAction: DashboardDto["nextActions"][number];
};

export function PrimaryNextActionCard({
  nextAction,
}: PrimaryNextActionCardProps) {
  return (
    <section className="rounded-3xl border border-border bg-primary p-6 text-primary-foreground shadow-xl shadow-primary/15">
      <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <Badge className="bg-card/15 text-primary-foreground" variant="outline">
            {priorityLabels[nextAction.priority]}
          </Badge>
          <h3 className="mt-4 text-2xl font-semibold tracking-tight">
            {nextAction.label}
          </h3>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-primary-foreground/85">
            {actionDescriptions[nextAction.label] ??
              "Tiếp tục cập nhật dữ liệu skincare để dashboard phản ánh chính xác hơn."}
          </p>
        </div>
        <Button asChild className="bg-card text-primary hover:bg-card/90" size="lg">
          <Link href={nextAction.href}>{nextAction.label}</Link>
        </Button>
      </div>
    </section>
  );
}
