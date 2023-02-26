import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

import { Avatar, Divider, Tab, Tabs, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { TabContext, TabPanel } from '@mui/lab';

import styles from '@/styles/Guild.module.css';
import TextAvatar from '@/components/TextAvatar';
import TicketsView from '@/components/views/TicketsView';
import InfractionsView from '@/components/views/InfractionsView';

export default function GuildPage(props) {
    const router = useRouter();

    /** @type {Boolean} */ const mobile = props.mobile;
    /** @type {Guild} */ const guild = props.guild;
    /** @type {Array<GuildMember>} */ const members = props.members;
    
    /** @type {[ Number, Function ]} */ const [ tab, setTab ] = React.useState(router.query.tab || 'overview');
    React.useEffect(() => setTab(router.query.tab || 'overview'), [ router.query.tab ]);

    if(!guild && typeof window !== 'undefined') router.push('/dashboard');

    return !guild ? <></> : (
        <>
            <Head>
                <title>Guardian Dashboard</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Box sx={{ display: 'flex', width: '100%', height: '100%' }}>
                <Box style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', flexGrow: 1 }}>
                    <TextAvatar variant='column' src={`${guild.iconURL}?size=128`} alt={guild.name.slice(0, 1)} typography='h3'>{guild.name}</TextAvatar>

                    <Divider style={{ width: '100%', marginTop: '10px', marginBottom: '10px' }}></Divider>

                    <TabContext value={tab}>
                        <Tabs value={tab} onChange={(_, newTab) => router.push(`${guild.id}?tab=${newTab}`, undefined, { shallow: true })}>
                            <Tab label='Overview' value='overview' />
                            <Tab label='Infractions' value='infractions' />
                            <Tab label='Tickets' value='tickets' />
                        </Tabs>

                        <TabPanel value='overview' className={`${styles.panel} ${tab == 'overview' ? '' : styles.hidden}`}>
                            TEST 1
                        </TabPanel>

                        <TabPanel value='infractions' className={`${styles.panel} ${tab == 'infractions' ? '' : styles.hidden}`}>
                            <InfractionsView mobile={mobile} guild={guild} members={members} />
                        </TabPanel>

                        <TabPanel value='tickets' className={`${styles.panel} ${tab == 'tickets' ? '' : styles.hidden}`}>
                            <TicketsView mobile={mobile} guild={guild} members={members} />
                        </TabPanel>
                    </TabContext>
                </Box>
            </Box>
        </>
    );
}

export async function getServerSideProps(context){
    const guild = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/bot/guilds/${context.params.guild}`, { cache: 'no-cache', headers: { Cookie: context.req.headers.cookie } })
        .then(async response => await response.json())
        .catch(() => null);

    const members = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/bot/guilds/${guild.id}/members`, { cache: 'no-cache', headers: { Cookie: context.req.headers.cookie } })
        .then(async response => await response.json())
        .catch(() => []);

    return { props: { guild: guild, members: members } };
}