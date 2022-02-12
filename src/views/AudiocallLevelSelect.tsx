import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { LevelSelection } from '~/components/game'
import { Path } from '~/components/router'

// TODO: maybe somehow combine that with sprintlevelselection component?
function AudiocallLevelSelect() {
	const { t } = useTranslation()

	const navigate = useNavigate()

	const onLevelSelected = (group: number) => navigate(`${Path.AUDIOCALL}/${group}`)

	return <LevelSelection title={t('AUDIOCALL.TITLE')} description={t('AUDIOCALL.DESCRIPTION')} onLevelSelected={onLevelSelected} />
}

export default AudiocallLevelSelect
