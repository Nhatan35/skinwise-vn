import type { ProductMatchResponseDto } from "@/modules/product-match/product-match.dto";
import type {
  BudgetRange,
  ExperienceLevel,
  SensitivityLevel,
  SkinConcern,
  SkinType,
} from "@/modules/skin-profile/skin-profile.types";
import Link from "next/link";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { routes } from "@/shared/constants/routes";

type ProductMatchSummaryProps = {
  productMatch: ProductMatchResponseDto;
};

const skinTypeLabels: Record<SkinType, string> = {
  oily: "Da dầu",
  dry: "Da khô",
  combination: "Da hỗn hợp",
  normal: "Da thường",
  sensitive: "Da nhạy cảm",
  unknown: "Chưa chắc chắn",
};

const concernLabels: Record<SkinConcern, string> = {
  acne: "Mụn",
  oiliness: "Dầu thừa",
  dryness: "Khô căng",
  redness: "Đỏ da",
  dark_spots: "Thâm hoặc đốm tối màu",
  texture: "Bề mặt da chưa đều",
  barrier_support: "Hàng rào da cần được hỗ trợ",
  unknown: "Chưa chắc chắn",
};

const sensitivityLabels: Record<SensitivityLevel, string> = {
  low: "Thấp",
  medium: "Trung bình",
  high: "Cao",
  unknown: "Chưa chắc chắn",
};

const budgetLabels: Record<BudgetRange, string> = {
  under_300k: "Dưới 300k",
  "300k_700k": "300k - 700k",
  "700k_1500k": "700k - 1.500k",
  above_1500k: "Trên 1.500k",
};

const experienceLabels: Record<ExperienceLevel, string> = {
  beginner: "Mới bắt đầu",
  intermediate: "Đã có routine cơ bản",
  advanced: "Có kinh nghiệm với hoạt chất",
};

function hasKnownConcern(concerns: SkinConcern[]) {
  return concerns.some((concern) => concern !== "unknown");
}

function needsMoreProfileInfo(profile: {
  concerns: SkinConcern[];
  sensitivityLevel: SensitivityLevel;
  skinType: SkinType;
}) {
  return (
    profile.skinType === "unknown" ||
    profile.sensitivityLevel === "unknown" ||
    !hasKnownConcern(profile.concerns)
  );
}

export function ProductMatchSummary({
  productMatch,
}: ProductMatchSummaryProps) {
  const profile = productMatch.skinProfileSummary;

  if (!profile) {
    return null;
  }

  const shouldPromptForMoreProfileInfo = needsMoreProfileInfo(profile);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hồ sơ da dùng để gợi ý</CardTitle>
        <CardDescription>
          Tính năng này dùng hồ sơ đã lưu, sản phẩm hiển thị và quy tắc cố định.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        {shouldPromptForMoreProfileInfo ? (
          <div className="mb-2 flex w-full flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-950 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-6">
              SkinWise cần thêm thông tin hồ sơ da để gợi ý sản phẩm phù hợp
              hơn. Hãy kiểm tra lại loại da, độ nhạy cảm và mối quan tâm về da.
            </p>
            <Button asChild size="sm" variant="outline">
              <Link href={routes.SKIN_PROFILE}>Cập nhật hồ sơ da</Link>
            </Button>
          </div>
        ) : null}
        <Badge variant="secondary">
          Loại da: {skinTypeLabels[profile.skinType]}
        </Badge>
        <Badge variant="secondary">
          Độ nhạy cảm: {sensitivityLabels[profile.sensitivityLevel]}
        </Badge>
        <Badge variant="secondary">
          Ngân sách: {budgetLabels[profile.budgetRange]}
        </Badge>
        <Badge variant="secondary">
          Kinh nghiệm: {experienceLabels[profile.experienceLevel]}
        </Badge>
        {profile.concerns.map((concern) => (
          <Badge key={concern} variant="outline">
            Mối quan tâm: {concernLabels[concern]}
          </Badge>
        ))}
        {profile.avoidIngredientsCount > 0 ? (
          <Badge variant="outline">
            Thành phần muốn tránh: {profile.avoidIngredientsCount}
          </Badge>
        ) : null}
      </CardContent>
    </Card>
  );
}
