import React from 'react'
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material'

export default function SectionDropdown() {
	const [section, setSection] = React.useState(0)

	const handleChange = (event: SelectChangeEvent) => {
		setSection(+event.target.value)
	}

	return (
		<FormControl>
			<InputLabel id="demo-simple-select-label">Section</InputLabel>
			<Select labelId="demo-simple-select-label" id="demo-simple-select" value={`${section}`} label="Section" onChange={handleChange}>
				<MenuItem value={0}>Section 1</MenuItem>
				<MenuItem value={1}>Section 2</MenuItem>
				<MenuItem value={2}>Section 3</MenuItem>
			</Select>
		</FormControl>
	)
}
