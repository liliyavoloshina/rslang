import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
// eslint-disable-next-line import/no-cycle
import { RootState } from '../../app/store'
import { ApiMethod, CompletedPages } from '../../types/api'
import { Word, WordDifficulty } from '../../types/word'
import apiClient from '../../utils/api'
import { WORD_PER_PAGE_AMOUNT } from '../../utils/constants'
import { localStorageSetPagination } from '../../utils/localStorage'

export interface TextbookState {
	words: Word[]
	page: number
	group: number
	status: 'idle' | 'loading' | 'failed' | 'success'
	completedPages: CompletedPages
}

const initialState: TextbookState = {
	words: [],
	page: 0,
	group: 0,
	status: 'idle',
	completedPages: {},
}

const updateCompletedPages = async (words: Word[], group: number, page: number, userId: string) => {
	let isPageCompleted = false

	const learnedOrDifficultWord = words.filter(word => word.userWord?.difficulty === WordDifficulty.Difficult || word.userWord?.optional?.isLearned === true)
	isPageCompleted = learnedOrDifficultWord.length + 1 === WORD_PER_PAGE_AMOUNT
	const currentStatistic = await apiClient.getUserStatistic(userId)

	const newGroupField = {
		...currentStatistic.optional.completedPages[group],
	}
	newGroupField[page] = isPageCompleted

	const updatedOptional = { ...currentStatistic.optional }
	updatedOptional.completedPages[group] = newGroupField

	await apiClient.updateCompletedPages(userId, updatedOptional)

	return isPageCompleted
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

export const getCompletedPages = createAsyncThunk('textbook/getCompletedPages', async (arg, { getState }) => {
	const state = getState() as RootState
	const { userInfo } = state.auth
	const res = (await apiClient.getUserStatistic(userInfo.userId as string)) || {}
	return res.optional.completedPages as CompletedPages
})

export const fetchDifficultWords = createAsyncThunk('textbook/fetchDifficultWords', async (arg, { getState }) => {
	const state = getState() as RootState
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
	const { words, group, page } = state.textbook
	const { wordId, difficulty } = arg
	const userId = userInfo.userId as string

	let isPageCompleted = false

	if (difficulty === WordDifficulty.Normal) {
		await apiClient.removeWordFromDifficult(userId, wordId, difficulty)
	} else {
		await apiClient.addWordToDifficult(userId, wordId, difficulty)
		isPageCompleted = await updateCompletedPages(words, group, page, userId)
	}

	return { wordId, difficulty, isPageCompleted }
})

export const changeWordLearnedStatus = createAsyncThunk('textbook/changeWordLearnedStatus', async (arg: { wordId: string; wordLearnedStatus: boolean }, { getState }) => {
	const state = getState() as RootState
	const { userInfo } = state.auth
	const { words, page, group } = state.textbook
	const { wordId, wordLearnedStatus } = arg
	const userId = userInfo.userId as string

	try {
		await apiClient.addWordToLearned(userId, wordId, wordLearnedStatus, ApiMethod.Put)
	} catch (e) {
		await apiClient.addWordToLearned(userId, wordId, wordLearnedStatus, ApiMethod.Post)
	}

	let isPageCompleted = false

	if (wordLearnedStatus === true) {
		isPageCompleted = await updateCompletedPages(words, group, page, userId)
		await apiClient.removeWordFromDifficult(userId, wordId, WordDifficulty.Normal)
	}

	return { wordId, wordLearnedStatus, isPageCompleted }
})

export const createNewStatistic = createAsyncThunk('textbook/createNewStatistic', async (arg, { getState }) => {
	const state = getState() as RootState
	const { userInfo } = state.auth
	const newStatistic = {
		learnedWords: 0,
		optional: {
			completedPages: { 0: { 0: false } },
		},
	}

	await apiClient.setNewStatistic(userInfo.userId as string, newStatistic)
})

export const textbookSlice = createSlice({
	name: 'textbook',
	initialState,
	reducers: {
		changePage: (state, action) => {
			const newPage = action.payload
			state.page = newPage
			localStorageSetPagination({ name: 'page', value: newPage })
		},
		changeGroup: (state, action) => {
			const newGroup = action.payload
			state.group = newGroup
			localStorageSetPagination({ name: 'group', value: newGroup })
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
				const { wordId, difficulty, isPageCompleted } = action.payload!

				if (isPageCompleted) {
					if (state.completedPages[state.group]) {
						state.completedPages[state.group][state.page] = true
					} else {
						state.completedPages[state.group] = { [state.page]: true }
					}
				}

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
			.addCase(changeWordLearnedStatus.fulfilled, (state, action) => {
				const { wordId, wordLearnedStatus, isPageCompleted } = action.payload!

				state.words = state.words.map(word => {
					if (word.id === wordId) {
						const updatedWord = word

						if (updatedWord.userWord) {
							updatedWord.userWord = {
								...updatedWord.userWord,
								optional: { ...updatedWord.userWord.optional, isLearned: wordLearnedStatus },
							}
						} else {
							updatedWord.userWord = {
								optional: { isLearned: wordLearnedStatus },
							}
						}
						return updatedWord
					}

					return word
				})

				if (wordLearnedStatus === true && state.group === 6) {
					state.words = state.words.filter(word => word.id !== wordId)
				}

				if (isPageCompleted) {
					if (state.completedPages[state.group]) {
						state.completedPages[state.group][state.page] = true
					} else {
						state.completedPages[state.group] = { [state.page]: true }
					}
				}

				if (wordLearnedStatus === true) {
					state.words = state.words.map(word => {
						if (word.id === wordId) {
							word.userWord = {
								...word.userWord,
								difficulty: WordDifficulty.Normal,
							}
						}

						return word
					})
				}
			})
			.addCase(getCompletedPages.fulfilled, (state, action) => {
				state.completedPages = action.payload
			})
	},
})

export const { changePage, changeGroup } = textbookSlice.actions
export const selectTextbookWords = (state: RootState) => state.textbook.words
export const selectTextbookStatus = (state: RootState) => state.textbook.status
export const selectTextbookGroup = (state: RootState) => state.textbook.group
export const selectTextbookPage = (state: RootState) => state.textbook.page
export const selectTextbookCompletedPages = (state: RootState) => state.textbook.completedPages
export default textbookSlice.reducer
