import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { CircularProgress } from '@mui/material'

import { useAppSelector } from '~/app/hooks'
import { Path } from '~/components/router'
import { selectAuthIsLoggedIn, signOut } from '~/features/auth'
import { localStorageRemoveUser } from '~/utils/localStorage'

const Logoff = () => {
	const dispatch = useDispatch()
	const isLoggedIn = useAppSelector(selectAuthIsLoggedIn)

	useEffect(() => {
		if (isLoggedIn) {
			dispatch(signOut())
			localStorageRemoveUser()
		} else {
			window.location.href = Path.HOME
		}
	}, [isLoggedIn, dispatch])

	return <CircularProgress />
}

export { Logoff }
