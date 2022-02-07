import AudioCall from '~/views/Audiocall'
import Home from '~/views/Home'
import SignIn from '~/views/SignIn'
import SignUp from '~/views/SignUp'
import Sprint from '~/views/Sprint'
import Statistic from '~/views/Statistic'
import Textbook from '~/views/Textbook'

enum Paths {
	HOME = '/',
	TEXTBOOK = 'textbook',
	STATISTIC = 'statistic',
	AUDIOCALL = 'audiocall',
	SIGNIN = 'signin',
	SIGNUP = 'signup',
	SPRINT = 'sprint',
}

const RouteByPath: Record<Paths, () => JSX.Element> = {
	[Paths.HOME]: Home,
	[Paths.TEXTBOOK]: Textbook,
	[Paths.STATISTIC]: Statistic,
	[Paths.AUDIOCALL]: AudioCall,
	[Paths.SIGNIN]: SignIn,
	[Paths.SIGNUP]: SignUp,
	[Paths.SPRINT]: Sprint,
}

export { Paths, RouteByPath }
