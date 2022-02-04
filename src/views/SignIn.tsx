import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import LoadingButton from '@mui/lab/LoadingButton'
import Alert from '@mui/lab/Alert'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { signIn, selectAuthLoading, selectAuthIsLoggedIn, selectAuthSignInError, clearError } from '../features/auth/authSlice'

function SignIn() {
	const navigate = useNavigate()
	const dispatch = useAppDispatch()
	const loading = useAppSelector(selectAuthLoading)
	const isLoggedIn = useAppSelector(selectAuthIsLoggedIn)
	const signInError = useAppSelector(selectAuthSignInError)

	const [emailData, setEmailData] = useState<string>('')
	const [emailError, setEmailError] = useState<string>('')
	const [passwordData, setPasswordData] = useState<string>('')
	const [passwordError, setPasswordError] = useState<string>('')

	const validateEmail = (email: string) => {
		return String(email)
			.toLowerCase()
			.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
	}

	useEffect(() => {
		if (!emailData) return

		if (validateEmail(emailData)) {
			setEmailError('')
		} else {
			setEmailError('Invalid E-mail!')
		}
	}, [emailData])

	useEffect(() => {
		if (!passwordData) return

		if (passwordData.length >= 6) {
			setPasswordError('')
		} else {
			setPasswordError('Password is too short!')
		}
	}, [passwordData])

	useEffect(() => {
		dispatch(clearError())
	}, [emailData, passwordData])

	const handleSubmit = (e: React.SyntheticEvent) => {
		e.preventDefault()

		if (!passwordData || !emailData) {
			setEmailError('Invalid E-mail!')
			setPasswordError('Password is too short!')
		}

		dispatch(signIn({ email: emailData, password: passwordData }))
	}

	// eslint-disable-next-line consistent-return
	useEffect(() => {
		if (isLoggedIn) {
			return navigate('/')
		}
	}, [isLoggedIn])

	return (
		<Stack alignItems="center" justifyContent="center" sx={{ height: '100%' }}>
			<Box component="form" onSubmit={handleSubmit}>
				<Typography variant="h3" gutterBottom>
					Sign In
				</Typography>
				{signInError && (
					<Alert severity="error" sx={{ my: 2 }}>
						{signInError}
					</Alert>
				)}
				<FormControl fullWidth sx={{ my: 1 }}>
					<TextField value={emailData} onChange={e => setEmailData(e.target.value)} label="Email" error={!!emailError} helperText={emailError} />
				</FormControl>
				<FormControl fullWidth sx={{ my: 1 }}>
					<TextField value={passwordData} onChange={e => setPasswordData(e.target.value)} label="Password" type="password" error={!!passwordError} helperText={passwordError} />
				</FormControl>
				<LoadingButton fullWidth type="submit" disabled={!!passwordError || !!emailError} loading={loading} loadingIndicator="Loading..." variant="outlined">
					Sign In
				</LoadingButton>
			</Box>
		</Stack>
	)
}

export default SignIn
