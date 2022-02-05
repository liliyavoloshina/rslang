import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
// eslint-disable-next-line import/no-cycle
import { RootState } from '../../app/store'
import { Word, WordDifficulty } from '../../types/word'
import apiClient from '../../utils/api'

export interface TextbookState {
	words: Word[]
	page: number
	group: number
	status: 'idle' | 'loading' | 'failed' | 'success'
}

const initialState: TextbookState = {
	words: [],
	page: 0,
	group: 0,
	status: 'idle',
}

export const fetchTextbookWords = createAsyncThunk('textbook/fetchWords', async (arg, { getState }) => {
	const state = getState() as RootState
	const { page, group } = state.textbook
	const { isLoggedIn, userInfo } = state.auth

	let words

	if (isLoggedIn) {
		const response = await apiClient.getUserWords(userInfo.userId as string, group, page)

		words = response[0].paginatedResults.map(word => {
			const wordId = word._id!
			word.id = wordId
			return word
		})
	} else {
		words = await apiClient.getAllWords(group, page)
	}

	return words
})

export const fetchDifficultWords = createAsyncThunk('textbook/fetchDifficultWords', async (arg, { getState }) => {
	const state = getState() as RootState
	// const { page, group } = state.textbook
	const { userInfo } = state.auth
	const response = await apiClient.getDifficultWords(userInfo.userId as string)
	return response[0].paginatedResults.map(word => {
		const wordId = word._id!
		word.id = wordId
		return word
	})
})

export const changeWordDifficulty = createAsyncThunk('textbook/changeWordDifficulty', async (arg: { wordId: string; difficulty: string }, { getState }) => {
	const state = getState() as RootState
	const { userInfo } = state.auth
	const { wordId, difficulty } = arg

	if (difficulty === WordDifficulty.Normal) {
		await apiClient.removeWordFromDifficult(userInfo.userId as string, wordId, difficulty)
	} else {
		await apiClient.addWordToDifficult(userInfo.userId as string, wordId, difficulty)
	}

	return { wordId, difficulty }
})

export const textbookSlice = createSlice({
	name: 'textbook',
	initialState,
	reducers: {
		changePage: (state, action) => {
			state.page = action.payload
		},
		changeGroup: (state, action) => {
			state.group = action.payload
		},
	},
	extraReducers: builder => {
		builder
			.addCase(fetchTextbookWords.pending, state => {
				state.status = 'loading'
			})
			.addCase(fetchTextbookWords.fulfilled, (state, action) => {
				state.status = 'success'
				state.words = action.payload
			})
			.addCase(fetchDifficultWords.pending, state => {
				state.status = 'loading'
			})
			.addCase(fetchDifficultWords.fulfilled, (state, action) => {
				state.status = 'success'
				state.words = action.payload
			})
			.addCase(changeWordDifficulty.fulfilled, (state, action) => {
				const { wordId, difficulty } = action.payload!

				state.words = state.words.map(word => {
					if (word.id === wordId) {
						const updatedWord = word

						if (updatedWord.userWord) {
							updatedWord.userWord = {
								...updatedWord.userWord,
								difficulty,
							}
						} else {
							updatedWord.userWord = {
								difficulty,
							}
						}
						return updatedWord
					}

					return word
				})

				if (difficulty === WordDifficulty.Normal) {
					state.words = state.words.filter(word => word.id !== wordId)
				}
			})
	},
})

export const { changePage, changeGroup } = textbookSlice.actions
export const selectTextbookWords = (state: RootState) => state.textbook.words
export const selectTextbookStatus = (state: RootState) => state.textbook.status
export const selectTextbookGroup = (state: RootState) => state.textbook.group
export const selectTextbookPage = (state: RootState) => state.textbook.page
export default textbookSlice.reducer
