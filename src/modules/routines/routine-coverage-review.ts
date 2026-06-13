import type { RoutineDto } from "@/modules/routines/routine.dto";

export type RoutineCoverageItemId =
  | "routine-created"
  | "morning-routine"
  | "evening-routine"
  | "morning-sunscreen"
  | "moisturizer";

export type RoutineCoverageItemStatus = "complete" | "note" | "missing";

export type RoutineCoverageItem = {
  id: RoutineCoverageItemId;
  label: string;
  status: RoutineCoverageItemStatus;
  description: string;
};

export type RoutineCoverageCautionItemId =
  | "missing-morning-sunscreen"
  | "missing-moisturizer"
  | "multiple-treatments";

export type RoutineCoverageCautionItem = {
  id: RoutineCoverageCautionItemId;
  label: string;
  description: string;
  severity: "info" | "caution";
};

export type RoutineCoverageNextActionType =
  | "create-routine"
  | "review-morning-routine"
  | "review-moisturizer"
  | "review-treatment-pacing"
  | "keep-monitoring";

export type RoutineCoverageNextAction = {
  label: string;
  description: string;
  actionType: RoutineCoverageNextActionType;
};

export type RoutineCoverageReview = {
  hasRoutines: boolean;
  totalRoutines: number;
  hasMorningRoutine: boolean;
  hasEveningRoutine: boolean;
  hasMorningSunscreen: boolean;
  hasMoisturizer: boolean;
  routinesWithMultipleTreatments: Array<{
    routineId: string;
    routineName: string;
    treatmentStepCount: number;
  }>;
  summary: string;
  coverageItems: RoutineCoverageItem[];
  cautionItems: RoutineCoverageCautionItem[];
  nextAction: RoutineCoverageNextAction;
};

export function buildRoutineCoverageReview(
  routines: RoutineDto[],
): RoutineCoverageReview {
  const totalRoutines = routines.length;
  const hasRoutines = totalRoutines > 0;
  const morningRoutines = routines.filter(
    (routine) => routine.timeOfDay === "morning",
  );
  const hasMorningRoutine = morningRoutines.length > 0;
  const hasEveningRoutine = routines.some(
    (routine) => routine.timeOfDay === "evening",
  );
  const hasMorningSunscreen =
    hasMorningRoutine &&
    morningRoutines.some((routine) =>
      routine.steps.some((step) => step.category === "sunscreen"),
    );
  const hasMoisturizer = routines.some((routine) =>
    routine.steps.some((step) => step.category === "moisturizer"),
  );
  const routinesWithMultipleTreatments = routines
    .map((routine) => ({
      routineId: routine.id,
      routineName: routine.name,
      treatmentStepCount: routine.steps.filter(
        (step) => step.category === "treatment",
      ).length,
    }))
    .filter((routine) => routine.treatmentStepCount >= 2);

  const cautionItems = buildCautionItems({
    hasMorningRoutine,
    hasMorningSunscreen,
    hasMoisturizer,
    hasRoutines,
    routinesWithMultipleTreatments,
  });

  return {
    hasRoutines,
    totalRoutines,
    hasMorningRoutine,
    hasEveningRoutine,
    hasMorningSunscreen,
    hasMoisturizer,
    routinesWithMultipleTreatments,
    summary: getCoverageSummary({
      cautionItems,
      hasRoutines,
    }),
    coverageItems: buildCoverageItems({
      hasEveningRoutine,
      hasMorningRoutine,
      hasMorningSunscreen,
      hasMoisturizer,
      hasRoutines,
    }),
    cautionItems,
    nextAction: getNextAction({
      hasMorningRoutine,
      hasMorningSunscreen,
      hasMoisturizer,
      hasRoutines,
      routinesWithMultipleTreatments,
    }),
  };
}

