import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { RootState } from '~/app/store'
import { UserWord, UserWordOptional, WordDifficulty } from '~/types/word'
import apiClient from '~/utils/api'
import { CORRECT_ANSWERS_TO_LEARN } from '~/utils/constants'

interface WordInfoToUpdate {
	wordId: string
	isCorrect: boolean
}

// export const updateWordStatistic = createAsyncThunk<any, WordInfoToUpdate, { state: RootState }>('statistic/updateWordStatistic', async ({ wordId, isCorrect }, { getState }) => {
// 	const state = getState()
// 	const { userInfo } = state.auth
// 	const { userId } = userInfo!

// 	let wordDataToUpdate: UserWord
// 	let isAlreadyExist = false

// 	try {
// 		const existingWord = await apiClient.getUserWord(userId, wordId)
// 		wordDataToUpdate = existingWord.userWord as UserWord
// 		isAlreadyExist = true
// 	} catch (e) {
// 		wordDataToUpdate = {
// 			difficulty: WordDifficulty.Normal,
// 			optional: {
// 				correctAnswers: 0,
// 				incorrectAnswers: 0,
// 				isLearned: false,
// 			},
// 		}
// 	}

// 	const { correctAnswers, incorrectAnswers, isLearned } = wordDataToUpdate.optional! as UserWordOptional

// 	if (isCorrect) {
// 		if (correctAnswers === CORRECT_ANSWERS_TO_LEARN) {
// 			wordDataToUpdate.optional!.isLearned = true
// 			wordDataToUpdate.difficulty = WordDifficulty.Normal
// 		} else {
// 			wordDataToUpdate.optional!.correctAnswers = correctAnswers + 1
// 		}
// 	} else {
// 		if (isLearned) {
// 			wordDataToUpdate.optional!.isLearned = false
// 		}

// 		wordDataToUpdate.optional!.incorrectAnswers = incorrectAnswers + 1
// 	}

// 	let updatedWord

// 	if (isAlreadyExist) {
// 		updatedWord = await apiClient.updateWordStatistic(userId, wordId, wordDataToUpdate)
// 	} else {
// 		updatedWord = await apiClient.addWordStatistic(userId, wordId, wordDataToUpdate)
// 	}

// 	return updatedWord
// })
// export const saveGameResult = createAsyncThunk('statistic/saveGameResult', async (arg: UserWord) => {
// 	const e
// })

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
