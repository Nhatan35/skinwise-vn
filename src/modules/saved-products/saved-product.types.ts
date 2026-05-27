import type { ObjectId, WithId } from "mongodb";

export type SavedProductDocument = {
  userId: string;
  productId: ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export type SavedProduct = WithId<SavedProductDocument>;
