import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import apiClient from '~/utils/api'

export const saveGameResult = createAsyncThunk('statistic/saveGameResult', async arg => {})

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
