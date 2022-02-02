import { UserInfo } from '../types/auth'

const LS_KEYWORD = 'soberkoala'

const localStorageSetUser = (value: UserInfo) => {
	const valueToStore = JSON.stringify(value)
	localStorage.setItem(`${LS_KEYWORD}-userinfo`, valueToStore)
}

const localStorageGetUser = (): UserInfo | null => {
	const storedUser = localStorage.getItem(`${LS_KEYWORD}-userinfo`)
	if (storedUser) {
		return JSON.parse(storedUser)
	}

	return null
}

const localStorageRemoveUser = () => {
	localStorage.removeItem(`${LS_KEYWORD}-userinfo`)
}

export { localStorageSetUser, localStorageGetUser, localStorageRemoveUser }
