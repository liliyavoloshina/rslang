import { Theme } from '@mui/material'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'

export default function Footer() {
	return (
		<footer className="footer" style={{ marginTop: '50px' }}>
			<Box px={{ xs: 3, sm: 3 }} py={{ xs: 3, sm: 3 }} bgcolor={(theme: Theme) => theme.palette.primary.main} color="white">
				<Container maxWidth="lg">
					<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
						<Typography>Textbook</Typography>
						<Typography>Textbook</Typography>
						<Typography>Textbook</Typography>
					</Box>
					<Box textAlign="center" pt={{ xs: 5, sm: 5 }} pb={{ xs: 5, sm: 0 }}>
						<Typography>RS Lang &reg; 2022</Typography>
					</Box>
				</Container>
			</Box>
		</footer>
	)
}
