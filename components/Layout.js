import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { styled, useTheme } from '@mui/material/styles';

import { AppBar as MuiAppBar, Avatar, Box, CircularProgress, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, Toolbar, Typography, useMediaQuery } from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import HomeIcon from '@mui/icons-material/Home';
import LaunchIcon from '@mui/icons-material/Launch';
import ServerSelector from './ServerSelector';
import GuildNavigator from './GuildNavigator';

const drawerWidth = 280;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen
        }),
        marginLeft: 0
    })
}));

const AppBar = styled(MuiAppBar, { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
    transition: theme.transitions.create([ 'margin', 'width' ], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
    }),
    ...(open && {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create([ 'margin', 'width' ], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen
        })
    })
}));
  
const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end'
}));

const LoadingCircle = styled(CircularProgress, { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
    transition: theme.transitions.create([ 'margin', 'width' ], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
    }),
    ...(open && {
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create([ 'margin', 'width' ], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen
        })
    })
}));

export default function Layout(props) {
    const theme = useTheme();
    const router = useRouter();
    const mobile = !useMediaQuery('(min-width:600px)');

    /** @type {Boolean} */ const loading = props.loading;
    /** @type {import('next-auth').Session} */ const session = props.session;
    /** @type {string} */ const title = props.title;
    /** @type {Guild} */ const guild = props.guild;
    /** @type {Array<APIGuild>} */ const guilds = props.guilds;

    const [ drawerOpen, setDrawerOpen ] = React.useState(!mobile);
    React.useEffect(() => setDrawerOpen(!mobile), [ mobile ]);
    const handleDrawerOpen = () => setDrawerOpen(true);
    const handleDrawerClose = () => setDrawerOpen(false);

    const [ anchorElUser, setAnchorElUser ] = React.useState(null);
    const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
    const handleCloseUserMenu = () => setAnchorElUser(null);

    return (
        <>
            <AppBar position="fixed" open={drawerOpen && !mobile}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{ mr: 2, ...(drawerOpen && { display: 'none' }) }}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">{guild && !mobile ? `${guild.name} | ` : ''}{title}</Typography>
                    <Box sx={{ flexGrow: 1 }}></Box>
                    <Box sx={{ flexGrow: 0, display: loading ? 'none' : 'block' }}>
                        <IconButton onClick={handleOpenUserMenu} style={{ p: 0, borderRadius: '50px' }}>
                            { session ? <>
                                <Avatar src={session.displayAvatarURL} style={{ marginRight: '5px' }} />
                                <Typography>{session.username}#{session.discriminator}</Typography>
                            </> : <>
                                <Link href="https://discord.com/api/oauth2/authorize?client_id=1046820104144420934&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fcallback%2Fdiscord&response_type=code&scope=identify%20guilds">
                                    <Typography>Login</Typography>
                                </Link>
                            </> }
                        </IconButton>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right'
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right'
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            <MenuItem onClick={() => router.push(`/users/${session.id}`) && handleCloseUserMenu()}>
                                <Typography textAlign='center'>Profile</Typography>
                            </MenuItem>
                            <MenuItem onClick={() => router.push('/api/logout') && handleCloseUserMenu()}>
                                <Typography textAlign='center' color='tomato'>Logout</Typography>
                            </MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box'
                    }
                }}
                anchor="left"
                open={drawerOpen}
                variant={mobile ? 'temporary' : 'persistent'}
            >
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        <ChevronLeftIcon />
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List>
                    <Link href='/dashboard'>
                        <ListItem disablePadding>
                            <ListItemButton>
                                <ListItemIcon>
                                    <HomeIcon />
                                </ListItemIcon>
                                <ListItemText primary='Dashboard' />
                            </ListItemButton>
                        </ListItem>
                    </Link>
                    <Link href='https://discord.com/api/oauth2/authorize?client_id=1046820104144420934&permissions=8&scope=bot'>
                        <ListItem disablePadding>
                            <ListItemButton>
                                <ListItemIcon>
                                    <LaunchIcon></LaunchIcon>
                                </ListItemIcon>
                                <ListItemText primary='Invite Bot' />
                            </ListItemButton>
                        </ListItem>
                    </Link>
                    <Divider></Divider>
                    { guilds ? <ServerSelector guilds={guilds} /> : guild ? <GuildNavigator guild={guild} /> : '' }
                </List>
            </Drawer>
            <Main className={loading ? 'loading' : ''} open={drawerOpen || mobile} style={{ display: 'flex', flexDirection: 'column' }}>
                <DrawerHeader />
                { loading ? <LoadingCircle open={!drawerOpen && !mobile} className='loading-progress' /> : props.children }
            </Main>
        </>
    );
}