import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Color, SelectChangeEvent } from '@mui/material'
import Box from '@mui/material/Box'
import Button, { ButtonProps } from '@mui/material/Button'
import Container from '@mui/material/Container'
import FormControl from '@mui/material/FormControl'
import InputLabel, { InputLabelProps } from '@mui/material/InputLabel'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectProps } from '@mui/material/Select'
import Typography from '@mui/material/Typography'
import { deepPurple, green, lightGreen, purple, teal } from '@mui/material/colors'
import { styled } from '@mui/material/styles'

import { useAppDispatch } from '~/app/hooks'
import { toggleLevelSelection } from '~/features/audiocall'

import { LevelSelectionProps } from './LevelSelection.types'

interface LevelSelectionCustomProps {
	customcolor: Color
}

const LevelSelectionLabel = styled(InputLabel)<LevelSelectionCustomProps & InputLabelProps>(({ customcolor }) => ({
	color: '#fff',
	'&.Mui-focused': {
		color: customcolor[200],
	},
}))

const LevelSelectionSelect = styled(Select)<LevelSelectionCustomProps & SelectProps>(({ customcolor }) => ({
	color: '#fff',

	'& .MuiOutlinedInput-notchedOutline': {
		borderColor: '#fff',
	},

	'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
		borderColor: customcolor[900],
	},

	'& .MuiSvgIcon-root': {
		color: '#fff',
	},
}))

const LevelSelectionButton = styled(Button)<LevelSelectionCustomProps & ButtonProps>(({ customcolor }) => ({
	color: '#fff',
	backgroundColor: customcolor[900],
	border: `1px solid ${customcolor[800]}`,
	'&:hover': {
		backgroundColor: customcolor[700],
	},
}))

const LevelSelection = ({ title, description, controls, type, onLevelSelected }: LevelSelectionProps) => {
	const { t } = useTranslation()

	const [group, setGroup] = useState(0)

	const dispatch = useAppDispatch()

	const handleChange = (event: SelectChangeEvent<unknown>) => {
		const newGroup = +(event.target.value as string)
		setGroup(newGroup)
	}

	const handlePlay = () => {
		onLevelSelected?.(group)
		dispatch(toggleLevelSelection(false))
	}

	const customColor = type === 'audiocall' ? purple : green
	const customColor2 = type === 'audiocall' ? deepPurple : teal
	const bgColor = `linear-gradient(to right top, ${customColor[500]}, ${customColor2[500]})`

	return (
		<Box sx={{ height: '100%', background: bgColor, color: '#fff' }}>
			<Container maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
				<Box sx={{ textAlign: 'center' }}>
					<Typography variant="h3">{title}</Typography>
					<Typography variant="subtitle1" gutterBottom marginTop="10px">
						{description}
					</Typography>
				</Box>
				<Box>
					<List>
						{controls.map((control, i) => {
							return (
								<ListItem key={i} dense>
									<ListItemText
										primary={control}
										primaryTypographyProps={{
											fontSize: 18,
											textAlign: 'center',
										}}
									/>
								</ListItem>
							)
						})}
					</List>
				</Box>
				<Box display="flex" gap="20px" marginTop="20px">
					<FormControl color="primary" variant="outlined">
						<LevelSelectionLabel customcolor={customColor}>{t('LEVEL_SELECTION.SELECT_LEVEL')}</LevelSelectionLabel>

						<LevelSelectionSelect value={group} label={t('LEVEL_SELECTION.SELECT_LEVEL')} onChange={handleChange} customcolor={customColor}>
							<MenuItem value={0}>{t('LEVEL_SELECTION.GROUP', { count: 1 })}</MenuItem>
							<MenuItem value={1}>{t('LEVEL_SELECTION.GROUP', { count: 2 })}</MenuItem>
							<MenuItem value={2}>{t('LEVEL_SELECTION.GROUP', { count: 3 })}</MenuItem>
							<MenuItem value={3}>{t('LEVEL_SELECTION.GROUP', { count: 4 })}</MenuItem>
							<MenuItem value={4}>{t('LEVEL_SELECTION.GROUP', { count: 5 })}</MenuItem>
							<MenuItem value={5}>{t('LEVEL_SELECTION.GROUP', { count: 6 })}</MenuItem>
						</LevelSelectionSelect>
					</FormControl>
					<LevelSelectionButton variant="contained" onClick={handlePlay} customcolor={customColor}>
						{t('LEVEL_SELECTION.PLAY')}
					</LevelSelectionButton>
				</Box>
			</Container>
		</Box>
	)
}

LevelSelection.defaultProps = {
	onLevelSelected: undefined,
}

export { LevelSelection }
