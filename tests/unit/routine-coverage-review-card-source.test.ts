import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const projectRoot = process.cwd();
const helperPath = join(
  projectRoot,
  "src/modules/routines/routine-coverage-review.ts",
);
const cardPath = join(
  projectRoot,
  "src/modules/routines/components/routine-coverage-review-card.tsx",
);
const routineBuilderPath = join(
  projectRoot,
  "src/modules/routines/components/routine-builder.tsx",
);

const helperSource = readFileSync(helperPath, "utf8");
const cardSource = readFileSync(cardPath, "utf8");
const routineBuilderSource = readFileSync(routineBuilderPath, "utf8");
const combinedCoverageSource = `${helperSource}\n${cardSource}`;

describe("Routine Coverage Review source safety", () => {
  it("adds the helper and card files", () => {
    expect(existsSync(helperPath)).toBe(true);
    expect(existsSync(cardPath)).toBe(true);
  });

  it("renders safe Routine Coverage Review copy", () => {
    for (const requiredCopy of [
      "Đánh giá tổng quan routine",
      "Đây là phần kiểm tra thói quen và cấu trúc routine ở mức tham khảo",
      "không phải chẩn đoán da hoặc lời khuyên điều trị",
      "Bạn chưa có routine nào để đánh giá.",
      "Routine buổi sáng hiện chưa có bước chống nắng",
      "Chưa thấy bước dưỡng ẩm trong routine hiện tại",
      "Một số routine có nhiều bước treatment/active",
      "Chưa thấy thiếu hụt cấu trúc lớn từ dữ liệu routine hiện có",
      "Điểm cần kiểm tra lại",
      "Tiếp tục theo dõi routine",
    ]) {
      expect(combinedCoverageSource).toContain(requiredCopy);
    }
  });

  it("does not include unsafe clinical or guarantee copy", () => {
    for (const forbiddenCopy of [
      "trị mụn",
      "trị nám",
      "chữa",
      "an toàn tuyệt đối",
      "chắc chắn phù hợp",
      "hoàn hảo",
      "điều trị bằng",
      "da bạn đang bị",
      "bạn bị",
      "chẩn đoán là",
      "will treat",
      "guaranteed",
      "perfect",
    ]) {
      expect(combinedCoverageSource).not.toContain(forbiddenCopy);
    }

    expect(combinedCoverageSource).toContain("không phải chẩn đoán");
    expect(combinedCoverageSource).not.toContain("Chẩn đoán:");
  });

  it("keeps the coverage helper pure and away from server layers", () => {
    for (const forbiddenSource of [
      "repository",
      "database",
      "server-only",
      "auth",
      "env",
      "AIProvider",
      "ai-provider",
      "domain/routine-safety",
      "routine-safety",
      "fetch(",
      "/api/routines/",
      "riskLevel",
      "shouldSeeProfessional",
      "process.env",
    ]) {
      expect(helperSource).not.toContain(forbiddenSource);
    }
  });

  it("keeps the coverage card client-safe without new API or AI calls", () => {
    for (const requiredSource of [
      '"use client";',
      "buildRoutineCoverageReview",
      "RoutineCoverageReviewCard",
      "RoutineCoverageReviewCardProps",
      "routines: RoutineDto[]",
      "onCreateRoutine?: () => void",
      'data-testid="routine-coverage-review-card"',
      'data-testid="routine-coverage-cautions"',
      'data-testid="routine-coverage-next-action"',
    ]) {
      expect(cardSource).toContain(requiredSource);
    }

    for (const forbiddenSource of [
      "fetch(",
      "/api/routines/",
      "/api/ai",
      "analyze",
      "riskLevel",
      "shouldSeeProfessional",
      "AIProvider",
      "ai-provider",
      "env",
      "process.env",
      "repository",
      "database",
      "server-only",
      "domain/routine-safety",
      "routine-safety",
    ]) {
      expect(cardSource).not.toContain(forbiddenSource);
    }
  });

  it("integrates the card into Routine Builder without changing dashboard scope", () => {
    expect(routineBuilderSource).toContain(
      "@/modules/routines/components/routine-coverage-review-card",
    );
    expect(routineBuilderSource).toContain("<RoutineCoverageReviewCard");
    expect(routineBuilderSource).toContain("routines={routines}");
    expect(routineBuilderSource).toContain(
      "onCreateRoutine={routines.length > 0 ? startCreate : undefined}",
    );
    expect(routineBuilderSource).not.toContain("@/modules/dashboard");
  });
});
