import React, { useEffect } from 'react'
import { Container, Typography, Box, Grid } from '@mui/material'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Skeleton from '@mui/material/Skeleton'
import { pink, orange, lightGreen, lightBlue, cyan, deepPurple } from '@mui/material/colors'
import { Link as RouterLink } from 'react-router-dom'
import TextbookGroupDropdown from '../components/textbook/TextbookGroupDropdown'
import TextbookCard from '../components/textbook/TextbookCard'
import TextbookPagination from '../components/textbook/TextbookPagination'
import { fetchTextbookWords, selectTextbookWords, selectTextbookGroup, selectTextbookStatus } from '../features/textbook/textbookSlice'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { selectAuthIsLoggedIn } from '../features/auth/authSlice'

function Textbook() {
	const dispatch = useAppDispatch()
	const words = useAppSelector(selectTextbookWords)
	const group = useAppSelector(selectTextbookGroup)
	const isLoggedIn = useAppSelector(selectAuthIsLoggedIn)
	const status = useAppSelector(selectTextbookStatus)
	const groupColors = [pink[500], orange[500], lightGreen[500], lightBlue[500], cyan[500], deepPurple[500]]
	const activeColor = groupColors[group]

	useEffect(() => {
		dispatch(fetchTextbookWords())
	}, [])

	return (
		<Container maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
			<Typography variant="h4" sx={{ mt: 3, mb: 3 }}>
				Textbook
			</Typography>

			<Stack spacing={2} direction="row" justifyContent="space-between" sx={{ marginBottom: '50px' }}>
				<TextbookGroupDropdown />

				<Stack spacing={2} direction="row" justifyContent="space-between">
					<Button component={RouterLink} to="/sprint" state={{ fromTextbook: true }}>
						Sprint
					</Button>
					<Button component={RouterLink} to="/audiocall" state={{ fromTextbook: true }}>
						Audiocall
					</Button>
				</Stack>
			</Stack>

			<Grid container spacing={2} sx={{ flex: '1 0 auto', marginBottom: '50px' }}>
				{status === 'loading'
					? [...Array(20)].map((word, idx) => {
							return (
								<Grid key={idx} item xs={12}>
									<Skeleton variant="rectangular" height={300} />
								</Grid>
							)
					  })
					: words.map(word => {
							return (
								<Grid key={word.id} item xs={12}>
									<TextbookCard activeColor={activeColor} passedWord={word} isLoggedIn={isLoggedIn} />
								</Grid>
							)
					  })}
			</Grid>

			<Box sx={{ flex: '0 0 auto' }}>
				<TextbookPagination />
			</Box>
		</Container>
	)
}

export default Textbook
