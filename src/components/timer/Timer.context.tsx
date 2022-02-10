import { ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'

type TimerContextShape = {
	status: 'stopped' | 'running' | 'timeout'
	duration: number | undefined
	start: (duration: number) => void
	stop: () => void
}

const TimerContext = createContext({} as TimerContextShape)

const TimerContextProvider = ({ children }: { children: ReactNode }) => {
	const [status, setStatus] = useState<TimerContextShape['status']>('stopped')
	const [duration, setDuration] = useState<number | undefined>()

	const timeoutRef = useRef<NodeJS.Timeout>()
	const statusRef = useRef<typeof status>(status)
	useEffect(() => {
		statusRef.current = status
	}, [status])

	const stop = useCallback(() => {
		if (statusRef.current === 'running') {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current)
				timeoutRef.current = undefined
			}
			setStatus('stopped')
		}
	}, [])

	const start = useCallback(
		// eslint-disable-next-line consistent-return
		newDuration => {
			if (statusRef.current !== 'running') {
				timeoutRef.current = setTimeout(() => {
					stop()
					setStatus('timeout')
				}, newDuration * 1000)

				setStatus('running')
				setDuration(newDuration)

				return () => timeoutRef.current && clearTimeout(timeoutRef.current)
			}
		},
		[]
	)

	const value = useMemo(() => ({ status, start, stop, duration }), [status, start, stop, duration])

	return <TimerContext.Provider value={value}>{children}</TimerContext.Provider>
}

const useTimerContext = () => useContext(TimerContext)

export type { TimerContextShape }
export { TimerContextProvider, useTimerContext }
