import { useEffect } from 'react'

import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { LongStat } from '~/types/statistic'

interface Data {
	name: string
	learnedWords: number
	newWords: number
}

export default function LongChartStat({ longStat }: { longStat: LongStat }) {
	const transformData = (oldData: LongStat) => {
		const { learnedWords, newWords } = oldData
		const newData: Data[] = []

		const dates = Object.keys(oldData.learnedWords)

		dates.forEach(date => {
			const transformedDate = new Date(+date).toLocaleDateString()
			const totalLearnedWords = learnedWords[+date].length
			const totalNewWords = newWords[+date].length
			const newDate = { name: transformedDate, learnedWords: totalLearnedWords, newWords: totalNewWords }
			newData.push(newDate)
		})

		return newData
	}

	useEffect(() => {
		transformData(longStat)
	}, [])

	return (
		<ResponsiveContainer width="95%" height={400}>
			<LineChart
				width={500}
				height={300}
				data={transformData(longStat)}
				margin={{
					top: 5,
					right: 30,
					left: 20,
					bottom: 5,
				}}
			>
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis dataKey="name" />
				<YAxis />
				<Tooltip />
				<Legend />
				<Line type="monotone" name="New words" dataKey="newWords" stroke="#8884d8" activeDot={{ r: 8 }} />
				<Line type="monotone" name="Learned words" dataKey="learnedWords" stroke="#82ca9d" />
			</LineChart>
		</ResponsiveContainer>
	)
}
