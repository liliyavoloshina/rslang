import { ChangeEvent, SyntheticEvent, useEffect, useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'

import Alert from '@mui/lab/Alert'
import LoadingButton from '@mui/lab/LoadingButton'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import { useAppDispatch, useAppSelector } from '~/app/hooks'
import { clearError, selectAuthIsLoggedIn, selectAuthLoading, selectAuthSignInError, signIn } from '~/features/auth'
import { validateEmail } from '~/utils/helpers'

function SignIn() {
	const navigate = useNavigate()
	const dispatch = useAppDispatch()
	const loading = useAppSelector(selectAuthLoading)
	const isLoggedIn = useAppSelector(selectAuthIsLoggedIn)
	const signInError = useAppSelector(selectAuthSignInError)

	const [emailData, setEmailData] = useState('')
	const [emailError, setEmailError] = useState('')
	const [passwordData, setPasswordData] = useState('')
	const [passwordError, setPasswordError] = useState('')

	useEffect(() => {
		if (!emailData) return

		setEmailError(validateEmail(emailData) ? '' : 'Invalid E-mail!')
	}, [emailData])

	useEffect(() => {
		if (!passwordData) return

		setPasswordError(passwordData.length < 7 ? 'Password is too short!' : '')
	}, [passwordData])

	useEffect(() => {
		dispatch(clearError())
	}, [dispatch, emailData, passwordData])

	const handleSubmit = (e: SyntheticEvent) => {
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
	}, [navigate, isLoggedIn])

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
					<TextField value={emailData} onChange={(e: ChangeEvent<HTMLInputElement>) => setEmailData(e.target.value)} label="Email" error={!!emailError} helperText={emailError} />
				</FormControl>
				<FormControl fullWidth sx={{ my: 1 }}>
					<TextField
						value={passwordData}
						onChange={(e: ChangeEvent<HTMLInputElement>) => setPasswordData(e.target.value)}
						label="Password"
						type="password"
						error={!!passwordError}
						helperText={passwordError}
					/>
				</FormControl>
				<LoadingButton fullWidth type="submit" disabled={!!passwordError || !!emailError} loading={loading} loadingIndicator="Loading..." variant="outlined">
					Sign In
				</LoadingButton>
				<Button sx={{ my: 1 }} fullWidth variant="text" component={RouterLink} to="/signup">
					Don&#39;t have an account?
				</Button>
			</Box>
		</Stack>
	)
}

export default SignIn
