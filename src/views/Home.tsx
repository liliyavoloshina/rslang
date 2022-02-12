import { TFuncKey, useTranslation } from 'react-i18next'

import { Card, CardContent, CardMedia, Container, Grid, Typography } from '@mui/material'

import AdvantageCard from '~/components/home/AdvantageCard'

const advantages: { title: TFuncKey; desc: TFuncKey; icon: string }[] = [
	{ title: 'HOME.ADVANTAGES.MINI_GAMES', desc: 'HOME.ADVANTAGES.MINI_GAMES_DESC', icon: 'game' },
	{ title: 'HOME.ADVANTAGES.TEXTBOOX', desc: 'HOME.ADVANTAGES.TEXTBOOX_DESC', icon: 'book' },
	{ title: 'HOME.ADVANTAGES.CHOOSE_WORDS', desc: 'HOME.ADVANTAGES.CHOOSE_WORDS_DESC', icon: 'school' },
	{ title: 'HOME.ADVANTAGES.LEARNING_PROGRESS', desc: 'HOME.ADVANTAGES.LEARNING_PROGRESS_DESC', icon: 'progress' },
	{ title: 'HOME.ADVANTAGES.LEARNING_PROGRESS', desc: 'HOME.ADVANTAGES.LEARNING_PROGRESS_DESC', icon: 'progress' },
	{ title: 'HOME.ADVANTAGES.LEARNING_PROGRESS', desc: 'HOME.ADVANTAGES.LEARNING_PROGRESS_DESC', icon: 'progress' },
]

export default function Home() {
	const { t } = useTranslation()
	return (
		<Container maxWidth="lg">
			<Typography variant="h2" sx={{ mt: 3, mb: 3, textAlign: 'center' }}>
				{t('HOME.TITLE')}
			</Typography>
			<Typography variant="body1" gutterBottom sx={{ mb: 5, textAlign: 'center' }}>
				{t('HOME.DESCRIPTION')}
			</Typography>
			<Grid container spacing={2}>
				{advantages.map(({ title, desc, icon }, idx) => (
					<Grid item xs={4} key={idx}>
						<AdvantageCard title={t(title) as string} desc={t(desc) as string} icon={icon} />
					</Grid>
				))}
			</Grid>
			<Typography variant="h4" sx={{ mt: 3, mb: 3, textAlign: 'center' }}>
				{t('HOME.DEVELOPER')}
			</Typography>
			<Card sx={{ maxWidth: 345 }}>
				<CardMedia
					component="img"
					height="140"
					image="https://images.unsplash.com/photo-1580894908361-967195033215?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
					alt="green iguana"
				/>
				<CardContent>
					<Typography gutterBottom variant="h5" component="div">
						{t('HOME.FIRST_DEVELOPER.NICKNAME')}
					</Typography>
					<Typography variant="body2" color="text.secondary">
						{t('HOME.FIRST_DEVELOPER.DESCRIPTION')}
					</Typography>
				</CardContent>
			</Card>
		</Container>
	)
}
