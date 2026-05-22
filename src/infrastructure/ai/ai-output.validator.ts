import "server-only";

import type { ZodError, ZodIssue } from "zod";

import type {
  AIProviderIngredientExplanationResult,
  AIProviderRoutineAnalysisResult,
  AIProviderSafetyClassifierResult,
} from "@/infrastructure/ai/ai-provider";
import { AIProviderResponseError } from "@/infrastructure/ai/ai-provider.errors";
import {
  aiProviderIngredientExplanationResultSchema,
  aiProviderRoutineAnalysisResultSchema,
  aiProviderSafetyClassifierResultSchema,
} from "@/infrastructure/ai/ai-output.schema";

function formatIssuePath(path: ZodIssue["path"]) {
  if (path.length === 0) {
    return "root";
  }

  return path.map((part) => String(part)).join(".");
}

function formatZodIssues(error: ZodError) {
  const visibleIssues = error.issues.slice(0, 5);
  const issueSummary = visibleIssues
    .map((issue) => `${formatIssuePath(issue.path)}: ${issue.message}`)
    .join("; ");

  if (error.issues.length <= visibleIssues.length) {
    return issueSummary;
  }

  return `${issueSummary}; ${error.issues.length - visibleIssues.length} more issue(s)`;
}

function throwInvalidOutputError(message: string, error: ZodError): never {
  throw new AIProviderResponseError(`${message}: ${formatZodIssues(error)}`);
}

export function validateRoutineAnalysisOutput(
  value: unknown,
): AIProviderRoutineAnalysisResult {
  const result = aiProviderRoutineAnalysisResultSchema.safeParse(value);

  if (!result.success) {
    return throwInvalidOutputError(
      "Invalid routine analysis AI output",
      result.error,
    );
  }

  return result.data;
}

export function validateIngredientExplanationOutput(
  value: unknown,
): AIProviderIngredientExplanationResult {
  const result = aiProviderIngredientExplanationResultSchema.safeParse(value);

  if (!result.success) {
    return throwInvalidOutputError(
      "Invalid ingredient explanation AI output",
      result.error,
    );
  }

  return result.data;
}

export function validateSafetyClassifierOutput(
  value: unknown,
): AIProviderSafetyClassifierResult {
  const result = aiProviderSafetyClassifierResultSchema.safeParse(value);

  if (!result.success) {
    return throwInvalidOutputError(
      "Invalid safety classifier AI output",
      result.error,
    );
  }

  return result.data;
}
