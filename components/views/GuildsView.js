import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import { Avatar, Card, CardContent, Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';

import TextAvatar from '../TextAvatar';

export default function GuildsView(){
    const router = useRouter();

    /** @type {[Array<Guild>, Function]} */ const [ guilds, setGuilds ] = React.useState([]);

    React.useEffect(() => {
        async function fetchGuilds(){
            try {
                const response = await fetch(`/api/users/${router.query.user}/guilds`, { cache: 'no-cache' });
                if(response.ok) {
                    const data = await response.json();
                    /** @type {Array<string>} */ const guilds = data.guilds || [];
                    setGuilds(guilds);
                }
            } catch(error) {
                console.error('Error fetching guilds:', error);
            }
        }

        if(router.query.user) {
            fetchGuilds();
        }
    }, [router.query.user]);
    return (
        <Grid container spacing={1} sx={{ justifyContent: 'center', alignContent: 'center' }}>
            {guilds.map(guild => {
                return (
                    <Grid item key={guild.id} sx={{ maxWidth: '180px' }}>
                        <Link href={`/dashboard/guilds/${guild.id}`}>
                            <Card>
                                <CardContent>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <TextAvatar variant='column' src={`${guild.iconURL}?size=64`} alt={guild.name.slice(0, 1)} typography='h7' size='64px'>{guild.name}</TextAvatar>
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