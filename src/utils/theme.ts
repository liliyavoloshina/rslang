import { createTheme } from '@mui/material/styles'
import { grey, indigo, green, red } from '@mui/material/colors'

const theme = createTheme({
	text: {
		secondary: grey[500],
		success: green[600],
		danger: red[600],
	},
	palette: {
		primary: {
			main: indigo[800],
		},
		secondary: {
			main: '#edf2ff',
		},
	},
})

export default theme
