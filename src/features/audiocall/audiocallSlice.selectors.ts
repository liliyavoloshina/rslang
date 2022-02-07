import { RootState } from '~/app/store'

export const selectAudiocallWords = (state: RootState) => state.audiocall.words
export const selectAudiocallAnswers = (state: RootState) => state.audiocall.answers
export const selectAudiocallCurrentIdx = (state: RootState) => state.audiocall.currentIdx
export const selectAudiocallCurrentWord = (state: RootState) => state.audiocall.currentWord
export const selectAudiocallStatus = (state: RootState) => state.audiocall.status
export const selectAudiocallIsLevelSelection = (state: RootState) => state.audiocall.isLevelSelection
export const selectAudiocallIsFinished = (state: RootState) => state.audiocall.isFinished