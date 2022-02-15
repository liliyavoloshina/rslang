import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { Box, Container, Stack, Typography } from '@mui/material'

import { useAppDispatch, useAppSelector } from '~/app/hooks'
import LongStatChart from '~/components/statistics/LongStatChart'
import ShortGameCard from '~/components/statistics/ShortGameCard'
import ShortWordCard from '~/components/statistics/ShortWordCard'
import { fetchUserStatistics, selectStatisticCalculated, selectStatisticOptional, sendUpdatedStatistic, updateShortStatistics } from '~/features/statistic'
import { isTheSameDay } from '~/utils/helpers'

function Statistic() {
	const { t } = useTranslation()
	const dispatch = useAppDispatch()
	const { shortStat, longStat } = useAppSelector(selectStatisticOptional)
	const { totalNewWordsShort, totalCorrectPercentShort, correctWordsPercentAudiocall, correctWordsPercentSprint } = useAppSelector(selectStatisticCalculated)

	const { date, learnedWords } = shortStat
	const { audiocall, sprint } = shortStat.games
	const { newWords: newWordsAudiocall, longestSeries: longestSeriesAudiocall } = audiocall
	const { newWords: newWordsSprint, longestSeries: longestSeriesSprint } = sprint

	const oldDate = new Date(date)
	const curDate = new Date()

	const getStatisics = async () => {
		if (!isTheSameDay(oldDate, curDate)) {
			dispatch(updateShortStatistics())
			await dispatch(sendUpdatedStatistic())
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
						{t('STATISTIC.SHORT_TITLE')} ({curDate.toLocaleDateString()})
					</Typography>
					<Stack flexDirection="row" alignItems="center" justifyContent="center" gap="20px">
						<ShortWordCard value={`${totalNewWordsShort}`} text={t('STATISTIC.TOTAL_NEW_WORDS')} />
						<ShortWordCard value={`${learnedWords}`} text={t('STATISTIC.TOTAL_LEARNED_WORDS')} />
						<ShortWordCard value={`${totalCorrectPercentShort}%`} text={t('STATISTIC.TOTAL_CORRECT_WORDS_PERCENT')} />
					</Stack>
				</Box>

				<Stack flexDirection="row" alignItems="center" justifyContent="center" gap="20px">
					<ShortGameCard gameName="audiocall" newWords={newWordsAudiocall} correctPercent={correctWordsPercentAudiocall} longestSeries={longestSeriesAudiocall} />
					<ShortGameCard gameName="sprint" newWords={newWordsSprint} correctPercent={correctWordsPercentSprint} longestSeries={longestSeriesSprint} />
				</Stack>
			</Stack>

			<Box>
				<Typography variant="h4" sx={{ mt: 5, mb: 5 }} align="center">
					{t('STATISTIC.LONG_TITLE')}
				</Typography>
				<LongStatChart longStat={longStat} />
			</Box>
		</Container>
	)
}

export default Statistic
