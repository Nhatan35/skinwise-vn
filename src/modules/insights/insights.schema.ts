import { z } from "zod";

const localDatePattern = /^\d{4}-\d{2}-\d{2}$/;
export const INSIGHTS_MAX_RANGE_DAYS = 90;

function isRealLocalDate(value: string) {
  if (!localDatePattern.test(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export function getInclusiveLocalDateDiffInDays(from: string, to: string) {
  const [fromYear, fromMonth, fromDay] = from.split("-").map(Number);
  const [toYear, toMonth, toDay] = to.split("-").map(Number);
  const fromTime = Date.UTC(fromYear, fromMonth - 1, fromDay);
  const toTime = Date.UTC(toYear, toMonth - 1, toDay);
  const millisecondsPerDay = 24 * 60 * 60 * 1000;

  return Math.floor((toTime - fromTime) / millisecondsPerDay) + 1;
}

export const insightsLocalDateSchema = z
  .string()
  .regex(localDatePattern, {
    message: "Date must use YYYY-MM-DD format.",
  })
  .refine(isRealLocalDate, {
    message: "Date must be a real calendar date.",
  });

export const insightsQuerySchema = z
  .object({
    from: insightsLocalDateSchema.optional(),
    to: insightsLocalDateSchema.optional(),
  })
  .strict()
  .superRefine((value, context) => {
    if ((value.from && !value.to) || (!value.from && value.to)) {
      context.addIssue({
        code: "custom",
        message: "from and to must be provided together.",
        path: value.from ? ["to"] : ["from"],
      });
      return;
    }

    if (!value.from || !value.to) {
      return;
    }

    if (value.from > value.to) {
      context.addIssue({
        code: "custom",
        message: "from must be before or equal to to.",
        path: ["from"],
      });
      return;
    }

    if (getInclusiveLocalDateDiffInDays(value.from, value.to) > INSIGHTS_MAX_RANGE_DAYS) {
      context.addIssue({
        code: "custom",
        message: `Insights date range cannot exceed ${INSIGHTS_MAX_RANGE_DAYS} days.`,
        path: ["to"],
      });
    }
  });

export type InsightsQueryInput = z.infer<typeof insightsQuerySchema>;
