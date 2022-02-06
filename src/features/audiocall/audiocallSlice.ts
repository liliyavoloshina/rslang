import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { Word } from '~/types/word'
import apiClient from '~/utils/api'
import { DOMAIN_URL, MAX_AUDIOCALL_ANSWERS_AMOUNT, WORD_PER_PAGE_AMOUNT } from '~/utils/constants'
import { shuffleArray } from '~/utils/helpers'

export interface AudiocallState {
	words: Word[]
	answers: string[]
	currentIdx: number
	currentWord: null | Word
	isLevelSelection: boolean
	isFinished: boolean
	status: 'idle' | 'loading' | 'failed' | 'success'
}

const initialState: AudiocallState = {
	words: [],
	answers: [],
	currentIdx: 0,
	currentWord: null,
	isLevelSelection: false,
	isFinished: false,
	status: 'idle',
}

export const fetchAudiocallWords = createAsyncThunk('audiocall/fetchWords', ({ group, page }: { group: number; page: number }) => apiClient.getAllWords(group, page))

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
		nextWord: state => {
			if (state.currentIdx === WORD_PER_PAGE_AMOUNT - 1) {
				state.isFinished = true
				return
			}
			state.currentIdx += 1
			state.currentWord = state.words[state.currentIdx]
			const correctAnswer = state.words[state.currentIdx].wordTranslate
			const onlyAnswers = state.words.map(word => word.wordTranslate)
			const randomAnswers = getRandomAnswers(correctAnswer, onlyAnswers)
			state.answers = randomAnswers
			const newAudio = new Audio(`${DOMAIN_URL}/${state.currentWord!.audio}`)
			newAudio.play()
		},
		toggleLevelSelection: (state, action) => {
			state.isLevelSelection = action.payload
		},
		toggleAudiocallAudio: state => {
			const newAudio = new Audio(`${DOMAIN_URL}/${state.currentWord!.audio}`)
			newAudio.play()
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
				const newAudio = new Audio(`${DOMAIN_URL}/${state.currentWord!.audio}`)
				newAudio.play()
			})
	},
})

export const { nextWord, toggleAudiocallAudio, toggleLevelSelection } = audiocallSlice.actions
export default audiocallSlice.reducer
