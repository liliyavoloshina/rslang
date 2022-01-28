import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
// eslint-disable-next-line import/no-cycle
import counterReducer from '../features/counter/counterSlice'
// eslint-disable-next-line import/no-cycle
import audiocallReducer from '../features/audiocall/audiocallSlice'

export const store = configureStore({
	reducer: {
		counter: counterReducer,
		audiocall: audiocallReducer,
	},
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>
