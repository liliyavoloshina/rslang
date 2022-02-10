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

interface ShortStatWords {
	newWords: number
	learnedWords: number
	correctWordsPercent: number[]
}

interface ShortStat {
	date: number
	games: {
		audiocall: ShortStatGame
		sprint: ShortStatGame
	}
	words: ShortStatWords
}

interface StatisticOptional {
	completedPages: CompletedPages
	shortStat: ShortStat
}

interface UserStatistic {
	learnedWords: number
	optional: StatisticOptional
}

export type { UserStatistic, CompletedPages, ShortStatGame }
