/* eslint-disable no-await-in-loop */

/* eslint-disable guard-for-in */

/* eslint-disable no-restricted-syntax */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { RootState } from '~/app/store'
import { GameName } from '~/types/game'
import { CompletedPages, UserStatistic, WordFieldsToUpdate } from '~/types/statistic'
import { UserWord, Word, WordDifficulty } from '~/types/word'
import apiClient from '~/utils/api'
import { CORRECT_ANSWERS_TO_LEARN_DIFFICULT, CORRECT_ANSWERS_TO_LEARN_NORMAL, WORD_PER_PAGE_AMOUNT } from '~/utils/constants'

const initialState: UserStatistic = {
	learnedWords: 0,
	optional: {
		completedPages: { 0: { 0: false } },
		shortStat: {
			date: 0,
			games: {
				audiocall: {
					newWords: 0,
					correctWordsPercent: [],
					longestSeries: 0,
				},
				sprint: {
					newWords: 0,
					correctWordsPercent: [],
					longestSeries: 0,
				},
			},
			learnedWords: 0,
		},
	},
}

const updateWordCorrectAnswers = (difficulty: WordDifficulty, oldAnswers: number, correctStrike: number) => {
	let isLearned = false

	if (difficulty === WordDifficulty.Normal && correctStrike === CORRECT_ANSWERS_TO_LEARN_NORMAL - 1) {
		isLearned = true
		// TODO: update short statictic learnedWords
	}

	if (difficulty === WordDifficulty.Difficult && correctStrike === CORRECT_ANSWERS_TO_LEARN_DIFFICULT - 1) {
		isLearned = true
		// TODO: update short statictic learnedWords
	}

	oldAnswers += 1
	correctStrike += 1

	return { correctAnswers: oldAnswers, isLearned, correctStrike }
}

const updateWordIncorrectAnswers = (oldAnswers: number) => {
	const correctStrike = 0
	const isLearned = false
	oldAnswers += 1
	return { incorrectAnswers: oldAnswers, isLearned, correctStrike }
}

export const fetchUserStatistic = createAsyncThunk<UserStatistic, void, { state: RootState }>('statistic/fetchUserStatistic', async (arg, { getState }) => {
	const state = getState()
	const { userInfo } = state.auth

	if (!userInfo) {
		throw new Error('Not permitted')
	}

	const res = await apiClient.getUserStatistic(userInfo.userId)
	return res
})

const transformOptionalStatistic = (currentStatistic: UserStatistic, group: number, page: number, isPageCompleted: boolean) => {
	const newGroupField = JSON.parse(JSON.stringify({ ...currentStatistic.optional.completedPages[group] }))
	newGroupField[page] = isPageCompleted

	const updatedOptional = JSON.parse(JSON.stringify(currentStatistic.optional))

	updatedOptional.completedPages[group] = newGroupField

	console.log(updatedOptional, 'updatedOptional')

	return updatedOptional
}

const transformExistingCompletedPages = (completedPages: CompletedPages, group: number, page: number, isPageCompleted: boolean) => {
	const newGroupField = JSON.parse(JSON.stringify({ ...completedPages[group] }))
	newGroupField[page] = isPageCompleted

	const updatedCompleted = JSON.parse(JSON.stringify(completedPages))

	updatedCompleted[group] = newGroupField

	return updatedCompleted
}

export const sendUpdatedStatistic = createAsyncThunk('textbook/sendUpdatedStatistic', async (arg, { getState }) => {
	const state = getState() as RootState
	const statisticToSend = state.statistic
	const { userId } = state.auth.userInfo!

	await apiClient.setNewStatistic(userId, statisticToSend)
})

// updates completed pages after game
export const updateCompletedPagesAfterGame = createAsyncThunk<{ updatedCompletedPages: CompletedPages }, { correctWords: Word[]; incorrectWords: Word[] }, { state: RootState }>(
	'statistic/updateCompletedPagesAfterGame',
	async ({ correctWords, incorrectWords }, { getState }) => {
		const state = getState()
		const { userInfo } = state.auth
		const currentStatistic = state.statistic
		const userId = userInfo!.userId as string

		interface PagesAndGroups {
			[key: number]: Set<number>
		}

		// get all pages and keys value
		const pagesAndGroupCorrect: PagesAndGroups = {}
		const pagesAndGroupIncorrect: PagesAndGroups = {}

		correctWords.forEach(word => {
			pagesAndGroupCorrect[word.group] = pagesAndGroupCorrect[word.group] ? pagesAndGroupCorrect[word.group].add(word.page) : new Set<number>().add(word.page)
		})

		incorrectWords.forEach(word => {
			pagesAndGroupIncorrect[word.group] = pagesAndGroupIncorrect[word.group] ? pagesAndGroupIncorrect[word.group].add(word.page) : new Set<number>().add(word.page)
		})

		let updatedCompletedPages

		// update completed pages statistic
		if (Object.keys(pagesAndGroupCorrect).length > 0) {
			for (const group in pagesAndGroupCorrect) {
				const pagesToCheck = pagesAndGroupCorrect[group]
				for (const page of pagesToCheck) {
					// check if all words in this group and page learned
					const completedResponse = await apiClient.getLearnedWordsByGroup(userId, +group, +page)
					const isCompleted = completedResponse[0].paginatedResults.length === WORD_PER_PAGE_AMOUNT

					if (isCompleted) {
						const updatedOptional = transformExistingCompletedPages(updatedCompletedPages ?? currentStatistic.optional.completedPages, +group, +page, true)
						updatedCompletedPages = updatedOptional
						// await apiClient.updateCompletedPages(userId, updatedOptional)
					} else {
						const updatedOptional = transformExistingCompletedPages(updatedCompletedPages ?? currentStatistic.optional.completedPages, +group, +page, false)
						updatedCompletedPages = updatedOptional
					}
				}
			}
		}

		// update not completed pages statistic
		if (Object.keys(pagesAndGroupIncorrect).length > 0) {
			for (const group in pagesAndGroupIncorrect) {
				const pagesToCheck = pagesAndGroupIncorrect[group]
				for (const page of pagesToCheck) {
					const updatedOptional = transformExistingCompletedPages(updatedCompletedPages ?? currentStatistic.optional.completedPages, +group, +page, false)
					updatedCompletedPages = updatedOptional
				}
			}
		}

		return { updatedCompletedPages }
	}
)

