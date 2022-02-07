import { Route, Routes } from 'react-router-dom'

import { RouteByPath } from './Router.constants'

const Router = () => (
	<Routes>
		{Object.entries(RouteByPath).map(([path, RouteElement]) => (
			<Route key={path} path={path} element={<RouteElement />} />
		))}
	</Routes>
)

export { Router }
