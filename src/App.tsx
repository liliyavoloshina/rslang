import { Route, Routes, useLocation } from 'react-router-dom'

import { ThemeProvider } from '@mui/material/styles'

import Footer from '~/components/layout/Footer'
import Header from '~/components/layout/Header'
import { setUser } from '~/features/auth'
import { localStorageGetUser } from '~/utils/localStorage'
import theme from '~/utils/theme'
import AudioCall from '~/views/Audiocall'
import Home from '~/views/Home'
import SignIn from '~/views/SignIn'
import SignUp from '~/views/SignUp'
import Sprint from '~/views/Sprint'
import Statistic from '~/views/Statistic'
import Textbook from '~/views/Textbook'

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
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="textbook" element={<Textbook />} />
					<Route path="audiocall" element={<AudioCall />} />
					<Route path="sprint" element={<Sprint />} />
					<Route path="statistic" element={<Statistic />} />
					<Route path="signin" element={<SignIn />} />
					<Route path="signup" element={<SignUp />} />
				</Routes>
			</main>
			{isFooter && <Footer />}
		</ThemeProvider>
	)
}

export default App
