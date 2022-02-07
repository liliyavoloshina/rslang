import { Ref, forwardRef } from 'react'
import { Link as RouterLink } from 'react-router-dom'

import VolumeUp from '@mui/icons-material/VolumeUp'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Slide from '@mui/material/Slide'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { TransitionProps } from '@mui/material/transitions'

import { Word } from '~/types/word'
import { DOMAIN_URL } from '~/utils/constants'

interface PopupProps {
	isOpen: boolean
	incorrectWords: Word[]
	correctWords: Word[]
}

const Transition = forwardRef(function Transition(
	props: TransitionProps & {
		children: JSX.Element
	},
	ref: Ref<unknown>
) {
	return <Slide direction="up" ref={ref} {...props} />
})

export default function Popup(props: PopupProps) {
	const { isOpen, incorrectWords, correctWords } = props

	const toggleAudio = (word: Word) => {
		const audio = new Audio(`${DOMAIN_URL}/${word.audio}`)
		audio.play()
	}

	return (
		<div>
			<Dialog open={isOpen} TransitionComponent={Transition} keepMounted maxWidth="sm" fullWidth aria-describedby="popup with game results">
				<DialogTitle>Your results:</DialogTitle>
				<DialogContent>
					<Stack direction="row" spacing={2} alignItems="center">
						<Typography color="error">Incorrect</Typography>
						<Chip label={incorrectWords.length} color="error" />
					</Stack>

					<List dense>
						{incorrectWords.map(word => {
							return (
								<ListItem key={word.id}>
									<IconButton aria-label="play audio" size="small" onClick={() => toggleAudio(word)}>
										<VolumeUp fontSize="inherit" />
									</IconButton>
									<ListItemText primary={word.word} />
								</ListItem>
							)
						})}
					</List>

					<Stack direction="row" spacing={2} alignItems="center">
						<Typography color="success">Correct</Typography>
						<Chip label={correctWords.length} color="success" />
					</Stack>
					<List dense>
						{correctWords.map(word => (
							<ListItem key={word.id}>
								<IconButton aria-label="play audio" size="small" onClick={() => toggleAudio(word)}>
									<VolumeUp fontSize="inherit" />
								</IconButton>
								<ListItemText primary={word.word} />
							</ListItem>
						))}
					</List>
				</DialogContent>
				<DialogActions>
					<Button component={RouterLink} to="/">
						Home
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	)
}
