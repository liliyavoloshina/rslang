import { useEffect, useState } from 'react'

import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { LongStat } from '~/types/statistic'

interface Data {
	name: string
	learnedWords: number
	newWords: number
}

export default function LongChartStat({ longStat }: { longStat: LongStat }) {
	const [data, setDate] = useState<Data[]>([])

	const transformData = (oldData: LongStat) => {
		const { learnedWords, newWords } = oldData
		const newData: Data[] = []

		const dates = Object.keys(oldData.learnedWords)
		// const testDate = new Date('2022-02-09T12:46:24.279Z').getTime()
		// const dates = [testDate, ...Object.keys(oldData.learnedWords)]

		dates.forEach(date => {
			const transformedDate = new Date(+date).toLocaleDateString()
			const totalLearnedWords = learnedWords[+date].length
			const totalNewWords = newWords[+date].length
			// const totalLearnedWords = learnedWords[+date] ? learnedWords[+date].length : 0
			// const totalNewWords = newWords[+date] ? newWords[+date].length : 0
			const newDate = { name: transformedDate, learnedWords: totalLearnedWords, newWords: totalNewWords }
			newData.push(newDate)
		})

		setDate(newData)
	}

	useEffect(() => {
		transformData(longStat)
	}, [])

	return (
		<ResponsiveContainer width="95%" height={400}>
			<LineChart
				width={500}
				height={300}
				data={data}
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
				<Line type="monotone" dataKey="newWords" stroke="#8884d8" activeDot={{ r: 8 }} />
				<Line type="monotone" dataKey="learnedWords" stroke="#82ca9d" />
			</LineChart>
		</ResponsiveContainer>
	)
}
