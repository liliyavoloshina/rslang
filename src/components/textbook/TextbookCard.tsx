import React from 'react'
import { Box, Card, CardMedia, Typography, IconButton } from '@mui/material'
import MusicNoteIcon from '@mui/icons-material/MusicNote'
import { grey } from '@mui/material/colors'

// const secondary

export default function TextbookCard() {
	return (
		<Card sx={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
			<CardMedia
				sx={{ flex: { xs: '1 1 250px', md: '0 1 150px' }, height: '150px', objectFit: 'cover' }}
				component="img"
				image="https://picsum.photos/seed/picsum/500/500"
				alt="Live from space album cover"
			/>
			<Box sx={{ flex: { xs: '1 1 60%', md: '1 0 60%' }, display: 'flex', flexDirection: 'column' }}>
				<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
					<Typography variant="h6">arrive - [əráiv]</Typography>
					<IconButton aria-label="delete" color="primary">
						<MusicNoteIcon />
					</IconButton>
				</Box>
				<Typography variant="h6" color={theme => theme.text.secondary}>
					прибыть
				</Typography>
			</Box>
		</Card>
	)
}
