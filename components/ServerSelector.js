import React from 'react';
import Link from 'next/link';
import { useTheme } from '@emotion/react';
import { useRouter } from 'next/router';

import { Avatar, ListItem, ListItemButton, ListItemIcon, ListItemText, TextField, useMediaQuery } from '@mui/material';
import { Box } from '@mui/system';

import SearchIcon from '@mui/icons-material/Search';

export default function ServerSelector(props) {
    /** @type {Array<APIGuild>} */ const guilds = props.guilds;

    const [ filter, setFilter ] = React.useState('');
    const handleFilterChange = (event) => setFilter(event.target.value.toLowerCase());

    return (
        <>
            <ListItem disablePadding>
                <Box style={{ padding: '8px 16px 8px 16px', flexGrow: 1, display: 'flex', alignItems: 'flex-end' }}>
                    <SearchIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                    <TextField
                        error={guilds.length != 0 && guilds.filter(guild => guild.name.toLowerCase().includes(filter)).length == 0}
                        variant='standard'
                        label='Filter servers...'
                        style={{ width: '100%' }}
                        onChange={handleFilterChange}
                    />
                </Box>
            </ListItem>
            { guilds ? guilds.filter(guild => guild.name.toLowerCase().includes(filter)).map(guild => (
                <Link key={guild.id} href={guild.hasBot ? `/guilds/${guild.id}` : 'https://discord.com/api/oauth2/authorize?client_id=1046820104144420934&permissions=8&scope=bot'}>
                    <ListItem disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                <Avatar src={guild.iconURL}>{guild.name.slice(0, 1)}</Avatar>
                            </ListItemIcon>
                            <ListItemText primary={guild.hasBot ? guild.name : null} secondary={guild.hasBot ? null : guild.name} />
                        </ListItemButton>
                    </ListItem>
                </Link>
            )) : '' }
        </>
    );
}