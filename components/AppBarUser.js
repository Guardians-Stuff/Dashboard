import React from 'react';
import Link from 'next/link';

import { Avatar, Divider, IconButton, Menu, MenuItem, Typography } from '@mui/material';

import TextAvatar from './TextAvatar';

export default function AppBarUser(props){
    /** @type {import("next-auth").Session} */ const session = props.session;
    /** @type {Boolean} */ const mobile = props.mobile;
    /** @type {Boolean} */ const showDashboard = props.showDashboard;

    const [ anchorElUser, setAnchorElUser ] = React.useState(null);

    return (
        <>
            <IconButton onClick={e => setAnchorElUser(e.currentTarget)} style={{ p: 0, borderRadius: '50px' }}>
                { session ? <>
                    <TextAvatar variant='inline' src={`${session.displayAvatarURL}?size=40`} size='40px'>{ !mobile ? `${session.username}#${session.discriminator}` : ''}</TextAvatar>
                </> : <>
                    <Link href={`https://discord.com/api/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.NEXT_PUBLIC_HOST)}%2Fapi%2Fauth%2Fcallback%2Fdiscord&response_type=code&scope=identify%20guilds`}>
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
                open={!!anchorElUser && !!session}
                onClose={() => setAnchorElUser(null)}
            >
                {mobile && session ?
                    <>
                        <MenuItem disabled>
                            <Typography style={{ color: '#ffffff !important' }}>{session.username}#{session.discriminator}</Typography>
                        </MenuItem>

                        <Divider />
                    </>
                    : ''
                }

                {showDashboard ?
                    <Link href='/dashboard'>
                        <MenuItem onClick={() => setAnchorElUser(null)}>
                            <Typography textAlign='center'>Dashboard</Typography>
                        </MenuItem>
                    </Link>
                    : ''
                }
                <Link href={`/dashboard/users/${session?.id}`}>
                    <MenuItem onClick={() => setAnchorElUser(null)}>
                        <Typography textAlign='center'>Profile</Typography>
                    </MenuItem>
                </Link>
                <Link href='/api/logout'>
                    <MenuItem onClick={() => setAnchorElUser(null)}>
                        <Typography textAlign='center' color='tomato'>Logout</Typography>
                    </MenuItem>
                </Link>
            </Menu>
        </>
    );
}