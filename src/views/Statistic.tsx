import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { Box, Container, Stack, Typography } from '@mui/material'

import { useAppDispatch, useAppSelector } from '~/app/hooks'
import LongChartStat from '~/components/statistics/LongChartStat'
import ShortGameCard from '~/components/statistics/ShortGameCard'
import ShortWordCard from '~/components/statistics/ShortWordCard'
import {
	fetchUserStatistics,
	selectStatisticCorrectWordsPercentAudiocall,
	selectStatisticCorrectWordsPercentSprint,
	selectStatisticLongStat,
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
	const totalCorrectPercentShort = useAppSelector(selectStatisticTotalCorrectPercentShort)
	const correctWordsPercentAudiocall = useAppSelector(selectStatisticCorrectWordsPercentAudiocall)
	const correctWordsPercentSprint = useAppSelector(selectStatisticCorrectWordsPercentSprint)
	const longStat = useAppSelector(selectStatisticLongStat)

	const { date, learnedWords } = statistics.shortStat
	const { audiocall, sprint } = statistics.shortStat.games
	const { newWords: newWordsAudiocall, longestSeries: longestSeriesAudiocall } = audiocall
	const { newWords: newWordsSprint, longestSeries: longestSeriesSprint } = sprint

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
			<Stack gap="20px">
				<Box>
					<Typography variant="h4" sx={{ mt: 3, mb: 3 }} align="center">
						{t('STATISTIC.TITLE')} for today ({curDate.toLocaleDateString()})
					</Typography>
					<Stack flexDirection="row" alignItems="center" justifyContent="center" gap="20px">
						<ShortWordCard value={`${totalNewWordsShort}`} text="Number of new words" />
						<ShortWordCard value={`${learnedWords}`} text="Number of learned words" />
						<ShortWordCard value={`${totalCorrectPercentShort}%`} text="Percentage of correct answers" />
					</Stack>
				</Box>

				<Stack flexDirection="row" alignItems="center" justifyContent="center" gap="20px">
					<ShortGameCard gameName="audiocall" newWords={newWordsAudiocall} correctPercent={correctWordsPercentAudiocall} longestSeries={longestSeriesAudiocall} />
					<ShortGameCard gameName="sprint" newWords={newWordsSprint} correctPercent={correctWordsPercentSprint} longestSeries={longestSeriesSprint} />
				</Stack>
			</Stack>

			<Box>
				<Typography variant="h4" sx={{ mt: 5, mb: 5 }} align="center">
					Statistics for all time
				</Typography>
				<LongChartStat longStat={longStat} />
			</Box>
		</Container>
	)
}

export default Statistic
