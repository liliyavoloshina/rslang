interface Word {
	id: string
	_id?: string
	group: number
	page: number
	word: string
	image: string
	audio: string
	audioMeaning: string
	audioExample: string
	textMeaning: string
	textExample: string
	transcription: string
	textExampleTranslate: string
	textMeaningTranslate: string
	wordTranslate: string
	userWord?: UserWord
}

interface UserWordOptional {
	correctAnswers: number
	incorrectAnswers: number
	isLearned: boolean
}

interface UserWord {
	difficulty?: string
	optional?: Record<string, unknown> | UserWordOptional
}

enum WordDifficulty {
	Difficult = 'difficult',
	Normal = 'normal',
}

export type { Word, UserWord, UserWordOptional }
export { WordDifficulty }
