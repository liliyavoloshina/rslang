import React, { useCallback, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

import { VolumeUp } from '@mui/icons-material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

import { useAppDispatch, useAppSelector } from '~/app/hooks'
import LevelSelection from '~/components/game/LevelSelection'
import Popup from '~/components/layout/Popup'
import {
	fetchAudiocallWords,
	nextWord,
	resetGame,
	selectAudiocallAnswers,
	selectAudiocallCurrentWord,
	selectAudiocallIsFinished,
	selectAudiocallIsLevelSelection,
	selectAudiocallStatus,
	toggleLevelSelection,
} from '~/features/audiocall'
import { selectTextbookGroup, selectTextbookPage } from '~/features/textbook'
import { GameName } from '~/types/game'
import { Word } from '~/types/word'
import { DOMAIN_URL } from '~/utils/constants'

interface LocationState {
	fromTextbook: boolean
}

function Audiocall() {
	const location = useLocation()
	const dispatch = useAppDispatch()
	const status = useAppSelector(selectAudiocallStatus)
	const currentPage = useAppSelector(selectTextbookPage)
	const currentGroup = useAppSelector(selectTextbookGroup)
	const currentWord = useAppSelector(selectAudiocallCurrentWord)
	const answers = useAppSelector(selectAudiocallAnswers)
	const isFinished = useAppSelector(selectAudiocallIsFinished)
	const isLevelSelection = useAppSelector(selectAudiocallIsLevelSelection)

	const [answeredWord, setAnsweredWord] = useState<null | string>(null)
	const [incorrectWords, setIncorrectWords] = useState<Word[]>([])
	const [correctWords, setCorrectWords] = useState<Word[]>([])

	const isFromTextbook = !!(location.state as LocationState)?.fromTextbook

	const toggleAudio = () => {
		const audio = new Audio(`${DOMAIN_URL}/${currentWord!.audio}`)
		audio.play()
	}

	const handleKeyDown = (event: KeyboardEvent) => {
		const { key } = event

		if (key === ' ') {
			toggleAudio()
		}

		// const
		// const answerPressed = answers[key - 1]
		// console.log('answerPressed', answerPressed)
		console.log('answerPressed', key)
	}

	useEffect(() => {
		dispatch(resetGame())

		if (isFromTextbook) {
			dispatch(fetchAudiocallWords({ group: currentGroup, page: currentPage }))
		} else {
			dispatch(toggleLevelSelection(true))
		}

		window.addEventListener('keydown', handleKeyDown)

		return () => {
			window.removeEventListener('keydown', handleKeyDown)
		}
	}, [])

	if (isLevelSelection) {
		return <LevelSelection gameName={GameName.Audiocall} />
	}

	if (status !== 'success') {
		return <div>loading...</div>
	}

	// const correctAnswer = currentWord!.wordTranslate

	const checkAnswer = (answer: string) => {
		setAnsweredWord(answer)

		if (answer !== currentWord!.wordTranslate) {
			setIncorrectWords([...incorrectWords, currentWord!])
		} else {
			setCorrectWords([...correctWords, currentWord!])
		}
	}

	const showNextWord = () => {
		dispatch(nextWord())

		if (!answeredWord) {
			checkAnswer('skipped')
		}

		setAnsweredWord(null)
	}

	return (
		<Container maxWidth="lg" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
			<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
				<Box
					sx={{
						visibility: answeredWord ? 'visible' : 'hidden',
					}}
				>
					<IconButton aria-label="play audio" size="small" onClick={() => toggleAudio()}>
						<VolumeUp fontSize="inherit" />
					</IconButton>
					<Typography variant="subtitle1" sx={{ fontWeight: '700' }}>
						{currentWord!.word}
					</Typography>
				</Box>

				{!answeredWord ? (
					<Button
						variant="outlined"
						onClick={() => toggleAudio()}
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
								onClick={() => checkAnswer(answer)}
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

				<Button onClick={() => showNextWord()} variant="contained" color="secondary" fullWidth>
					{answeredWord ? 'Next' : 'Skip'}
				</Button>
			</Box>

			<Popup isOpen={isFinished} correctWords={correctWords} incorrectWords={incorrectWords} />
		</Container>
	)
}

export default Audiocall
