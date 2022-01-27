import React from 'react'
import { Pagination, Stack } from '@mui/material'

export default function TextbookPagination() {
	return (
		<Stack spacing={2} sx={{ alignItems: 'center' }}>
			<Pagination count={10} variant="outlined" color="primary" />
		</Stack>
	)
}
