import { ReactNode } from 'react'

import { RocketLaunch } from '@mui/icons-material'
import AutoGraph from '@mui/icons-material/AutoGraph'
import MenuBook from '@mui/icons-material/MenuBook'
import SportsEsports from '@mui/icons-material/SportsEsports'
import { Card, CardActionArea, CardContent, Typography } from '@mui/material'

interface AdvantageCardProps {
	title: string
	desc: string
	cardColor: string
	icon: string
}

const ADVANTAGE_ICONS: Record<string, ReactNode | undefined> = {
	book: <MenuBook sx={{ fontSize: 60, color: 'white' }} />,
	rocket: <RocketLaunch sx={{ fontSize: 60, color: 'white' }} />,
	game: <SportsEsports sx={{ fontSize: 60, color: 'white' }} />,
	progress: <AutoGraph sx={{ fontSize: 60, color: 'white' }} />,
}

const ADVANTAGE_BG_COLORS: Record<string, string> = {
	book: '#38c4c1',
	rocket: '#feca02',
	game: '#fe7ec9',
	progress: '#488df4',
}

export default function AdvantageCard({ icon, title, desc, cardColor }: AdvantageCardProps) {
	return (
		<Card sx={{ maxWidth: 215, height: 215, textAlign: 'center', bgcolor: `${ADVANTAGE_BG_COLORS[cardColor]}`, paddingTop: 1 }}>
			<CardActionArea>
				{ADVANTAGE_ICONS[icon]}
				<CardContent>
					<Typography gutterBottom variant="h5" component="div" color="white">
						{title}
					</Typography>
					<Typography variant="body2" color="white">
						{desc}
					</Typography>
				</CardContent>
			</CardActionArea>
		</Card>
	)
}
