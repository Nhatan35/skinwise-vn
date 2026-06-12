import type { DashboardNextAction } from "@/modules/dashboard/dashboard.types";

const dashboardNextActionDescriptions: Record<string, string> = {
  "Hoàn thiện hồ sơ da":
    "Hồ sơ da còn thiếu thông tin nền, nên SkinWise cần thêm ngữ cảnh trước khi gợi ý sản phẩm hoặc routine dễ hiểu hơn.",
  "Tạo routine đầu tiên":
    "Bạn đã có điểm bắt đầu, hãy sắp xếp routine đơn giản để dễ theo dõi đều đặn hơn.",
  "Ghi nhận routine hôm nay":
    "Bạn đã có routine nhưng hôm nay chưa có log; ghi nhận giúp Dashboard và Insights phản ánh thói quen hiện tại.",
  "Thêm nhật ký da hôm nay":
    "Routine log cho biết bạn đã làm gì, còn journal giúp ghi lại cảm nhận và bối cảnh cá nhân sau routine.",
  "Tìm sản phẩm phù hợp với hồ sơ da":
    "Bạn đã có hồ sơ da, hãy xem Product Match để cân nhắc sản phẩm trước khi lưu hoặc thêm vào routine.",
  "Xem phân tích an toàn routine":
    "Bạn đã có routine và ghi nhận hôm nay; xem lại lưu ý an toàn của routine trước khi tiếp tục duy trì.",
  "Xem insights cá nhân":
    "Bạn đã có các ghi nhận chính hôm nay; xem insights để nhìn lại thói quen và dữ liệu cá nhân theo thời gian.",
};

export function getDashboardNextActionDescription(
  nextAction: DashboardNextAction,
) {
  return (
    dashboardNextActionDescriptions[nextAction.label] ??
    "Tiếp tục cập nhật hồ sơ, routine, log hoặc journal để Dashboard có thêm ngữ cảnh cá nhân."
  );
}
