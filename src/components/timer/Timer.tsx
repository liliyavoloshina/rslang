import { useCallback, useEffect } from 'react'
import { CountdownCircleTimer } from 'react-countdown-circle-timer'

import { Box } from '@mui/material'

import { GAME_TIME, TIME_ALMOST_UP } from '~/utils/constants'

import { useTimerContext } from './Timer.context'
import { TimerProps } from './Timer.types'

const NumberFormat = Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2 })

const Timer = ({ onTimeout, onTimeAlmostUp, ...boxProps }: TimerProps) => {
	const { status, duration } = useTimerContext()

	useEffect(() => {
		if (status === 'timeout') {
			onTimeout?.()
		}
	}, [onTimeout, status])

	const onUpdate = useCallback(
		(timeLeft: number) => {
			if (timeLeft > 0 && timeLeft <= TIME_ALMOST_UP) {
				onTimeAlmostUp?.(timeLeft)
			}
		},
		[onTimeAlmostUp]
	)

	return (
		<Box {...boxProps}>
			<CountdownCircleTimer isPlaying duration={GAME_TIME} colors={['#004777', '#F7B801', '#A30000', '#A30000']} colorsTime={[60, 50, 20, 0]} size={100} onUpdate={onUpdate}>
				{({ remainingTime }) => remainingTime}
			</CountdownCircleTimer>
			{/* <Box>{status === 'running' && <Typography ref={timeLeftRef} />}</Box> */}
		</Box>
	)
}

export { Timer }
