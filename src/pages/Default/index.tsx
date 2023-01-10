import React, { useEffect } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'

import {
	CssBaseline,
	Box,
	Drawer,
	Toolbar,
	List,
	Typography,
	Divider,
	IconButton,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Button,
	Chip,
	Avatar
} from '@mui/material'

import {
	ChevronRight,
	ChevronLeft,
	Menu as MenuIcon,
	DashboardRounded,
	BarChartRounded,
	ReceiptLongRounded,
	GroupsRounded,
	TextSnippetRounded,
	DirectionsBikeRounded,
	LoginRounded,
	AccountCircleRounded
} from '@mui/icons-material'

import { useTheme } from '@mui/material/styles'
import { AppBar, DrawerHeader, drawerWidth, LogoMenuDrawer, Main } from './styles'

import { adminPages as defaultAdminPages, userPages as defaultUserPages } from 'static/pagination'
import IPagination from 'interfaces/IPagination'
import { useUserContext } from 'contexts/UserContext'
import { theme as defaultTheme } from 'styles/theme'

export default function DefaultPage({children}: {children?: any}) {
	const [open, setOpen] = React.useState(true)
	const [userPages] = React.useState<IPagination[]>(defaultUserPages)
	const [adminPages, setAdminPages] = React.useState<IPagination[]>([])

	const theme = useTheme()
	const navigate = useNavigate()
	const { logout, user, token } = useUserContext()

	useEffect(() => {
		user.nivel_id === 2 ? setAdminPages(defaultAdminPages) : setAdminPages([])
	}, [user, token])

	const handleDrawerOpen = () => {
		setOpen(true)
	}
	const handleDrawerClose = () => {
		setOpen(false)
	}

	return (
		<Box sx={{ display: 'flex' }}>
			<CssBaseline />
			<AppBar position="fixed" open={open}>
				<Toolbar sx={{justifyContent: 'space-between'}}>
					<Box sx={{display: 'flex', alignItems: 'center'}}>
						<IconButton
							color="inherit"
							aria-label="open drawer"
							onClick={handleDrawerOpen}
							edge="start"
							sx={{ mr: 2, ...(open && { display: 'none' }) }}
						>
							<MenuIcon />
						</IconButton>
						<Typography variant="h6" noWrap component="div">BikeGR</Typography>
					</Box>
					<Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
						{user.nome && 
							<Link to='/system/me' style={{textDecoration: 'none'}}>
								<Chip
									avatar={<Avatar><b>{user.nome[0]}</b></Avatar>}
									variant='filled'
									style={{
										color: defaultTheme.colors.white,
										backgroundColor: defaultTheme.colors.orange,
										fontWeight: 900,
										letterSpacing: 1,
										textTransform: 'uppercase'
									}}
									label={`${user.nome.split(' ')[0]}`}
								/>
							</Link>
						}
						<Button
							variant='contained'
							color={!user.nivel_id ? 'success' : 'info'}
							onClick={() => logout()}
						>
							{(!user.nivel_id) && <><LoginRounded style={{marginRight: 6}}/> Login</>}
							{(user.nivel_id) && <><LoginRounded style={{marginRight: 6}}/> Sair</>}
						</Button>
					</Box>
				</Toolbar>
			</AppBar>
			<Drawer
				sx={{
					width: drawerWidth,
					flexShrink: 0,
					'& .MuiDrawer-paper': {
						width: drawerWidth,
						boxSizing: 'border-box',
					},
				}}
				variant="persistent"
				anchor="left"
				open={open}
			>
				<DrawerHeader sx={{ display: 'flex', justifyContent: 'space-between' }}>
					<LogoMenuDrawer src='/assets/logo.png' alt='Logo' />
					<IconButton onClick={handleDrawerClose}>
						{theme.direction === 'ltr' ? <ChevronLeft /> : <ChevronRight />}
					</IconButton>
				</DrawerHeader>
				<Divider />
				<List>
					{userPages.map((item) => (
						<ListItem key={item.id} disablePadding>
							<ListItemButton onClick={() => navigate(item.path)}>
								<ListItemIcon>
									{item.id == 1 ? <AccountCircleRounded />
										: item.id === 2 ? <ReceiptLongRounded />
											: item.id === 3 ? <TextSnippetRounded />
												: null}
								</ListItemIcon>
								<ListItemText primary={item.title} />
							</ListItemButton>
						</ListItem>
					))}
				</List>
				<Divider />
				<List>
					{adminPages.map((item) => (
						<ListItem key={item.id} disablePadding>
							<ListItemButton onClick={() => navigate(item.path)}>
								<ListItemIcon>
									{item.id === 1 ? <DashboardRounded /> :
										item.id === 2 ? <BarChartRounded /> :
											item.id === 3 ? <GroupsRounded /> :
												item.id === 4 ? <DirectionsBikeRounded /> :
													null}
								</ListItemIcon>
								<ListItemText primary={item.title} />
							</ListItemButton>
						</ListItem>
					))}
				</List>
			</Drawer>
			<Main open={open}>
				<DrawerHeader />
				<Outlet />
				{children}
			</Main>
		</Box>
	)
}