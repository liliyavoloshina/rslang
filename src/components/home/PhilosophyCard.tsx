import { ReactNode } from 'react'

import { Card, CardContent, Typography } from '@mui/material'

interface PhilosophyCardProps {
	title: string
	desc: string
	textColor: string
}

const PHILOSOPHY_COLORS: Record<string, string> = {
	textbook: '#feca02',
	dictionary: '#fe7ec9',
	statistic: '#38c4c1',
	games: '#488df4',
}

export default function PhilosophyCard({ title, desc, textColor }: PhilosophyCardProps) {
	return (
		<Card sx={{ maxWidth: 270, height: 215, textAlign: 'center', bgColor: '#38c4c1' }}>
			<CardContent>
				<Typography gutterBottom variant="h5" component="div" sx={{ color: `${PHILOSOPHY_COLORS[textColor]}` }}>
					{title}
				</Typography>
				<Typography variant="body2" color="text.secondary" fontStyle="italic">
					{desc}
				</Typography>
			</CardContent>
		</Card>
	)
}
