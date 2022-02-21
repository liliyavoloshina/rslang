import { TFuncKey, useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { Box, Card, CardContent, CardMedia, Container, Grid, IconButton, Link, Typography, colors } from '@mui/material'

import AdvantageCard from '~/components/home/AdvantageCard'
import PhilosophyCard from '~/components/home/PhilosophyCard'
import { Path } from '~/components/router'

const advantages: { title: TFuncKey; desc: TFuncKey; icon: string; cardColor: string; path: Path }[] = [
	{ title: 'HOME.ADVANTAGES.TEXTBOOK', desc: 'HOME.ADVANTAGES.TEXTBOOK_DESC', icon: 'book', cardColor: 'book', path: Path.TEXTBOOK },
	{ title: 'HOME.ADVANTAGES.SPRINT', desc: 'HOME.ADVANTAGES.SPRINT_DESC', icon: 'rocket', cardColor: 'rocket', path: Path.SPRINT },
	{ title: 'HOME.ADVANTAGES.AUDIOCALL', desc: 'HOME.ADVANTAGES.AUDIOCALL_DESC', icon: 'game', cardColor: 'game', path: Path.AUDIOCALL },
	{ title: 'HOME.ADVANTAGES.STATISTIC', desc: 'HOME.ADVANTAGES.STATISTIC_DESC', icon: 'progress', cardColor: 'progress', path: Path.STATISTIC },
]

const philosophy: { title: TFuncKey; desc: TFuncKey; textColor: string }[] = [
	{ title: 'HOME.PHILOSOPHY.TEXTBOOK', desc: 'HOME.PHILOSOPHY.TEXTBOOK_DESC', textColor: 'textbook' },
	{ title: 'HOME.PHILOSOPHY.DICTIONARY', desc: 'HOME.PHILOSOPHY.DICTIONARY_DESC', textColor: 'dictionary' },
	{ title: 'HOME.PHILOSOPHY.STATISTIC', desc: 'HOME.PHILOSOPHY.STATISTIC_DESC', textColor: 'statistic' },
	{ title: 'HOME.PHILOSOPHY.GAMES', desc: 'HOME.PHILOSOPHY.GAMES_DESC', textColor: 'games' },
]

export default function Home() {
	const { t } = useTranslation()
	const navigate = useNavigate()

	return (
		<>
			<Container>
				<Box maxWidth="lg">
					<Grid container style={{ position: 'relative', marginTop: 40 }}>
						<Grid item xs={5}>
							<img style={{ width: 450, height: 490, objectFit: 'contain', borderRadius: 5 }} src="/assets/images/home_page_learning.jpg" alt="learning" />
							<Box sx={{ width: 420, height: 430, backgroundImage: 'linear-gradient(45deg, #feca02, #fe7ec9)', margin: '-345px auto 0 75px', borderRadius: 1 }} />
						</Grid>

						<Grid item xs={7}>
							<Typography
								variant="h3"
								gutterBottom
								sx={{ mb: 5, textAlign: 'center', color: '#488df4', verticalAlign: 'center', textTransform: 'uppercase', fontWeight: 800, padding: 8 }}
							>
								{t('HOME.DESCRIPTION')}
							</Typography>
						</Grid>

						<Grid container spacing={0} maxWidth={900} style={{ position: 'absolute', top: 325, right: 5 }}>
							{advantages.map(({ title, desc, icon, cardColor, path }, idx) => (
								<Grid item xs={3} key={idx} onClick={() => navigate(path)}>
									<AdvantageCard title={t(title) as string} desc={t(desc) as string} icon={icon} cardColor={cardColor} />
								</Grid>
							))}
						</Grid>
					</Grid>
				</Box>
			</Container>
			<Box sx={{ width: 'calc(100% - 80px)', bgcolor: '#38c4c1', margin: '100px auto', padding: 5 }}>
				<Container>
					<Typography variant="h4" sx={{ mt: 3, mb: 3, textAlign: 'center', fontWeight: 800, color: 'white' }}>
						{t('HOME.PHILOSOPHY.TITLE')}
					</Typography>

					<Grid container spacing={5} sx={{ justifyContent: 'space-round' }}>
						{philosophy.map(({ title, desc, textColor }, idx) => (
							<Grid item xs={3} key={idx}>
								<PhilosophyCard title={t(title) as string} desc={t(desc) as string} textColor={textColor} />
							</Grid>
						))}
					</Grid>
				</Container>
			</Box>

			<Box position="relative" style={{ marginBottom: 80 }}>
				<Box sx={{ position: 'absolute', width: '100%', height: 144, top: 260, background: '#488df4' }} />
				<Container>
					<Typography variant="h4" sx={{ mt: 3, mb: 3, textAlign: 'center', fontWeight: 800, color: '#488df4' }}>
						{t('HOME.ABOUT_US')}
					</Typography>
					<Grid container spacing={5} sx={{ justifyContent: 'space-between', height: 430 }}>
						<Grid item xs={6} position="relative">
							<Box sx={{ position: 'absolute', width: '75%', height: '100%', backgroundImage: 'linear-gradient( #feca02, #fe7ec9 )', borderRadius: 1 }} />
							<Card sx={{ width: '75%', transform: 'translate(25%, 80px)' }}>
								<CardMedia
									component="img"
									height="140"
									width="140"
									style={{ borderRadius: '50%', objectFit: 'contain' }}
									image="/assets/images/lady_avatar_blond.png"
									alt="avatar"
								/>
								<CardContent>
									<Typography gutterBottom variant="h5" component="div" textAlign="center">
										<Link href="https://github.com/liliyavoloshina" underline="hover" color="#488df4">
											{t('HOME.FIRST_DEVELOPER.NICKNAME')}
											{/* <img style={{ width: 20, height: 20, objectFit: 'contain' }} src="/assets/svg/github.png" alt="" /> */}
										</Link>
									</Typography>
									<Typography variant="body2" color="text.secondary">
										{t('HOME.FIRST_DEVELOPER.TASKS_DESCRIPTION')}
									</Typography>
								</CardContent>
							</Card>
						</Grid>
						<Grid item xs={6} position="relative">
							<Box sx={{ position: 'absolute', width: '75%', height: '100%', right: 0, backgroundImage: 'linear-gradient( #fe7ec9, #feca02 )', borderRadius: 1 }} />
							<Card sx={{ width: '75%', transform: 'translate(10%, 25px)' }}>
								<CardMedia
									component="img"
									height="140"
									width="140"
									style={{ borderRadius: '50%', objectFit: 'contain' }}
									image="/assets/images/lady_avatar_brown.png"
									alt="avatar"
								/>
								<CardContent>
									<Typography gutterBottom variant="h5" component="div" textAlign="center">
										<Link href="https://github.com/ElenaBezro" underline="hover" color="#488df4">
											{t('HOME.SECOND_DEVELOPER.NICKNAME')}
										</Link>
									</Typography>
									<Typography variant="body2" color="text.secondary">
										{t('HOME.SECOND_DEVELOPER.TASKS_DESCRIPTION')}
									</Typography>
								</CardContent>
							</Card>
						</Grid>
					</Grid>
				</Container>
			</Box>
		</>
	)
}
