import * as React from 'react'
import { CardContent, Typography, Card } from '@mui/material'
import AutoGraph from '@mui/icons-material/AutoGraph'
import SportsEsports from '@mui/icons-material/SportsEsports'
import MenuBook from '@mui/icons-material/MenuBook'
import School from '@mui/icons-material/School'

interface AdvantageCardProps {
	title: string
	desc: string
	icon: string
}

export default function AdvantageCard(advantage: AdvantageCardProps) {
	const { icon, title, desc } = advantage
	let advantageIcon

	if (icon === 'game') {
		advantageIcon = <SportsEsports sx={{ fontSize: 60 }} />
	} else if (icon === 'book') {
		advantageIcon = <MenuBook sx={{ fontSize: 60 }} />
	} else if (icon === 'school') {
		advantageIcon = <School sx={{ fontSize: 60 }} />
	} else if (icon === 'progress') {
		advantageIcon = <AutoGraph sx={{ fontSize: 60 }} />
	}

	return (
		<Card sx={{ maxWidth: 345, textAlign: 'center' }}>
			{advantageIcon}
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
