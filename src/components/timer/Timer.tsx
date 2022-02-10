import { useEffect, useRef } from 'react'

import { Box, Typography } from '@mui/material'

import { useTimerContext } from './Timer.context'
import { TimerProps } from './Timer.types'

const NumberFormat = Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2 })

const Timer = ({ onTimeout, ...boxProps }: TimerProps) => {
	const { status, duration } = useTimerContext()

	const timeLeftRef = useRef<HTMLSpanElement>(null)
	const intervalRef = useRef<NodeJS.Timeout | undefined>()

	// eslint-disable-next-line consistent-return
	useEffect(() => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current)
			intervalRef.current = undefined
		}

		if (status === 'running') {
			const startTime = new Date().getTime()
			intervalRef.current = setInterval(() => {
				if (timeLeftRef.current) {
					const timePassed = (new Date().getTime() - startTime) / 1000
					timeLeftRef.current.textContent = `seconds left: ${NumberFormat.format(Math.max(duration! - timePassed, 0))}`
				}
			}, 20)

			return () => intervalRef.current && clearInterval(intervalRef.current)
		}
	}, [duration, status])

	useEffect(() => {
		if (status === 'timeout') {
			onTimeout?.()
		}
	}, [onTimeout, status])

	return <Box {...boxProps}>{status === 'running' && <Typography ref={timeLeftRef} />}</Box>
}

export { Timer }
