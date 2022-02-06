import React from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import Stack from '@mui/material/Stack'
import Chip from '@mui/material/Chip'
import Tooltip from '@mui/material/Tooltip'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded'
import DiamondIcon from '@mui/icons-material/Diamond'
import { blue, lightGreen } from '@mui/material/colors'
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

export default function TextbookCard({ activeColor, passedWord, isLoggedIn }: TextbookCardProps) {
	const dispatch = useAppDispatch()

	const group = useAppSelector(selectTextbookGroup)
	const { id, image, word, transcription, wordTranslate, textMeaning, textMeaningTranslate, textExample, textExampleTranslate, audio, audioExample, audioMeaning, userWord } =
		passedWord

	const isLearned = userWord?.optional?.isLearned as boolean
	const isDifficult = userWord?.difficulty === WordDifficulty.Difficult
	const isDifficultDisable = (isDifficult && group !== 6) || isLearned
	const difficultBtnColor = blue.A200
	const learnedBtnColor = lightGreen[500]

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
		<Card sx={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
			<CardMedia sx={{ flex: '1 1 150px', minHeight: '200px' }} image={imageUrl} />
			<CardContent sx={{ flex: '1 1 500px', display: 'flex', flexDirection: 'column', rowGap: '10px' }}>
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

				<Stack flexDirection="row" justifyContent="space-between" alignItems="center">
					<Stack rowGap="10px">
						<Stack>
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

						<Stack>
							<Typography className={styles.textbookCardMarkdown} variant="subtitle2" color={theme => theme.text.secondary} dangerouslySetInnerHTML={{ __html: textExample }} />
							<Typography variant="subtitle2" color={theme => theme.text.secondary}>
								{textExampleTranslate}
							</Typography>
						</Stack>
					</Stack>

					<Stack>
						<Tooltip title={isLearned ? '' : 'Add to learned'} placement="top">
							<IconButton sx={{ color: learnedBtnColor }} onClick={addToLearned} disabled={isLearned}>
								<BookmarkAddedIcon />
							</IconButton>
						</Tooltip>
						<Tooltip title={isDifficultDisable ? '' : isDifficult ? 'Remove from difficult' : 'Add to difficult'}>
							<IconButton sx={{ color: difficultBtnColor }} onClick={toggleWordDifficulty} disabled={isDifficultDisable}>
								<DiamondIcon />
							</IconButton>
						</Tooltip>
					</Stack>
				</Stack>

				<Stack flexDirection="row" justifyContent="space-between" sx={{ display: isLoggedIn ? 'flex' : 'none' }}>
					<Box>
						<Typography variant="subtitle2" color={theme => theme.text.success}>
							Правильных ответов: {userWord?.optional?.correctAnswers ? userWord?.optional?.correctAnswers : 0}
						</Typography>
						<Typography variant="subtitle2" color={theme => theme.text.danger}>
							Неправильных ответов: {userWord?.optional?.incorrectAnswers ? userWord?.optional?.incorrectAnswers : 0}
						</Typography>
					</Box>
					<Stack flexDirection="row" columnGap="10px">
						<Chip sx={{ display: isLearned ? 'flex' : 'none', backgroundColor: learnedBtnColor, color: '#fff' }} label="Learned" />
						<Chip sx={{ display: isDifficult ? 'flex' : 'none', backgroundColor: difficultBtnColor, color: '#fff' }} label="Difficult" />
					</Stack>
				</Stack>
			</CardContent>
		</Card>
	)
}
