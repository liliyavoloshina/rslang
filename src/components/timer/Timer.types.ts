import { BoxProps } from '@mui/material'

export type TimerProps = BoxProps & {
	onTimeout?: () => void
	onTimeAlmostUp?: (time: number) => void
}
