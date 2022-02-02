import * as React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Menu as MenuIcon } from '@mui/icons-material'
import { Link, MenuItem, Tooltip, Button, Container, Menu, Typography, IconButton, Toolbar, Box, AppBar } from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'

const pages = [
	{
		name: 'Home',
		path: '/',
	},
	{
		name: 'Textbook',
		path: 'textbook',
	},
	{
		name: 'Statistic',
		path: 'statistic',
	},
]

const games = [
	{
		name: 'Sprint',
		path: 'sprint',
	},
	{
		name: 'Audiocall',
		path: 'audiocall',
	},
]

const settings = ['Profile', 'Account', 'Dashboard', 'Logout']

function Header() {
	const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null)
	const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null)
	const [anchorElGames, setAnchorElGames] = React.useState<null | HTMLElement>(null)

	const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElNav(event.currentTarget)
	}

	const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElUser(event.currentTarget)
	}

	const handleOpenGamesMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElGames(event.currentTarget)
	}

	const handleCloseNavMenu = () => {
		setAnchorElNav(null)
	}

	const handleCloseUserMenu = () => {
		setAnchorElUser(null)
	}

	const handleCloseGamesMenu = () => {
		setAnchorElGames(null)
	}

	return (
		<AppBar position="static" color="primary" className="header">
			<Container maxWidth="xl">
				<Toolbar disableGutters>
					<Typography variant="h6" noWrap component="div" sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}>
						LOGO
					</Typography>

					<Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
						<IconButton size="large" aria-label="account of current user" aria-controls="menu-appbar" aria-haspopup="true" onClick={handleOpenNavMenu} color="inherit">
							<MenuIcon />
						</IconButton>
						<Menu
							id="menu-appbar"
							anchorEl={anchorElNav}
							anchorOrigin={{
								vertical: 'bottom',
								horizontal: 'left',
							}}
							keepMounted
							transformOrigin={{
								vertical: 'top',
								horizontal: 'left',
							}}
							open={Boolean(anchorElNav)}
							onClose={handleCloseNavMenu}
							sx={{
								display: { xs: 'block', md: 'none' },
							}}
						>
							{pages.map((page, idx) => (
								<MenuItem key={page.name} onClick={handleCloseNavMenu}>
									<Link underline="none" key={idx} component={RouterLink} to={page.path}>
										<Typography textAlign="center">{page.name}</Typography>
									</Link>
								</MenuItem>
							))}
							{games.map((page, idx) => (
								<MenuItem key={page.name} onClick={handleCloseNavMenu}>
									<Link underline="none" key={idx} component={RouterLink} to={page.path}>
										<Typography textAlign="center">{page.name}</Typography>
									</Link>
								</MenuItem>
							))}
						</Menu>
					</Box>

					{/* desktop  */}
					<Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
						LOGO
					</Typography>
					<Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
						{pages.map((page, idx) => (
							<Button component={RouterLink} to={page.path} key={idx} onClick={handleCloseNavMenu} sx={{ my: 2, color: 'white', display: 'block' }}>
								{page.name}
							</Button>
						))}

						<Tooltip title="Open Games">
							<Button onClick={handleOpenGamesMenu} sx={{ display: 'block', color: 'white' }}>
								Games
							</Button>
						</Tooltip>
						<Menu
							sx={{ mt: '45px' }}
							id="games-menu-appbar"
							anchorEl={anchorElGames}
							anchorOrigin={{
								vertical: 'top',
								horizontal: 'right',
							}}
							keepMounted
							transformOrigin={{
								vertical: 'top',
								horizontal: 'right',
							}}
							open={Boolean(anchorElGames)}
							onClose={handleCloseGamesMenu}
						>
							{games.map((game, idx) => (
								<MenuItem key={game.name} onClick={handleCloseNavMenu}>
									<Link underline="none" key={idx} component={RouterLink} to={game.path} state={{ fromTextbook: false }}>
										<Typography textAlign="center">{game.name}</Typography>
									</Link>
								</MenuItem>
							))}
						</Menu>
					</Box>

					<Box sx={{ flexGrow: 0 }}>
						<Tooltip title="Open Account">
							<IconButton onClick={handleOpenUserMenu} sx={{ color: 'white' }}>
								<PersonIcon />
							</IconButton>
						</Tooltip>
						<Menu
							sx={{ mt: '45px' }}
							id="menu-appbar"
							anchorEl={anchorElUser}
							anchorOrigin={{
								vertical: 'top',
								horizontal: 'right',
							}}
							keepMounted
							transformOrigin={{
								vertical: 'top',
								horizontal: 'right',
							}}
							open={Boolean(anchorElUser)}
							onClose={handleCloseUserMenu}
						>
							{settings.map(setting => (
								<MenuItem key={setting} onClick={handleCloseUserMenu}>
									<Typography textAlign="center">{setting}</Typography>
								</MenuItem>
							))}
						</Menu>
					</Box>
				</Toolbar>
			</Container>
		</AppBar>
	)
}
export default Header
