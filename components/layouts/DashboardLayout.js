import React from 'react';
import Link from 'next/link';
import { styled } from '@mui/material/styles';

import { AppBar as MuiAppBar, Avatar, Box, CircularProgress, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, TextField, Toolbar, Typography } from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import HomeIcon from '@mui/icons-material/Home';
import LaunchIcon from '@mui/icons-material/Launch';
import SearchIcon from '@mui/icons-material/Search';
import GuildNavigator from '../GuildNavigator';
import AppBarUser from '../AppBarUser';

const drawerWidth = 280;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
    }),
    marginLeft: 0,
    ...(open && {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen
        }),
        marginLeft: `${drawerWidth}px`
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

export default function DashboardLayout(props) {
    /** @type {Boolean} */ const loading = props.loading;
    /** @type {Boolean} */ const mobile = props.mobile;
    /** @type {import('next-auth').Session} */ const session = props.session;
    /** @type {Guild} */ const guilds = props.guilds;
    
    const [ drawerOpen, setDrawerOpen ] = React.useState(!mobile);
    React.useEffect(() => setDrawerOpen(!mobile), [ mobile ]);
    const [ filter, setFilter ] = React.useState('');
    
    return (
        <>
            <AppBar position="fixed" open={drawerOpen && !mobile}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={() => setDrawerOpen(true)}
                        edge="start"
                        sx={{ mr: 2, ...(drawerOpen && { display: 'none' }) }}>
                        <MenuIcon />
                    </IconButton>
                    {/* <Typography variant="h6" noWrap component="div">{guild && !mobile ? `${guild.name} | ` : ''}{title}</Typography> */}
                    <Box sx={{ flexGrow: 1 }}></Box>
                    <Box sx={{ flexGrow: 0, display: loading ? 'none' : 'block' }}>
                        <AppBarUser session={session} mobile={mobile} />
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
                    <IconButton onClick={() => setDrawerOpen(false)}>
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
                    <Link href={`https://discord.com/api/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&permissions=8&scope=bot`}>
                        <ListItem disablePadding>
                            <ListItemButton>
                                <ListItemIcon>
                                    <LaunchIcon></LaunchIcon>
                                </ListItemIcon>
                                <ListItemText primary='Invite Bot' />
                            </ListItemButton>
                        </ListItem>
                    </Link>

                    <Divider />

                    <ListItem disablePadding>
                        <Box style={{ padding: '8px 16px 8px 16px', flexGrow: 1, display: 'flex', alignItems: 'flex-end' }}>
                            <SearchIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                            <TextField
                                error={guilds.length != 0 && guilds.filter(guild => guild.name.toLowerCase().includes(filter)).length == 0}
                                variant='standard'
                                label='Filter servers...'
                                style={{ width: '100%' }}
                                onChange={e => setFilter(e.target.value.toLowerCase())}
                            />
                        </Box>
                    </ListItem>

                    { guilds ? guilds.filter(guild => guild.name.toLowerCase().includes(filter)).map(guild => (
                        <GuildNavigator key={guild.id} guild={guild} />
                    )) : '' }
                </List>
            </Drawer>
            <Main className={loading ? 'loading' : ''} open={drawerOpen && !mobile} style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'scroll' }}>
                <DrawerHeader />
                { loading ? <LoadingCircle open={!drawerOpen && !mobile} className='loading-progress' /> : props.children }
            </Main>
        </>
    );
}