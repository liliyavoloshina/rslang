import React from 'react'

import AddCircleIcon from '@mui/icons-material/AddCircle'
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment'
import PercentIcon from '@mui/icons-material/Percent'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'

import { GameName } from '~/types/game'

interface ShortGameCardProps {
	gameName: GameName
	newWords: number
	correctPercent: string
	longestSeries: number
}

export default function ShortGameCard({ gameName, newWords, correctPercent, longestSeries }: ShortGameCardProps) {
	return (
		<Card>
			<CardContent>
				<Typography variant="h5" color="text.secondary" gutterBottom>
					{gameName}
				</Typography>
				<List>
					<ListItem disablePadding>
						<ListItemIcon style={{ minWidth: '40px' }}>
							<AddCircleIcon color="success" />
						</ListItemIcon>
						<ListItemText primary={`New words: ${newWords}`} />
					</ListItem>
					<ListItem disablePadding>
						<ListItemIcon style={{ minWidth: '40px' }}>
							<PercentIcon color="primary" />
						</ListItemIcon>
						<ListItemText primary={`Correct words percent: ${correctPercent}%`} />
					</ListItem>
					<ListItem disablePadding>
						<ListItemIcon style={{ minWidth: '40px' }}>
							<LocalFireDepartmentIcon color="error" />
						</ListItemIcon>
						<ListItemText primary={`Longest correct words series: ${longestSeries}`} />
					</ListItem>
				</List>
			</CardContent>
		</Card>
	)
}
