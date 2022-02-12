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

const updateGameStatistic = async (userId: string, gameName: GameName, gameStatistic: ShortStatGame) => {
	const existingStat = await apiClient.getUserStatistic(userId)
	const oldStat = existingStat.optional.shortStat
	const oldDate = new Date(oldStat.date)
	const curDate = new Date()

	if (isTheSameDay(oldDate, curDate)) {
		oldStat.games[gameName].newWords += gameStatistic.newWords
		oldStat.games[gameName].correctWordsPercent.push(...gameStatistic.correctWordsPercent)

		if (oldStat.games[gameName].longestSeries < gameStatistic.longestSeries) {
			oldStat.games[gameName].longestSeries = gameStatistic.longestSeries
		}
	} else {
		oldStat.date = curDate.getTime()
		oldStat.games[gameName] = gameStatistic
	}

	// const statToUpdate = {
	// 	learnedWords: existingStat.learnedWords,
	// 	optional: existingStat.optional,
	// }

	// await apiClient.setNewStatistic(userId, statToUpdate)
}

export { updateGameStatistic, updateShortLearnedAmount }
