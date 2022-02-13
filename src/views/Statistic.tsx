import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { Box, Container, Stack, Typography } from '@mui/material'

import { useAppDispatch, useAppSelector } from '~/app/hooks'
import { TodayWordCard } from '~/components/statistics/TodayWordCard'
import {
	fetchUserStatistics,
	selectStatisticLongestSeriesShort,
	selectStatisticOptional,
	selectStatisticTotalCorrectPercentShort,
	selectStatisticTotalNewWordsShort,
	sendUpdatedStatistic,
	updateShortStatistics,
} from '~/features/statistic'
import { isTheSameDay } from '~/utils/helpers'

function Statistic() {
	const { t } = useTranslation()
	const dispatch = useAppDispatch()
	const statistics = useAppSelector(selectStatisticOptional)
	const totalNewWordsShort = useAppSelector(selectStatisticTotalNewWordsShort)
	const totalLongestSeriesShort = useAppSelector(selectStatisticLongestSeriesShort)
	const totalCorrectPercentShort = useAppSelector(selectStatisticTotalCorrectPercentShort)

	const { date } = statistics.shortStat

	const oldDate = new Date(date)
	const curDate = new Date()

	const getStatisics = async () => {
		if (!isTheSameDay(oldDate, curDate)) {
			dispatch(updateShortStatistics())
			dispatch(sendUpdatedStatistic())
		}

		await dispatch(fetchUserStatistics())
	}

	useEffect(() => {
		getStatisics()
	}, [dispatch])

	return (
		<Container maxWidth="lg">
			<Box>
				<Typography variant="h4" sx={{ mt: 3, mb: 3 }} align="center">
					{t('STATISTIC.TITLE')} for today ({curDate.toLocaleDateString()})
				</Typography>
				<Stack flexDirection="row" alignItems="center" justifyContent="center">
					<TodayWordCard value={`${totalNewWordsShort}`} text="Number of new words" />
					<TodayWordCard value={`${totalCorrectPercentShort}%`} text="Percentage of correct answers" />
					<TodayWordCard value={`${totalLongestSeriesShort}`} text="Longest series of correct answers" />
				</Stack>
			</Box>
			<Box>
				<Typography variant="h4" sx={{ mt: 3, mb: 3 }} align="center">
					Statistics for all time
				</Typography>
			</Box>
		</Container>
	)
}

export default Statistic
