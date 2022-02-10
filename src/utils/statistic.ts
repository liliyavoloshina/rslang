import { GameName } from '~/types/game'
import { GameStatistic } from '~/types/statistic'
import { UserWord, UserWordOptional, WordDifficulty } from '~/types/word'

import apiClient from './api'
import { CORRECT_ANSWERS_TO_LEARN_DIFFICULT, CORRECT_ANSWERS_TO_LEARN_NORMAL } from './constants'

const updateWordStatistic = async (userId: string, { wordId, isCorrect }: { wordId: string; isCorrect: boolean }) => {
	let wordDataToUpdate: UserWord
	let isAlreadyExist = false

	try {
		const existingStatistic = await apiClient.getUserWord(userId, wordId)
		isAlreadyExist = true
		wordDataToUpdate = {
			difficulty: existingStatistic.difficulty,
			optional: existingStatistic.optional || { correctAnswers: 0, incorrectAnswers: 0, correctStrike: 0, isLearned: false },
		}
	} catch (e) {
		wordDataToUpdate = {
			difficulty: WordDifficulty.Normal,
			optional: {
				correctAnswers: 0,
				incorrectAnswers: 0,
				correctStrike: 0,
				isLearned: false,
			},
		}
	}

	const { correctAnswers, incorrectAnswers, correctStrike, isLearned } = wordDataToUpdate.optional! as UserWordOptional

	if (isCorrect) {
		if (wordDataToUpdate.difficulty === WordDifficulty.Normal) {
			if (correctStrike === CORRECT_ANSWERS_TO_LEARN_NORMAL - 1) {
				wordDataToUpdate.optional!.isLearned = true
			} else {
				wordDataToUpdate.optional!.correctAnswers = correctAnswers + 1
			}
		}

		if (wordDataToUpdate.difficulty === WordDifficulty.Difficult) {
			if (correctStrike === CORRECT_ANSWERS_TO_LEARN_DIFFICULT - 1) {
				wordDataToUpdate.optional!.isLearned = true
			} else {
				wordDataToUpdate.optional!.correctAnswers = correctAnswers + 1
			}
		}

		wordDataToUpdate.optional!.correctAnswers = correctAnswers + 1
		wordDataToUpdate.optional!.correctStrike = correctStrike + 1
	} else {
		if (isLearned) {
			wordDataToUpdate.optional!.isLearned = false
		}

		wordDataToUpdate.optional!.incorrectAnswers = incorrectAnswers + 1
		wordDataToUpdate.optional!.correctStrike = 0
	}

	let updatedWord

	if (isAlreadyExist) {
		updatedWord = await apiClient.updateWordStatistic(userId, wordId, wordDataToUpdate)
	} else {
		updatedWord = await apiClient.addWordStatistic(userId, wordId, wordDataToUpdate)
	}

	return updatedWord
}

const updateGameStatistic = async (userId: string, gameName: GameName, gameStatistic: GameStatistic) => {
	const existingStat = await apiClient.getUserStatistic(userId)
	console.log(existingStat)
}

export { updateWordStatistic, updateGameStatistic }
