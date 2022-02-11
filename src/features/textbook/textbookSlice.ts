import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { RootState } from '~/app/store'
import { CompletedPages } from '~/types/api'
import { Word, WordDifficulty } from '~/types/word'
import {
	addWordToDifficult,
	addWordToLearned,
	getAllWords,
	getDifficultWords,
	getUserStatistic,
	getUserWords,
	removeWordFromDifficult,
	setNewStatistic,
	updateCompletedPages as updateCompletedPagesApi,
} from '~/utils/api'
import { WORD_PER_PAGE_AMOUNT } from '~/utils/constants'
import { localStorageSetPagination } from '~/utils/localStorage'
import { updateShortLearnedAmount } from '~/utils/statistic'

import { updateWordStatistic } from '../statistic/statisticSlice'

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

	const learnedOrDifficultWord = words.filter(word => word.userWord?.difficulty === WordDifficulty.Difficult || !!word.userWord?.optional?.isLearned)
	isPageCompleted = learnedOrDifficultWord.length + 1 === WORD_PER_PAGE_AMOUNT
	const currentStatistic = await getUserStatistic(userId)

	const newGroupField = {
		...currentStatistic.optional.completedPages[group],
	}
	newGroupField[page] = isPageCompleted

	const updatedOptional = { ...currentStatistic.optional }
	updatedOptional.completedPages[group] = newGroupField

	await updateCompletedPagesApi(userId, updatedOptional)

	return isPageCompleted
}

export const fetchTextbookWords = createAsyncThunk<Word[], void, { state: RootState }>('textbook/fetchWords', async (_arg, { getState }) => {
	const state = getState()
	const { page, group } = state.textbook
	const { userInfo } = state.auth

	if (userInfo) {
		const response = await getUserWords(userInfo.userId, group, page)

		// TODO: check if this map function is really needed here
		// eslint-disable-next-line no-underscore-dangle
		return response[0].paginatedResults.map(word => ({ ...word, id: word._id! }))
	}

	return getAllWords(group, page)
})

export const getCompletedPages = createAsyncThunk<CompletedPages, void, { state: RootState }>('textbook/getCompletedPages', async (arg, { getState }) => {
	const state = getState()
	const { userInfo } = state.auth
	if (!userInfo) {
		throw new Error('Not permitted')
	}

	const res = (await getUserStatistic(userInfo.userId)) || {}
	return res.optional.completedPages
})

export const fetchDifficultWords = createAsyncThunk<Word[], void, { state: RootState }>('textbook/fetchDifficultWords', async (arg, { getState }) => {
	const state = getState()
	const { userInfo } = state.auth
	if (!userInfo) {
		throw new Error('Not permitted')
	}

	const response = await getDifficultWords(userInfo.userId as string)
	// TODO: refactor duplicated code
	// eslint-disable-next-line no-underscore-dangle
	return response[0].paginatedResults.map(word => ({ ...word, id: word._id! }))
})

export const changeWordDifficulty = createAsyncThunk('textbook/changeWordDifficulty', async (arg: { word: Word; difficulty: WordDifficulty }, { getState }) => {
	const state = getState() as RootState
	const { userInfo } = state.auth

	if (!userInfo) {
		throw new Error('Not permitted')
	}

	const { words, group, page } = state.textbook
	const { word, difficulty } = arg
	const { userId } = userInfo
	const wordId = word.id

	let isPageCompleted = false

	if (difficulty === WordDifficulty.Normal) {
		await removeWordFromDifficult(userId, wordId, difficulty)
	} else {
		await addWordToDifficult(userId, wordId, difficulty)
		isPageCompleted = await updateCompletedPages(words, group, page, userId)
	}

	return { wordId, difficulty, isPageCompleted }
})

export const changeWordLearnedStatus = createAsyncThunk('textbook/changeWordLearnedStatus', async (arg: { word: Word; wordLearnedStatus: boolean }, { getState }) => {
	const state = getState() as RootState
	const { userInfo } = state.auth

	if (!userInfo) {
		throw new Error('Not permitted')
	}

	const { words, page, group } = state.textbook
	const { word, wordLearnedStatus } = arg
	const { userId } = userInfo
	const { id: wordId } = word

	try {
		await addWordToLearned(userId, wordId, wordLearnedStatus, true)
	} catch (e) {
		await addWordToLearned(userId, wordId, wordLearnedStatus, false)
	}

	let isPageCompleted = false

	if (wordLearnedStatus) {
		isPageCompleted = await updateCompletedPages(words, group, page, userId)
		await removeWordFromDifficult(userId, wordId, WordDifficulty.Normal)
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

	await setNewStatistic(userInfo.userId, newStatistic)
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
								optional: { correctAnswers: 0, incorrectAnswers: 0, correctStrike: 0, isLearned: false },
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
								optional: { ...updatedWord.userWord.optional!, isLearned: wordLearnedStatus },
							}
						} else {
							updatedWord.userWord = {
								difficulty: WordDifficulty.Normal,
								optional: { correctAnswers: 0, incorrectAnswers: 0, correctStrike: 0, isLearned: wordLearnedStatus },
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
								optional: word.userWord!.optional,
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
