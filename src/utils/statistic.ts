import { GameName } from '~/types/game'
import { ShortStatGame } from '~/types/statistic'

import apiClient from './api'
import { isTheSameDay } from './helpers'

const updateShortLearnedAmount = async (userId: string, amount: number) => {
	const existingStat = await apiClient.getUserStatistic(userId)
	const oldStat = existingStat.optional.shortStat
	const oldDate = new Date(oldStat.date)
	const curDate = new Date()

	if (isTheSameDay(oldDate, curDate)) {
		oldStat.learnedWords += amount
	} else {
		oldStat.date = curDate.getTime()
		oldStat.learnedWords = amount
	}

	const statToUpdate = {
		learnedWords: existingStat.learnedWords,
		optional: existingStat.optional,
	}

	await apiClient.setNewStatistic(userId, statToUpdate)
}

export { updateShortLearnedAmount }
