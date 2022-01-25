import React from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './views/Home'
import Textbook from './views/Textbook'

function App() {
	return (
		<div className="App">
			<Header />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="textbook" element={<Textbook />} />
			</Routes>
		</div>
	)
}

export default App
