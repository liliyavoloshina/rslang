import React, { useEffect, useMemo } from 'react'
import { useMatch, useNavigate } from 'react-router-dom'

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
	selectAudiocallStatus,
	showNextWord,
	toggleAudiocallAudio,
} from '~/features/audiocall'
import { GameName } from '~/types/game'
import { DOMAIN_URL } from '~/utils/constants'

function Audiocall() {
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

	const groupMatch = useMatch(Path.AUDIOCALL_WITH_GROUP)
	const pageMatch = useMatch(Path.AUDIOCALL_WITH_GROUP_AND_PAGE)

	const group = useMemo(() => parseInt((groupMatch ?? pageMatch)?.params.group ?? '', 10), [groupMatch, pageMatch])
	const page = useMemo(() => (pageMatch?.params.page ? parseInt(pageMatch.params.page, 10) : undefined), [pageMatch])

	if (Number.isNaN(group)) {
		navigate(Path.AUDIOCALL)
	}

	const handleKeyDown = (event: KeyboardEvent) => {
		event.preventDefault()
		const { key } = event

		if (key === '') {
			dispatch(toggleAudiocallAudio())
		} else if (['1', '2', '3', '4', '5'].includes(key)) {
			dispatch(checkAnswer({ answer: key, isKeyboard: true }))
		} else if (key === 'Enter') {
			dispatch(showNextWord())
		}
	}

	const fetchWords = async () => {
		await dispatch(fetchAudiocallWords({ group, page }))
	}

	useEffect(() => {
		dispatch(resetGame())

		fetchWords()

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
						{currentWord!.word}
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
					{answeredWord ? 'Next' : 'Skip'}
				</Button>
			</Box>

			<Popup isOpen={isFinished} correctWords={correctWords} incorrectWords={incorrectWords} />
		</Container>
	)
}

export default Audiocall
