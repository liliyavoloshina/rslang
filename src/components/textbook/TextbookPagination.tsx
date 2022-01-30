import React from 'react'
import { Pagination, Stack } from '@mui/material'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { selectTextbookPage, changePage, fetchTextbookWords } from '../../features/textbook/textbookSlice'

export default function TextbookPagination() {
	const dispatch = useAppDispatch()
	const page = useAppSelector(selectTextbookPage) + 1

	const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
		dispatch(changePage(value - 1))
		dispatch(fetchTextbookWords())
	}

	return (
		<Stack spacing={2} sx={{ alignItems: 'center' }}>
			<Pagination count={30} variant="outlined" color="primary" page={page} onChange={handleChange} />
		</Stack>
	)
}
