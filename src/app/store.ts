import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
// eslint-disable-next-line import/no-cycle
import audiocallReducer from '../features/audiocall/audiocallSlice'
// eslint-disable-next-line import/no-cycle
import textbookReducer from '../features/textbook/textbookSlice'

export const store = configureStore({
	reducer: {
		audiocall: audiocallReducer,
		textbook: textbookReducer,
	},
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>
