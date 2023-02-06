import React from 'react';
import Link from 'next/link';

import { ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

import InfoIcon from '@mui/icons-material/Info';
import GppMaybeIcon from '@mui/icons-material/GppMaybe';
import ChatIcon from '@mui/icons-material/Chat';

export default function GuildNavigator(props) {
    /** @type {Guild} */ const guild = props.guild;

    return (
        <>
            <Link href={`/guilds/${guild.id}`}>
                <ListItem disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <InfoIcon></InfoIcon>
                        </ListItemIcon>
                        <ListItemText primary='Overview' />
                    </ListItemButton>
                </ListItem>
            </Link>
            <Link href={`/guilds/${guild.id}/infractions`}>
                <ListItem disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <GppMaybeIcon></GppMaybeIcon>
                        </ListItemIcon>
                        <ListItemText primary='Infractions' />
                    </ListItemButton>
                </ListItem>
            </Link>
            <Link href={`/guilds/${guild.id}/tickets`}>
                <ListItem disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <ChatIcon></ChatIcon>
                        </ListItemIcon>
                        <ListItemText primary='Tickets' />
                    </ListItemButton>
                </ListItem>
            </Link>
        </>
    );
}