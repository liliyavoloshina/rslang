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
import { Word, WordDifficulty } from '../../types/word'
import styles from './Textbook.module.css'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { changeWordDifficulty, changeWordLearnedStatus, selectTextbookGroup } from '../../features/textbook/textbookSlice'

const DOMAIN_URL = process.env.REACT_APP_DOMAIN as string

interface TextbookCardProps {
	activeColor: string
	passedWord: Word
	isLoggedIn: boolean
}

interface CustomButtonProps extends ButtonProps {
	activeColor: string
}

const ColorButton = styled(Button, { shouldForwardProp: prop => prop !== 'activeColor' })<CustomButtonProps>(({ activeColor }) => ({
	color: 'white',
	backgroundColor: activeColor,
	'&:hover': {
		backgroundColor: activeColor,
		opacity: '0.7',
	},
}))

export default function TextbookCard({ activeColor, passedWord, isLoggedIn }: TextbookCardProps) {
	const dispatch = useAppDispatch()

	const group = useAppSelector(selectTextbookGroup)
	const { id, image, word, transcription, wordTranslate, textMeaning, textMeaningTranslate, textExample, textExampleTranslate, audio, audioExample, audioMeaning, userWord } =
		passedWord

	const isLearned = userWord?.optional?.isLearned as boolean

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

	const toggleWordDifficulty = () => {
		const difficulty = userWord?.difficulty === WordDifficulty.Difficult ? WordDifficulty.Normal : WordDifficulty.Difficult

		dispatch(changeWordDifficulty({ wordId: id, difficulty }))
	}

	const addToLearned = () => {
		dispatch(changeWordLearnedStatus({ wordId: id, wordLearnedStatus: true }))
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

				<Stack sx={{ marginTop: '10px' }}>
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
				</Stack>

				<Box sx={{ display: 'flex', flexDirection: 'column', marginTop: '10px' }}>
					<Typography className={styles.textbookCardMarkdown} variant="subtitle2" color={theme => theme.text.secondary} dangerouslySetInnerHTML={{ __html: textExample }} />
					<Typography variant="subtitle2" color={theme => theme.text.secondary}>
						{textExampleTranslate}
					</Typography>
				</Box>

				<Box sx={{ margin: '10px 0', display: isLoggedIn ? 'block' : 'none' }}>
					<Typography variant="subtitle2" color={theme => theme.text.success}>
						Правильных ответов: {userWord?.optional?.correctAnswers ? userWord?.optional?.correctAnswers : 0}
					</Typography>
					<Typography variant="subtitle2" color={theme => theme.text.danger}>
						Неправильных ответов: {userWord?.optional?.incorrectAnswers ? userWord?.optional?.incorrectAnswers : 0}
					</Typography>
				</Box>

				<Stack direction="row" justifyContent="space-between" sx={{ display: isLoggedIn ? 'flex' : 'none' }}>
					<ColorButton
						onClick={toggleWordDifficulty}
						variant="contained"
						size="small"
						activeColor={activeColor}
						disabled={(userWord?.difficulty === WordDifficulty.Difficult && group !== 6) || isLearned}
					>
						{userWord?.difficulty === WordDifficulty.Difficult ? 'Remove from difficult' : 'Add to difficult'}
					</ColorButton>
					<ColorButton variant="contained" size="small" activeColor={activeColor} onClick={addToLearned} disabled={isLearned}>
						To learned
					</ColorButton>
				</Stack>
			</CardContent>
		</Card>
	)
}
