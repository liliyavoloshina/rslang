import { ApiMethod, ApiBody, ApiConfig, ApiHeaders } from '../types/api'
import { SignInData, SignInResponse } from '../types/auth'
import { Word } from '../types/word'
import { localStorageGetUser } from './localStorage'

const DOMAIN_URL = process.env.REACT_APP_DOMAIN as string

const apiClient = async <T>(endpoint: string, method: ApiMethod, body?: ApiBody): Promise<T> => {
	const config: ApiConfig = {
		headers: { 'Content-Type': 'application/json' } as ApiHeaders,
		method,
	}

	const user = localStorageGetUser()

	if (user && user.token) {
		config.headers.Authorization = `Bearer ${user.token}`
	}

	if (body) {
		config.body = JSON.stringify(body)
	}

	const response = await fetch(endpoint, config)

	if (!response.ok) {
		throw new Error(response.statusText)
	}

	const data = await response.json()
	return data
}

apiClient.getWords = (group: number, page: number) => {
	return apiClient<Word[]>(`${DOMAIN_URL}/words?group=${group}&page=${page}`, ApiMethod.Get)
}

apiClient.signIn = (signinData: SignInData) => {
	return apiClient<SignInResponse>(`${DOMAIN_URL}/signin`, ApiMethod.Post, signinData)
}

export default apiClient
