import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import NoIcon from '@mui/icons-material/Cancel'
import YesIcon from '@mui/icons-material/CheckCircle'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

import { useAppSelector } from '~/app/hooks'
import { answer, selectSprintQuestion, startGame } from '~/features/sprint/sprintSlice'

import Popup from '../layout/Popup'

type SprintProps = {
	page?: number
	group: number
}

function Sprint({ group, page }: SprintProps) {
	const { word, suggestedTranslation, isFinished, correctWords, incorrectWords } = useAppSelector(selectSprintQuestion)

	const dispatch = useDispatch()

	useEffect(() => {
		dispatch(startGame({ group, page }))
	}, [startGame, group, page])

	const selectOption = (option: boolean) => dispatch(answer(option))

	return (
		<>
			{!isFinished && word && (
				<Box sx={{ width: '100%' }}>
					<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
						<Typography variant="h3" textTransform="capitalize">
							{word}
						</Typography>
						<Typography variant="h4" textTransform="capitalize">
							{suggestedTranslation}
						</Typography>
					</Box>
					<Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 2 }}>
						<IconButton color="success" size="large" onClick={() => selectOption(true)}>
							<YesIcon /> Yes
						</IconButton>
						<IconButton color="error" size="large" onClick={() => selectOption(false)}>
							<NoIcon /> No
						</IconButton>
					</Box>
				</Box>
			)}
			<Popup isOpen={isFinished} incorrectWords={incorrectWords} correctWords={correctWords} />
		</>
	)
}

Sprint.defaultProps = {
	page: undefined,
}

export default Sprint
