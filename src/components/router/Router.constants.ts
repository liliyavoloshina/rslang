import Audiocall from '~/views/Audiocall'
import AudiocallLevelSelect from '~/views/AudiocallLevelSelect'
import Home from '~/views/Home'
import { Logoff } from '~/views/Logoff'
import SignIn from '~/views/SignIn'
import SignUp from '~/views/SignUp'
import Sprint from '~/views/Sprint'
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
	[Path.SPRINT]: Sprint,
}

export { Path, RouteByPath }
