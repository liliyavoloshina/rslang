import { useCallback } from 'react'
import { CountdownCircleTimer } from 'react-countdown-circle-timer'

import { SPRINT_TIME_ALMOST_UP_THRESHOLD } from '~/utils/constants'

import { TimerProps } from './Timer.types'

const Timer = ({ duration, onTimeout, onTimeAlmostUp }: TimerProps) => {
	const onUpdate = useCallback(
		(timeLeft: number) => {
			if (timeLeft > 0 && timeLeft <= SPRINT_TIME_ALMOST_UP_THRESHOLD) {
				onTimeAlmostUp?.(timeLeft)
			}
		},
		[onTimeAlmostUp]
	)

	return (
		<CountdownCircleTimer
			isPlaying
			duration={duration}
			colors={['#004777', '#F7B801', '#A30000', '#A30000']}
			colorsTime={[60, 50, 20, 0]}
			size={100}
			onUpdate={onUpdate}
			onComplete={onTimeout}
		>
			{({ remainingTime }) => remainingTime}
		</CountdownCircleTimer>
	)
}

export { Timer }
