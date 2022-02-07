import { green, grey, indigo, red } from '@mui/material/colors'
import { createTheme } from '@mui/material/styles'

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
