export type AccountAppDataDeletedCountsDto = {
  skinProfiles: number;
  savedProducts: number;
  routines: number;
  routineLogs: number;
  routineAnalyses: number;
  skinJournals: number;
};

export type DeleteAccountAppDataDto = {
  deleted: true;
  deletedAt: string;
  deletedCounts: AccountAppDataDeletedCountsDto;
  appUserProfile: {
    preserved: boolean;
    onboardingCompletedReset: boolean;
  };
};
