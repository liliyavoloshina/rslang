import { useTranslation } from 'react-i18next'

import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded'
import DiamondIcon from '@mui/icons-material/Diamond'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import { Theme } from '@mui/material'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { blue, lightGreen } from '@mui/material/colors'

import { useAppDispatch, useAppSelector } from '~/app/hooks'
import { selectAuthUserInfo } from '~/features/auth'
import { updateWordStatistic } from '~/features/statistic'
import { changeWordDifficulty, changeWordLearnedStatus, selectTextbookGroup } from '~/features/textbook'
import { Word, WordDifficulty } from '~/types/word'
import { DOMAIN_URL } from '~/utils/constants'

import styles from './Textbook.module.css'

interface TextbookCardProps {
	activeColor: string
	passedWord: Word
	isLoggedIn: boolean
}

export default function TextbookCard({ activeColor, passedWord, isLoggedIn }: TextbookCardProps) {
	const { t } = useTranslation()

	const dispatch = useAppDispatch()

	const group = useAppSelector(selectTextbookGroup)
	const userInfo = useAppSelector(selectAuthUserInfo)
	const { id, image, word, transcription, wordTranslate, textMeaning, textMeaningTranslate, textExample, textExampleTranslate, audio, audioExample, audioMeaning, userWord } =
		passedWord

	const isLearned = !!userWord?.optional?.isLearned
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

		dispatch(changeWordDifficulty({ word: passedWord, difficulty }))
	}

	const addToLearned = () => {
		dispatch(changeWordLearnedStatus({ word: passedWord, wordLearnedStatus: true }))
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
						<Typography variant="h6" color={(theme: Theme) => theme.text.secondary}>
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
								color={(theme: Theme) => theme.text.secondary}
								dangerouslySetInnerHTML={{ __html: textMeaning }}
							/>
							<Typography sx={{ fontStyle: 'italic' }} variant="subtitle2" color={(theme: Theme) => theme.text.secondary}>
								{textMeaningTranslate}
							</Typography>
						</Stack>

						<Stack>
							<Typography
								className={styles.textbookCardMarkdown}
								variant="subtitle2"
								color={(theme: Theme) => theme.text.secondary}
								dangerouslySetInnerHTML={{ __html: textExample }}
							/>
							<Typography variant="subtitle2" color={(theme: Theme) => theme.text.secondary}>
								{textExampleTranslate}
							</Typography>
						</Stack>
					</Stack>

					{isLoggedIn && (
						<Stack>
							<Tooltip title={isLearned ? '' : t('TEXTBOOK.ADD_TO_LEARNED')} placement="top">
								<IconButton sx={{ color: learnedBtnColor }} onClick={addToLearned} disabled={isLearned}>
									<BookmarkAddedIcon />
								</IconButton>
							</Tooltip>
							<Tooltip title={isDifficultDisable ? '' : t(isDifficult ? 'TEXTBOOK.REMOVED_FROM_DIFFICULT' : 'TEXTBOOK.ADD_TO_DIFFICULT')}>
								<IconButton sx={{ color: difficultBtnColor }} onClick={toggleWordDifficulty} disabled={isDifficultDisable}>
									<DiamondIcon />
								</IconButton>
							</Tooltip>
						</Stack>
					)}
				</Stack>

				{isLoggedIn && (
					<Stack flexDirection="row" justifyContent="space-between">
						<Box>
							<Typography variant="subtitle2" color={(theme: Theme) => theme.text.success}>
								{t('TEXTBOOK.CORRECT_ANSWER_COUNT', { count: (userWord?.optional?.correctAnswers as number | undefined) ?? 0 })}
							</Typography>
							<Typography variant="subtitle2" color={(theme: Theme) => theme.text.danger}>
								{t('TEXTBOOK.INCORRECT_ANSWER_COUNT', { count: (userWord?.optional?.incorrectAnswers as number | undefined) ?? 0 })}
							</Typography>
						</Box>
						<Stack flexDirection="row" columnGap="10px">
							<Chip sx={{ display: isLearned ? 'flex' : 'none', backgroundColor: learnedBtnColor, color: '#fff' }} label={t('TEXTBOOK.LEARNED')} />
							<Chip sx={{ display: isDifficult ? 'flex' : 'none', backgroundColor: difficultBtnColor, color: '#fff' }} label={t('TEXTBOOK.DIFFICULT')} />
						</Stack>
					</Stack>
				)}
			</CardContent>
		</Card>
	)
}
