import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import Container from '@mui/material/Container'

import { useAppSelector } from '~/app/hooks'
import LevelSelection from '~/components/game/LevelSelection'
import SprintGame from '~/components/game/Sprint'
import { reset, selectSprintQuestion } from '~/features/sprint/sprintSlice'
import { GameName } from '~/types/game'

function Sprint() {
	const [group, setGroup] = useState<number | undefined>()
	const { isIdle } = useAppSelector(selectSprintQuestion)

	const dispatch = useDispatch()

	useEffect(() => {
		dispatch(reset())
	}, [dispatch])

	return (
		<Container maxWidth="sm" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
			{isIdle && <LevelSelection gameName={GameName.Sprint} onLevelSelected={setGroup} />}
			{group !== undefined && <SprintGame group={group} />}
		</Container>
	)
}

export default Sprint
