import { CountdownCircleTimer } from 'react-countdown-circle-timer'

import { COUNTDOWN_BEFORE_SPRINT_START } from '~/utils/constants'

const CountdownToStart = ({ onComplete }: { onComplete: () => void }) => (
	<CountdownCircleTimer
		isPlaying
		duration={COUNTDOWN_BEFORE_SPRINT_START}
		colors={['#004777', '#F7B801']}
		colorsTime={[COUNTDOWN_BEFORE_SPRINT_START, 0]}
		size={100}
		onComplete={onComplete}
	>
		{({ remainingTime }) => remainingTime}
	</CountdownCircleTimer>
)

export { CountdownToStart }
