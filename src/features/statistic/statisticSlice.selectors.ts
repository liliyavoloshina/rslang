import { RootState } from '~/app/store'

export const selectStatisticCompletedPages = (state: RootState) => state.statistic.statistics.optional.completedPages
export const selectStatisticOptional = (state: RootState) => state.statistic.statistics.optional
export const selectStatisticTotalNewWordsShort = (state: RootState) => state.statistic.statisticsCalculated.totalNewWordsShort
export const selectStatisticLongestSeriesShort = (state: RootState) => state.statistic.statisticsCalculated.longestSeriesShort
export const selectStatisticTotalCorrectPercentShort = (state: RootState) => state.statistic.statisticsCalculated.totalCorrectPercentShort
