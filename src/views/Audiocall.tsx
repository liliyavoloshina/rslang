import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useMatch, useNavigate } from 'react-router-dom'

import CloseIcon from '@mui/icons-material/Close'
import MusicNoteIcon from '@mui/icons-material/MusicNote'
import MusicOffIcon from '@mui/icons-material/MusicOff'
import VolumeUp from '@mui/icons-material/VolumeUp'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
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
	selectAudiocallIsWithSounds,
	selectAudiocallStatus,
	showNextWord,
	toggleAudiocallAudio,
	toggleSounds,
} from '~/features/audiocall'
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
	const isWithSounds = useAppSelector(selectAudiocallIsWithSounds)

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

	const exitGame = () => {
		console.log('exit game')
	}

	useEffect(() => {
		dispatch(resetGame())

		fetchWords()

		window.addEventListener('keydown', handleKeyDown)
		return () => {
			window.removeEventListener('keydown', handleKeyDown)
		}
	}, [dispatch, fetchWords, handleKeyDown])

	if (isLevelSelection) {
		return <LevelSelection title={t('AUDIOCALL.TITLE')} description={t('AUDIOCALL.DESCRIPTION')} />
	}

	if (status !== 'success') {
		return <div>{t('COMMON.LOADING')}</div>
	}

	return (
		<Container maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', height: '100%' }}>
			<Box justifyContent="space-between" sx={{ alignSelf: 'flex-start', display: 'flex', width: '100%', marginTop: '20px' }}>
				<IconButton aria-label="exit game" onClick={() => dispatch(toggleSounds())}>
					{isWithSounds ? <MusicNoteIcon /> : <MusicOffIcon />}
				</IconButton>
				<IconButton aria-label="exit game" onClick={() => exitGame()}>
					<CloseIcon />
				</IconButton>
			</Box>

			<Stack alignItems="center" justifyContent="center" gap="20px" marginBottom="50px">
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
			</Stack>

			<GameResultDialog isOpen={isFinished} correctWords={correctWords} incorrectWords={incorrectWords} />
		</Container>
	)
}

export default Audiocall
