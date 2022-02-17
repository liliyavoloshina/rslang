import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import LoadingButton from '@mui/lab/LoadingButton'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Modal from '@mui/material/Modal'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import { useAppDispatch, useAppSelector } from '~/app/hooks'
import LongStatChart from '~/components/statistics/LongStatChart'
import ShortGameCard from '~/components/statistics/ShortGameCard'
import ShortWordCard from '~/components/statistics/ShortWordCard'
import { selectAuthIsLoggedIn } from '~/features/auth'
import {
	fetchUserStatistics,
	resetStatistic,
	selectStatisticCalculated,
	selectStatisticOptional,
	selectStatisticResetStatus,
	sendUpdatedStatistic,
	updateShortStatistics,
} from '~/features/statistic'
import { isTheSameDay } from '~/utils/helpers'

export default function Statistic() {
	const { t } = useTranslation()
	const dispatch = useAppDispatch()
	const isLoggedIn = useAppSelector(selectAuthIsLoggedIn)

	const { shortStat, longStat } = useAppSelector(selectStatisticOptional)
	const { totalNewWordsShort, totalCorrectPercentShort, correctWordsPercentAudiocall, correctWordsPercentSprint } = useAppSelector(selectStatisticCalculated)
	const resetStatus = useAppSelector(selectStatisticResetStatus)

	const { date, learnedWords } = shortStat
	const { audiocall, sprint } = shortStat.games
	const { newWords: newWordsAudiocall, longestSeries: longestSeriesAudiocall } = audiocall
	const { newWords: newWordsSprint, longestSeries: longestSeriesSprint } = sprint

	const oldDate = new Date(date)
	const curDate = new Date()

	const [open, setOpen] = useState(false)
	const handleOpen = () => setOpen(true)
	const handleClose = () => setOpen(false)

	const getStatisics = async () => {
		if (!isTheSameDay(oldDate, curDate)) {
			dispatch(updateShortStatistics())
			await dispatch(sendUpdatedStatistic())
		}

		await dispatch(fetchUserStatistics())
	}

	const resetStatistics = async () => {
		await dispatch(resetStatistic())
		setOpen(false)
	}

	useEffect(() => {
		getStatisics()
	}, [dispatch])

	if (!isLoggedIn) {
		return (
			<Container maxWidth="lg">
				<Alert severity="warning" sx={{ marginTop: 5 }}>
					{t('AUTH.NOT_ALLOWED')}
				</Alert>
			</Container>
		)
	}

	const modalStyle = {
		position: 'absolute' as const,
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		width: 400,
		bgcolor: 'background.paper',
		borderRadius: '10px',
		boxShadow: 24,
		p: 4,
	}

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

			<Box display="flex" justifyContent="center" marginTop="50px">
				<Button variant="contained" color="error" onClick={handleOpen}>
					{t('COMMON.BUTTON.RESET_STATISTICS')}
				</Button>
			</Box>

			<Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
				<Box sx={modalStyle}>
					<Typography textAlign="center" id="modal-modal-title" variant="h6" component="h2">
						{t('STATISTIC.MODAL_TITLE')}
					</Typography>
					<Typography textAlign="center" id="modal-modal-description" sx={{ mt: 5 }}>
						{t('STATISTIC.MODAL_DESCRIPTION')}
					</Typography>
					<Typography textAlign="right" variant="subtitle2" color="slategray" sx={{ mt: 3 }}>
						* {t('STATISTIC.MODAL_DESCRIPTION_SHORT')}
					</Typography>
					<Stack spacing={2} direction="row" justifyContent="space-between" marginTop="40px">
						<Button variant="contained" color="secondary" onClick={handleClose}>
							{t('STATISTIC.MODAL_CANCEL')}
						</Button>
						<LoadingButton disabled={resetStatus === 'loading'} loading={resetStatus === 'loading'} onClick={resetStatistics} variant="contained">
							{t('STATISTIC.MODAL_AGREE')}
						</LoadingButton>
					</Stack>
				</Box>
			</Modal>
		</Container>
	)
}
