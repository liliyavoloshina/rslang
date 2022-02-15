import React from 'react'
import { useTranslation } from 'react-i18next'

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

interface ShortGameCardProps {
	gameName: 'audiocall' | 'sprint'
	newWords: number
	correctPercent: string
	longestSeries: number
}

export default function ShortGameCard({ gameName, newWords, correctPercent, longestSeries }: ShortGameCardProps) {
	const { t } = useTranslation()
	return (
		<Card>
			<CardContent>
				<Typography variant="h5" color="text.secondary" gutterBottom>
					{gameName === 'audiocall' ? t('AUDIOCALL.TITLE') : t('SPRINT.TITLE')}
				</Typography>
				<List>
					<ListItem disablePadding>
						<ListItemIcon style={{ minWidth: '40px' }}>
							<AddCircleIcon color="success" />
						</ListItemIcon>
						<ListItemText primary={t('STATISTIC.NEW_WORDS', { words: `${newWords}` })} />
					</ListItem>
					<ListItem disablePadding>
						<ListItemIcon style={{ minWidth: '40px' }}>
							<PercentIcon color="primary" />
						</ListItemIcon>
						<ListItemText primary={t('STATISTIC.CORRECT_WORDS_PERCENT', { percent: `${correctPercent}` })} />
					</ListItem>
					<ListItem disablePadding>
						<ListItemIcon style={{ minWidth: '40px' }}>
							<LocalFireDepartmentIcon color="error" />
						</ListItemIcon>
						<ListItemText primary={t('STATISTIC.LONGEST_CORRECT_SERIES', { series: `${longestSeries}` })} />
					</ListItem>
				</List>
			</CardContent>
		</Card>
	)
}
