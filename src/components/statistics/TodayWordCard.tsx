import React from 'react'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

interface TodayWordCardProps {
	value: string
	text: string
}

export function TodayWordCard({ value, text }: TodayWordCardProps) {
	return (
		<Card sx={{ minWidth: 275 }}>
			<CardContent>
				<Typography variant="h3" gutterBottom align="center">
					{value}
				</Typography>
				<Typography sx={{ fontSize: 16 }} color="text.secondary" align="center">
					{text}
				</Typography>
			</CardContent>
		</Card>
	)
}
