import { RootState } from '~/app/store'

export const selectStatisticCompletedPages = (state: RootState) => state.statistic.statistics.optional.completedPages
export const selectStatisticOptional = (state: RootState) => state.statistic.statistics.optional
export const selectStatisticTotalNewWordsShort = (state: RootState) => state.statistic.statisticsCalculated.totalNewWordsShort
export const selectStatisticTotalCorrectPercentShort = (state: RootState) => state.statistic.statisticsCalculated.totalCorrectPercentShort
export const selectStatisticCorrectWordsPercentAudiocall = (state: RootState) => state.statistic.statisticsCalculated.correctWordsPercentAudiocall
export const selectStatisticCorrectWordsPercentSprint = (state: RootState) => state.statistic.statisticsCalculated.correctWordsPercentSprint
export const selectStatisticLongStat = (state: RootState) => state.statistic.statistics.optional.longStat
