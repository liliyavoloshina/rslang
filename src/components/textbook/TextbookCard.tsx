import React from 'react'
import { Box, Card, CardMedia, Typography, IconButton, CardActions, Button, CardContent } from '@mui/material'
import MusicNoteIcon from '@mui/icons-material/MusicNote'
import { grey } from '@mui/material/colors'

// const secondary

export default function TextbookCard() {
	return (
		<Card sx={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
			<CardMedia
				sx={{ flex: { xs: '1 1 250px', md: '1 1 150px' }, height: { xs: '200px', md: '200px' } }}
				component="img"
				image="https://picsum.photos/seed/picsum/500/500"
				alt="Live from space album cover"
			/>
			<CardContent>
				<Box sx={{ flex: { xs: '1 1 60%' }, display: 'flex', flexDirection: 'column' }}>
					<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
						<Box>
							<Typography variant="h6">arrive - [əráiv]</Typography>
							<Typography variant="h6" color={theme => theme.text.secondary}>
								прибыть
							</Typography>
						</Box>
						<IconButton aria-label="delete" color="primary">
							<MusicNoteIcon />
						</IconButton>
					</Box>

					<Box sx={{ display: 'flex', flexDirection: 'column', marginTop: '10px' }}>
						<Typography sx={{ fontStyle: 'italic' }} variant="subtitle2" color={theme => theme.text.secondary}>
							To arrive is to get somewhere.
						</Typography>
						<Typography sx={{ fontStyle: 'italic' }} variant="subtitle2" color={theme => theme.text.secondary}>
							Приехать значит попасть куда-то
						</Typography>
					</Box>

					<Box sx={{ display: 'flex', flexDirection: 'column', marginTop: '10px' }}>
						<Typography variant="subtitle2" color={theme => theme.text.secondary}>
							They arrived at school at 7 a.m.
						</Typography>
						<Typography variant="subtitle2" color={theme => theme.text.secondary}>
							Они прибыли в школу в 7 часов утра
						</Typography>
					</Box>

					<Box sx={{ display: 'flex', flexDirection: 'column', marginTop: '10px' }}>
						<Button size="small" variant="contained">
							To difficult
						</Button>
					</Box>
				</Box>
			</CardContent>
		</Card>
	)
}
