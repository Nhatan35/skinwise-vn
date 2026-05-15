import { z, ZodError } from "zod";

export const analyzeRoutineRequestSchema = z.object({}).strict();

export type AnalyzeRoutineRequestInput = z.infer<
  typeof analyzeRoutineRequestSchema
>;

export function parseAnalyzeRoutineRequestText(
  requestText: string,
): AnalyzeRoutineRequestInput {
  if (!requestText.trim()) {
    return {};
  }

  try {
    return analyzeRoutineRequestSchema.parse(JSON.parse(requestText));
  } catch (error) {
    if (error instanceof ZodError) {
      throw error;
    }

    throw new ZodError([]);
  }
}
