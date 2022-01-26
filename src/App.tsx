import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import Header from './components/layout/Header'
import Home from './views/Home'
import Textbook from './views/Textbook'
import AudioCall from './views/Audiocall'
import Sprint from './views/Sprint'
import Statistic from './views/Statistic'
import Footer from './components/layout/Footer'
import theme from './utils/theme'

function App() {
	const location = useLocation().pathname

	const isFooter = !!(location !== '/audiocall' && location !== '/sprint')

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
				</Routes>
			</main>
			{isFooter && <Footer />}
		</ThemeProvider>
	)
}

export default App
