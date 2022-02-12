import { useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

/* eslint-disable no-await-in-loop */

/* eslint-disable no-restricted-syntax */
import { useLocation, useMatch, useNavigate } from 'react-router-dom'

import { VolumeUp } from '@mui/icons-material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

import { useAppDispatch, useAppSelector } from '~/app/hooks'
import { GameResultDialog, LevelSelection } from '~/components/game'
import { Path } from '~/components/router'
import {
	checkAnswer,
	fetchAudiocallWords,
	resetGame,
	selectAudiocallAnsweredWord,
	selectAudiocallAnswers,
	selectAudiocallCorrectAnswers,
	selectAudiocallCurrentWord,
	selectAudiocallIncorrectAnswers,
	selectAudiocallIsFinished,
	selectAudiocallIsLevelSelection,
	selectAudiocallLongestSeries,
	selectAudiocallStatus,
	selectAudiocallWords,
	showNextWord,
	toggleAudiocallAudio,
} from '~/features/audiocall'
import { selectAuthIsLoggedIn } from '~/features/auth'
import { sendUpdatedStatistic, updateCompletedPagesAfterGame, updateGameStatistic, updateWordStatistic } from '~/features/statistic'
import { DOMAIN_URL, PAGES_PER_GROUP } from '~/utils/constants'

interface LocationState {
	fromTextbook: boolean
}

function Audiocall() {
	const { t } = useTranslation()

	const location = useLocation()
	const dispatch = useAppDispatch()
	const navigate = useNavigate()

	const status = useAppSelector(selectAudiocallStatus)
	const currentWord = useAppSelector(selectAudiocallCurrentWord)
	const answers = useAppSelector(selectAudiocallAnswers)
	const isFinished = useAppSelector(selectAudiocallIsFinished)
	const isLevelSelection = useAppSelector(selectAudiocallIsLevelSelection)
	const incorrectWords = useAppSelector(selectAudiocallIncorrectAnswers)
	const correctWords = useAppSelector(selectAudiocallCorrectAnswers)
	const answeredWord = useAppSelector(selectAudiocallAnsweredWord)
	const isLoggedIn = useAppSelector(selectAuthIsLoggedIn)
	const audiocallWords = useAppSelector(selectAudiocallWords)
	const bestSeries = useAppSelector(selectAudiocallLongestSeries)

	const groupMatch = useMatch(Path.AUDIOCALL_WITH_GROUP)
	const pageMatch = useMatch(Path.AUDIOCALL_WITH_GROUP_AND_PAGE)

	const group = useMemo(() => parseInt((groupMatch ?? pageMatch)?.params.group ?? '', 10), [groupMatch, pageMatch])
	const page = useMemo(() => (pageMatch?.params.page ? parseInt(pageMatch.params.page, 10) : undefined), [pageMatch])

	const isFromTextbook = !!(location.state as LocationState)?.fromTextbook

	if (Number.isNaN(group)) {
		navigate(Path.AUDIOCALL)
	}

	const handleKeyDown = useCallback(
		(event: KeyboardEvent) => {
			event.preventDefault()
			const { key } = event

			if (key === '') {
				dispatch(toggleAudiocallAudio())
			} else if (['1', '2', '3', '4', '5'].includes(key)) {
				dispatch(checkAnswer({ answer: key, isKeyboard: true }))
			} else if (key === 'Enter') {
				dispatch(showNextWord())
			}
		},
		[dispatch]
	)

	const fetchWords = useCallback(() => {
		return dispatch(fetchAudiocallWords({ group, page: page ?? Math.floor(Math.random() * PAGES_PER_GROUP), isFromTextbook }))
	}, [dispatch, group, isFromTextbook, page])

	useEffect(() => {
		dispatch(resetGame())

		fetchWords()

		window.addEventListener('keydown', handleKeyDown)
		return () => {
			window.removeEventListener('keydown', handleKeyDown)
		}
	}, [dispatch, fetchWords, handleKeyDown])

	const getAudiocallGameStatistic = () => {
		const newWords = audiocallWords.filter(word => !word.userWord?.optional).length
		const correctWordsPercent = (correctWords.length / audiocallWords.length) * 100
		const longestSeries = Math.max(...bestSeries.correctAnswers)

		const newStatistic = {
			newWords,
			correctWordsPercent: [correctWordsPercent],
			longestSeries,
		}

		return newStatistic
	}

	const updateEveryWordStatistic = async () => {
		// update word statistic

		console.log('update every word statistic...')

		if (correctWords.length > 0) {
			for (const word of correctWords) {
				await dispatch(updateWordStatistic({ wordToUpdate: word, newFields: { correctAnswers: 1 } }))
			}
		}

		if (incorrectWords.length > 0) {
			for (const word of incorrectWords) {
				await dispatch(updateWordStatistic({ wordToUpdate: word, newFields: { incorrectAnswers: 1 } }))
			}
		}
	}

	const finish = async () => {
		// update every word statistic and learned words in short stat if necessary
		await updateEveryWordStatistic()

		if (isLoggedIn) {
			// set to completed page field store
			await dispatch(updateCompletedPagesAfterGame({ correctWords, incorrectWords }))

			// caluclate and set new game statistic
			const gameStatistic = getAudiocallGameStatistic()
			dispatch(updateGameStatistic({ gameName: GameName.Audiocall, newStatistic: gameStatistic }))

			// send updated stat to the server
			dispatch(sendUpdatedStatistic())
		}
	}

	useEffect(() => {
		if (isFinished) {
			finish()
		}
	}, [isFinished])

	if (isLevelSelection) {
		return <LevelSelection title={t('AUDIOCALL.TITLE')} description={t('AUDIOCALL.DESCRIPTION')} />
	}

	if (status !== 'success') {
		return <div>{t('COMMON.LOADING')}</div>
	}

	return (
		<Container maxWidth="lg" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
			<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
				<Box
					sx={{
						visibility: answeredWord ? 'visible' : 'hidden',
					}}
				>
					<IconButton aria-label="play audio" size="small" onClick={() => dispatch(toggleAudiocallAudio())}>
						<VolumeUp fontSize="inherit" />
					</IconButton>
					<Typography variant="subtitle1" sx={{ fontWeight: '700' }}>
						{currentWord?.word ?? ''}
					</Typography>
				</Box>

				{!answeredWord ? (
					<Button
						variant="outlined"
						onClick={() => dispatch(toggleAudiocallAudio())}
						sx={{
							width: 150,
							height: 150,
							borderRadius: '100%',
						}}
					>
						<VolumeUp sx={{ fontSize: 80 }} />
					</Button>
				) : (
					<Box
						sx={{
							width: 150,
							height: 150,
							borderRadius: '100%',
						}}
					>
						<img
							style={{
								width: '100%',
								height: '100%',
								borderRadius: '100%',
								objectFit: 'cover',
							}}
							src={`${DOMAIN_URL}/${currentWord!.image}`}
							alt=""
						/>
					</Box>
				)}

				<Grid container spacing={2}>
					{answers.map(answer => (
						<Grid key={answer} item>
							<Button
								disabled={isFinished}
								onClick={() => dispatch(checkAnswer({ answer, isKeyboard: false }))}
								variant="contained"
								sx={{ pointerEvents: answeredWord ? 'none' : 'all' }}
								color={
									answer === currentWord!.wordTranslate && answeredWord
										? 'success'
										: answeredWord === answer
										? answer === currentWord!.wordTranslate
											? 'success'
											: 'error'
										: 'primary'
								}
							>
								{answer}
							</Button>
						</Grid>
					))}
				</Grid>

				<Button onClick={() => dispatch(showNextWord())} tabIndex={0} variant="contained" color="secondary" fullWidth>
					{t(answeredWord ? 'AUDIOCALL.NEXT' : 'AUDIOCALL.SKIP')}
				</Button>
			</Box>

			<GameResultDialog isOpen={isFinished} correctWords={correctWords} incorrectWords={incorrectWords} />
		</Container>
	)
}

export default Audiocall
