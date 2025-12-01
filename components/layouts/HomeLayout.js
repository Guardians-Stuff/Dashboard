import Link from 'next/link';
import { useRouter } from 'next/router';
import { styled } from '@mui/material/styles';

import { Box } from '@mui/system';
import { AppBar, IconButton, MenuItem, Toolbar, Typography } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';

import AppBarUser from '../AppBarUser';
import DiscordIcon from '../icons/DiscordIcon';

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end'
}));

const StyledAppBar = styled(AppBar)(({ theme }) => ({
    background: 'linear-gradient(135deg, rgba(18, 18, 18, 0.95) 0%, rgba(30, 30, 30, 0.95) 100%)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
    borderBottom: '1px solid rgba(80, 80, 80, 0.3)',
}));

const StyledMenuItem = styled(MenuItem, {
    shouldForwardProp: (prop) => prop !== 'active',
})(({ theme, active }) => ({
    position: 'relative',
    borderRadius: '8px',
    margin: '0 4px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&::after': {
        content: '""',
        position: 'absolute',
        bottom: 0,
        left: '50%',
        transform: active ? 'translateX(-50%) scaleX(1)' : 'translateX(-50%) scaleX(0)',
        width: '60%',
        height: '2px',
        background: 'linear-gradient(90deg, transparent, rgba(200, 200, 200, 0.8), transparent)',
        transition: 'transform 0.3s ease',
    },
    '&:hover': {
        background: 'rgba(60, 60, 60, 0.3)',
        transform: 'translateY(-2px)',
        '&::after': {
            transform: 'translateX(-50%) scaleX(1)',
        }
    },
    ...(active && {
        background: 'rgba(50, 50, 50, 0.4)',
    })
}));

export default function HomeLayout(props) {
    /** @type {import('next-auth').Session} */ const session = props.session;
    /** @type {Boolean} */ const mobile = props.mobile;
    const router = useRouter();

    const navItems = [
        { label: 'Home', path: '/' },
        { label: 'Commands', path: '/commands' },
        { label: 'Changelog', path: '/changelog' },
    ];

    return (
        <>
            <StyledAppBar position='fixed'>
                <Toolbar sx={{ px: { xs: 1, sm: 3 } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {navItems.map((item) => {
                            const isActive = router.pathname === item.path;
                            return (
                                <StyledMenuItem key={item.path} active={isActive}>
                                    <Link href={item.path} style={{ textDecoration: 'none', width: '100%' }}>
                                        <Typography 
                                            variant='h7' 
                                            noWrap 
                                            component="div"
                                            sx={{
                                                color: isActive ? '#fff' : 'rgba(255, 255, 255, 0.9)',
                                                fontWeight: isActive ? 600 : 500,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    color: '#fff',
                                                }
                                            }}
                                        >
                                            {item.label}
                                        </Typography>
                                    </Link>
                                </StyledMenuItem>
                            );
                        })}
                    </Box>

                    <Box sx={{ flexGrow: 1 }}></Box>

                    <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton
                            href="https://github.com/Guardians-Stuff"
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                                color: 'rgba(255, 255, 255, 0.9)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    color: '#fff',
                                    transform: 'translateY(-2px)',
                                    background: 'rgba(60, 60, 60, 0.3)',
                                }
                            }}
                        >
                            <GitHubIcon />
                        </IconButton>
                        <IconButton
                            href="https://discord.gg/m5vhwUDQvz"
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                                color: 'rgba(255, 255, 255, 0.9)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    color: '#fff',
                                    transform: 'translateY(-2px)',
                                    background: 'rgba(60, 60, 60, 0.3)',
                                }
                            }}
                        >
                            <DiscordIcon />
                        </IconButton>
                        <AppBarUser showDashboard session={session} mobile={mobile} />
                    </Box>
                </Toolbar>
            </StyledAppBar>
            <main style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'scroll' }}>
                <DrawerHeader />
                {props.children}
            </main>
        </>
    );
}