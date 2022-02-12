import Audiocall from '~/views/Audiocall'
import AudiocallLevelSelect from '~/views/AudiocallLevelSelect'
import Home from '~/views/Home'
import { Logoff } from '~/views/Logoff'
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
	AUDIOCALL = '/audiocall',
	AUDIOCALL_WITH_GROUP = '/audiocall/:group',
	AUDIOCALL_WITH_GROUP_AND_PAGE = '/audiocall/:group/:page',
	SIGN_IN = '/signin',
	SIGN_UP = '/signup',
	LOGOFF = '/logoff',
	SPRINT = '/sprint',
	SPRINT_WITH_GROUP = '/sprint/:group',
	SPRINT_WITH_GROUP_AND_PAGE = '/sprint/:group/:page',
}

const RouteByPath: Record<Path, () => JSX.Element> = {
	[Path.HOME]: Home,
	[Path.TEXTBOOK]: Textbook,
	[Path.STATISTIC]: Statistic,
	[Path.AUDIOCALL]: AudiocallLevelSelect,
	[Path.AUDIOCALL_WITH_GROUP]: Audiocall,
	[Path.AUDIOCALL_WITH_GROUP_AND_PAGE]: Audiocall,
	[Path.SIGN_IN]: SignIn,
	[Path.SIGN_UP]: SignUp,
	[Path.LOGOFF]: Logoff,
	[Path.SPRINT]: SprintLevelSelect,
	[Path.SPRINT_WITH_GROUP]: Sprint,
	[Path.SPRINT_WITH_GROUP_AND_PAGE]: Sprint,
}

export { Path, RouteByPath }
