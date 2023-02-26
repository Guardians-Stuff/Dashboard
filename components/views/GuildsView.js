import React from 'react';
import Link from 'next/link';

import { Avatar, Card, CardContent, Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useRouter } from 'next/router';

export default function GuildsView(){
    const router = useRouter();

    /** @type {[Array<Guild>, Function]} */ const [ guilds, setGuilds ] = React.useState([]);

    React.useState(() => {
        async function fetchGuilds(){
            /** @type {Array<string>} */ const guilds = (await fetch(`/api/users/${router.query.user}/guilds`, { cache: 'no-cache' }).then(response => response.json())).guilds;

            setGuilds(guilds);
        }

        fetchGuilds();
    }, []);
    return (
        <Grid container spacing={1} sx={{ justifyContent: 'center', alignContent: 'center' }}>
            {guilds.map(guild => {
                return (
                    <Grid item key={guild.id} sx={{ maxWidth: '180px' }}>
                        <Link href={`/dashboard/guilds/${guild.id}`}>
                            <Card>
                                <CardContent>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <Avatar src={guild.iconURL} sx={{ height: '64px', width: '64px' }} />
                                        <Typography variant='h7'>{guild.name}</Typography>
                                        <Typography variant='subtitle2'>{guild.id}</Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Link>
                    </Grid>
                );
            }) }
        </Grid>
    );
}