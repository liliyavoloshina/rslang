import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import LoadingButton from '@mui/lab/LoadingButton'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { signUp, selectAuthLoading, clearError, selectAuthSignUpError, selectAuthIsLoggedIn, selectAuthIsSignUpInProcess, signIn } from '../features/auth/authSlice'
import { validateEmail } from '../utils/helpers'

function SignUp() {
	const navigate = useNavigate()
	const dispatch = useAppDispatch()
	const loading = useAppSelector(selectAuthLoading)
	const signUpError = useAppSelector(selectAuthSignUpError)
	const isLoggedIn = useAppSelector(selectAuthIsLoggedIn)
	const isSignUpInProcess = useAppSelector(selectAuthIsSignUpInProcess)

	const [nameData, setNameData] = useState('')
	const [nameError, setNameError] = useState('')
	const [emailData, setEmailData] = useState('')
	const [emailError, setEmailError] = useState('')
	const [passwordData, setPasswordData] = useState('')
	const [passwordError, setPasswordError] = useState('')

	useEffect(() => {
		if (!nameData) return

		if (nameData.length >= 2) {
			setNameError('')
		} else {
			setNameError('Name is too short!')
		}
	}, [nameData])

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
	}, [nameData, emailData, passwordData])

	const handleSubmit = async (e: React.SyntheticEvent) => {
		e.preventDefault()

		if (!nameData || !passwordData || !emailData) {
			setNameError('Name is too short!')
			setEmailError('Invalid E-mail!')
			setPasswordError('Password is too short!')
		}

		await dispatch(signUp({ name: nameData, email: emailData, password: passwordData }))
	}

	useEffect(() => {
		if (!signUpError) {
			dispatch(signIn({ email: emailData, password: passwordData }))
		}
	}, [isSignUpInProcess])

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
					Sign Up
				</Typography>
				{signUpError && (
					<Alert severity="error" sx={{ my: 2 }}>
						{signUpError}
					</Alert>
				)}
				<FormControl fullWidth sx={{ my: 1 }}>
					<TextField value={nameData} onChange={e => setNameData(e.target.value)} label="Name" error={!!nameError} helperText={nameError} />
				</FormControl>
				<FormControl fullWidth sx={{ my: 1 }}>
					<TextField value={emailData} onChange={e => setEmailData(e.target.value)} label="Email" error={!!emailError} helperText={emailError} />
				</FormControl>
				<FormControl fullWidth sx={{ my: 1 }}>
					<TextField value={passwordData} onChange={e => setPasswordData(e.target.value)} label="Password" type="password" error={!!passwordError} helperText={passwordError} />
				</FormControl>
				<LoadingButton sx={{ my: 1 }} fullWidth type="submit" disabled={!!passwordError || !!emailError} loading={loading} loadingIndicator="Loading..." variant="outlined">
					Sign Up
				</LoadingButton>
				<Button sx={{ my: 1 }} fullWidth variant="text" component={RouterLink} to="/signin">
					Already have an account?
				</Button>
			</Box>
		</Stack>
	)
}

export default SignUp
