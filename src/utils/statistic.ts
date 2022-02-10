import { UserWord, UserWordOptional, WordDifficulty } from '~/types/word'

import apiClient from './api'
import { CORRECT_ANSWERS_TO_LEARN } from './constants'

const updateWordStatistic = async (userId: string, { wordId, isCorrect }: { wordId: string; isCorrect: boolean }) => {
	let wordDataToUpdate: UserWord
	let isAlreadyExist = false

	try {
		const existingStatistic = await apiClient.getUserWord(userId, wordId)
		isAlreadyExist = true
		wordDataToUpdate = {
			difficulty: existingStatistic.difficulty,
			optional: existingStatistic.optional,
		}
	} catch (e) {
		wordDataToUpdate = {
			difficulty: WordDifficulty.Normal,
			optional: {
				correctAnswers: 0,
				incorrectAnswers: 0,
				isLearned: false,
			},
		}
	}

	const { correctAnswers, incorrectAnswers, isLearned } = wordDataToUpdate.optional! as UserWordOptional

	if (isCorrect) {
		if (correctAnswers === CORRECT_ANSWERS_TO_LEARN) {
			wordDataToUpdate.optional!.isLearned = true
			wordDataToUpdate.difficulty = WordDifficulty.Normal
		} else {
			wordDataToUpdate.optional!.correctAnswers = correctAnswers + 1
		}
	} else {
		if (isLearned) {
			wordDataToUpdate.optional!.isLearned = false
		}

		wordDataToUpdate.optional!.incorrectAnswers = incorrectAnswers + 1
	}

	let updatedWord

	if (isAlreadyExist) {
		updatedWord = await apiClient.updateWordStatistic(userId, wordId, wordDataToUpdate)
	} else {
		updatedWord = await apiClient.addWordStatistic(userId, wordId, wordDataToUpdate)
	}

	return updatedWord
}

export { updateWordStatistic }
