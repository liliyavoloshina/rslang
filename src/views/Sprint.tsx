import { useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { useLocation, useMatch, useNavigate } from 'react-router-dom'

import NoIcon from '@mui/icons-material/Cancel'
import YesIcon from '@mui/icons-material/CheckCircle'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

import { useAppSelector } from '~/app/hooks'
import { GameResultDialog } from '~/components/game'
import { Path } from '~/components/router'
import { Timer, TimerContextProvider, useTimerContext } from '~/components/timer'
import { selectAuthIsLoggedIn } from '~/features/auth'
import { answer, gameTimeout, reset, selectSprintState, startGame } from '~/features/sprint'
import { sendUpdatedStatistic, updateCompletedPagesAfterGame, updateGameStatistic, updateWordStatistic } from '~/features/statistic'
import { Word } from '~/types/word'
import { GAME_TIME, PAGES_PER_GROUP } from '~/utils/constants'

interface LocationState {
	fromTextbook: boolean
}

const useSprintGame = () => {
	const location = useLocation()
	const dispatch = useDispatch()
	const navigate = useNavigate()
	// HACK: react-router-dom@6 does not support optional params anymore
	// so for now using this hack until a proper solution is found
	const groupMatch = useMatch(Path.SPRINT_WITH_GROUP)
	const pageMatch = useMatch(Path.SPRINT_WITH_GROUP_AND_PAGE)

	const group = useMemo(() => parseInt((groupMatch ?? pageMatch)?.params.group ?? '', 10), [groupMatch, pageMatch])
	const page = useMemo(() => (pageMatch?.params.page ? parseInt(pageMatch.params.page, 10) : undefined), [pageMatch])
	if (Number.isNaN(group)) {
		navigate(Path.SPRINT)
	}

	const { words, status, word, suggestedTranslation, correctWords, incorrectWords, correctAnswersInRow, gameRound, bestSeries } = useAppSelector(selectSprintState)
	const isLoggedIn = useAppSelector(selectAuthIsLoggedIn)

	const isFromTextbook = !!(location.state as LocationState)?.fromTextbook

	const { start, stop } = useTimerContext()

	const getSprintGameStatistic = () => {
		const newWords = words.filter((newWord: Word) => !newWord.userWord?.optional).length
		const correctWordsPercent = (correctWords.length / words.length) * 100

		const newStatistic = {
			newWords,
			correctWordsPercent: [correctWordsPercent],
			longestSeries: bestSeries,
		}

		return newStatistic
	}

	const updateEveryWordStatistic = async () => {
		// update word statistic
		const correctPromises = correctWords.map(wordToSend => dispatch(updateWordStatistic({ wordToUpdate: wordToSend, newFields: { correctAnswers: 1 } })))
		const incorrectPromises = incorrectWords.map(wordToSend => dispatch(updateWordStatistic({ wordToUpdate: wordToSend, newFields: { incorrectAnswers: 1 } })))

		await Promise.all([...correctPromises, ...incorrectPromises])
	}

	const finish = async () => {
		if (isLoggedIn) {
			// update every word statistic and learned words in short stat if necessary
			await updateEveryWordStatistic()
			// set to completed page field store
			await dispatch(updateCompletedPagesAfterGame({ correctWords, incorrectWords }))

			// caluclate and set new game statistic
			const gameStatistic = getSprintGameStatistic()
			dispatch(updateGameStatistic({ gameName: 'sprint', newStatistic: gameStatistic }))

			// send updated stat to the server
			await dispatch(sendUpdatedStatistic())
		}
	}

	useEffect(() => {
		if (status === 'game-running') {
			// TODO: extract `30` to config/constants file
			start(GAME_TIME)
		} else if (status === 'game-over') {
			finish()
			stop()
		}
	}, [status, start, stop])

	// start on mount or when group/page changes
	useEffect(() => {
		dispatch(startGame({ group, page: page ?? Math.floor(Math.random() * PAGES_PER_GROUP), isFromTextbook }))
	}, [dispatch, group, page])

	// reset game on unmount
	useEffect(
		() => () => {
			dispatch(reset())
		},
		[dispatch]
	)

	const selectOption = useCallback((option: boolean) => dispatch(answer(option)), [dispatch])

	// eslint-disable-next-line consistent-return
	useEffect(() => {
		if (status === 'game-running') {
			const onKeyDown = (e: KeyboardEvent) => {
				switch (e.key) {
					case 'Left':
					case 'ArrowLeft':
					case 'a':
						selectOption(false)
						break

					case 'Right':
					case 'ArrowRight':
					case 'd':
						selectOption(true)
						break

					default: // no op
				}
			}

			window.addEventListener('keydown', onKeyDown)

			return () => window.removeEventListener('keydown', onKeyDown)
		}
	}, [status, selectOption])

	const onTimeout = useCallback(() => {
		dispatch(gameTimeout())
	}, [dispatch])

	return { status, word, suggestedTranslation, selectOption, correctWords, incorrectWords, correctAnswersInRow, gameRound, onTimeout }
}

const SprintInner = () => {
	const { t } = useTranslation()

	const { status, word, suggestedTranslation, selectOption, correctWords, incorrectWords, correctAnswersInRow, gameRound, onTimeout } = useSprintGame()

	return (
		<Container maxWidth="sm" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }} style={{ position: 'relative' }}>
			{status === 'game-running' && word && (
				<Box sx={{ width: '100%' }}>
					<Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
						<Box sx={{ width: 15, height: 15, borderRadius: '50%', backgroundColor: !(correctAnswersInRow % 4 === 0) ? '#00ff00' : '#cccccc' }} />
						<Box
							sx={{
								width: 15,
								height: 15,
								borderRadius: '50%',
								backgroundColor: (correctAnswersInRow - 2) % 4 === 0 || (correctAnswersInRow - 3) % 4 === 0 ? '#00ff00' : '#cccccc',
							}}
						/>
						<Box sx={{ width: 15, height: 15, borderRadius: '50%', backgroundColor: (correctAnswersInRow - 3) % 4 === 0 ? '#00ff00' : '#cccccc' }} />
					</Box>
					<Box sx={{ width: '50%', height: 100, margin: '0 auto', padding: '10px 0' }}>
						<img
							style={{
								width: '100%',
								height: '100%',
								objectFit: 'cover',
							}}
							src={`/assets/${gameRound}birds_sprint.png`}
							alt=""
						/>
					</Box>
					<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
						<Typography variant="h3" textTransform="capitalize">
							{word}
						</Typography>
						<Typography variant="h4" textTransform="capitalize">
							{suggestedTranslation}
						</Typography>
					</Box>
					<Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 2 }}>
						<IconButton color="error" size="large" onClick={() => selectOption(false)}>
							<NoIcon /> {t('COMMON.BUTTON.NO')}
						</IconButton>
						<IconButton color="success" size="large" onClick={() => selectOption(true)}>
							<YesIcon /> {t('COMMON.BUTTON.YES')}
						</IconButton>
					</Box>
				</Box>
			)}
			<Timer onTimeout={onTimeout} sx={{ position: 'absolute', width: 100, top: 200, right: 0 }} />
			<GameResultDialog isOpen={status === 'game-over'} incorrectWords={incorrectWords} correctWords={correctWords} />
		</Container>
	)
}

const Sprint = () => (
	<TimerContextProvider>
		<SprintInner />
	</TimerContextProvider>
)

export default Sprint
