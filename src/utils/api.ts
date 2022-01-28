import { ApiMethod, ApiBody, ApiConfig } from '../types/api/api'
import { Word } from '../types/word'

const DOMAIN_URL = process.env.REACT_APP_DOMAIN as string

const apiClient = async <T>(endpoint: string, method: ApiMethod, body?: ApiBody): Promise<T> => {
	const config: ApiConfig = {
		headers: { 'Content-Type': 'application/json' },
		method,
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

export default apiClient
