import { RootState } from '~/app/store'

export const selectStatisticOptional = (state: RootState) => state.statistic.statistics.optional
export const selectStatisticCalculated = (state: RootState) => state.statistic.statisticsCalculated
