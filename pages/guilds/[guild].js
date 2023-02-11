import React from 'react';
import Router, { useRouter } from 'next/router';
import Head from 'next/head';

import { Avatar, Card, CardContent, Divider, Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';

import Layout from '@/components/Layout';

export default function GuildPage(props) {
    /** @type {import('next-auth/providers/discord').DiscordProfile} */ const session = props.session;
    /** @type {Boolean} */ const loading = props.loading;
    /** @type {Guild} */ const guild = props.guild;

    const router = useRouter();
    if(!guild && typeof window !== 'undefined') router.push('/dashboard');

    return loading || !guild ? <Layout loading title='Overview' session={session} guild={guild}></Layout> : (
        <>
            <Head>
                <title>Guardian Dashboard</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Box sx={{ display: 'flex', height: '100%' }}>
                <Layout title='Overview' session={session} guild={guild}>
                    <Box style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', flexGrow: 1 }}>
                        <Avatar src={`${guild.iconURL}?size=128`} sx={{ width: 128, height: 128, fontSize: '40px' }}>{guild.name.slice(0, 1)}</Avatar>
                        <Typography variant="h3">{guild.name}</Typography>
                        {/* <NitroIcon sx={{ fontSize: 40 }}/> */}
                        <Divider style={{ width: '100%', marginBottom: '50px' }}></Divider>

                        {/* //TODO: figure out a better interface
                        <Grid container spacing={2} sx={{ textAlign: 'center', flexGrow: 1 }}>
                            <Grid item xs={4}>
                                <Card>
                                    <CardContent>
                                        <Typography typography='h2'>20</Typography>
                                        <Typography typography='h4'>Channels</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={4}>
                                <Card>
                                    <CardContent>
                                        <Typography typography='h2'>69,420</Typography>
                                        <Typography typography='h4'>Members</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={4}>
                                <Card>
                                    <CardContent>
                                        <Typography typography='h2'>13</Typography>
                                        <Typography typography='h4'>Roles</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={4}>
                                <Card>
                                    <CardContent>
                                        <Typography typography='h2'>1000</Typography>
                                        <Typography typography='h4'>Infractions</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={4}>
                                <Card>
                                    <CardContent>
                                        <Typography typography='h2'>2</Typography>
                                        <Typography typography='h4'>Enabled Systems</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={4}>
                                <Card>
                                    <CardContent>
                                        <Typography typography='h2'>0</Typography>
                                        <Typography typography='h4'>Infractions</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid> */}
                    </Box>
                </Layout>
            </Box>
        </>
    );
}
GuildPage.auth = true;

export async function getServerSideProps(context){
    const guild = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/bot/guilds/${context.params.guild}`, { cache: 'no-cache', headers: { 'Cookie': context.req.headers.cookie } })
        .then(async response => await response.json())
        .catch(() => null);

    return { props: { guild: guild } };
}