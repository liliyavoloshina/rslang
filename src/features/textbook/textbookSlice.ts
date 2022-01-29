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
	const response = await apiClient.getWords(page, group)
	return response
})

export const textbookSlice = createSlice({
	name: 'textbook',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchTextbookWords.pending, state => {
				state.status = 'loading'
			})
			.addCase(fetchTextbookWords.fulfilled, (state, action) => {
				state.status = 'success'
				state.words = action.payload
			})
	},
})

// export const { nextWord } = audiocallSlice.actions
export const selectTextbookWords = (state: RootState) => state.textbook.words
export const selectTextbookStatus = (state: RootState) => state.textbook.status
export default textbookSlice.reducer
