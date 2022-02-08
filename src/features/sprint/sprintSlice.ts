import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { Word } from '~/types/word'
// TODO: uncomment and use this instead of hardcoded temp test value
// import { MAX_WORD_GAME_AMOUNT } from '~/utils/constants'
import apiClient from '~/utils/api'
import { shuffleArray } from '~/utils/helpers'

type SprintState = {
	words: Word[]
	currentWord: Word | undefined
	suggestedTranslation: string | undefined
	currentIdx: number
	isFinished: boolean
	correctWords: Word[]
	incorrectWords: Word[]
	status: 'idle' | 'loading' | 'failed' | 'success'
}

const initialState: SprintState = {
	words: [],
	currentIdx: 0,
	isFinished: false,
	currentWord: undefined,
	suggestedTranslation: undefined,
	correctWords: [],
	incorrectWords: [],
	status: 'idle',
}

const getSuggestedTranslation = (currentWord: Word, words: Word[]) => {
	const shouldSuggestCorrectOption = Math.random() > 0.5
	if (shouldSuggestCorrectOption) {
		return currentWord.wordTranslate
	}
	for (;;) {
		const randomWord = words[Math.floor(Math.random() * words.length)]
		if (randomWord !== currentWord) {
			return randomWord.wordTranslate
		}
	}
}

export const startGame = createAsyncThunk('sprint/startGame', ({ group, page }: { group: number; page: number }) => apiClient.getAllWords(group, page))

export const sprintSlice = createSlice({
	name: 'sprint',
	initialState,
	reducers: {
		answer: (state, action: PayloadAction<boolean>) => {
			if (state.currentWord) {
				const correctOption = state.suggestedTranslation === state.currentWord.wordTranslate
				if (action.payload === correctOption) {
					state.correctWords.push(state.currentWord)
				} else {
					state.incorrectWords.push(state.currentWord)
				}
			}

			// TODO: uncomment me
			// if (state.currentIdx < MAX_WORD_GAME_AMOUNT - 1) {
			if (state.currentIdx < 2) {
				state.currentIdx += 1
				state.currentWord = state.words[state.currentIdx]
				state.suggestedTranslation = getSuggestedTranslation(state.currentWord!, state.words)
			} else {
				state.isFinished = true
			}
		},
		reset: state => {
			Object.assign(state, initialState)
		},
	},
	extraReducers: builder => {
		builder
			.addCase(startGame.pending, state => {
				state.status = 'loading'
			})
			.addCase(startGame.fulfilled, (state, action) => {
				state.status = 'success'
				state.words = action.payload
				shuffleArray(state.words)
				state.currentWord = state.words[state.currentIdx]
				state.suggestedTranslation = getSuggestedTranslation(state.currentWord!, state.words)
			})
	},
})

export const { answer, reset } = sprintSlice.actions

export default sprintSlice.reducer
