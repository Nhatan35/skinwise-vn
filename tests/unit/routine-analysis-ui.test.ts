import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const projectRoot = process.cwd();
const routineBuilderPath = join(
  projectRoot,
  "src/modules/routines/components/routine-builder.tsx",
);
const routineAnalysisPanelPath = join(
  projectRoot,
  "src/modules/routines/components/routine-analysis-panel.tsx",
);

const routineBuilderSource = readFileSync(routineBuilderPath, "utf8");
const routineAnalysisPanelSource = readFileSync(
  routineAnalysisPanelPath,
  "utf8",
);
const combinedSource = `${routineBuilderSource}\n${routineAnalysisPanelSource}`;

function getAnalyzeFetchSource() {
  const match = routineBuilderSource.match(
    /fetch\(getAnalyzeEndpoint\(routine\.id\), \{[\s\S]*?method: "POST",[\s\S]*?\}\);/,
  );

  return match?.[0] ?? "";
}

describe("Routine Analysis UI foundation", () => {
  it("adds a focused analysis panel component used by the /routines UI", () => {
    expect(existsSync(routineAnalysisPanelPath)).toBe(true);
    expect(routineBuilderSource).toContain(
      "@/modules/routines/components/routine-analysis-panel",
    );
    expect(routineBuilderSource).toContain("<RoutineAnalysisPanel");
  });

  it("calls the existing routine analysis API routes through fetch", () => {
    expect(routineBuilderSource).toContain('const ROUTINES_API_PATH = "/api/routines"');
    expect(routineBuilderSource).toContain('const ANALYZE_ROUTE_SEGMENT = "analyze"');
    expect(routineBuilderSource).toContain(
      'const ANALYSIS_HISTORY_ROUTE_SEGMENT = "analyses"',
    );
    expect(routineBuilderSource).toContain("getAnalyzeEndpoint(routine.id)");
    expect(routineBuilderSource).toContain(
      "getAnalysisHistoryEndpoint(routine.id)",
    );
    expect(routineBuilderSource).toContain('method: "POST"');
    expect(routineBuilderSource).toContain('method: "GET"');
  });

  it("posts analyze requests without a client request body", () => {
    const analyzeFetchSource = getAnalyzeFetchSource();

    expect(analyzeFetchSource).toContain("getAnalyzeEndpoint(routine.id)");
    expect(analyzeFetchSource).toContain('method: "POST"');
    expect(analyzeFetchSource).not.toContain("body:");
    expect(analyzeFetchSource).not.toContain("JSON.stringify");
    expect(analyzeFetchSource).not.toContain("userId");
    expect(analyzeFetchSource).not.toContain("routineId");
    expect(analyzeFetchSource).not.toContain("riskLevel");
    expect(analyzeFetchSource).not.toContain("warnings");
    expect(analyzeFetchSource).not.toContain("suggestions");
  });

  it("reads the actual history response shape and updates local history", () => {
    expect(routineBuilderSource).toContain(
      "readApiResponse<{ analyses: RoutineAnalysisDto[] }>",
    );
    expect(routineBuilderSource).toContain("body.data.analyses");
    expect(routineBuilderSource).toContain("setAnalysisHistoryByRoutineId");
    expect(routineBuilderSource).toContain(
      "analysis.analysisId !== body.data.analysisId",
    );
  });

  it("displays only API-provided analysis fields", () => {
    for (const apiField of [
      "analysis.analysisId",
      "analysis.createdAt",
      "analysis.riskLevel",
      "analysis.summary",
      "analysis.positiveFindings",
      "analysis.warnings",
      "warning.code",
      "warning.severity",
      "warning.message",
      "warning.reason",
      "analysis.suggestions",
      "suggestion.title",
      "suggestion.description",
      "suggestion.priority",
      "analysis.shouldSeeProfessional",
      "analysis.disclaimer",
    ]) {
      expect(routineAnalysisPanelSource).toContain(apiField);
    }
  });

  it("renders actionable routine analysis sections", () => {
    for (const sectionHeading of [
      "Tổng quan an toàn routine",
      "Điểm ổn",
      "Cần lưu ý",
      "Gợi ý chỉnh sửa",
      "Thông tin tham khảo",
    ]) {
      expect(routineAnalysisPanelSource).toContain(sectionHeading);
    }
  });

  it("renders text priority labels for suggestions", () => {
    for (const prioritySource of [
      'must_fix: "Cao"',
      'should_fix: "Trung bình"',
      'optional: "Thấp"',
      "Ưu tiên:",
    ]) {
      expect(routineAnalysisPanelSource).toContain(prioritySource);
    }
  });

  it("renders clear empty states for warnings and suggestions", () => {
    expect(routineAnalysisPanelSource).toContain(
      "Chưa có đủ dữ liệu để xác định điểm mạnh của routine.",
    );
    expect(routineAnalysisPanelSource).toContain(
      "Chưa phát hiện lưu ý lớn từ dữ liệu hiện có.",
    );
    expect(routineAnalysisPanelSource).toContain(
      "Bạn có thể tiếp tục theo dõi routine bằng Today Log và Journal.",
    );
  });

  it("renders positive findings from the API response only", () => {
    expect(routineAnalysisPanelSource).toContain("positiveFindings.length");
    expect(routineAnalysisPanelSource).toContain("positiveFindings.map");
    expect(routineAnalysisPanelSource).toContain(
      'data-testid="routine-analysis-positive-finding"',
    );
    expect(routineAnalysisPanelSource).toContain('aria-hidden="true"');
  });

  it("does not prioritize raw rule code as user-facing warning content", () => {
    expect(routineAnalysisPanelSource).not.toContain(
      ">{warning.code}</Badge>",
    );
    expect(routineAnalysisPanelSource).toContain("warning.message");
    expect(routineAnalysisPanelSource).toContain("warning.reason");
  });

  it("includes analyzing, history loading, error, empty history, and success states", () => {
    for (const stateSource of [
      "isAnalyzing",
      "isHistoryLoading",
      "isHistoryLoaded",
      "analysisErrorByRoutineId",
      "Chưa có lịch sử phân tích",
      "Chưa có kết quả phân tích",
      "Đã phân tích routine.",
      "Đang kiểm tra routine",
      "Đang tải lịch sử",
    ]) {
      expect(combinedSource).toContain(stateSource);
    }
  });

  it("uses type-only DTO imports and does not import server or domain analysis modules", () => {
    expect(routineBuilderSource).toContain(
      'import type { RoutineAnalysisDto } from "@/modules/ai-analysis/routine-analysis.dto";',
    );
    expect(routineAnalysisPanelSource).toContain(
      'import type { RoutineAnalysisDto } from "@/modules/ai-analysis/routine-analysis.dto";',
    );

    for (const forbiddenImport of [
      "routine.repository",
      "routine.use-case",
      "routine-analysis.repository",
      "analyze-routine.use-case",
      "@/infrastructure/database",
      "mongodb",
      "server-only",
      "getCurrentUser",
      "@/modules/auth",
      "@/domain/routine-safety",
      "@/infrastructure/ai",
      "openai",
      "OpenAI",
      "LLM",
    ]) {
      expect(combinedSource).not.toContain(forbiddenImport);
    }
  });

  it("does not generate client-side analysis conclusions", () => {
    for (const forbiddenSource of [
      "ruleResults",
      "triggeredRules",
      "analyzeRoutineSafety",
      "MISSING_SUNSCREEN_AM",
      "TOO_MANY_ACTIVES",
      "RETINOID_PLUS_EXFOLIANT",
      "FRAGRANCE_SENSITIVE_CAUTION",
      "skin score",
      "medical diagnosis",
    ]) {
      expect(combinedSource).not.toContain(forbiddenSource);
    }
  });

  it("keeps routine analysis UI copy free of unsafe skincare claims", () => {
    for (const unsafeClaim of [
      "chữa khỏi",
      "điều trị chắc chắn",
      "đảm bảo an toàn",
      "đảm bảo hiệu quả",
      "phù hợp 100%",
      "routine này chắc chắn không gây kích ứng",
      "không bao giờ kích ứng",
      "routine hoàn hảo",
      "bác sĩ khuyên",
      "trị mụn chắc chắn",
      "hiệu quả 100%",
      "cure",
      "guaranteed",
      "100% safe",
      "100% effective",
      "never irritates",
      "perfect routine",
      "doctor recommended",
      "medical diagnosis",
    ]) {
      expect(combinedSource.toLowerCase()).not.toContain(
        unsafeClaim.toLowerCase(),
      );
    }
  });

  it("does not introduce out-of-scope feature modules or new analysis UI routes", () => {
    for (const forbiddenScope of [
      "@/modules/ingredients",
      "@/modules/journals",
      "@/modules/dashboard",
      "/api/ingredients",
      "ProductPicker",
      "Dashboard",
      "Routine Logs",
      "image upload",
    ]) {
      expect(combinedSource).not.toContain(forbiddenScope);
    }

    expect(
      existsSync(join(projectRoot, "src/app/(dashboard)/routines/[id]")),
    ).toBe(false);
    expect(
      existsSync(
        join(projectRoot, "src/app/(dashboard)/routines/[id]/analysis"),
      ),
    ).toBe(false);
    expect(
      existsSync(
        join(projectRoot, "src/app/(dashboard)/routines/[id]/analyses"),
      ),
    ).toBe(false);
  });
});
