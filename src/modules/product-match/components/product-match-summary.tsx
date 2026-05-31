import type { ProductMatchResponseDto } from "@/modules/product-match/product-match.dto";
import type {
  BudgetRange,
  ExperienceLevel,
  SensitivityLevel,
  SkinConcern,
  SkinType,
} from "@/modules/skin-profile/skin-profile.types";
import { Badge } from "@/shared/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

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

export function ProductMatchSummary({
  productMatch,
}: ProductMatchSummaryProps) {
  const profile = productMatch.skinProfileSummary;

  if (!profile) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hồ sơ da dùng để gợi ý</CardTitle>
        <CardDescription>
          Tính năng này dùng hồ sơ đã lưu, sản phẩm hiển thị và quy tắc cố định.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
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
