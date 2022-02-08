import { useEffect, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { useMatch, useNavigate } from 'react-router-dom'

import NoIcon from '@mui/icons-material/Cancel'
import YesIcon from '@mui/icons-material/CheckCircle'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

import { useAppSelector } from '~/app/hooks'
import Popup from '~/components/layout/Popup'
import { Path } from '~/components/router'
import { answer, reset, selectSprintState, startGame } from '~/features/sprint'
import { PAGES_PER_GROUP } from '~/utils/constants'

const Sprint = () => {
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

	const { word, suggestedTranslation, isFinished, correctWords, incorrectWords } = useAppSelector(selectSprintState)

	// start on mount or when group/page changes
	useEffect(() => {
		dispatch(startGame({ group, page: page ?? Math.floor(Math.random() * PAGES_PER_GROUP) }))
	}, [dispatch, group, page])

	// reset game on unmount
	useEffect(
		() => () => {
			dispatch(reset())
		},
		[dispatch]
	)

	const selectOption = (option: boolean) => dispatch(answer(option))

	return (
		<Container maxWidth="sm" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
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
						<IconButton color="error" size="large" onClick={() => selectOption(false)}>
							<NoIcon /> No
						</IconButton>
						<IconButton color="success" size="large" onClick={() => selectOption(true)}>
							<YesIcon /> Yes
						</IconButton>
					</Box>
				</Box>
			)}
			<Popup isOpen={isFinished} incorrectWords={incorrectWords} correctWords={correctWords} />
		</Container>
	)
}

export default Sprint
