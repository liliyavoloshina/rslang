import { SelectChangeEvent } from '@mui/material'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'

import { useAppDispatch, useAppSelector } from '~/app/hooks'
import { selectAuthIsLoggedIn } from '~/features/auth'
import { changeGroup, fetchDifficultWords, fetchTextbookWords, selectTextbookGroup } from '~/features/textbook'

export default function SectionDropdown() {
	const dispatch = useAppDispatch()
	const group = useAppSelector(selectTextbookGroup)
	const isLoggedIn = useAppSelector(selectAuthIsLoggedIn)

	const handleChange = (event: SelectChangeEvent) => {
		const selectedGroup = +event.target.value

		if (selectedGroup === 6) {
			dispatch(changeGroup(selectedGroup))
			dispatch(fetchDifficultWords())
		} else {
			dispatch(changeGroup(selectedGroup))
			dispatch(fetchTextbookWords())
		}
	}

	return (
		<FormControl>
			<InputLabel>Word group</InputLabel>
			<Select value={`${group}`} label="Word group" onChange={handleChange}>
				<MenuItem value={0}>Group 1</MenuItem>
				<MenuItem value={1}>Group 2</MenuItem>
				<MenuItem value={2}>Group 3</MenuItem>
				<MenuItem value={3}>Group 4</MenuItem>
				<MenuItem value={4}>Group 5</MenuItem>
				<MenuItem value={5}>Group 6</MenuItem>
				{isLoggedIn && <MenuItem value={6}>Difficult</MenuItem>}
			</Select>
		</FormControl>
	)
}
