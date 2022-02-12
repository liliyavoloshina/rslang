import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { SelectChangeEvent } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Typography from '@mui/material/Typography'

import { useAppDispatch } from '~/app/hooks'
import { toggleLevelSelection } from '~/features/audiocall'

import { LevelSelectionProps } from './LevelSelection.types'

const LevelSelection = ({ title, description, onLevelSelected }: LevelSelectionProps) => {
	const { t } = useTranslation()

	const [group, setGroup] = useState(0)

	const dispatch = useAppDispatch()

	const handleChange = (event: SelectChangeEvent<number>) => {
		const newGroup = +event.target.value
		setGroup(newGroup)
	}

	const handlePlay = () => {
		onLevelSelected?.(group)
		dispatch(toggleLevelSelection(false))
	}

	return (
		<Container maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
			<Box>
				<Typography variant="h2">{title}</Typography>
				<Typography variant="subtitle2" gutterBottom component="div">
					{description}
				</Typography>
			</Box>
			<FormControl>
				<InputLabel>{t('LEVEL_SELECTION.SELECT_LEVEL')}</InputLabel>
				<Select<number> value={group} label={t('LEVEL_SELECTION.SELECT_LEVEL')} onChange={handleChange}>
					<MenuItem value={0}>{t('LEVEL_SELECTION.GROUP', { count: 1 })}</MenuItem>
					<MenuItem value={1}>{t('LEVEL_SELECTION.GROUP', { count: 2 })}</MenuItem>
					<MenuItem value={2}>{t('LEVEL_SELECTION.GROUP', { count: 3 })}</MenuItem>
					<MenuItem value={3}>{t('LEVEL_SELECTION.GROUP', { count: 4 })}</MenuItem>
					<MenuItem value={4}>{t('LEVEL_SELECTION.GROUP', { count: 5 })}</MenuItem>
					<MenuItem value={5}>{t('LEVEL_SELECTION.GROUP', { count: 6 })}</MenuItem>
				</Select>
			</FormControl>
			<Button variant="contained" onClick={handlePlay}>
				{t('LEVEL_SELECTION.PLAY')}
			</Button>
		</Container>
	)
}

LevelSelection.defaultProps = {
	onLevelSelected: undefined,
}

export { LevelSelection }
