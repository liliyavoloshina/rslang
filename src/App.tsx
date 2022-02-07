import { useLocation } from 'react-router-dom'

import { ThemeProvider } from '@mui/material/styles'

import Footer from '~/components/layout/Footer'
import Header from '~/components/layout/Header'
import { Router } from '~/components/router'
import { setUser } from '~/features/auth'
import { localStorageGetUser } from '~/utils/localStorage'
import theme from '~/utils/theme'

import { useAppDispatch } from './app/hooks'

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
				<Router />
			</main>
			{isFooter && <Footer />}
		</ThemeProvider>
	)
}

export default App
