import React, { useEffect } from 'react'
import { Container, Typography, Box, Grid } from '@mui/material'
import SectionDropdown from '../components/textbook/SectionDropdown'
import TextbookCard from '../components/textbook/TextbookCard'
import TextbookPagination from '../components/textbook/TextbookPagination'
import { fetchTextbookWords, selectTextbookWords } from '../features/textbook/textbookSlice'
import { useAppDispatch, useAppSelector } from '../app/hooks'

function Textbook() {
	const dispatch = useAppDispatch()
	const words = useAppSelector(selectTextbookWords)

	useEffect(() => {
		dispatch(fetchTextbookWords())
	}, [])

	return (
		<Container maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
			<Typography variant="h4" sx={{ mt: 3, mb: 3 }}>
				Textbook
			</Typography>

			<Box sx={{ display: 'flex', marginBottom: '50px' }}>
				<SectionDropdown />
			</Box>

			<Grid container spacing={2} sx={{ flex: '1 0 auto', marginBottom: '50px' }}>
				{words.map(word => {
					return (
						<Grid key={word.id} item xs={12}>
							<TextbookCard {...word} />
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
