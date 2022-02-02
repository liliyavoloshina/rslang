const shuffleArray = <T>(array: T[]) => {
	for (let i = array.length - 1; i > 0; i -= 1) {
		const j = Math.floor(Math.random() * (i + 1))
		;[array[i], array[j]] = [array[j], array[i]]
	}
}

const setToken = (val: string) => {
	localStorage.setItem('token', val)
}

const getToken = () => {
	return localStorage.getItem('token')
}

const removeToken = () => {
	localStorage.removeItem('token')
}

export { shuffleArray, getToken, removeToken, setToken }
