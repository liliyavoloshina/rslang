import React from 'react'
import { Container, Typography, Box, Grid } from '@mui/material'
import SectionDropdown from '../components/textbook/SectionDropdown'
import TextbookCard from '../components/textbook/TextbookCard'
import TextbookPagination from '../components/textbook/TextbookPagination'

function Textbook() {
	return (
		<Container maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
			<Typography variant="h4" sx={{ mt: 3, mb: 3 }}>
				Textbook
			</Typography>

			<Box sx={{ display: 'flex', marginBottom: '20px' }}>
				<SectionDropdown />
			</Box>

			<Grid container spacing={2} sx={{ flex: '1 0 auto' }}>
				<Grid item xs={12} md={6}>
					<TextbookCard />
				</Grid>
				<Grid item xs={12} md={6}>
					<TextbookCard />
				</Grid>
			</Grid>

			<Box sx={{ flex: '0 0 auto' }}>
				<TextbookPagination />
			</Box>
		</Container>
	)
}

export default Textbook
