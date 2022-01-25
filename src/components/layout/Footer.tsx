import React from 'react'
import { Container, Box } from '@mui/material'

export default function Footer() {
	return (
		<footer style={{ marginTop: '50px' }}>
			<Box px={{ xs: 3, sm: 3 }} py={{ xs: 3, sm: 3 }} bgcolor={theme => theme.palette.primary.main} color="white">
				<Container maxWidth="lg">
					<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
						<div>aaaa</div>
						<div>aaaa</div>
						<div>aaaa</div>
					</Box>
					<Box textAlign="center" pt={{ xs: 5, sm: 5 }} pb={{ xs: 5, sm: 0 }}>
						RS Lang &reg; 2022
					</Box>
				</Container>
			</Box>
		</footer>
	)
}
