import Link from "next/link";

import { DashboardCard } from "@/modules/dashboard/components/dashboard-card";
import type { DashboardDto } from "@/modules/dashboard/dashboard.dto";
import { Button } from "@/shared/components/ui/button";
import { routes } from "@/shared/constants/routes";

type SkinProfileSummaryCardProps = {
  skinProfile: DashboardDto["skinProfile"];
};

const skinTypeLabels = {
  oily: "Da dầu",
  dry: "Da khô",
  combination: "Da hỗn hợp",
  normal: "Da thường",
  sensitive: "Da nhạy cảm",
  unknown: "Chưa chắc chắn",
};

const sensitivityLabels = {
  low: "Thấp",
  medium: "Trung bình",
  high: "Cao",
  unknown: "Chưa chắc chắn",
};

const concernLabels = {
  acne: "Mụn",
  oiliness: "Dầu thừa",
  dryness: "Khô căng",
  redness: "Đỏ da",
  dark_spots: "Thâm hoặc đốm tối màu",
  texture: "Bề mặt da chưa đều",
  barrier_support: "Hàng rào da cần hỗ trợ",
  unknown: "Chưa chắc chắn",
};

export function SkinProfileSummaryCard({
  skinProfile,
}: SkinProfileSummaryCardProps) {
  if (!skinProfile.exists) {
    return (
      <DashboardCard title="Hồ sơ da">
        <div className="space-y-4">
          <p className="text-sm leading-6 text-stone-600">
            Bạn chưa hoàn thiện hồ sơ da. Hãy thêm thông tin nền tảng để các
            phần routine và phân tích có ngữ cảnh tốt hơn.
          </p>
          <Button asChild size="sm">
            <Link href={routes.SKIN_PROFILE}>Hoàn thiện hồ sơ da</Link>
          </Button>
        </div>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard title="Hồ sơ da">
      <dl className="space-y-3 text-sm">
        <div>
          <dt className="font-medium text-stone-900">Loại da</dt>
          <dd className="mt-1 text-stone-600">
            {skinTypeLabels[skinProfile.skinType]}
          </dd>
        </div>
        <div>
          <dt className="font-medium text-stone-900">Vấn đề chính</dt>
          <dd className="mt-1 text-stone-600">
            {skinProfile.concerns.map((concern) => concernLabels[concern]).join(", ")}
          </dd>
        </div>
        <div>
          <dt className="font-medium text-stone-900">Mức độ nhạy cảm</dt>
          <dd className="mt-1 text-stone-600">
            {sensitivityLabels[skinProfile.sensitivityLevel]}
          </dd>
        </div>
      </dl>
      <Button asChild className="mt-4" size="sm" variant="outline">
        <Link href={routes.SKIN_PROFILE}>Chỉnh sửa hồ sơ da</Link>
      </Button>
    </DashboardCard>
  );
}
