import React, { useEffect, useState } from 'react'
import { Container, Typography, Box, Button, Grid, IconButton } from '@mui/material'
import { VolumeUp } from '@mui/icons-material'
import { Word } from '../types/word'
import apiClient from '../utils/api'
import { MAX_AUDIOCALL_ANSWERS_AMOUNT } from '../utils/constants'
import { shuffleArray } from '../utils/helpers'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import {
	fetchAudiocallWords,
	selectAudiocallWords,
	selectAudiocallAnswers,
	selectAudiocallCurrentIdx,
	selectAudiocallStatus,
	selectAudiocallCurrentWord,
	selectAudiocallIsFinished,
	nextWord,
} from '../features/audiocall/audiocallSlice'
import Popup from '../components/layout/Popup'

const DOMAIN_URL = process.env.REACT_APP_DOMAIN as string

function Audiocall() {
	const dispatch = useAppDispatch()
	const status = useAppSelector(selectAudiocallStatus)
	const words = useAppSelector(selectAudiocallWords)
	const currentIdx = useAppSelector(selectAudiocallCurrentIdx)
	const currentWord = useAppSelector(selectAudiocallCurrentWord)
	const answers = useAppSelector(selectAudiocallAnswers)
	const isFinished = useAppSelector(selectAudiocallIsFinished)

	const isFromMainPage = false

	const [answeredWord, setAnsweredWord] = useState<null | string>(null)
	const [incorrectWords, setIncorrectWords] = useState<Word[]>([])
	const [correctWords, setCorrectWords] = useState<Word[]>([])

	useEffect(() => {
		dispatch(fetchAudiocallWords({ page: 1, group: 2 }))
	}, [])

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

		// toggleAudio()

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
					{answers.map(answer => {
						return (
							<Grid key={answer} item>
								<Button
									onClick={() => checkAnswer(answer)}
									variant="contained"
									color={answer === correctAnswer && answeredWord ? 'success' : answeredWord === answer ? (answer === correctAnswer ? 'success' : 'error') : 'primary'}
								>
									{answer}
								</Button>
							</Grid>
						)
					})}
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
