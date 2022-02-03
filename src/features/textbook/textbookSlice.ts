import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
// eslint-disable-next-line import/no-cycle
import { RootState } from '../../app/store'
import { Word } from '../../types/word'
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
			// eslint-disable-next-line no-underscore-dangle
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
		// eslint-disable-next-line no-underscore-dangle
		const wordId = word._id!
		word.id = wordId
		return word
	})
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
	},
})

export const { changePage, changeGroup } = textbookSlice.actions
export const selectTextbookWords = (state: RootState) => state.textbook.words
export const selectTextbookStatus = (state: RootState) => state.textbook.status
export const selectTextbookGroup = (state: RootState) => state.textbook.group
export const selectTextbookPage = (state: RootState) => state.textbook.page
export default textbookSlice.reducer
