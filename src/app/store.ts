import { Action, ThunkAction, configureStore } from '@reduxjs/toolkit'

import audiocallReducer from '~/features/audiocall/audiocallSlice'
import authReducer from '~/features/auth/authSlice'
import sprintReducer from '~/features/sprint/sprintSlice'
import textbookReducer from '~/features/textbook/textbookSlice'

export const store = configureStore({
	reducer: {
		audiocall: audiocallReducer,
		sprint: sprintReducer,
		textbook: textbookReducer,
		auth: authReducer,
	},
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>
