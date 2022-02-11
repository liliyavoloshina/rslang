import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { RootState } from '~/app/store'
import { UserStatistic, WordFieldsToUpdate } from '~/types/statistic'
import { UserWord, Word, WordDifficulty } from '~/types/word'
import apiClient from '~/utils/api'
import { CORRECT_ANSWERS_TO_LEARN_DIFFICULT, CORRECT_ANSWERS_TO_LEARN_NORMAL } from '~/utils/constants'

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

interface StatisticState {
	test: boolean
}

const initialState: StatisticState = {
	test: false,
}

export const statisticSlice = createSlice({
	name: 'statistic',
	initialState,
	reducers: {},
})

export default statisticSlice.reducer
