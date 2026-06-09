export type AccountAppDataSummaryCountsDto = {
  skinProfiles: number;
  savedProducts: number;
  routines: number;
  routineLogs: number;
  routineAnalyses: number;
  skinJournals: number;
};

export type AccountAppDataSummaryDto = {
  generatedAt: string;
  counts: AccountAppDataSummaryCountsDto;
  sharedCatalogueData: {
    productsPreserved: true;
    ingredientsPreserved: true;
  };
};
