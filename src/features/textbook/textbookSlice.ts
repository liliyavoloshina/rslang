import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { RootState } from '~/app/store'
import { ApiMethod, CompletedPages } from '~/types/api'
import { Word, WordDifficulty } from '~/types/word'
import apiClient from '~/utils/api'
import { WORD_PER_PAGE_AMOUNT } from '~/utils/constants'
import { localStorageSetPagination } from '~/utils/localStorage'

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

export const fetchTextbookWords = createAsyncThunk<Word[], void, { state: RootState }>('textbook/fetchWords', async (_arg, { getState }) => {
	const state = getState()
	const { page, group } = state.textbook
	const { userInfo } = state.auth

	if (userInfo) {
		const response = await apiClient.getUserWords(userInfo.userId, group, page)

		// TODO: check if this map function is really needed here
		// eslint-disable-next-line no-underscore-dangle
		return response[0].paginatedResults.map(word => ({ ...word, id: word._id! }))
	}

	return apiClient.getAllWords(group, page)
})

export const getCompletedPages = createAsyncThunk<CompletedPages, void, { state: RootState }>('textbook/getCompletedPages', async (arg, { getState }) => {
	const state = getState()
	const { userInfo } = state.auth
	if (!userInfo) {
		throw new Error('Not permitted')
	}

	const res = (await apiClient.getUserStatistic(userInfo.userId)) || {}
	return res.optional.completedPages
})

export const fetchDifficultWords = createAsyncThunk<Word[], void, { state: RootState }>('textbook/fetchDifficultWords', async (arg, { getState }) => {
	const state = getState()
	const { userInfo } = state.auth
	if (!userInfo) {
		throw new Error('Not permitted')
	}

	const response = await apiClient.getDifficultWords(userInfo.userId as string)
	// TODO: refactor duplicated code
	// eslint-disable-next-line no-underscore-dangle
	return response[0].paginatedResults.map(word => ({ ...word, id: word._id! }))
})

export const changeWordDifficulty = createAsyncThunk('textbook/changeWordDifficulty', async (arg: { wordId: string; difficulty: string }, { getState }) => {
	const state = getState() as RootState
	const { userInfo } = state.auth
	if (!userInfo) {
		throw new Error('Not permitted')
	}

	const { words, group, page } = state.textbook
	const { wordId, difficulty } = arg
	const { userId } = userInfo

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
	if (!userInfo) {
		throw new Error('Not permitted')
	}

	const { words, page, group } = state.textbook
	const { wordId, wordLearnedStatus } = arg
	const { userId } = userInfo

	try {
		await apiClient.addWordToLearned(userId, wordId, wordLearnedStatus, ApiMethod.Put)
	} catch (e) {
		await apiClient.addWordToLearned(userId, wordId, wordLearnedStatus, ApiMethod.Post)
	}

	let isPageCompleted = false

	if (wordLearnedStatus) {
		isPageCompleted = await updateCompletedPages(words, group, page, userId)
		await apiClient.removeWordFromDifficult(userId, wordId, WordDifficulty.Normal)
	}

	return { wordId, wordLearnedStatus, isPageCompleted }
})

export const createNewStatistic = createAsyncThunk('textbook/createNewStatistic', async (arg, { getState }) => {
	const state = getState() as RootState
	const { userInfo } = state.auth
	if (!userInfo) {
		throw new Error('Not permitted')
	}

	const newStatistic = {
		learnedWords: 0,
		optional: {
			completedPages: { 0: { 0: false } },
		},
	}

	await apiClient.setNewStatistic(userInfo.userId, newStatistic)
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
export default textbookSlice.reducer
