import { useNavigate } from 'react-router-dom'

import LevelSelection from '~/components/game/LevelSelection'
import { Path } from '~/components/router'
import { GameName } from '~/types/game'

// TODO: maybe somehow combine that with sprintlevelselection component?
function AudiocallLevelSelect() {
	const navigate = useNavigate()

	const onLevelSelected = (group: number) => navigate(`${Path.AUDIOCALL}/${group}`)

	return <LevelSelection gameName={GameName.Audiocall} onLevelSelected={onLevelSelected} />
}

export default AudiocallLevelSelect
