import React from 'react'
import { Box, Card, CardMedia, Typography, IconButton, Button, CardContent } from '@mui/material'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'

export default function TextbookCard() {
	return (
		<Card sx={{ display: 'flex', flexWrap: 'wrap', gap: '10px', minHeight: '300px' }}>
			<CardMedia sx={{ flex: { xs: '1 1 250px', md: '1 1 150px' }, minHeight: '300px' }} image="https://picsum.photos/seed/picsum/500/500" />
			<CardContent sx={{ flex: '1', display: 'flex', flexDirection: 'column' }}>
				<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minWidth: '300px' }}>
					<Box>
						<Typography variant="h6">arrive - [əráiv]</Typography>
						<Typography variant="h6" color={theme => theme.text.secondary}>
							прибыть
						</Typography>
					</Box>
					<IconButton aria-label="delete" color="primary">
						<VolumeUpIcon />
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

				<Box sx={{ margin: '10px 0' }}>
					<Typography variant="subtitle2" color={theme => theme.text.success}>
						Правильных ответов: 12
					</Typography>
					<Typography variant="subtitle2" color={theme => theme.text.danger}>
						Неправильных ответов: 12
					</Typography>
				</Box>

				<Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto' }}>
					<Button size="small" variant="contained">
						To difficult
					</Button>
					<Button size="small" variant="contained">
						To learned
					</Button>
				</Box>
			</CardContent>
		</Card>
	)
}
