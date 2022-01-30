import React from 'react'
import { Box, Card, CardMedia, Typography, IconButton, Button, CardContent } from '@mui/material'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import { Word } from '../../types/word'
import styles from './Textbook.module.css'

const DOMAIN_URL = process.env.REACT_APP_DOMAIN as string

export default function TextbookCard(prop: Word) {
	const { image, word, transcription, wordTranslate, textMeaning, textMeaningTranslate, textExample, textExampleTranslate, audio } = prop
	const imageUrl = `${DOMAIN_URL}/${image}`

	const mainAudio = new Audio(`${DOMAIN_URL}/${audio}`)

	const toggleMainAudio = () => {
		mainAudio.play()
	}

	return (
		<Card sx={{ display: 'flex', flexWrap: 'wrap', gap: '10px', minHeight: '300px' }}>
			<CardMedia sx={{ flex: '1 1 150px', minHeight: '300px' }} image={imageUrl} />
			<CardContent sx={{ flex: '1 1 500px', display: 'flex', flexDirection: 'column' }}>
				<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
					<Box>
						<Typography variant="h6">
							{word} - [{transcription}]
						</Typography>
						<Typography variant="h6" color={theme => theme.text.secondary}>
							{wordTranslate}
						</Typography>
					</Box>
					<IconButton aria-label="delete" color="primary" onClick={toggleMainAudio}>
						<VolumeUpIcon />
					</IconButton>
				</Box>

				<Box sx={{ display: 'flex', flexDirection: 'column', marginTop: '10px' }}>
					<Typography
						className={styles.textbookCardMarkdown}
						sx={{ fontStyle: 'italic' }}
						variant="subtitle2"
						color={theme => theme.text.secondary}
						dangerouslySetInnerHTML={{ __html: textMeaning }}
					/>
					<Typography sx={{ fontStyle: 'italic' }} variant="subtitle2" color={theme => theme.text.secondary}>
						{textMeaningTranslate}
					</Typography>
				</Box>

				<Box sx={{ display: 'flex', flexDirection: 'column', marginTop: '10px' }}>
					{/* <Typography variant="subtitle2" color={theme => theme.text.secondary}>
						{textExample}
					</Typography> */}
					<Typography className={styles.textbookCardMarkdown} variant="subtitle2" color={theme => theme.text.secondary} dangerouslySetInnerHTML={{ __html: textExample }} />
					<Typography variant="subtitle2" color={theme => theme.text.secondary}>
						{textExampleTranslate}
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
