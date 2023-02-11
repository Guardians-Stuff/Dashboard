import React from 'react';
import Router, { useRouter } from 'next/router';
import Head from 'next/head';

import { Avatar, Card, CardContent, Divider, Grid, Tab, Tabs, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { TabContext, TabPanel } from '@mui/lab';

import Layout from '@/components/Layout';
import TicketsView from '@/components/TicketsView';
import InfractionsView from '@/components/InfractionsView';

export default function GuildPage(props) {
    const router = useRouter();

    /** @type {import('next-auth/providers/discord').DiscordProfile} */ const session = props.session;
    /** @type {Boolean} */ const loading = props.loading;
    /** @type {Boolean} */ const mobile = props.mobile;
    /** @type {Guild} */ const guild = props.guild;
    
    /** @type {[ Number, Function ]} */ const [ tab, setTab ] = React.useState(+router.query.tab || 0);
    React.useEffect(() => setTab(+router.query.tab || 0), [ router.query.tab ]);

    /** @type {[Array<GuildMember | User>, Function]} */ const [ users, setUsers ] = React.useState([]);
    /** @type {[ Array<import('@/schemas/Tickets').Ticket, Function> ]} */ const [ tickets, setTickets ] = React.useState([]);
    /** @type {[ Array<import('@/schemas/Infractions').Infraction, Function> ]} */ const [ infractions, setInfractions ] = React.useState([]);
    
    React.useEffect(() => {
        async function fetchTickets(){
            const tempUsers = [ ...users ];
            
            /** @type {Array<import('@/schemas/Tickets').Ticket>} */ const tickets = (await fetch(`/api/guilds/${guild.id}/tickets`, { cache: 'no-cache' }).then(response => response.json())).tickets;
            if(tempUsers.length == 0) tempUsers.push(...await (await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/bot/guilds/${guild.id}/members`, { cache: 'no-cache' })).json());
            /** @type {Array<string>} */ const externalIDs = [ ...new Set(tickets.flatMap(ticket => ticket.user )) ].filter(id => !tempUsers.find(user => user.id == id));
            /** @type {Array<GuildMember | Promise<User>>} */ const promises = externalIDs.map(id => fetch(`${process.env.NEXT_PUBLIC_HOST}/api/users/${id}`, { cache: 'no-cache' }).then(async response => response.json()));
            
            tempUsers.push(...await Promise.all(promises));
            
            setUsers(tempUsers);
            setTickets(tickets);
        }

        async function fetchInfractions(){
            const tempUsers = [ ...users ];
            
            /** @type {Array<import('@/schemas/Infractions').Infraction>} */ const infractions = (await fetch(`/api/guilds/${guild.id}/infractions`, { cache: 'no-cache' }).then(response => response.json())).infractions;
            if(tempUsers.length == 0) tempUsers.push(...await (await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/bot/guilds/${guild.id}/members`, { cache: 'no-cache' })).json());
            /** @type {Array<string>} */ const externalIDs = [ ...new Set(infractions.flatMap(ticket => ticket.user )) ].filter(id => !tempUsers.find(user => user.id == id));
            /** @type {Array<GuildMember | Promise<User>>} */ const promises = externalIDs.map(id => fetch(`${process.env.NEXT_PUBLIC_HOST}/api/users/${id}`, { cache: 'no-cache' }).then(async response => response.json()));
            
            tempUsers.push(...await Promise.all(promises));
            
            setUsers(tempUsers);
            setInfractions(infractions);
        }

        if(tab == 1) fetchInfractions();
        if(tab == 2) fetchTickets();
    }, [ tab ]);
    

    if(!guild && typeof window !== 'undefined') router.push('/dashboard');

    return loading || !guild ? <Layout loading title='Overview' session={session} guild={guild}></Layout> : (
        <>
            <Head>
                <title>Guardian Dashboard</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Box sx={{ display: 'flex', width: '100%', height: '100%' }}>
                <Box style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', flexGrow: 1 }}>
                    <Avatar src={`${guild.iconURL}?size=128`} sx={{ width: 128, height: 128, fontSize: '40px' }}>{guild.name.slice(0, 1)}</Avatar>
                    <Typography variant="h3">{guild.name}</Typography>
                    {/* <NitroIcon sx={{ fontSize: 40 }}/> */}

                    <Divider style={{ width: '100%', marginTop: '10px', marginBottom: '10px' }}></Divider>

                    <TabContext value={tab}>
                        <Tabs value={tab} onChange={(e, newTab) => setTab(newTab)}>
                            <Tab label='Overview' />
                            <Tab label='Infractions' />
                            <Tab label='Tickets' />
                        </Tabs>

                        <TabPanel value={0}>
                            TEST 1
                        </TabPanel>

                        <TabPanel value={1} style={{ width: '100%', height: '100%' }} >
                            <InfractionsView mobile={mobile} guild={guild} infractions={infractions} users={users} />
                        </TabPanel>

                        <TabPanel value={2}>
                            <TicketsView guild={guild} tickets={tickets} users={users} />
                        </TabPanel>
                    </TabContext>
                </Box>
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