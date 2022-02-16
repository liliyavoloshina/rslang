import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { SelectChangeEvent } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Typography from '@mui/material/Typography'
import { indigo, lightGreen } from '@mui/material/colors'

import { useAppDispatch } from '~/app/hooks'
import { toggleLevelSelection } from '~/features/audiocall'

import { LevelSelectionProps } from './LevelSelection.types'

const LevelSelection = ({ title, description, controls, type, onLevelSelected }: LevelSelectionProps) => {
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

	const bgColor = type === 'audiocall' ? `linear-gradient(to right top, ${indigo[100]}, #fff)` : `linear-gradient(to right bottom, ${lightGreen[100]}, #fff)`

	return (
		<Box sx={{ height: '100%', background: bgColor }}>
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
				</Box>
			</Container>
		</Box>
	)
}

LevelSelection.defaultProps = {
	onLevelSelected: undefined,
}

export { LevelSelection }
