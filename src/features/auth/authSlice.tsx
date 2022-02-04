import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
// eslint-disable-next-line import/no-cycle
import { RootState } from '../../app/store'
import { SignInData, SignUpData, UserInfo } from '../../types/auth'
import apiClient from '../../utils/api'
import { handleError } from '../../utils/helpers'
import { localStorageRemoveUser, localStorageSetUser } from '../../utils/localStorage'

export const signIn = createAsyncThunk('auth/signin', async (arg: SignInData) => {
	const response = await apiClient.signIn(arg)
	return response
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
	userInfo: UserInfo | Record<string, unknown>
	signInInfo: SignInData | Record<string, unknown>
	isLoggedIn: boolean
	signUpError: string
	isSignInFailed: boolean
	isSignUpFailed: boolean
	loading: boolean
}

const initialState: AuthState = {
	userInfo: {},
	signInInfo: {},
	isLoggedIn: false,
	signUpError: '',
	isSignInFailed: false,
	isSignUpFailed: false,
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
		signOut: state => {
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
			.addCase(signUp.pending, state => {
				state.loading = true
			})
			.addCase(signUp.fulfilled, (state, action) => {
				state.signInInfo = action.payload
			})
			.addCase(signUp.rejected, (state, action) => {
				state.signUpError = action.payload as string
				state.loading = false
			})
	},
})

export const { clearError, setUser, signOut } = authSlice.actions
export const selectAuthLoading = (state: RootState) => state.auth.loading
export const selectAuthIsLoggedIn = (state: RootState) => state.auth.isLoggedIn
export const selectAuthIsSignInFailed = (state: RootState) => state.auth.isSignInFailed
export const selectAuthUserInfo = (state: RootState) => state.auth.userInfo
export const selectAuthSignUpError = (state: RootState) => state.auth.signUpError
export default authSlice.reducer
