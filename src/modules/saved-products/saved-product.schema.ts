import { z } from "zod";

const mongoObjectIdPattern = /^[a-f\d]{24}$/i;

export const savedProductObjectIdSchema = z
  .string()
  .trim()
  .regex(mongoObjectIdPattern, {
    message: "productId must be a valid MongoDB ObjectId.",
  });

export const saveProductBodySchema = z
  .object({
    productId: savedProductObjectIdSchema,
  })
  .strict();

export const savedProductRouteParamsSchema = z
  .object({
    productId: savedProductObjectIdSchema,
  })
  .strict();

export type SaveProductBodyInput = z.infer<typeof saveProductBodySchema>;
export type SavedProductRouteParamsInput = z.infer<
  typeof savedProductRouteParamsSchema
>;
