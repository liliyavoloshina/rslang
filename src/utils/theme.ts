import { createTheme } from '@mui/material/styles'
import { grey, indigo } from '@mui/material/colors'

const theme = createTheme({
	text: {
		secondary: grey[500],
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
