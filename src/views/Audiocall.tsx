import React, { useEffect, useState } from 'react'
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

const DOMAIN_URL = process.env.REACT_APP_DOMAIN as string

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

	useEffect(() => {
		if (isFromTextbook) {
			dispatch(fetchAudiocallWords({ group: currentGroup, page: currentPage }))
		} else {
			dispatch(toggleLevelSelection(true))
		}
	}, [])

	if (isLevelSelection) {
		return <LevelSelection gameName={GameName.Audiocall} />
	}

	if (status !== 'success') {
		return <div>loading...</div>
	}

	const correctAnswer = currentWord!.wordTranslate

	const audio = new Audio(`${DOMAIN_URL}/${currentWord!.audio}`)

	const toggleAudio = () => {
		audio.play()
	}

	const checkAnswer = (answer: string) => {
		setAnsweredWord(answer)

		if (answer !== correctAnswer) {
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
				<Button
					variant="outlined"
					onClick={() => toggleAudio()}
					sx={{
						width: 150,
						height: 150,
						borderRadius: '100%',
						display: answeredWord ? 'none' : 'block',
					}}
				>
					<VolumeUp sx={{ fontSize: 80 }} />
				</Button>

				<Box
					sx={{
						width: 150,
						height: 150,
						borderRadius: '100%',
						display: answeredWord ? 'block' : 'none',
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
				<Box
					sx={{
						display: answeredWord ? 'flex' : 'none',
					}}
				>
					<IconButton aria-label="play audio" size="small" onClick={() => toggleAudio()}>
						<VolumeUp fontSize="inherit" />
					</IconButton>
					<Typography variant="subtitle1" sx={{ fontWeight: '700' }}>
						{currentWord!.word}
					</Typography>
				</Box>

				<Grid container spacing={2}>
					{answers.map(answer => (
						<Grid key={answer} item>
							<Button
								onClick={() => checkAnswer(answer)}
								variant="contained"
								color={answer === correctAnswer && answeredWord ? 'success' : answeredWord === answer ? (answer === correctAnswer ? 'success' : 'error') : 'primary'}
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