function buildCoverageItems({
  hasEveningRoutine,
  hasMorningRoutine,
  hasMorningSunscreen,
  hasMoisturizer,
  hasRoutines,
}: {
  hasEveningRoutine: boolean;
  hasMorningRoutine: boolean;
  hasMorningSunscreen: boolean;
  hasMoisturizer: boolean;
  hasRoutines: boolean;
}): RoutineCoverageItem[] {
  return [
    {
      id: "routine-created",
      label: "Routine đã được tạo",
      status: hasRoutines ? "complete" : "missing",
      description: hasRoutines
        ? "Bạn đã có dữ liệu routine để xem lại ở mức tổng quan."
        : "Bạn chưa có routine nào để đánh giá.",
    },
    {
      id: "morning-routine",
      label: "Routine buổi sáng",
      status: hasMorningRoutine ? "complete" : "note",
      description: hasMorningRoutine
        ? "Đã có ít nhất một routine buổi sáng trong dữ liệu hiện tại."
        : "Bạn chưa có routine buổi sáng trong dữ liệu hiện tại.",
    },
    {
      id: "evening-routine",
      label: "Routine buổi tối",
      status: hasEveningRoutine ? "complete" : "note",
      description: hasEveningRoutine
        ? "Đã có ít nhất một routine buổi tối trong dữ liệu hiện tại."
        : "Bạn chưa có routine buổi tối trong dữ liệu hiện tại.",
    },
    {
      id: "morning-sunscreen",
      label: "Chống nắng buổi sáng",
      status: getMorningSunscreenStatus({
        hasMorningRoutine,
        hasMorningSunscreen,
      }),
      description: getMorningSunscreenDescription({
        hasMorningRoutine,
        hasMorningSunscreen,
      }),
    },
    {
      id: "moisturizer",
      label: "Dưỡng ẩm",
      status: getMoisturizerStatus({ hasMoisturizer, hasRoutines }),
      description: getMoisturizerDescription({ hasMoisturizer, hasRoutines }),
    },
  ];
}

function buildCautionItems({
  hasMorningRoutine,
  hasMorningSunscreen,
  hasMoisturizer,
  hasRoutines,
  routinesWithMultipleTreatments,
}: {
  hasMorningRoutine: boolean;
  hasMorningSunscreen: boolean;
  hasMoisturizer: boolean;
  hasRoutines: boolean;
  routinesWithMultipleTreatments: RoutineCoverageReview["routinesWithMultipleTreatments"];
}): RoutineCoverageCautionItem[] {
  const cautionItems: RoutineCoverageCautionItem[] = [];

  if (hasMorningRoutine && !hasMorningSunscreen) {
    cautionItems.push({
      id: "missing-morning-sunscreen",
      label: "Kiểm tra chống nắng buổi sáng",
      description:
        "Routine buổi sáng hiện chưa có bước chống nắng. Bạn có thể cân nhắc kiểm tra lại nếu routine này dùng ban ngày.",
      severity: "info",
    });
  }

  if (hasRoutines && !hasMoisturizer) {
    cautionItems.push({
      id: "missing-moisturizer",
      label: "Kiểm tra bước dưỡng ẩm",
      description:
        "Chưa thấy bước dưỡng ẩm trong routine hiện tại. Bạn có thể kiểm tra lại để hỗ trợ cảm giác dễ chịu và duy trì thói quen chăm sóc da ổn định hơn.",
      severity: "info",
    });
  }

  if (routinesWithMultipleTreatments.length > 0) {
    cautionItems.push({
      id: "multiple-treatments",
      label: "Xem lại treatment/active",
      description:
        "Một số routine có nhiều bước treatment/active. Bạn có thể kiểm tra lại cách sắp xếp, tần suất dùng và theo dõi phản ứng của da.",
      severity: "caution",
    });
  }

  return cautionItems;
}

function getMorningSunscreenStatus({
  hasMorningRoutine,
  hasMorningSunscreen,
}: {
  hasMorningRoutine: boolean;
  hasMorningSunscreen: boolean;
}): RoutineCoverageItemStatus {
  if (!hasMorningRoutine) {
    return "note";
  }

  return hasMorningSunscreen ? "complete" : "missing";
}

function getMorningSunscreenDescription({
  hasMorningRoutine,
  hasMorningSunscreen,
}: {
  hasMorningRoutine: boolean;
  hasMorningSunscreen: boolean;
}) {
  if (!hasMorningRoutine) {
    return "Chưa kiểm tra bước chống nắng vì bạn chưa có routine buổi sáng.";
  }

  if (hasMorningSunscreen) {
    return "Đã thấy bước chống nắng trong routine buổi sáng.";
  }

  return "Routine buổi sáng hiện chưa có bước chống nắng. Đây là tín hiệu để bạn xem lại nếu routine này dùng ban ngày.";
}

