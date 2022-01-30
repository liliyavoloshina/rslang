import React from 'react'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { SelectChangeEvent } from '@mui/material'
// import { createStyles } from '@mui/material/styles'
import { changeGroup, selectTextbookGroup, fetchTextbookWords } from '../../features/textbook/textbookSlice'

import { useAppDispatch, useAppSelector } from '../../app/hooks'

// interface StyleProps {
// 	color: string
// }

// const useStyles = ({ color }: StyleProps) =>
// 	createStyles({
// 		select: {
// 			'&:before': {
// 				borderColor: color,
// 			},
// 			'&:after': {
// 				borderColor: color,
// 			},
// 			'&:not(.Mui-disabled):hover::before': {
// 				borderColor: color,
// 			},
// 		},
// 		// root: {
// 		// 	color,
// 		// },
// 	})

export default function SectionDropdown() {
	const dispatch = useAppDispatch()
	const group = useAppSelector(selectTextbookGroup)

	const handleChange = (event: SelectChangeEvent) => {
		const newGroup = +event.target.value
		dispatch(changeGroup(newGroup))
		dispatch(fetchTextbookWords())
	}

	return (
		<FormControl>
			<InputLabel id="demo-simple-select-label">Word group</InputLabel>
			<Select labelId="demo-simple-select-label" id="demo-simple-select" value={`${group}`} label="Word group" onChange={handleChange}>
				<MenuItem value={0}>Group 1</MenuItem>
				<MenuItem value={1}>Group 2</MenuItem>
				<MenuItem value={2}>Group 3</MenuItem>
				<MenuItem value={3}>Group 4</MenuItem>
				<MenuItem value={4}>Group 5</MenuItem>
				<MenuItem value={5}>Group 6</MenuItem>
			</Select>
		</FormControl>
	)
}
