import * as React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import SportsEsportsIcon from '@mui/icons-material/SportsEsports'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import SchoolIcon from '@mui/icons-material/School'
import AutoGraphIcon from '@mui/icons-material/AutoGraph'

interface AdvantageCardProps {
	title: string
	desc: string
	icon: string
}

export default function AdvantageCard(advantage: AdvantageCardProps) {
	const { icon, title, desc } = advantage
	let advantageIcon

	if (icon === 'game') {
		advantageIcon = <SportsEsportsIcon sx={{ fontSize: 60 }} />
	} else if (icon === 'book') {
		advantageIcon = <MenuBookIcon sx={{ fontSize: 60 }} />
	} else if (icon === 'school') {
		advantageIcon = <SchoolIcon sx={{ fontSize: 60 }} />
	} else if (icon === 'progress') {
		advantageIcon = <AutoGraphIcon sx={{ fontSize: 60 }} />
	}

	return (
		<Card sx={{ maxWidth: 345 }}>
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
