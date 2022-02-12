import { Word } from './word'

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

export type { GetUserWordsResponse, UserStatistic, CompletedPages, StatisticOptional, TokenResponse }
