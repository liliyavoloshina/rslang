import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { RootState } from '~/app/store'
import { Word } from '~/types/word'
import { getAllWords, getNotLearnedWord, getUserWords } from '~/utils/api'
// TODO: uncomment and use this instead of hardcoded temp test value
import { BASE_CORRECT_ANSWER_POINTS, DOMAIN_URL, MAX_WORDS_GAME_AMOUNT, WORD_PER_PAGE_AMOUNT } from '~/utils/constants'
import { shuffleArray } from '~/utils/helpers'

type SprintState = {
	words: Word[]
	currentWord: Word | undefined
	suggestedTranslation: string | undefined
	currentIdx: number
	correctWords: Word[]
	incorrectWords: Word[]
	correctAnswersInRow: number
	maxCorrectAnswersSequence: number
	gameRound: number
	totalPoints: number
	audioPath: string
	isMute: boolean
	status: 'idle' | 'loading' | 'failed' | 'game-running' | 'game-over'
}

const initialState: SprintState = {
	words: [],
	currentIdx: 0,
	currentWord: undefined,
	suggestedTranslation: undefined,
	correctWords: [],
	incorrectWords: [],
	correctAnswersInRow: 0,
	maxCorrectAnswersSequence: 0,
	gameRound: 1,
	totalPoints: 0,
	audioPath: '',
	isMute: false,
	status: 'idle',
}

const getSuggestedTranslation = (currentWord: Word, words: Word[]) => {
	const shouldSuggestCorrectOption = Math.random() > 0.5
	if (shouldSuggestCorrectOption) {
		return currentWord.wordTranslate
	}

	const otherWords = words.filter(word => word !== currentWord)
	return otherWords[Math.floor(Math.random() * otherWords.length)].wordTranslate
}

// TODO: we need to get aggregated words here, so we will have userWord field
// export const startGame = createAsyncThunk('sprint/startGame', ({ group, page }: { group: number; page: number }) => getAllWords(group, page))

interface FetchWordsParams {
	group: number
	page: number
	isFromTextbook: boolean
}

export const startGame = createAsyncThunk<Word[], FetchWordsParams, { state: RootState }>('sprint/startGame', async ({ group, page, isFromTextbook }, { getState }) => {
	const state = getState()
	const { isLoggedIn, userInfo } = state.auth

	let wordsForGame

	// if there are possibly learned words
	if (userInfo && isLoggedIn) {
		const allUserWordsResponse = await getUserWords(userInfo.userId, group, page)
		const allUserWords = allUserWordsResponse[0].paginatedResults

		if (isFromTextbook) {
			const addNotLearnedWordsFromPage = async (currentPage: number, words: Word[]): Promise<Word[]> => {
				const response = await getNotLearnedWord(userInfo.userId, group, currentPage)
				const wordsFromPage = response[0].paginatedResults
				words.unshift(...wordsFromPage)

				if (words.length < WORD_PER_PAGE_AMOUNT && currentPage !== 0) {
					return addNotLearnedWordsFromPage(currentPage - 1, words)
				}

				const sliced = words.slice(0, WORD_PER_PAGE_AMOUNT)
				return sliced
			}
			wordsForGame = await addNotLearnedWordsFromPage(page, [])
		} else {
			wordsForGame = allUserWords
		}
	} else {
		wordsForGame = await getAllWords(group, page)
	}

	return wordsForGame
})

export const sprintSlice = createSlice({
	name: 'sprint',
	initialState,
	reducers: {
		answer: (state, action: PayloadAction<boolean>) => {
			const correctAnswerAudio = new Audio('/assets/audio/correct_answer2.mp3')
			const incorrectAnswerAudio = new Audio('/assets/audio/incorrect_answer2.mp3')
			const newRoundAudio = new Audio('/assets/audio/new_round.mp3')
			if (state.currentWord) {
				const correctOption = state.suggestedTranslation === state.currentWord.wordTranslate
				if (action.payload === correctOption) {
					state.correctWords = [...state.correctWords, state.currentWord]
					state.correctAnswersInRow += 1
					state.totalPoints += BASE_CORRECT_ANSWER_POINTS * state.gameRound
					if (!state.isMute) {
						correctAnswerAudio.play()
					}
					if (state.gameRound < 4 && state.correctAnswersInRow % 4 === 0 && state.correctAnswersInRow !== 0) {
						state.gameRound += 1
						if (!state.isMute) {
							newRoundAudio.play()
						}
					}
				} else {
					state.incorrectWords = [...state.incorrectWords, state.currentWord]
					state.maxCorrectAnswersSequence = Math.max(state.maxCorrectAnswersSequence, state.correctAnswersInRow)
					state.correctAnswersInRow = 0
					state.gameRound = 1
					if (!state.isMute) {
						incorrectAnswerAudio.play()
					}
				}
			}

			// TODO: uncomment me
			if (state.currentIdx < MAX_WORDS_GAME_AMOUNT - 1) {
				// if (state.currentIdx < 19) {
				state.currentIdx += 1
				state.currentWord = state.words[state.currentIdx]
				state.suggestedTranslation = getSuggestedTranslation(state.currentWord!, state.words)
				state.audioPath = `${DOMAIN_URL}/${state.currentWord!.audio}`
			} else {
				state.status = 'game-over'
				// TODO: для всех слов - проверить word.userWord?, если нет, то добавить в статистику +1 новое слово с таймстемпом
				// TODO: для всех неугаданных слов - сделать неизученными, сбросить на ноль количество правильных ответов для этого слова (и в сложных и в обычных)
				// TODO: для всех угаданных слов - если слово было обычным/сложным и 3/5 раз подряд угаданно, То сделать изученным

				// state.incorrectWords.map(word => word.userWord?.optional?.isLearned === false)
			}
		},
		reset: state => {
			Object.assign(state, initialState)
		},
		gameTimeout: state => {
			state.status = 'game-over'
		},
		playWordAudio: state => {
			const newAudio = new Audio(state.audioPath)
			newAudio.play()
		},
		toggleMute: state => {
			state.isMute = !state.isMute
		},
	},
	extraReducers: builder => {
		builder
			.addCase(startGame.pending, state => {
				state.status = 'loading'
			})
			.addCase(startGame.fulfilled, (state, action) => {
				state.status = 'game-running'
				state.words = action.payload
				shuffleArray(state.words)
				state.currentWord = state.words[state.currentIdx]
				state.suggestedTranslation = getSuggestedTranslation(state.currentWord!, state.words)
				state.audioPath = `${DOMAIN_URL}/${state.currentWord!.audio}`
			})
	},
})

export const { answer, reset, gameTimeout, playWordAudio, toggleMute } = sprintSlice.actions

export default sprintSlice.reducer
