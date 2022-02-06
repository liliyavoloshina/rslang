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

interface StatisticOptional {
	completedPages: CompletedPages
}

interface CompletedPages {
	[key: number]: {
		[key: number]: boolean
	}
}

interface GetUserStatisticResponse {
	learnedWords: number
	optional: StatisticOptional
}

type ApiBody = any

export { ApiMethod }
export type { ApiConfig, ApiBody, ApiHeaders, GetUserWordsResponse, GetUserStatisticResponse, CompletedPages }
