import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
// eslint-disable-next-line import/no-cycle
import { RootState } from '../../app/store'
import { SignInData, UserInfo } from '../../types/auth'
import apiClient from '../../utils/api'
import { localStorageRemoveUser, localStorageSetUser } from '../../utils/localStorage'

// export const login = createAsyncThunk('auth/login', async (arg, { getState }) => {
// 	console.log(login)
// })

export const signIn = createAsyncThunk('auth/signin', async (arg: SignInData) => {
	const response = await apiClient.signIn(arg)
	return response
})

interface AuthState {
	userInfo: UserInfo | Record<string, unknown>
	isLoggedIn: boolean
	isSignInFailed: boolean
	loading: boolean
}

const initialState: AuthState = {
	userInfo: {},
	isLoggedIn: false,
	isSignInFailed: false,
	loading: false,
}

export const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		clearError: state => {
			state.isSignInFailed = false
		},
		setUser: (state, action) => {
			state.isLoggedIn = true
			state.userInfo = action.payload
		},
		logOut: state => {
			state.userInfo = {}
			state.isLoggedIn = false
			localStorageRemoveUser()
		},
	},
	extraReducers: builder => {
		builder
			.addCase(signIn.pending, state => {
				state.loading = true
			})
			.addCase(signIn.fulfilled, (state, action) => {
				const { token, refreshToken, userId, name } = action.payload
				state.userInfo = { token, userId, name, refreshToken }
				state.loading = false
				state.isLoggedIn = true
				state.isSignInFailed = false

				const infoToStore = {
					token,
					userId,
					name,
					refreshToken,
				}
				localStorageSetUser(infoToStore)
			})
			.addCase(signIn.rejected, state => {
				state.isSignInFailed = true
				state.loading = false
			})
		// .addCase(login.pending, state => {
		// 	state.loading = true
		// })
		// .addCase(login.fulfilled, (state, action) => {
		// 	const { accessToken } = action.payload
		// 	state.token = accessToken
		// 	state.userData = user
		// 	state.loading = false
		// })
		// .addCase(login.rejected, (state, action) => {
		// 	state.loading = false
		// })
	},
})

export const { clearError, setUser, logOut } = authSlice.actions
export const selectAuthLoading = (state: RootState) => state.auth.loading
export const selectAuthIsLoggedIn = (state: RootState) => state.auth.isLoggedIn
export const selectAuthIsSignInFailed = (state: RootState) => state.auth.isSignInFailed
export const selectAuthUserInfo = (state: RootState) => state.auth.userInfo
export default authSlice.reducer
