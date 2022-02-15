import { green, grey, indigo, lightGreen, red } from '@mui/material/colors'
import { createTheme } from '@mui/material/styles'

const { palette } = createTheme()

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
			main: indigo[300],
		},
		correct: palette.augmentColor({ color: lightGreen, mainShade: 400 }),
		incorrect: palette.augmentColor({ color: red, mainShade: 400 }),
	},
})

export default theme
