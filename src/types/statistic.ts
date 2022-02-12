import { WordDifficulty } from './word'

interface CompletedPages {
	[key: number]: {
		[key: number]: boolean
	}
}

interface ShortStatGame {
	newWords: number
	correctWordsPercent: number[]
	longestSeries: number
}

interface ShortStat {
	date: number
	games: {
		audiocall: ShortStatGame
		sprint: ShortStatGame
	}
	learnedWords: number
}

interface StatisticOptional {
	completedPages: CompletedPages
	shortStat: ShortStat
}

interface UserStatistic {
	learnedWords: number
	optional: StatisticOptional
}

interface WordFieldsToUpdate {
	difficulty?: WordDifficulty
	correctAnswers?: number
	incorrectAnswers?: number
	correctStrike?: number
	isLearned?: boolean
}

export type { UserStatistic, CompletedPages, ShortStatGame, WordFieldsToUpdate, StatisticOptional }
