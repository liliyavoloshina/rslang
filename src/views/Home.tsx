import React from 'react'
import { Container, Grid, Typography, CardMedia, CardContent, Card } from '@mui/material'
import AdvantageCard from '../components/AdvantageCard'

const advantages = [
	{ title: 'Mini-games', desc: 'Games make learning fun', icon: 'game' },
	{ title: 'Textbook', desc: 'Dictionary stores all the words you need', icon: 'book' },
	{ title: 'Сhoose your words', desc: 'Сhoose words to study or mark as studied', icon: 'school' },
	{ title: 'Learning Progress', desc: 'Track your progress', icon: 'progress' },
	{ title: 'Learning Progress', desc: 'Track your progress', icon: 'progress' },
	{ title: 'Learning Progress', desc: 'Track your progress', icon: 'progress' },
]

export default function Home() {
	return (
		<Container maxWidth="lg">
			<Typography variant="h2" sx={{ mt: 3, mb: 3 }}>
				RS Lang
			</Typography>
			<Typography variant="body1" gutterBottom sx={{ mb: 5 }}>
				body1. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur unde suscipit, quam beatae rerum inventore consectetur, neque doloribus, cupiditate
				numquam dignissimos laborum fugiat deleniti? Eum quasi quidem quibusdam.
			</Typography>
			<Grid container spacing={2}>
				{advantages.map((advantage, idx) => {
					return (
						<Grid item xs={4} key={idx}>
							<AdvantageCard {...advantage} />
						</Grid>
					)
				})}
			</Grid>
			<Typography variant="h4" sx={{ mt: 3, mb: 3 }}>
				Developer
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
						Lizard
					</Typography>
					<Typography variant="body2" color="text.secondary">
						Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging across all continents except Antarctica
					</Typography>
				</CardContent>
			</Card>
		</Container>
	)
}
