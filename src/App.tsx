import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import Header from './components/layout/Header'
import Home from './views/Home'
import Textbook from './views/Textbook'
import AudioCall from './views/Audiocall'
import Sprint from './views/Sprint'
import Statistic from './views/Statistic'
import Login from './views/Login'
import Footer from './components/layout/Footer'
import theme from './utils/theme'
import { localStorageGetUser } from './utils/localStorage'
import { useAppDispatch } from './app/hooks'
import { setUser } from './features/auth/authSlice'

function App() {
	const location = useLocation().pathname
	const dispatch = useAppDispatch()

	const isFooter = !!(location !== '/audiocall' && location !== '/sprint')

	const user = localStorageGetUser()

	if (user && user.token) {
		dispatch(setUser(user))
	}

	return (
		<ThemeProvider theme={theme}>
			<Header />
			<main className="main">
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="textbook" element={<Textbook />} />
					<Route path="audiocall" element={<AudioCall />} />
					<Route path="sprint" element={<Sprint />} />
					<Route path="statistic" element={<Statistic />} />
					<Route path="login" element={<Login />} />
				</Routes>
			</main>
			{isFooter && <Footer />}
		</ThemeProvider>
	)
}

export default App
