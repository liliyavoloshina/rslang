import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { RootState } from '~/app/store'
import { GetUserWordsResponse } from '~/types/api'
import { Word } from '~/types/word'
import apiClient from '~/utils/api'
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

export const fetchAudiocallWords = createAsyncThunk<Word[], FetchWordsParams, { state: RootState }>(
	'audiocall/fetchWords',
	async ({ group, page, isFromTextbook }, { getState }) => {
		const state = getState()
		const { isLoggedIn, userInfo } = state.auth

		// if there are possibly learned words
		if (isFromTextbook && isLoggedIn) {
			const res = await apiClient.getNotLearnedWord(userInfo!.userId, group, page)
			let receivedWords = res[0].paginatedResults

			while (receivedWords.length !== WORD_PER_PAGE_AMOUNT) {
				if (page === 0) break
				// eslint-disable-next-line no-await-in-loop
				const resFromPrevPage = await apiClient.getNotLearnedWord(userInfo!.userId, group, page - 1)
				const wordsFromPrevPage = resFromPrevPage[0].paginatedResults
				receivedWords = [...receivedWords, ...wordsFromPrevPage].slice(0, 20)
			}

			return receivedWords
		}

		return apiClient.getAllWords(group, page)
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
			if (state.currentIdx === WORD_PER_PAGE_AMOUNT - 1) {
				state.isFinished = true
				return
			}

			if (!state.answeredWord) {
				state.incorrectAnswers = [...state.incorrectAnswers, state.currentWord!]
			}
			state.currentIdx += 1
			state.currentWord = state.words[state.currentIdx]
			const correctAnswer = state.words[state.currentIdx].wordTranslate
			const onlyAnswers = state.words.map(word => word.wordTranslate)
			const randomAnswers = getRandomAnswers(correctAnswer, onlyAnswers)
			state.answers = randomAnswers
			state.audioPath = `${DOMAIN_URL}/${state.currentWord!.audio}`
			const newAudio = new Audio(state.audioPath)
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

			if (actualWord !== currentWord!.wordTranslate) {
				state.incorrectAnswers = [...state.incorrectAnswers, currentWord!]
			} else {
				state.correctAnswers = [...state.correctAnswers, currentWord!]
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
				state.words = action.payload
				const correctAnswer = state.words[state.currentIdx].wordTranslate
				const onlyAnswers = state.words.map(word => word.wordTranslate)
				const randomAnswers = getRandomAnswers(correctAnswer, onlyAnswers)
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
