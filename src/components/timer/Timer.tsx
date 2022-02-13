import { useEffect, useRef } from 'react'
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import { useTranslation } from 'react-i18next'

import { Box, Typography } from '@mui/material'

import { useTimerContext } from './Timer.context'
import { TimerProps } from './Timer.types'

const Timer = ({ onTimeout, ...boxProps }: TimerProps) => {
	const { t } = useTranslation()

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
					const timeLeft = Math.max(Math.floor(duration! - timePassed), 0)
					timeLeftRef.current.textContent = t('TIMER.TIME_LEFT', { count: timeLeft })
				}
			}, 200)

			return () => intervalRef.current && clearInterval(intervalRef.current)
		}
	}, [duration, status, t])

	useEffect(() => {
		if (status === 'timeout') {
			onTimeout?.()
		}
	}, [onTimeout, status])

	return (
		<Box {...boxProps}>
			<CountdownCircleTimer isPlaying duration={60} colors={['#004777', '#F7B801', '#A30000', '#A30000']} colorsTime={[60, 50, 20, 0]} size={100}>
				{({ remainingTime }) => remainingTime}
			</CountdownCircleTimer>
			{/* <Box>{status === 'running' && <Typography ref={timeLeftRef} />}</Box> */}
		</Box>
	)
}

export { Timer }
