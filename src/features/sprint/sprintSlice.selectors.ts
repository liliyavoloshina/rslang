import { RootState } from '~/app/store'

export const selectSprintState = ({ sprint }: RootState) => ({
	word: sprint.currentWord?.word,
	suggestedTranslation: sprint.suggestedTranslation,
	correctOption: sprint.currentWord && sprint.suggestedTranslation === sprint.currentWord?.word,
	correctWords: sprint.correctWords,
	incorrectWords: sprint.incorrectWords,
	status: sprint.status,
})
