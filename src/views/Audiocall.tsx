import React, { useEffect, useState } from 'react'
import { Container, Typography, Box, Button, Grid } from '@mui/material'
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
} from '../features/audiocall/audiocallSlice'

const DOMAIN_URL = process.env.REACT_APP_DOMAIN as string

function Audiocall() {
	const dispatch = useAppDispatch()
	const status = useAppSelector(selectAudiocallStatus)
	const words = useAppSelector(selectAudiocallWords)
	const currentIdx = useAppSelector(selectAudiocallCurrentIdx)
	const currentWord = useAppSelector(selectAudiocallCurrentWord)
	const answers = useAppSelector(selectAudiocallAnswers)

	const isFromMainPage = false

	const [isAnswered, setIsAnswered] = useState<boolean>(false)

	useEffect(() => {
		dispatch(fetchAudiocallWords({ page: 1, group: 2 }))
	}, [])

	const nextWord = () => {
		// setActiveIdx(prevIdx => prevIdx + 1)
		// getRandomAnswers()
	}

	if (status === 'loading') {
		return <div>loading...</div>
	}

	return (
		<Container maxWidth="lg" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
			<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
				<Button
					variant="outlined"
					sx={{
						width: 150,
						height: 150,
						borderRadius: '100%',
						display: isAnswered ? 'none' : 'block',
					}}
				>
					<VolumeUp sx={{ fontSize: 80 }} />
				</Button>

				<Box>
					<img src={`${DOMAIN_URL}/${currentWord!.image}`} alt="" />
				</Box>

				<Grid container spacing={2}>
					{answers.map(answer => {
						return (
							<Grid key={answer} item>
								<Button>{answer}</Button>
							</Grid>
						)
					})}
				</Grid>

				<Button onClick={() => nextWord()} variant="contained" fullWidth>
					Skip
				</Button>
			</Box>
		</Container>
	)
}

export default Audiocall
