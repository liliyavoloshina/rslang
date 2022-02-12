import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'

import { Box, Container, Grid, Typography } from '@mui/material'
import Button from '@mui/material/Button'
import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'
import { cyan, deepPurple, lightBlue, lightGreen, orange, pink } from '@mui/material/colors'

import { useAppDispatch, useAppSelector } from '~/app/hooks'
import { Path } from '~/components/router'
import TextbookCard from '~/components/textbook/TextbookCard'
import TextbookGroupDropdown from '~/components/textbook/TextbookGroupDropdown'
import TextbookPagination from '~/components/textbook/TextbookPagination'
import { selectAuthIsLoggedIn } from '~/features/auth'
import {
	changeGroup,
	changePage,
	fetchDifficultWords,
	fetchTextbookWords,
	getCompletedPages,
	selectTextbookCompletedPages,
	selectTextbookGroup,
	selectTextbookPage,
	selectTextbookStatus,
	selectTextbookWords,
} from '~/features/textbook'
import { localStorageGetPagination } from '~/utils/localStorage'

function Textbook() {
	const { t } = useTranslation()
	const dispatch = useAppDispatch()

	const words = useAppSelector(selectTextbookWords)
	const group = useAppSelector(selectTextbookGroup)
	const page = useAppSelector(selectTextbookPage)
	const isLoggedIn = useAppSelector(selectAuthIsLoggedIn)
	const status = useAppSelector(selectTextbookStatus)
	const completedPages = useAppSelector(selectTextbookCompletedPages)

	const groupColors = [pink[500], orange[500], lightGreen[500], lightBlue[500], cyan[500], deepPurple[500]]
	const activeColor = groupColors[group]

	const isPageCompleted = group in completedPages && completedPages[group][page]

	useEffect(() => {
		const storedPagination = localStorageGetPagination()
		const storedGroup = storedPagination.group
		const storedPage = storedPagination.page
		dispatch(changeGroup(storedGroup))
		dispatch(changePage(storedPage))

		if (storedGroup === 6) {
			dispatch(fetchDifficultWords())
		} else {
			dispatch(fetchTextbookWords())
		}

		dispatch(getCompletedPages())
	}, [dispatch])

	return (
		<Container maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
			<Typography variant="h4" sx={{ mt: 3, mb: 3 }}>
				{t('TEXTBOOK.TITLE')}
			</Typography>

			<Stack spacing={2} direction="row" justifyContent="space-between" sx={{ marginBottom: '50px' }}>
				<TextbookGroupDropdown />

				{isPageCompleted && (
					<Box>
						<Typography variant="h6" sx={{ color: lightGreen[500] }}>
							{t('TEXTBOOK.FULLY_LEARNED_SECTION')}
						</Typography>
					</Box>
				)}

				<Stack spacing={2} direction="row" justifyContent="space-between">
					<Button component={RouterLink} to={`${Path.SPRINT}/${group}/${page}`} disabled={isPageCompleted}>
						{t('TEXTBOOK.OPEN_SPRTING_GAME')}
					</Button>
					<Button component={RouterLink} to={`${Path.AUDIOCALL}/${group}/${page}`} state={{ fromTextbook: true }} disabled={isPageCompleted}>
						{t('TEXTBOOK.OPEN_AUDIO_CALL_GAME')}
					</Button>
				</Stack>
			</Stack>

			<Grid container spacing={2} sx={{ flex: '1 0 auto', marginBottom: '50px' }}>
				{status === 'loading'
					? [...Array(20)].map((_, idx) => (
							<Grid key={idx} item xs={12}>
								<Skeleton variant="rectangular" height={300} />
							</Grid>
					  ))
					: words.map(word => (
							<Grid key={word.id} item xs={12}>
								<TextbookCard activeColor={activeColor} passedWord={word} isLoggedIn={isLoggedIn} />
							</Grid>
					  ))}
			</Grid>

			{group !== 6 && (
				<Box sx={{ flex: '0 0 auto' }}>
					<TextbookPagination />
				</Box>
			)}
		</Container>
	)
}

export default Textbook
