import { Theme, ThemeOptions } from '@mui/material/styles'

declare module '@mui/material/styles' {
	interface CustomTheme extends Theme {
		palette: {
			primary: {
				main: string
			}
			secondary: {
				main: string
			}
		}
	}
	// allow configuration using `createTheme`
	interface CustomThemeOptions extends ThemeOptions {
		palette: {
			primary: {
				main: string
			}
			secondary: {
				main: string
			}
		}
	}
	export default function createTheme(options?: CustomThemeOptions): CustomTheme
}
