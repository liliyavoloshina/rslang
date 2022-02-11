import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { RootState } from '~/app/store'
import { UserStatistic, WordFieldsToUpdate } from '~/types/statistic'
import { UserWord, Word, WordDifficulty } from '~/types/word'
import apiClient from '~/utils/api'

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

	const { isLearned } = newFields
	const { difficulty } = newFields

	if (isLearned) {
		statisticToUpdate.optional.isLearned = isLearned
	}

	if (difficulty) {
		statisticToUpdate.difficulty = difficulty
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
