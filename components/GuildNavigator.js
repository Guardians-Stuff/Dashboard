import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { Avatar, Collapse, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

import InfoIcon from '@mui/icons-material/Info';
import GppMaybeIcon from '@mui/icons-material/GppMaybe';
import ChatIcon from '@mui/icons-material/Chat';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LockIcon from '@mui/icons-material/Lock';

export default function GuildNavigator(props) {
    const router = useRouter();

    /** @type {Guild} */ const guild = props.guild;

    /** @type {[ Boolean, Function ]} */ const [ openCollapse, setOpenCollapse ] = React.useState(false);
    React.useEffect(() => setOpenCollapse(router.query.guild == guild.id), [ router.query.guild, guild.id ]);
    const handleClick = event => {
        event.preventDefault();
        setOpenCollapse(!openCollapse);
    };

    return (
        <>
            <Link key={guild.id} href={guild.hasBot ? guild.authorized ? `/dashboard/guilds/${guild.id}` : '#' : `https://discord.com/api/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&permissions=8&scope=bot`}>
                <ListItem disablePadding>
                    <ListItemButton
                        sx={{
                            borderRadius: '8px',
                            margin: '4px 8px',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                background: 'rgba(60, 60, 60, 0.3)',
                                transform: 'translateX(4px)'
                            }
                        }}
                    >
                        <ListItemIcon>
                            <Avatar src={guild.iconURL}>{guild.name.slice(0, 1)}</Avatar>
                        </ListItemIcon>
                        <ListItemText 
                            primary={guild.hasBot ? guild.name : null} 
                            secondary={guild.hasBot ? null : guild.name}
                            primaryTypographyProps={{
                                sx: { color: 'rgba(255, 255, 255, 0.9)' }
                            }}
                            secondaryTypographyProps={{
                                sx: { color: 'rgba(200, 200, 200, 0.7)' }
                            }}
                        />
                        {guild.hasBot ? guild.authorized ? openCollapse ? 
                            <ExpandLessIcon 
                                onClick={handleClick} 
                                sx={{ color: 'rgba(255, 255, 255, 0.7)', transition: 'transform 0.3s ease', '&:hover': { transform: 'scale(1.2)' } }}
                            /> : 
                            <ExpandMoreIcon 
                                onClick={handleClick} 
                                sx={{ color: 'rgba(255, 255, 255, 0.7)', transition: 'transform 0.3s ease', '&:hover': { transform: 'scale(1.2)' } }}
                            /> : 
                            <LockIcon sx={{ color: 'rgba(150, 150, 150, 0.7)' }} /> : ''}
                    </ListItemButton>
                </ListItem>
            </Link>

            <Collapse in={openCollapse} timeout='auto' unmountOnExit>
                <List disablePadding sx={{ pl: 4 }}>
                    <ListItem onClick={() => router.push(`/dashboard/guilds/${guild.id}`, undefined, { shallow: true })} disablePadding>
                        <ListItemButton
                            sx={{
                                borderRadius: '8px',
                                margin: '2px 0',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    background: 'rgba(50, 50, 50, 0.3)',
                                    transform: 'translateX(4px)'
                                }
                            }}
                        >
                            <ListItemIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                <InfoIcon></InfoIcon>
                            </ListItemIcon>
                            <ListItemText 
                                primary='Overview'
                                primaryTypographyProps={{
                                    sx: { color: 'rgba(255, 255, 255, 0.9)' }
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                    <ListItem onClick={() => router.push(`/dashboard/guilds/${guild.id}?tab=infractions`, undefined, { shallow: true })} disablePadding>
                        <ListItemButton
                            sx={{
                                borderRadius: '8px',
                                margin: '2px 0',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    background: 'rgba(50, 50, 50, 0.3)',
                                    transform: 'translateX(4px)'
                                }
                            }}
                        >
                            <ListItemIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                <GppMaybeIcon></GppMaybeIcon>
                            </ListItemIcon>
                            <ListItemText 
                                primary='Infractions'
                                primaryTypographyProps={{
                                    sx: { color: 'rgba(255, 255, 255, 0.9)' }
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                    <ListItem onClick={() => router.push(`/dashboard/guilds/${guild.id}?tab=tickets`, undefined, { shallow: true })} disablePadding>
                        <ListItemButton
                            sx={{
                                borderRadius: '8px',
                                margin: '2px 0',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    background: 'rgba(50, 50, 50, 0.3)',
                                    transform: 'translateX(4px)'
                                }
                            }}
                        >
                            <ListItemIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                <ChatIcon></ChatIcon>
                            </ListItemIcon>
                            <ListItemText 
                                primary='Tickets'
                                primaryTypographyProps={{
                                    sx: { color: 'rgba(255, 255, 255, 0.9)' }
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Collapse>
        </>
    );
}