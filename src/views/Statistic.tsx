import { useTranslation } from 'react-i18next'

function Statistic() {
	const { t } = useTranslation()
	return (
		<div className="statistic">
			<h1>{t('STATISTIC.TITLE')}</h1>
		</div>
	)
}

export default Statistic
