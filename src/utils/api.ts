import { ApiBody, ApiConfig, ApiHeaders, ApiMethod, GetUserWordsResponse, TokenResponse, UserStatistic } from '~/types/api'
import { SignInData, SignInResponse, SignUpData, SignUpResponse } from '~/types/auth'
import { UserWord, Word } from '~/types/word'

import { DOMAIN_URL } from './constants'
import { localStorageGetUser, localStorageSetUser } from './localStorage'

const apiClient = async <T>(endpoint: string, method: ApiMethod, body?: ApiBody): Promise<T> => {
	const config: ApiConfig = {
		headers: { 'Content-Type': 'application/json' } as ApiHeaders,
		method,
	}

	const userInfo = localStorageGetUser()

	if (userInfo && userInfo.token) {
		const singinDate = userInfo.expirationDate!
		const currentDate = new Date().getTime()
		const isExpired = singinDate < currentDate

		if (isExpired) {
			const refreshConfig = {
				headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.refreshToken}` } as ApiHeaders,
				method: 'GET',
			}
			const tokenRes = await fetch(`${DOMAIN_URL}/${userInfo?.userId}/tokens`, refreshConfig)
			const token = (await tokenRes.json()) as TokenResponse
			const updatedUserInfo = {
				name: token.name,
				refreshToken: token.refreshToken,
				token: token.token,
				userId: token.userId,
			}

			localStorageSetUser(updatedUserInfo)

			config.headers.Authorization = `Bearer ${updatedUserInfo.token}`
		} else {
			config.headers.Authorization = `Bearer ${userInfo.token}`
		}
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

apiClient.getAllWords = (group: number, page?: number) => {
	return apiClient<Word[]>(`words?group=${group}${page !== undefined ? `&page=${page}` : ''}`, ApiMethod.Get)
}

apiClient.getUserWords = (id: string, group: number, page: number) => {
	return apiClient<GetUserWordsResponse[]>(`users/${id}/aggregatedWords?group=${group}&page=${page}&wordsPerPage=20`, ApiMethod.Get)
}

apiClient.getNotLearnedWord = (id: string, group: number, page: number) => {
	return apiClient<GetUserWordsResponse[]>(
		`users/${id}/aggregatedWords?filter={"$and":[{"$or":[{"userWord.optional.isLearned":false},{"userWord":null}]},{"group":${group},"page":${page}}]}&wordsPerPage=600`,
		ApiMethod.Get
	)
}

apiClient.getUserWord = (userId: string, wordId: string) => {
	return apiClient<Word>(`users/${userId}/words/${wordId}`, ApiMethod.Get)
}
apiClient.getDifficultWords = (id: string) => {
	return apiClient<GetUserWordsResponse[]>(`users/${id}/aggregatedWords?filter={"$and":[{"userWord.difficulty":"difficult"}]}`, ApiMethod.Get)
}

apiClient.addWordToDifficult = (userId: string, wordId: string, difficulty: string) => {
	return apiClient<UserWord>(`users/${userId}/words/${wordId}`, ApiMethod.Post, {
		difficulty,
	})
}

apiClient.removeWordFromDifficult = (userId: string, wordId: string, difficulty: string) => {
	return apiClient<UserWord>(`users/${userId}/words/${wordId}`, ApiMethod.Put, {
		difficulty,
	})
}

apiClient.addWordToLearned = async (userId: string, wordId: string, isLearned: boolean, method: ApiMethod) => {
	return apiClient<UserWord>(`users/${userId}/words/${wordId}`, method, {
		optional: {
			isLearned,
		},
	})
}

apiClient.updateCompletedPages = (userId: string, updatedStatistic: UserStatistic['optional']) => {
	return apiClient<UserStatistic>(`users/${userId}/statistics`, ApiMethod.Put, { optional: updatedStatistic })
}

apiClient.setNewStatistic = (userId: string, newStatistic: UserStatistic) => {
	return apiClient<UserStatistic>(`users/${userId}/statistics`, ApiMethod.Put, newStatistic)
}

apiClient.getUserStatistic = (userId: string) => {
	return apiClient<UserStatistic>(`users/${userId}/statistics`, ApiMethod.Get)
}

apiClient.signIn = (signinData: SignInData) => {
	return apiClient<SignInResponse>(`signin`, ApiMethod.Post, signinData)
}

apiClient.signUp = (signupData: SignUpData) => {
	return apiClient<SignUpResponse>(`users`, ApiMethod.Post, signupData)
}

export default apiClient
