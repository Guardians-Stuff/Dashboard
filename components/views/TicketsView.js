import React from 'react';
import Link from 'next/link';
import Moment from 'moment';

import { Avatar, Card, CardContent, Checkbox, CircularProgress, Divider, FormControl, FormControlLabel, Grid, InputLabel, ListItemText, MenuItem, Pagination, Select, Switch, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';

import TextAvatar from '../TextAvatar';

export default function TicketsView(props){
    /** @type {Boolean} */ const mobile = props.mobile;
    /** @type {Guild} */ const guild = props.guild;
    /** @type {Array<GuildMember>} */ const members = props.members;
    /** @type {User} */ const user = props.user;

    const [ data, setData ] = React.useState({
        loading: true,
        users: user ? [ user ] : members,
        tickets: [],
        page: 1,
        totalPages: 0
    });
    const [ filter, setFilter ] = React.useState({
        id: '',
        inactive: true
    });
    
    React.useEffect(() => {
        async function fetchData(){
            const url = [
                '/api/',
                guild ? `guilds/${guild.id}/tickets` : '',
                user ? `users/${user.id}/tickets` : '',
                `?pagination=${data.page}`,
                filter.id ? `&id=${filter.id}` : '',
                !filter.inactive ? '&active=true' : ''
            ].join('');

            const tempUsers = [ ...data.users ];

            const response = (await fetch(url, { cache: 'no-cache' }).then(response => response.json()));
            /** @type {Array<import('@/schemas/Tickets').Ticket>} */ const tickets = response.tickets;

            /** @type {Array<string>} */ const externalIDs = [ ...new Set(tickets.flatMap(entry => entry.user )) ].filter(id => !tempUsers.find(user => user.id == id));
            /** @type {Array<GuildMember | Promise<User>>} */ const promises = externalIDs.map(id => fetch(`${process.env.NEXT_PUBLIC_HOST}/api/users/${id}`, { cache: 'no-cache' }).then(async response => response.json()));
            
            tempUsers.push(...await Promise.all(promises));
        
            setData({
                ...data,
                loading: false,
                users: tempUsers,
                tickets: tickets,
                totalPages: response.pagination.totalPages
            });
        }

        setData({ ...data, loading: true });
        fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ data.page, filter ]);

    return data.loading ?
        <Box sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
            <CircularProgress />
        </Box>
        :
        <>
            <Grid container spacing={1} sx={{ justifyContent: 'center', alignContent: 'center' }}>
                <Grid item sm={12}>
                    { mobile && !user ?
                        <form style={{ width: '100%', display: 'flex', marginBottom: 2 }}>
                            <TextField
                                variant='standard'
                                label='Filter ID'
                                defaultValue={filter.id}
                                onBlur={e => setFilter({ ...filter, id: e.target.value })}
                                sx={{ width: '100%', marginBottom: 2 }}
                            ></TextField>
                        </form>
                        : ''
                    }
                    <form style={{ display: 'flex', marginBottom: 2, justifyContent: 'center' }}>
                        { !mobile && !user ?
                            <TextField
                                variant='standard'
                                label='Filter ID'
                                defaultValue={filter.id}
                                onBlur={e => setFilter({ ...filter, id: e.target.value })}
                            ></TextField>
                            : ''
                        }
                        <FormControlLabel
                            control={<Switch checked={filter.inactive} />}
                            label='Show Inactive'
                            labelPlacement='top'
                            onChange={() => setFilter({ ...filter, inactive: !filter.inactive })}
                        />
                    </form>
                </Grid>
                { data.loading ?
                    <Grid item>
                        <Box sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                            <CircularProgress />
                        </Box>
                    </Grid>
                    :
                    data.tickets.map(ticket => {
                        const fetchedUser = data.users.find(user => user.id == ticket.user);

                        return (
                            <Grid item key={ticket._id} sx={{ minWidth: '281px' }}>
                                <Link href={`/dashboard/guilds/${ticket.guild}/tickets/${ticket._id}`}>
                                    <Card>
                                        <CardContent>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                <TextAvatar variant='column' src={`${fetchedUser.displayAvatarURL}?size=64`} typography='h7' size='64px'>{fetchedUser.username}#{fetchedUser.discriminator}</TextAvatar>
                                                <Typography variant='subtitle2'>{ticket._id}</Typography>

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

            <br/><br/>

            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Pagination page={data.page} count={data.totalPages} onChange={(e, value) => setData({ ...data, page: value })}></Pagination>
            </Box>
        </>;
}