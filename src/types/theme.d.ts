import { Theme as MUITheme, ThemeOptions as MUIThemeOptions } from '@mui/material/styles'

declare module '@mui/material/styles' {
	interface Theme extends MUITheme {
		text: {
			secondary: string
		}
	}
	// allow configuration using `createTheme`
	interface ThemeOptions extends MUIThemeOptions {
		text?: {
			secondary?: string
		}
	}
	// eslint-disable-next-line import/prefer-default-export
	export function createTheme(options?: ThemeOptions): Theme
}
