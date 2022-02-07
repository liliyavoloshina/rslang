import { ReactNode } from 'react'

import AutoGraph from '@mui/icons-material/AutoGraph'
import MenuBook from '@mui/icons-material/MenuBook'
import School from '@mui/icons-material/School'
import SportsEsports from '@mui/icons-material/SportsEsports'
import { Card, CardContent, Typography } from '@mui/material'

interface AdvantageCardProps {
	title: string
	desc: string
	icon: string
}

const ADVANTAGE_ICONS: Record<string, ReactNode | undefined> = {
	game: <SportsEsports sx={{ fontSize: 60 }} />,
	book: <MenuBook sx={{ fontSize: 60 }} />,
	school: <School sx={{ fontSize: 60 }} />,
	progress: <AutoGraph sx={{ fontSize: 60 }} />,
}

export default function AdvantageCard({ icon, title, desc }: AdvantageCardProps) {
	return (
		<Card sx={{ maxWidth: 345, textAlign: 'center' }}>
			{ADVANTAGE_ICONS[icon]}
			<CardContent>
				<Typography gutterBottom variant="h5" component="div">
					{title}
				</Typography>
				<Typography variant="body2" color="text.secondary">
					{desc}
				</Typography>
			</CardContent>
		</Card>
	)
}
