import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
// eslint-disable-next-line import/no-cycle
import { RootState } from '../../app/store'
import { Word } from '../../types/word'
import apiClient from '../../utils/api'
import { MAX_AUDIOCALL_ANSWERS_AMOUNT, MAX_WORD_GAME_AMOUNT } from '../../utils/constants'
import { shuffleArray } from '../../utils/helpers'

const DOMAIN_URL = process.env.REACT_APP_DOMAIN as string

export interface AudiocallState {
	words: Word[]
	answers: string[]
	currentIdx: number
	currentWord: null | Word
	isFinished: boolean
	status: 'idle' | 'loading' | 'failed' | 'success'
}

const initialState: AudiocallState = {
	words: [],
	answers: [],
	currentIdx: 0,
	currentWord: null,
	isFinished: false,
	status: 'idle',
}

export const fetchAudiocallWords = createAsyncThunk('audiocall/fetchWords', async ({ page, group }: { page: number; group: number }) => {
	const response = await apiClient.getWords(page, group)
	return response
})

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
			if (state.currentIdx === MAX_WORD_GAME_AMOUNT - 1) {
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

export const { nextWord } = audiocallSlice.actions
export const selectAudiocallWords = (state: RootState) => state.audiocall.words
export const selectAudiocallAnswers = (state: RootState) => state.audiocall.answers
export const selectAudiocallCurrentIdx = (state: RootState) => state.audiocall.currentIdx
export const selectAudiocallCurrentWord = (state: RootState) => state.audiocall.currentWord
export const selectAudiocallStatus = (state: RootState) => state.audiocall.status
export const selectAudiocallIsFinished = (state: RootState) => state.audiocall.isFinished
export default audiocallSlice.reducer
