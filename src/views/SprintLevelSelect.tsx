import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { LevelSelection } from '~/components/game'
import { Path } from '~/components/router'
import { GAME_TIME } from '~/utils/constants'

function Sprint() {
	const { t } = useTranslation()

	const navigate = useNavigate()

	const onLevelSelected = (group: number) => navigate(`${Path.SPRINT}/${group}`)

	return <LevelSelection title={t('SPRINT.TITLE')} description={t('SPRINT.DESCRIPTION', { count: GAME_TIME })} onLevelSelected={onLevelSelected} />
}

export default Sprint
