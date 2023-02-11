import React from 'react';
import Router, { useRouter } from 'next/router';
import Moment from 'moment';

import Link from 'next/link';
import Head from 'next/head';
import { Box } from '@mui/system';
import { Avatar, Card, CardContent, Divider, Grid, Typography } from '@mui/material';

import Layout from '@/components/Layout';
import dbConnect from '@/lib/dbConnect';
import Tickets from '@/schemas/Tickets';

export default function TicketsPage(props) {
    /** @type {import('next-auth/providers/discord').DiscordProfile} */ const session = props.session;
    /** @type {Boolean} */ const loading = props.loading;
    /** @type {Guild} */ const guild = props.guild;
    /** @type {Array<import('@/schemas/Tickets').Ticket>} */ const tickets = props.tickets;
    /** @type {Array<User | GuildMember>} */ const users = props.users;

    const router = useRouter();
    if(!guild && typeof window !== 'undefined') router.push('/dashboard');

    return loading || !guild ? <Layout loading title='Tickets' session={session} guild={guild}></Layout> : (
        <>
            <Head>
                <title>Guardian Dashboard</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Box sx={{ display: 'flex', height: '100%' }}>
                <Layout title='Tickets' session={session} guild={guild}>
                    <Grid container spacing={1} sx={{ justifyContent: 'center', alignContent: 'center' }}>
                        { tickets.map(ticket => {
                            const fetchedUser = users.find(user => user.id == ticket.user);

                            return (
                                <Grid item key={ticket.id} sx={{ minWidth: '281px' }}>
                                    <Link href={`/guilds/${guild.id}/tickets/${ticket.id}`}>
                                        <Card>
                                            <CardContent>
                                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                    <Avatar src={fetchedUser.displayAvatarURL} sx={{ height: '64px', width: '64px' }} />
                                                    <Typography variant='h7'>{fetchedUser.username}#{fetchedUser.discriminator}</Typography>
                                                    <Typography variant='subtitle2'>{ticket.id}</Typography>

                                                    <Divider sx={{ width: '100%', margin: '10px 0 10px 0' }} />

                                                    <Typography variant='h7' style={{ color: ticket.active ? 'lime' : 'tomato' }}>{ticket.active ? 'Active' : 'Inactive'}</Typography>
                                                    <Typography variant='subtitle2'>Created At: {Moment(ticket.time).format('DD/MM/YYYY hh:mm:ss A')}</Typography>
                                                    <Typography variant='subtitle2'>Last Message: {ticket.messages.length == 0 ? 'None' : Moment([ ...ticket.messages ].pop().time).format('DD/MM/YYYY hh:mm:ss A')}</Typography>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                </Grid>
                            );
                        }) }
                    </Grid>
                </Layout>
            </Box>
        </>
    );
}
TicketsPage.auth = true;

export async function getServerSideProps(context){
    await dbConnect();

    const guild = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/bot/guilds/${context.params.guild}`, { cache: 'no-cache', headers: { Cookie: context.req.headers.cookie } })
        .then(async response => await response.json())
        .catch(() => null);
    
    if(!guild) return { props: { guild: null, tickets: [], users: [] } };

    const results = await Tickets.find({ guild: context.params.guild }).sort({ _id: -1 });
    /** @type {Array<import('@/schemas/Tickets').Ticket>} */ const tickets = results.map(result => {
        /** @type {import('@/schemas/Tickets').Ticket} */ const ticket = result.toObject();
        ticket._id = result._id.toString();
        ticket.id = ticket._id;
        ticket.time = result._id.getTimestamp().valueOf();
        ticket.messages = ticket.messages.map(message => {
            message._id = message._id.toString();
            message.id = message._id;

            return message;
        });

        return ticket;
    });


    /** @type {Array<GuildMember>} */ const members = await (await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/bot/guilds/${context.params.guild}/members`, { cache: 'no-cache', headers: { Cookie: context.req.headers.cookie } })).json();
    /** @type {Array<string>} */ const ids = [ ...new Set(tickets.flatMap(ticket => ticket.user )) ];
    const users = [];

    for(const id of ids){
        const member = members.find(member => member.id == id);
        if(member){
            users.push(member);
            continue;
        }

        users.push(fetch(`${process.env.NEXT_PUBLIC_HOST}/api/users/${id}`, { cache: 'no-cache', headers: { 'Cookie': context.req.headers.cookie } }).then(async response => response.json()));
    }

    return { props: { guild: guild, tickets: tickets, users: await Promise.all(users) } };
}