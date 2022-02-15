import { initReactI18next } from 'react-i18next'

import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import en from '../locales/en.json'
import ru from '../locales/ru.json'

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
	en: {
		translation: en,
	},
	ru: {
		translation: ru,
	},
}

const defaultNS = 'translation'

i18n
	.use(initReactI18next) // passes i18n down to react-i18next
	.use(LanguageDetector)
	.init({
		resources,
		defaultNS,
		fallbackLng: 'en',
		interpolation: {
			escapeValue: false, // react already safes from xss
		},
	})

export { resources, defaultNS }
