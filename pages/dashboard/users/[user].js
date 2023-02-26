import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';

import { Avatar, Divider, Tab, Tabs, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { TabContext, TabPanel } from '@mui/lab';

import styles from '@/styles/User.module.css';
import TextAvatar from '@/components/TextAvatar';
import GuildsView from '@/components/views/GuildsView';
import InfractionsView from '@/components/views/InfractionsView';
import TicketsView from '@/components/views/TicketsView';

export default function UserPage(props) {
    const router = useRouter();

    /** @type {User} */ const user = props.user;
    /** @type {[ Number, Function ]} */ const [ tab, setTab ] = React.useState(router.query.tab || 'servers');
    React.useEffect(() => setTab(router.query.tab || 'servers'), [ router.query.tab ]);

    if(!user && typeof window !== 'undefined') router.push('/dashboard');

    return !user ? <></> : (
        <>
            <Head>
                <title>Guardian Dashboard</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Box sx={{ display: 'flex', height: '100%', width: '100%' }}>
                <Box style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', width: '100%' }}>
                    <TextAvatar variant='column' src={`${user.displayAvatarURL}?size=128`} typography='h3'>{user.username}#{user.discriminator}</TextAvatar>

                    {/* TODO:// figure out server & nitro */}
                    <Box display='flex'>
                        <Image style={{ display: user.public_flags >> 0 & 1 == 1 ? 'block' : 'none' }} width={40} height={40} alt='Discord Staff' src='https://discord.id/img/flags/0.png' />
                        <Image style={{ display: user.public_flags >> 1 & 1 == 1 ? 'block' : 'none' }} width={40} height={40} alt='Discord Partner' src='https://discord.id/img/flags/1.png' />
                        <Image style={{ display: user.public_flags >> 2 & 1 == 1 ? 'block' : 'none' }} width={40} height={40} alt='Hypesquad Event' src='https://discord.id/img/flags/2.png' />
                        <Image style={{ display: user.public_flags >> 3 & 1 == 1 ? 'block' : 'none' }} width={40} height={40} alt='Bug Hunter' src='https://discord.id/img/flags/3.png' />
                        <Image style={{ display: user.public_flags >> 6 & 1 == 1 ? 'block' : 'none' }} width={40} height={40} alt='Hypesquad Bravery' src='https://discord.id/img/flags/6.png' />
                        <Image style={{ display: user.public_flags >> 7 & 1 == 1 ? 'block' : 'none' }} width={40} height={40} alt='Hypesquad Brilliance' src='https://discord.id/img/flags/7.png' />
                        <Image style={{ display: user.public_flags >> 8 & 1 == 1 ? 'block' : 'none' }} width={40} height={40} alt='Hypesquad Balance' src='https://discord.id/img/flags/8.png' />
                        <Image style={{ display: user.public_flags >> 9 & 1 == 1 ? 'block' : 'none' }} width={40} height={40} alt='Early Supporter' src='https://discord.id/img/flags/9.png' />
                        <Image style={{ display: user.public_flags >> 14 & 1 == 1 ? 'block' : 'none' }} width={40} height={40} alt='Bug Hunter Level 2' src='https://discord.id/img/flags/14.png' />
                        <Image style={{ display: user.public_flags >> 17 & 1 == 1 ? 'block' : 'none' }} width={40} height={40} alt='Verified Bot Developer' src='https://discord.id/img/flags/17.png' />
                        <Image style={{ display: user.public_flags >> 18 & 1 == 1 ? 'block' : 'none' }} width={40} height={40} alt='Discord Certified Moderator' src='https://discord.id/img/flags/18.png' />
                        <Image style={{ display: user.public_flags >> 22 & 1 == 1 ? 'block' : 'none' }} width={40} height={40} alt='Active Developer' src='https://discord.id/img/flags/22.png' />
                    </Box>

                    <Divider style={{ width: '100%', marginTop: '10px', marginBottom: '10px' }}></Divider>

                    <TabContext value={tab}>
                        <Tabs value={tab} onChange={(_, newTab) => router.push(`${user.id}?tab=${newTab}`, undefined, { shallow: true })}>
                            <Tab label='Servers' value='servers' />
                            <Tab label='Infractions' value='infractions' />
                            <Tab label='Tickets' value='tickets' />
                            <Tab label='Admin' value='admin' />
                        </Tabs>

                        <TabPanel value='servers' className={`${styles.panel} ${tab == 'servers' ? '' : styles.hidden}`}>
                            <GuildsView />
                        </TabPanel>

                        <TabPanel value='infractions' className={`${styles.panel} ${tab == 'infractions' ? '' : styles.hidden}`}>
                            <InfractionsView user={user} />
                        </TabPanel>

                        <TabPanel value='tickets' className={`${styles.panel} ${tab == 'tickets' ? '' : styles.hidden}`}>
                            <TicketsView user={user} />
                        </TabPanel>
                    </TabContext>
                </Box>
            </Box>
        </>
    );
}
UserPage.auth = true;

export async function getServerSideProps(context){
    /** @type {User} */ const user = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/users/${context.params.user}`, { cache: 'no-cache', headers: { 'Cookie': context.req.headers.cookie } })
        .then(async response => await response.json())
        .catch(() => null);

    return { props: { user: user } };
}