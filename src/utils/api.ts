import { ApiMethod, ApiBody, ApiConfig, ApiHeaders, GetUserWordsResponse } from '../types/api'
import { SignInData, SignInResponse, SignUpData, SignUpResponse } from '../types/auth'
import { UserWord, Word } from '../types/word'
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

	const response = await fetch(`${DOMAIN_URL}/${endpoint}`, config)

	if (!response.ok) {
		const error = await response.text()
		throw new Error(error)
	}

	const data = await response.json()
	return data
}

apiClient.getAllWords = (group: number, page: number) => {
	return apiClient<Word[]>(`words?group=${group}&page=${page}`, ApiMethod.Get)
}

apiClient.getUserWords = (id: string, group: number, page: number) => {
	return apiClient<GetUserWordsResponse[]>(`users/${id}/aggregatedWords?group=${group}&page=${page}&wordsPerPage=20`, ApiMethod.Get)
}

apiClient.getDifficultWords = (id: string) => {
	return apiClient<GetUserWordsResponse[]>(`users/${id}/aggregatedWords?filter={"$and":[{"userWord.difficulty":"difficult"}]}`, ApiMethod.Get)
}

// apiClient.addWordToDifficult = (id: string) => {
// 	return apiClient<Word[]>(`users/${id}/words`, ApiMethod.Get)
// }

apiClient.signIn = (signinData: SignInData) => {
	return apiClient<SignInResponse>(`signin`, ApiMethod.Post, signinData)
}

apiClient.signUp = (signupData: SignUpData) => {
	return apiClient<SignUpResponse>(`users`, ApiMethod.Post, signupData)
}

export default apiClient
