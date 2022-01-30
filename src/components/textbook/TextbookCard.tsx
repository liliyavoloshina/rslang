import React from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'
import Button, { ButtonProps } from '@mui/material/Button'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import { Word } from '../../types/word'
import styles from './Textbook.module.css'

const DOMAIN_URL = process.env.REACT_APP_DOMAIN as string

interface TextbookCardProps {
	activeColor: string
	passedWord: Word
}

interface CustomButtonProps extends ButtonProps {
	activeColor: string
}

const ColorButton = styled(Button)<CustomButtonProps>(({ activeColor }) => ({
	color: 'white',
	backgroundColor: activeColor,
	'&:hover': {
		backgroundColor: activeColor,
		opacity: '0.7',
	},
}))

export default function TextbookCard({ activeColor, passedWord }: TextbookCardProps) {
	const { image, word, transcription, wordTranslate, textMeaning, textMeaningTranslate, textExample, textExampleTranslate, audio, audioExample, audioMeaning } = passedWord
	const imageUrl = `${DOMAIN_URL}/${image}`

	const audioUrls = [`${DOMAIN_URL}/${audio}`, `${DOMAIN_URL}/${audioMeaning}`, `${DOMAIN_URL}/${audioExample}`]

	const toggleAudio = () => {
		let curUrl = 0
		const audioToPlay = new Audio()
		audioToPlay.src = audioUrls[curUrl]
		audioToPlay.play()
		audioToPlay.onended = () => {
			if (curUrl < 2) {
				curUrl += 1
				audioToPlay.src = audioUrls[curUrl]
				audioToPlay.play()
			}
		}
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
					<IconButton aria-label="delete" sx={{ color: activeColor }} onClick={toggleAudio}>
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

				<Stack spacing={2} direction="row" justifyContent="space-between">
					<ColorButton variant="contained" size="small" activeColor={activeColor}>
						To difficult
					</ColorButton>
					<ColorButton variant="contained" size="small" activeColor={activeColor}>
						To difficult
					</ColorButton>
				</Stack>

				{/* <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto' }}>
					<Button size="small" variant="outlined" sx={{ backgroundColor: activeColor }}>
						To difficult
					</Button>
					<Button size="small" variant="outlined" sx={{ backgroundColor: activeColor }}>
						To learned
					</Button>
				</Box>  */}
			</CardContent>
		</Card>
	)
}
