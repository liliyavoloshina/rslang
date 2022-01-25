import React from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './views/Home'
import Textbook from './views/Textbook'
import AudioCall from './views/Audiocall'
import Sprint from './views/Sprint'
import Statistic from './views/Statistic'

function App() {
	return (
		<div className="App">
			<Header />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="textbook" element={<Textbook />} />
				<Route path="audiocall" element={<AudioCall />} />
				<Route path="sprint" element={<Sprint />} />
				<Route path="statistic" element={<Statistic />} />
			</Routes>
		</div>
	)
}

export default App
