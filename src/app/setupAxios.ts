import axios, { AxiosRequestHeaders } from 'axios'

import { Path } from '~/components/router'
import { TokenResponse } from '~/types/api'
import { DOMAIN_URL } from '~/utils/constants'
import { localStorageGetUser, localStorageSetUser } from '~/utils/localStorage'

axios.defaults.baseURL = DOMAIN_URL

axios.interceptors.request.use(async requestConfig => {
	const userInfo = localStorageGetUser()

	const headers: AxiosRequestHeaders = {
		...requestConfig.headers,
		'Content-Type': 'application/json',
	}

	if (userInfo && userInfo.token) {
		const singinDate = userInfo.expirationDate!
		const currentDate = new Date().getTime()
		const isExpired = singinDate < currentDate

		if (isExpired) {
			const refreshConfig: AxiosRequestHeaders = {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${userInfo.refreshToken}`,
			}
			const { data: token } = await axios.get<TokenResponse>(`users/${userInfo.userId}/tokens`, refreshConfig)
			const updatedUserInfo = {
				name: token.name,
				refreshToken: token.refreshToken,
				token: token.token,
				userId: token.userId,
			}

			localStorageSetUser(updatedUserInfo)

			headers.Authorization = `Bearer ${updatedUserInfo.token}`
		} else {
			headers.Authorization = `Bearer ${userInfo.token}`
		}
	}

	return { ...requestConfig, headers }
})

axios.interceptors.response.use(response => {
	if (response.status === 401) {
		window.location.hash = Path.LOGOFF
	}
	return response
})
