import React from 'react';
import Router, { useRouter } from 'next/router';
import Moment from 'moment';

import Head from 'next/head';
import Link from 'next/link';
import { Box } from '@mui/system';
import { Avatar, Divider, Typography } from '@mui/material';

import EmptyChannelIcon from '@/components/icons/EmptyChannelIcon';

import styles from '@/styles/Ticket.module.css';
import dbConnect from '@/lib/dbConnect';
import Tickets from '@/schemas/Tickets';


export default function TicketPage(props) {
    /** @type {Guild} */ const guild = props.guild;
    /** @type {import('@/schemas/Tickets').Ticket} */ const ticket = props.ticket;
    /** @type {Array<User | GuildMember>} */ const users = props.users;
    const ticketUser = users.find(user => user.id == ticket.user);

    const router = useRouter();
    if((!guild || !ticket) && typeof window !== 'undefined') router.push('/dashboard');

    return !guild || !ticket ? <></> : (
        <>
            <Head>
                <title>Guardian Dashboard</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Box sx={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
                <Box>
                    <Box className={styles.emptyChannelIcon}>
                        <EmptyChannelIcon sx={{ width: '44px', height: '44px' }}></EmptyChannelIcon>
                    </Box>
                    <Typography variant='h4'>Welcome to #ticket-{ticketUser.username.toLowerCase().split(' ').join('-')}!</Typography>
                    <Typography>This is the start of the #ticket-{ticketUser.username.toLowerCase().split(' ').join('-')} channel. </Typography>
                </Box>

                <Box><Divider><Typography>{Moment(ticket.time).format('MMMM DD, YYYY')}</Typography></Divider></Box>

                {ticket.messages.map(message => {
                    const user = users.find(user => user.id == message.user);

                    return (
                        <Box key={message.id} className={styles.messageContainer}>
                            <Avatar className={styles.avatar} src={user.displayAvatarURL}></Avatar>
                            <h2>
                                <span style={{ fontSize: '1rem', fontWeight: '400', marginRight: '0.5rem' }}>{user.username}({user.id})</span>
                                <span style={{ fontSize: '.75rem', fontWeight: 300 }}>{Moment(message.time).format('DD/MM/YYYY HH:mm:ss')}</span>
                            </h2>

                            <Box className={styles.embedContainer}>
                                <Box className={styles.embedWrapper} sx={{ borderColor: '#2DBCFF !important' }}>
                                    <Box className={styles.grid}>
                                        <Box className={`${styles.embedAuthor} ${styles.embedMargin}`}>
                                            <Avatar className={styles.embedAuthorIcon} src={user.displayAvatarURL}></Avatar>
                                            <span className={styles.embedAuthorName}>{user.username}</span>
                                        </Box>
                                        <Box className={`${styles.embedDescription} ${styles.embedMargin}`}>{message.message}</Box>
                                    </Box>
                                </Box>
                                {message.images.map((image, index) => {
                                    return (
                                        <Box key={index} className={styles.messageAttachment}>
                                            <Link rel='noreferrer noopener' target='_blank' role='button' href={image}>
                                                <img alt='' src={image} />
                                            </Link>
                                        </Box>
                                    );
                                })}
                            </Box>
                        </Box>
                    );
                })}
            </Box>
        </>
    );
}

export async function getServerSideProps(context) {
    await dbConnect();

    const guild = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/bot/guilds/${context.params.guild}`, { cache: 'no-cache', headers: { Authorization: `Bearer ${process.env.DISCORD_CLIENT_TOKEN}` } })
        .then(async response => await response.json())
        .catch(() => null);
    
    if(!guild) return { props: { guild: null, ticket: null, users: [] } };

    const result = await Tickets.findOne({ _id: context.params.ticket, guild: context.params.guild }).catch(() => null);
    if(!result) return { props: { guild: null, ticket: null, users: [] } };

    /** @type {import('@/schemas/Tickets').Ticket} */ const ticket = result?.toObject();
    ticket._id = result._id.toString();
    ticket.id = ticket._id;
    ticket.time = result._id.getTimestamp().valueOf();
    ticket.messages = ticket.messages.map(message => {
        message._id = message._id.toString();
        message.id = message._id;

        return message;
    });

    /** @type {Array<GuildMember>} */ const members = await (await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/bot/guilds/${context.params.guild}/members`, { cache: 'no-cache', headers: { Authorization: `Bearer ${process.env.DISCORD_CLIENT_TOKEN}` } })).json();
    /** @type {Array<string>} */ const ids = [ ...new Set([ ticket.user, ticket.messages.flatMap(message => message.user) ].flat() ) ];
    const users = [];

    for(const id of ids){
        const member = members.find(member => member.id == id);
        if(member){
            users.push(member);
            continue;
        }

        users.push(fetch(`${process.env.NEXT_PUBLIC_HOST}/api/users/${id}`, { cache: 'no-cache' }).then(async response => response.json()));
    }

    return { props: { guild: guild, ticket: ticket, users: await Promise.all(users) } };
}