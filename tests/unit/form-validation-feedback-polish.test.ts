import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const projectRoot = process.cwd();
const readSource = (path: string) =>
  readFileSync(join(projectRoot, path), "utf8");

const onboardingSource = readSource(
  "src/modules/skin-profile/components/skin-profile-onboarding-form.tsx",
);
const profileEditSource = readSource(
  "src/modules/skin-profile/components/skin-profile-view-edit.tsx",
);
const routineBuilderSource = readSource(
  "src/modules/routines/components/routine-builder.tsx",
);
const routineLogSource = readSource(
  "src/modules/routines/components/routine-log-controls.tsx",
);
const journalFormSource = readSource(
  "src/modules/journals/components/skin-journal-entry-form.tsx",
);
const journalTimelineSource = readSource(
  "src/modules/journals/components/skin-journal-timeline.tsx",
);
const settingsSource = readSource(
  "src/modules/settings/components/settings-data-control-center.tsx",
);

describe("MVP form validation and inline feedback polish", () => {
  it("adds required-field guidance and invalid-field focus to Skin Profile forms", () => {
    for (const source of [onboardingSource, profileEditSource]) {
      expect(source).toContain("focusFirstProfileError");
      expect(source).toContain("focusFirstProfileError(validationErrors)");
      expect(source).toContain("Các mục có nhãn “Bắt buộc”");
      expect(source).toContain('aria-required="true"');
      expect(source).toContain('role="alert"');
      expect(source).toContain('role="status"');
    }
  });

  it("explains Routine Builder requirements and manual-product disabled state", () => {
    for (const requiredSource of [
      "ROUTINE_REQUIRED_GUIDANCE_ID",
      "Tên routine (Bắt buộc)",
      "Sản phẩm hoặc nhập thủ công (Bắt buộc)",
      "Hướng dẫn sử dụng là tùy chọn.",
      "Chuyển lựa chọn sản phẩm sang nhập thủ công để nhập tên khác.",
      "aria-required={!step.productId}",
    ]) {
      expect(routineBuilderSource).toContain(requiredSource);
    }
  });

  it("prevents invalid partial-log submission and explains how to continue", () => {
    expect(routineLogSource).toContain("const canSavePartial");
    expect(routineLogSource).toContain(
      "disabled={controlsDisabled || !canSavePartial}",
    );
    expect(routineLogSource).toContain(
      "Chọn ít nhất một bước đã hoàn thành để lưu trạng thái một phần.",
    );
    expect(routineLogSource).toContain(
      "Bạn đã chọn tất cả các bước. Hãy dùng nút Hoàn thành",
    );
    expect(routineLogSource).toContain('role="status"');
    expect(routineLogSource).not.toContain("error.message");
  });

  it("keeps Journal validation close to fields and avoids raw client errors", () => {
    for (const requiredSource of [
      "SKIN_JOURNAL_REQUIRED_GUIDANCE_ID",
      "Ngày ghi nhận (Bắt buộc)",
      "Ngày ghi nhận và múi giờ là bắt buộc.",
      'aria-required="true"',
      "Phiên đăng nhập không còn hiệu lực.",
      "Một vài thông tin nhật ký chưa hợp lệ.",
      "Mục nhật ký này không còn khả dụng.",
    ]) {
      expect(journalFormSource).toContain(requiredSource);
    }

    expect(journalFormSource).not.toContain("`${error.message}");
    expect(journalTimelineSource).not.toContain("return error.message");
  });

  it("uses safe Settings action feedback and visible confirmation guidance", () => {
    for (const requiredSource of [
      "getSettingsActionErrorMessage",
      "APP_DATA_DELETE_ACTION_GUIDANCE_ID",
      "ACCOUNT_DELETE_ACTION_GUIDANCE_ID",
      "Chọn ô xác nhận ở trên để mở khóa nút xóa dữ liệu ứng dụng.",
      "Chọn ô xác nhận ở trên để mở khóa nút gửi yêu cầu.",
      'role="alert"',
      'role="status"',
    ]) {
      expect(settingsSource).toContain(requiredSource);
    }

    expect(settingsSource).not.toContain("? error.message");
  });
});
