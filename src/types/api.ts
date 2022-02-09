import { Word } from './word'

enum ApiMethod {
	Get = 'GET',
	Post = 'POST',
	Put = 'PUT',
	Delete = 'DELETE',
	Patch = 'PATCH',
}

interface ApiHeaders {
	[key: string]: string
	'Content-Type': string
	Authorization: string
}

interface ApiConfig {
	headers: ApiHeaders
	method: ApiMethod
	body?: string
}

interface GetUserWordsResponse {
	paginatedResults: Word[]
	totalCount: [
		{
			count: number
		}
	]
}

interface CompletedPages {
	[key: number]: {
		[key: number]: boolean
	}
}

interface StatisticOptional {
	completedPages: CompletedPages
}

interface UserStatistic {
	learnedWords: number
	optional: StatisticOptional
}

interface TokenResponse {
	message: string
	token: string
	refreshToken: string
	userId: string
	name: string
}

type ApiBody = unknown

export { ApiMethod }
export type { ApiConfig, ApiBody, ApiHeaders, GetUserWordsResponse, UserStatistic, CompletedPages, StatisticOptional, TokenResponse }
