export const WORD_PER_PAGE_AMOUNT = 20
export const MAX_WORDS_GAME_AMOUNT = 20
export const MAX_AUDIOCALL_ANSWERS_AMOUNT = 5
export const PAGES_PER_GROUP = 30
export const GAME_TIME = 60
export const CORRECT_ANSWERS_TO_LEARN_DIFFICULT = 5
export const CORRECT_ANSWERS_TO_LEARN_NORMAL = 3

export const DOMAIN_URL = process.env.REACT_APP_DOMAIN as string

export const INITIAL_SHORT_STATISTICS = {
	date: new Date().getTime(),
	games: {
		audiocall: {
			newWords: 0,
			correctWordsPercent: [],
			longestSeries: 0,
		},
		sprint: {
			newWords: 0,
			correctWordsPercent: [],
			longestSeries: 0,
		},
	},
	learnedWords: 0,
}
