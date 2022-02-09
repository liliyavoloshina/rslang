import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { SignInData, SignUpData, UserInfo } from '~/types/auth'
import apiClient from '~/utils/api'
import { handleError } from '~/utils/helpers'
import { localStorageClear, localStorageSetUser } from '~/utils/localStorage'

export const signIn = createAsyncThunk('auth/signin', async (arg: SignInData, { rejectWithValue }) => {
	try {
		const response = await apiClient.signIn(arg)
		return response
	} catch (e) {
		const errorToShow = handleError(e)
		return rejectWithValue(errorToShow)
	}
})

export const signUp = createAsyncThunk('auth/signup', async (arg: SignUpData, { rejectWithValue }) => {
	try {
		await apiClient.signUp(arg)

		return { email: arg.email, password: arg.password }
	} catch (e) {
		const errorToShow = handleError(e)
		return rejectWithValue(errorToShow)
	}
})

interface AuthState {
	userInfo: UserInfo | undefined
	isLoggedIn: boolean
	isSignUpInProcess: boolean
	signUpError: string
	signInError: string
	loading: boolean
}

const initialState: AuthState = {
	userInfo: undefined,
	isLoggedIn: false,
	isSignUpInProcess: false,
	signUpError: '',
	signInError: '',
	loading: false,
}

export const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		clearError: state => {
			state.signInError = ''
			state.signUpError = ''
		},
		setUser: (state, action) => {
			state.isLoggedIn = true
			state.userInfo = action.payload
		},
		signOut: state => {
			state.userInfo = undefined
			state.isLoggedIn = false
			localStorageClear()
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
				state.signInError = ''
				state.signUpError = ''
				state.isSignUpInProcess = false

				const currentTime = new Date()
				currentTime.setHours(currentTime.getHours() + 3)
				const expirationDate = currentTime.getTime()

				const infoToStore = {
					token,
					userId,
					name,
					refreshToken,
					expirationDate,
				}
				localStorageSetUser(infoToStore)
			})
			.addCase(signIn.rejected, (state, action) => {
				state.signInError = action.payload as string
				state.loading = false
			})
			.addCase(signUp.pending, state => {
				state.loading = true
			})
			.addCase(signUp.fulfilled, state => {
				state.signUpError = ''
				state.isSignUpInProcess = true
				state.loading = false
			})
			.addCase(signUp.rejected, (state, action) => {
				state.signUpError = action.payload as string
				state.isSignUpInProcess = false
				state.loading = false
			})
	},
})

export const { clearError, setUser, signOut } = authSlice.actions
export default authSlice.reducer
