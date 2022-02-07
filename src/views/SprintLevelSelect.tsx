import { useNavigate } from 'react-router-dom'

import LevelSelection from '~/components/game/LevelSelection'
import { Path } from '~/components/router'
import { GameName } from '~/types/game'

function Sprint() {
	const navigate = useNavigate()

	const onLevelSelected = (group: number) => navigate(`${Path.SPRINT}/${group}`)

	return <LevelSelection gameName={GameName.Sprint} onLevelSelected={onLevelSelected} />
}

export default Sprint
