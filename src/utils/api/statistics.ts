import { UserStatistic } from '~/types/api'

import { get, put } from './base'

export const setNewStatistic = (userId: string, newStatistic: UserStatistic) => put<UserStatistic>(`users/${userId}/statistics`, newStatistic)

export const getUserStatistic = (userId: string) => get<UserStatistic>(`users/${userId}/statistics`)

export const updateCompletedPages = (userId: string, updatedStatistic: UserStatistic['optional']) =>
	put<UserStatistic>(`users/${userId}/statistics`, { optional: updatedStatistic })
