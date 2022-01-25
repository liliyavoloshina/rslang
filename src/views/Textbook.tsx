import React from 'react'
import { Container, Typography, Box } from '@mui/material'
import SectionDropdown from '../components/textbook/SectionDropdown'

function Textbook() {
	return (
		<Container maxWidth="lg">
			<Typography variant="h4" sx={{ mt: 3, mb: 3 }}>
				Textbook
			</Typography>

			<Box sx={{ display: 'flex' }}>
				<SectionDropdown />
			</Box>
		</Container>
	)
}

export default Textbook
