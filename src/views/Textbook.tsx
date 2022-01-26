import React from 'react'
import { Container, Typography, Box, Grid } from '@mui/material'
import SectionDropdown from '../components/textbook/SectionDropdown'
import TextbookCard from '../components/textbook/TextbookCard'

function Textbook() {
	return (
		<Container maxWidth="lg">
			<Typography variant="h4" sx={{ mt: 3, mb: 3 }}>
				Textbook
			</Typography>

			<Box sx={{ display: 'flex' }}>
				<SectionDropdown />
			</Box>

			<Grid container spacing={2}>
				<Grid item xs={12} md={6}>
					<TextbookCard />
				</Grid>
				<Grid item xs={12} md={6}>
					<TextbookCard />
				</Grid>
			</Grid>
		</Container>
	)
}

export default Textbook
