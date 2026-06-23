export type AdminContentSummaryDto = {
  products: {
    total: number;
    unverified: number;
    reviewed: number;
    verified: number;
    manageHref: string;
  };
  ingredients: {
    total: number;
    manageHref: string;
  };
  boundaryNote: string;
};
