import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Box, Typography, Card, CardContent, Grid } from '@mui/material';

import TextAvatar from '@/components/TextAvatar';

export default function DashboardPage(props) {
    const router = useRouter();
    /** @type {Array<Guild>} */ const guilds = props.guilds || [];
    /** @type {Boolean} */ const mobile = props.mobile;

    // Filter to show only authorized guilds with bot
    const authorizedGuilds = guilds.filter(guild => guild.hasBot && guild.authorized);

    return (
        <>
            <Head>
                <title>Guardian Dashboard</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 2 }}>
                <Typography variant="h4" sx={{ marginBottom: 3 }}>
                    Welcome to Guardian Dashboard
                </Typography>
                
                {authorizedGuilds.length > 0 ? (
                    <>
                        <Typography variant="h6" sx={{ marginBottom: 2, alignSelf: 'flex-start' }}>
                            Your Servers
                        </Typography>
                        <Grid container spacing={2} sx={{ width: '100%', maxWidth: '1200px' }}>
                            {authorizedGuilds.map(guild => (
                                <Grid item key={guild.id} xs={12} sm={6} md={4} lg={3}>
                                    <Card 
                                        sx={{ 
                                            cursor: 'pointer',
                                            '&:hover': { 
                                                transform: 'scale(1.02)',
                                                transition: 'transform 0.2s'
                                            }
                                        }}
                                        onClick={() => router.push(`/dashboard/guilds/${guild.id}`)}
                                    >
                                        <CardContent>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                <TextAvatar 
                                                    variant='column' 
                                                    src={guild.iconURL ? `${guild.iconURL}?size=64` : null} 
                                                    alt={guild.name.slice(0, 1)} 
                                                    typography='h6' 
                                                    size='64px'
                                                >
                                                    {guild.name}
                                                </TextAvatar>
                                                <Typography variant='subtitle1' sx={{ marginTop: 1, textAlign: 'center' }}>
                                                    {guild.name}
                                                </Typography>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </>
                ) : (
                    <Box sx={{ textAlign: 'center', marginTop: 4 }}>
                        <Typography variant="h6" sx={{ marginBottom: 2 }}>
                            No servers available
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {guilds.length === 0 
                                ? "You don't have access to any servers with the Guardian bot."
                                : "You need to authorize access to your servers. Check the sidebar for available servers."}
                        </Typography>
                    </Box>
                )}
            </Box>
        </>
    );
}

DashboardPage.auth = true;