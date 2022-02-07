import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { RootState } from '~/app/store'
import { Word } from '~/types/word'
import { getNotLearnedWord, getUserWords } from '~/utils/api/userWords'
import { getAllWords } from '~/utils/api/words'
import { DOMAIN_URL, MAX_AUDIOCALL_ANSWERS_AMOUNT, WORD_PER_PAGE_AMOUNT } from '~/utils/constants'
import { shuffleArray } from '~/utils/helpers'

export interface AudiocallState {
	words: Word[]
	answers: string[]
	currentIdx: number
	currentWord: null | Word
	answeredWord: string | null
	incorrectAnswers: Word[]
	correctAnswers: Word[]
	longestSeries: {
		correctAnswers: number[]
		stopped: boolean
	}
	isLevelSelection: boolean
	isFinished: boolean
	audioPath: string
	status: 'idle' | 'loading' | 'failed' | 'success'
}

const initialState: AudiocallState = {
	words: [],
	answers: [],
	currentIdx: 0,
	currentWord: null,
	answeredWord: null,
	incorrectAnswers: [],
	correctAnswers: [],
	longestSeries: {
		correctAnswers: [0],
		stopped: false,
	},
	isLevelSelection: false,
	isFinished: false,
	audioPath: '',
	status: 'idle',
}

interface FetchWordsParams {
	group: number
	page: number
	isFromTextbook: boolean
}

export const fetchAudiocallWords = createAsyncThunk<{ wordsForGame: Word[]; answers: string[] }, FetchWordsParams, { state: RootState }>(
	'audiocall/fetchWords',
	async ({ group, page, isFromTextbook }, { getState }) => {
		const state = getState()
		const { isLoggedIn, userInfo } = state.auth

		let wordsForGame
		let answers

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

			// there maybe not enough answers if available words is less than 5
			answers = allUserWords.map((word: Word) => word.wordTranslate)
		} else {
			const allWords = await getAllWords(group, page)
			wordsForGame = allWords
			answers = allWords.map((word: Word) => word.wordTranslate)
		}

		return { wordsForGame, answers }
	}
)

const getRandomAnswers = (correctAnswer: string, answers: string[]) => {
	shuffleArray(answers)

	const randomAnswers: string[] = [correctAnswer]

	for (let i = 0; randomAnswers.length < MAX_AUDIOCALL_ANSWERS_AMOUNT; i += 1) {
		const possibleAnswer = answers[i]
		if (possibleAnswer !== correctAnswer && !randomAnswers.includes(possibleAnswer)) {
			randomAnswers.push(possibleAnswer)
		}
	}

	shuffleArray(randomAnswers)

	return randomAnswers
}

export const audiocallSlice = createSlice({
	name: 'audiocall',
	initialState,
	reducers: {
		showNextWord: state => {
			const currentWord = state.currentWord!

			if (!state.answeredWord) {
				// eslint-disable-next-line no-underscore-dangle
				const updatedWord = { ...currentWord, id: currentWord._id! }
				state.incorrectAnswers = [...state.incorrectAnswers, updatedWord]
				state.longestSeries.stopped = true
			}

			if (state.currentIdx === state.words.length - 1) {
				state.isFinished = true
				return
			}

			state.currentIdx += 1
			const newCurrentWord = state.words[state.currentIdx]
			const audioPath = `${DOMAIN_URL}/${newCurrentWord.audio}`
			const correctAnswer = state.words[state.currentIdx].wordTranslate
			const onlyAnswers = state.words.map(word => word.wordTranslate)
			const randomAnswers = getRandomAnswers(correctAnswer, onlyAnswers)

			state.currentWord = newCurrentWord

			state.answers = randomAnswers
			state.audioPath = audioPath
			const newAudio = new Audio(audioPath)
			newAudio.play()
			state.answeredWord = null
		},
		toggleLevelSelection: (state, action) => {
			state.isLevelSelection = action.payload
		},
		toggleAudiocallAudio: state => {
			const newAudio = new Audio(state.audioPath)
			newAudio.play()
		},
		resetGame: state => {
			Object.assign(state, initialState)
		},
		checkAnswer: (state, action) => {
			const { answer, isKeyboard } = action.payload
			const { currentWord } = state
			let actualWord

			if (isKeyboard) {
				actualWord = state.answers[answer - 1]
			} else {
				actualWord = answer
			}

			state.answeredWord = actualWord

			// eslint-disable-next-line no-underscore-dangle
			const updatedWord = { ...currentWord!, id: currentWord!._id! }

			if (actualWord !== currentWord!.wordTranslate) {
				state.incorrectAnswers = [...state.incorrectAnswers, updatedWord]
				state.longestSeries.stopped = true
			} else {
				if (state.longestSeries.stopped) {
					state.longestSeries.correctAnswers = [...state.longestSeries.correctAnswers, 1]
					state.longestSeries.stopped = false
				} else {
					state.longestSeries.correctAnswers[state.longestSeries.correctAnswers.length - 1] += 1
				}

				state.correctAnswers = [...state.correctAnswers, updatedWord]
			}
		},
	},
	extraReducers: builder => {
		builder
			.addCase(fetchAudiocallWords.pending, state => {
				state.status = 'loading'
			})
			.addCase(fetchAudiocallWords.fulfilled, (state, action) => {
				state.status = 'success'
				const { wordsForGame, answers } = action.payload
				state.words = wordsForGame
				const correctAnswer = state.words[state.currentIdx].wordTranslate

				const randomAnswers = getRandomAnswers(correctAnswer, answers)
				state.answers = randomAnswers

				// eslint-disable-next-line prefer-destructuring
				state.currentWord = state.words[0]

				state.audioPath = `${DOMAIN_URL}/${state.currentWord!.audio}`
				const newAudio = new Audio(state.audioPath)
				newAudio.play()
			})
	},
})

export const { showNextWord, toggleAudiocallAudio, toggleLevelSelection, resetGame, checkAnswer } = audiocallSlice.actions
export default audiocallSlice.reducer
