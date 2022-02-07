import AudioCall from '~/views/Audiocall'
import Home from '~/views/Home'
import SignIn from '~/views/SignIn'
import SignUp from '~/views/SignUp'
import Sprint from '~/views/Sprint'
import SprintLevelSelect from '~/views/SprintLevelSelect'
import Statistic from '~/views/Statistic'
import Textbook from '~/views/Textbook'

enum Path {
	HOME = '/',
	TEXTBOOK = '/textbook',
	STATISTIC = '/statistic',
	AUDIO_CALL = '/audiocall',
	SIGN_IN = '/signin',
	SIGN_UP = '/signup',
	SPRINT = '/sprint',
	SPRINT_WITH_GROUP = '/sprint/:group',
	SPRINT_WITH_GROUP_AND_PAGE = '/sprint/:group/:page',
}

const RouteByPath: Record<Path, () => JSX.Element> = {
	[Path.HOME]: Home,
	[Path.TEXTBOOK]: Textbook,
	[Path.STATISTIC]: Statistic,
	[Path.AUDIO_CALL]: AudioCall,
	[Path.SIGN_IN]: SignIn,
	[Path.SIGN_UP]: SignUp,
	[Path.SPRINT]: SprintLevelSelect,
	[Path.SPRINT_WITH_GROUP]: Sprint,
	[Path.SPRINT_WITH_GROUP_AND_PAGE]: Sprint,
}

export { Path, RouteByPath }
