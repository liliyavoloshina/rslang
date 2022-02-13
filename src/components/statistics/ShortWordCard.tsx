import React from 'react'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

interface ShortWordCardProps {
	value: string
	text: string
}

export default function ShortWordCard({ value, text }: ShortWordCardProps) {
	return (
		<Card>
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
