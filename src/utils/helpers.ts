const shuffleArray = <T>(array: T[]) => {
	for (let i = array.length - 1; i > 0; i -= 1) {
		const j = Math.floor(Math.random() * (i + 1))
		;[array[i], array[j]] = [array[j], array[i]]
	}
}

// eslint-disable-next-line import/prefer-default-export
export { shuffleArray }
