import React from 'react'
import Pagination from '@mui/material/Pagination'
import Stack from '@mui/material/Stack'
import PaginationItem from '@mui/material/PaginationItem'
import { lightGreen } from '@mui/material/colors'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { selectTextbookPage, changePage, fetchTextbookWords, selectTextbookCompletedPages, selectTextbookGroup } from '../../features/textbook/textbookSlice'

export default function TextbookPagination() {
	const dispatch = useAppDispatch()
	const page = useAppSelector(selectTextbookPage) + 1
	const group = useAppSelector(selectTextbookGroup)
	const completedPages = useAppSelector(selectTextbookCompletedPages)

	const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
		dispatch(changePage(value - 1))
		dispatch(fetchTextbookWords())
	}

	return (
		<Stack spacing={2} sx={{ alignItems: 'center' }}>
			<Pagination
				count={30}
				variant="outlined"
				page={page}
				color="primary"
				onChange={handleChange}
				renderItem={item => {
					let isCompleted = false
					if (Object.keys(completedPages).length !== 0) {
						if (completedPages[group]) {
							const completed = item.type === 'page' && completedPages[group][item.page - 1]
							isCompleted = !!completed
						}
					}

					item.color = isCompleted ? 'standard' : 'primary'

					return <PaginationItem {...item} sx={{ backgroundColor: isCompleted ? `${lightGreen[100]}` : '' }} />
				}}
			/>
		</Stack>
	)
}
