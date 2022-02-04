const shuffleArray = <T>(array: T[]) => {
	for (let i = array.length - 1; i > 0; i -= 1) {
		const j = Math.floor(Math.random() * (i + 1))
		;[array[i], array[j]] = [array[j], array[i]]
	}
}

const handleError = (err: unknown) => `Ooops! ${err instanceof Error ? err.message : 'Unknown Error'}`

export { shuffleArray, handleError }
