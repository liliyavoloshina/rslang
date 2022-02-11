import { RootState } from '~/app/store'

export const selectStatisticCompletedPages = (state: RootState) => state.statistic.optional.completedPages
