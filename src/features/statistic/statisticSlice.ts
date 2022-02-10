import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { RootState } from '~/app/store'
import { UserStatistic } from '~/types/statistic'
import apiClient from '~/utils/api'

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
				words: {
					newWords: 0,
					learnedWords: 0,
					correctWordsPercent: [],
				},
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
