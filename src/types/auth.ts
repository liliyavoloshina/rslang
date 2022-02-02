interface SignInResponse {
	message: string
	token: string
	refreshToken: string
	userId: string
	name: string
}

interface SignInData {
	email: string
	password: string
}

interface UserInfo {
	token: string
	refreshToken: string
	userId: string
	name: string
}

export type { SignInResponse, SignInData, UserInfo }
