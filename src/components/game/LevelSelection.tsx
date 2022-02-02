import React, { useState } from 'react'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import { SelectChangeEvent } from '@mui/material'
import { GameName } from '../../types/game'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { fetchAudiocallWords, toggleLevelSelection, toggleAudiocallAudio } from '../../features/audiocall/audiocallSlice'
import { selectTextbookGroup, selectTextbookPage } from '../../features/textbook/textbookSlice'

interface LevelSelectionProps {
	gameName: GameName
}

function LevelSelection(props: LevelSelectionProps) {
	const [group, setGroup] = useState(0)

	const { gameName } = props
	const gameDesc = gameName === GameName.Audiocall ? 'Улучши восприятие слов нас слух' : 'Сколько слов ты сможешь угадать за 30 секунд?'
	const dispatch = useAppDispatch()

	const handleChange = (event: SelectChangeEvent) => {
		const newGroup = +event.target.value
		setGroup(newGroup)
	}

	const handlePlay = () => {
		dispatch(fetchAudiocallWords({ group, page: 0 }))
		dispatch(toggleLevelSelection(false))
	}

	return (
		<Container maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
			<Box>
				<Typography variant="h2">{gameName}</Typography>
				<Typography variant="subtitle2" gutterBottom component="div">
					{gameDesc}
				</Typography>
			</Box>
			{/* <Box> */}
			<FormControl>
				<InputLabel>Select level</InputLabel>
				<Select value={`${group}`} label="Select level" onChange={handleChange}>
					<MenuItem value={0}>Group 1</MenuItem>
					<MenuItem value={1}>Group 2</MenuItem>
					<MenuItem value={2}>Group 3</MenuItem>
					<MenuItem value={3}>Group 4</MenuItem>
					<MenuItem value={4}>Group 5</MenuItem>
					<MenuItem value={5}>Group 6</MenuItem>
				</Select>
			</FormControl>
			{/* </Box> */}
			<Button variant="contained" onClick={handlePlay}>
				Play
			</Button>
		</Container>
	)
}

export default LevelSelection
