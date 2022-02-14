const CORRECT_ANSWERS_TO_LEARN_DIFFICULT = 5
const CORRECT_ANSWERS_TO_LEARN_NORMAL = 3

const WORD_PER_PAGE_AMOUNT = 20
const PAGES_PER_GROUP = 30

const MAX_WORDS_GAME_AMOUNT = 20
const MAX_AUDIOCALL_ANSWERS_AMOUNT = 5

// TODO: rename, mention sprint
const GAME_TIME = 60
const TIME_ALMOST_UP_THRESHOLD = 5
const BASE_CORRECT_ANSWER_POINTS = 10

const DOMAIN_URL = process.env.REACT_APP_DOMAIN as string

const INITIAL_SHORT_STATISTICS = {
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

export {
	WORD_PER_PAGE_AMOUNT,
	MAX_WORDS_GAME_AMOUNT,
	MAX_AUDIOCALL_ANSWERS_AMOUNT,
	PAGES_PER_GROUP,
	GAME_TIME,
	TIME_ALMOST_UP_THRESHOLD,
	CORRECT_ANSWERS_TO_LEARN_DIFFICULT,
	CORRECT_ANSWERS_TO_LEARN_NORMAL,
	INITIAL_SHORT_STATISTICS,
	BASE_CORRECT_ANSWER_POINTS,
	DOMAIN_URL,
}
