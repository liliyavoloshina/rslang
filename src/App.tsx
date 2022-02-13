import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import { ThemeProvider } from '@mui/material/styles'

import Footer from '~/components/layout/Footer'
import Header from '~/components/layout/Header'
import { Path, Router } from '~/components/router'
import { setUser } from '~/features/auth'
import { localStorageGetUser } from '~/utils/localStorage'
import theme from '~/utils/theme'

import { useAppDispatch } from './app/hooks'

function CheckAuth() {
	const dispatch = useAppDispatch()
	useEffect(() => {
		const user = localStorageGetUser()

		if (user && user.token) {
			dispatch(setUser(user))
		}
	}, [dispatch])

	return null
}

function App() {
	const location = useLocation().pathname

	const isFooter = [Path.AUDIOCALL, Path.SPRINT].every(pattern => !location.startsWith(pattern))

	return (
		<ThemeProvider theme={theme}>
			<CheckAuth />
			<Header />
			<main className="main">
				<Router />
			</main>
			{isFooter && <Footer />}
		</ThemeProvider>
	)
}

export default App
