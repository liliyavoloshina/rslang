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
}

interface UserWord {
	wordId?: string
	difficulty?: string
	optional?: Record<string, unknown> | UserWordOptional
}

enum WordDifficulty {
	Difficult = 'difficult',
	Normal = 'difficult',
}

export type { Word, UserWord }
export { WordDifficulty }