// when check word as learned or difficult from card
export const updateCompletedPages = createAsyncThunk<{ isPageCompleted: boolean; page: number; group: number }, { page: number; group: number }, { state: RootState }>(
	'statistic/updateCompletedPages',
	async ({ page, group }, { getState }) => {
		const state = getState()
		const { words } = state.textbook
		const currentStatistic = state.statistic
		const userId = state.auth.userInfo?.userId as string

		let isPageCompleted = false

		const learnedOrDifficultWord = words.filter(word => word.userWord?.difficulty === WordDifficulty.Difficult || !!word.userWord?.optional?.isLearned)
		isPageCompleted = learnedOrDifficultWord.length === WORD_PER_PAGE_AMOUNT

		const updatedOptional = transformOptionalStatistic(currentStatistic, group, page, isPageCompleted)

		await apiClient.updateCompletedPages(userId, updatedOptional)

		return { isPageCompleted, page, group }
	}
)

// update single word statistic (need to pass fileds that needed to be updated)
export const updateWordStatistic = async (userId: string, wordToUpdate: Word, newFields: WordFieldsToUpdate) => {
	const word = JSON.parse(JSON.stringify(wordToUpdate))
	const isStatisticExist = !!word.userWord
	const wordId = word.id

	let statisticToUpdate: UserWord

	if (isStatisticExist) {
		statisticToUpdate = word.userWord!
	} else {
		statisticToUpdate = {
			difficulty: WordDifficulty.Normal,
			optional: {
				correctAnswers: 0,
				incorrectAnswers: 0,
				correctStrike: 0,
				isLearned: false,
			},
		}
	}

	const { difficulty } = statisticToUpdate
	const { correctAnswers, correctStrike, incorrectAnswers } = statisticToUpdate.optional
	const { isLearned, difficulty: newDifficulty, correctAnswers: newCorrectAnswers, incorrectAnswers: newIncorrectAnswers } = newFields

	if (isLearned) {
		statisticToUpdate.optional.isLearned = isLearned
		statisticToUpdate.difficulty = WordDifficulty.Normal
	}

	if (newDifficulty) {
		statisticToUpdate.difficulty = newDifficulty
	}

	if (newCorrectAnswers) {
		const updatedFields = updateWordCorrectAnswers(difficulty, correctAnswers, correctStrike)

		statisticToUpdate.optional = {
			...statisticToUpdate.optional,
			...updatedFields,
		}

		if (updatedFields.isLearned) {
			statisticToUpdate.difficulty = WordDifficulty.Normal
		}
	}

	if (newIncorrectAnswers) {
		const updatedFields = updateWordIncorrectAnswers(incorrectAnswers)

		statisticToUpdate.optional = {
			...statisticToUpdate.optional,
			...updatedFields,
		}
	}

	if (isStatisticExist) {
		// update existing stat
		await apiClient.updateWordStatistic(userId, wordId, statisticToUpdate)
	} else {
		// create new stat
		await apiClient.addWordStatistic(userId, wordId, statisticToUpdate)
	}
}

// creates and pushes new statistic when user signed up
export const createNewStatistic = createAsyncThunk('textbook/createNewStatistic', async (arg, { getState }) => {
	const state = getState() as RootState
	const { userInfo } = state.auth
	if (!userInfo) {
		throw new Error('Not permitted')
	}

	const date = new Date().getTime()

	const newStatistic: UserStatistic = {
		learnedWords: 0,
		optional: {
			completedPages: { 0: { 0: false } },
			shortStat: {
				date,
				games: {
					audiocall: {
						newWords: 0,
						correctWordsPercent: [],
						longestSeries: 0,
					},
					sprint: {
						newWords: 0,
						correctWordsPercent: [],
						longestSeries: 0,
					},
				},
				learnedWords: 0,
			},
		},
	}

	await apiClient.setNewStatistic(userInfo.userId, newStatistic)
})

export const statisticSlice = createSlice({
	name: 'statistic',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(updateCompletedPagesAfterGame.fulfilled, (state, action) => {
				const { updatedCompletedPages } = action.payload

				state.optional.completedPages = updatedCompletedPages
			})
			.addCase(fetchUserStatistic.fulfilled, (state, action) => {
				state.optional = { ...action.payload.optional }
			})
			.addCase(updateCompletedPages.fulfilled, (state, action) => {
				const { isPageCompleted, page, group } = action.payload

				if (state.optional.completedPages[group]) {
					state.optional.completedPages[group][page] = isPageCompleted
				} else {
					state.optional.completedPages[group] = { [page]: isPageCompleted }
				}
			})
	},
})

export default statisticSlice.reducer