function getMoisturizerStatus({
  hasMoisturizer,
  hasRoutines,
}: {
  hasMoisturizer: boolean;
  hasRoutines: boolean;
}): RoutineCoverageItemStatus {
  if (!hasRoutines) {
    return "note";
  }

  return hasMoisturizer ? "complete" : "missing";
}

function getMoisturizerDescription({
  hasMoisturizer,
  hasRoutines,
}: {
  hasMoisturizer: boolean;
  hasRoutines: boolean;
}) {
  if (!hasRoutines) {
    return "Chưa kiểm tra bước dưỡng ẩm vì bạn chưa có routine nào.";
  }

  if (hasMoisturizer) {
    return "Đã thấy bước dưỡng ẩm trong dữ liệu routine hiện tại.";
  }

  return "Chưa thấy bước dưỡng ẩm trong routine hiện tại. Bạn có thể kiểm tra lại ở mức thói quen, không phải yêu cầu bắt buộc.";
}

function getCoverageSummary({
  cautionItems,
  hasRoutines,
}: {
  cautionItems: RoutineCoverageCautionItem[];
  hasRoutines: boolean;
}) {
  if (!hasRoutines) {
    return "Bạn có thể bắt đầu bằng một routine đơn giản với các bước cơ bản, sau đó điều chỉnh dần theo thói quen sử dụng.";
  }

  if (cautionItems.length === 0) {
    return "Chưa thấy thiếu hụt cấu trúc lớn từ dữ liệu routine hiện có. Bạn có thể tiếp tục theo dõi cảm nhận của da và cập nhật routine khi cần.";
  }

  return "Có một vài điểm nên kiểm tra lại ở mức thói quen. Các ghi chú này chỉ giúp bạn xem cấu trúc routine rõ hơn, không phải kết luận chuyên môn.";
}

function getNextAction({
  hasMorningRoutine,
  hasMorningSunscreen,
  hasMoisturizer,
  hasRoutines,
  routinesWithMultipleTreatments,
}: {
  hasMorningRoutine: boolean;
  hasMorningSunscreen: boolean;
  hasMoisturizer: boolean;
  hasRoutines: boolean;
  routinesWithMultipleTreatments: RoutineCoverageReview["routinesWithMultipleTreatments"];
}): RoutineCoverageNextAction {
  if (!hasRoutines) {
    return {
      label: "Tạo routine đầu tiên",
      description:
        "Bạn có thể bắt đầu bằng một routine đơn giản với các bước cơ bản, sau đó điều chỉnh dần theo thói quen sử dụng.",
      actionType: "create-routine",
    };
  }

  if (!hasMorningRoutine || !hasMorningSunscreen) {
    return {
      label: "Kiểm tra routine buổi sáng",
      description:
        "Xem lại routine buổi sáng nếu bạn dùng routine này ban ngày, đặc biệt là các bước cơ bản và cách thêm sản phẩm mới từ từ.",
      actionType: "review-morning-routine",
    };
  }

  if (!hasMoisturizer) {
    return {
      label: "Xem lại bước dưỡng ẩm",
      description:
        "Kiểm tra xem routine hiện tại có cần một bước hỗ trợ cảm giác dễ chịu và duy trì thói quen ổn định hơn không.",
      actionType: "review-moisturizer",
    };
  }

  if (routinesWithMultipleTreatments.length > 0) {
    return {
      label: "Xem lại cách sắp xếp treatment",
      description:
        "Nếu routine có nhiều treatment/active, hãy xem lại tần suất, thứ tự và theo dõi phản ứng của da theo thời gian.",
      actionType: "review-treatment-pacing",
    };
  }

  return {
    label: "Tiếp tục theo dõi routine",
    description:
      "Tiếp tục ghi nhận routine và cập nhật khi thói quen hoặc cảm nhận của da thay đổi.",
    actionType: "keep-monitoring",
  };
}
